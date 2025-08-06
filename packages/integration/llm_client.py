"""LLM client manager for AI Configuration Assistant."""
import logging
from typing import Any, Dict, List, Optional, Union
import asyncio
from dataclasses import dataclass

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    DEFAULT_MODELS,
    DEFAULT_TEMPERATURE, 
    DEFAULT_MAX_TOKENS,
    CONF_TEMPERATURE,
    CONF_MAX_TOKENS,
)

_LOGGER = logging.getLogger(__name__)

@dataclass
class LLMResponse:
    """Response from LLM."""
    content: str
    model: str
    provider: str
    tokens_used: Optional[int] = None
    finish_reason: Optional[str] = None

@dataclass 
class LLMMessage:
    """Message for LLM conversation."""
    role: str  # "system", "user", "assistant"
    content: str

class LLMClientManager:
    """Manage LLM client connections and requests."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the LLM client manager."""
        self.hass = hass
        self._provider: Optional[str] = None
        self._api_key: Optional[str] = None
        self._default_model: Optional[str] = None
        self._session = None
        self._litellm = None

    async def setup(
        self, 
        provider: str, 
        api_key: str, 
        default_model: Optional[str] = None
    ) -> None:
        """Set up the LLM client."""
        self._provider = provider
        self._api_key = api_key
        self._default_model = default_model or DEFAULT_MODELS.get(provider)
        
        # Import litellm dynamically
        try:
            import litellm
            self._litellm = litellm
            
            # Configure the provider
            await self._configure_provider(provider, api_key)
            
            _LOGGER.info("LLM client setup completed for provider: %s", provider)
            
        except ImportError as err:
            _LOGGER.error("Failed to import litellm: %s", err)
            raise
        except Exception as err:
            _LOGGER.error("Failed to setup LLM client: %s", err)
            raise

    async def _configure_provider(self, provider: str, api_key: str) -> None:
        """Configure the specific LLM provider."""
        if provider == "openai":
            self._litellm.openai_key = api_key
        elif provider == "anthropic":
            self._litellm.anthropic_key = api_key
        elif provider == "google":
            self._litellm.vertex_ai_key = api_key
        elif provider == "mistral":
            self._litellm.mistral_key = api_key
        elif provider == "groq":
            self._litellm.groq_key = api_key
        # Ollama doesn't need API key configuration
        elif provider == "ollama":
            pass
        else:
            _LOGGER.warning("Unknown provider: %s", provider)

    async def generate_completion(
        self,
        messages: List[LLMMessage],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        **kwargs
    ) -> LLMResponse:
        """Generate a completion from the LLM."""
        if not self._litellm:
            raise RuntimeError("LLM client not initialized")

        # Use defaults if not specified
        model = model or self._default_model
        temperature = temperature if temperature is not None else DEFAULT_TEMPERATURE
        max_tokens = max_tokens or DEFAULT_MAX_TOKENS

        # Convert messages to the format expected by litellm
        formatted_messages = [
            {"role": msg.role, "content": msg.content}
            for msg in messages
        ]

        try:
            # Make the API call
            response = await self._litellm.acompletion(
                model=model,
                messages=formatted_messages,
                temperature=temperature,
                max_tokens=max_tokens,
                **kwargs
            )

            # Extract response content
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if hasattr(response, 'usage') else None
            finish_reason = response.choices[0].finish_reason

            return LLMResponse(
                content=content,
                model=model,
                provider=self._provider,
                tokens_used=tokens_used,
                finish_reason=finish_reason,
            )

        except Exception as err:
            _LOGGER.error("Error generating completion: %s", err)
            raise

    async def generate_config(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: Optional[str] = None,
        **kwargs
    ) -> LLMResponse:
        """Generate configuration using the LLM."""
        messages = []
        
        if system_prompt:
            messages.append(LLMMessage(role="system", content=system_prompt))
        
        messages.append(LLMMessage(role="user", content=prompt))

        return await self.generate_completion(
            messages=messages,
            model=model,
            **kwargs
        )

    async def validate_config(
        self,
        config_yaml: str,
        config_type: str,
        model: Optional[str] = None,
        **kwargs
    ) -> LLMResponse:
        """Validate configuration using the LLM."""
        system_prompt = f"""You are a Home Assistant configuration validator.
        Analyze the following {config_type} YAML configuration and identify any errors, warnings, or suggestions.
        
        Return your response in this JSON format:
        {{
            "valid": true/false,
            "errors": ["list of errors"],
            "warnings": ["list of warnings"], 
            "suggestions": ["list of improvements"]
        }}
        """

        user_prompt = f"Validate this {config_type} configuration:\n\n```yaml\n{config_yaml}\n```"

        return await self.generate_config(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model=model,
            **kwargs
        )

    async def improve_config(
        self,
        config_yaml: str,
        improvement_request: str,
        config_type: str,
        model: Optional[str] = None,
        **kwargs
    ) -> LLMResponse:
        """Improve existing configuration based on user request."""
        system_prompt = f"""You are a Home Assistant configuration expert.
        The user wants to modify an existing {config_type} configuration.
        
        Provide the complete improved YAML configuration.
        Only return valid YAML, no explanations or markdown formatting.
        """

        user_prompt = f"""Current configuration:
```yaml
{config_yaml}
```

Requested change: {improvement_request}

Provide the updated configuration:"""

        return await self.generate_config(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model=model,
            **kwargs
        )

    async def explain_config(
        self,
        config_yaml: str,
        config_type: str,
        model: Optional[str] = None,
        **kwargs
    ) -> LLMResponse:
        """Explain what a configuration does."""
        system_prompt = f"""You are a Home Assistant expert.
        Explain what the following {config_type} configuration does in simple terms.
        Break down each section and explain how it works.
        """

        user_prompt = f"Explain this {config_type} configuration:\n\n```yaml\n{config_yaml}\n```"

        return await self.generate_config(
            prompt=user_prompt,
            system_prompt=system_prompt,
            model=model,
            **kwargs
        )

    async def get_available_models(self) -> List[str]:
        """Get list of available models for the current provider."""
        if not self._provider:
            return []

        # Return known models for each provider
        model_mappings = {
            "openai": ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-4o", "gpt-4o-mini"],
            "anthropic": [
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229", 
                "claude-3-haiku-20240307",
                "claude-3-5-sonnet-20241022"
            ],
            "google": ["gemini-pro", "gemini-pro-vision", "gemini-1.5-pro", "gemini-2.0-flash-exp"],
            "mistral": ["mistral-large-latest", "mistral-medium-latest", "mistral-small-latest"],
            "groq": ["llama3-70b-8192", "llama3-8b-8192", "mixtral-8x7b-32768"],
            "ollama": ["llama2", "llama3", "mistral", "codellama"],
        }

        return model_mappings.get(self._provider, [self._default_model])

    async def cleanup(self) -> None:
        """Clean up resources."""
        if self._session and not self._session.closed:
            await self._session.close()
        
        self._provider = None
        self._api_key = None
        self._default_model = None
        self._litellm = None

    @property
    def is_configured(self) -> bool:
        """Check if the client is properly configured."""
        return (
            self._provider is not None 
            and self._api_key is not None 
            and self._litellm is not None
        )

    @property
    def provider(self) -> Optional[str]:
        """Get the current provider."""
        return self._provider

    @property 
    def default_model(self) -> Optional[str]:
        """Get the default model."""
        return self._default_model