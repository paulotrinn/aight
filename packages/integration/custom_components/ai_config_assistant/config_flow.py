"""Config flow for AI Configuration Assistant."""
import logging
from typing import Any, Dict, Optional

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.const import CONF_API_KEY
from homeassistant.core import HomeAssistant, callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import (
    DOMAIN,
    CONF_LLM_PROVIDER,
    CONF_DEFAULT_MODEL,
    CONF_TEMPERATURE,
    CONF_MAX_TOKENS,
    LLM_PROVIDERS,
    DEFAULT_MODELS,
    DEFAULT_TEMPERATURE,
    DEFAULT_MAX_TOKENS,
)

_LOGGER = logging.getLogger(__name__)

class AIConfigAssistantConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AI Configuration Assistant."""

    VERSION = 1

    def __init__(self) -> None:
        """Initialize the config flow."""
        self.data: Dict[str, Any] = {}

    async def async_step_user(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            # Validate the provider selection
            provider = user_input[CONF_LLM_PROVIDER]
            api_key = user_input[CONF_API_KEY]

            if not api_key.strip():
                errors[CONF_API_KEY] = "api_key_required"
            else:
                # Test the API key
                try:
                    is_valid = await self._test_api_key(provider, api_key)
                    if not is_valid:
                        errors[CONF_API_KEY] = "invalid_api_key"
                    else:
                        # Store the basic config
                        self.data = user_input.copy()
                        return await self.async_step_advanced()
                except Exception as err:
                    _LOGGER.error("Error testing API key: %s", err)
                    errors["base"] = "connection_error"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_LLM_PROVIDER, default="openai"): vol.In(LLM_PROVIDERS),
                vol.Required(CONF_API_KEY): str,
            }),
            errors=errors,
        )

    async def async_step_advanced(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> FlowResult:
        """Handle advanced configuration options."""
        if user_input is not None:
            # Merge advanced settings with basic config
            self.data.update(user_input)
            
            # Set default model if not provided
            if CONF_DEFAULT_MODEL not in self.data:
                provider = self.data[CONF_LLM_PROVIDER]
                self.data[CONF_DEFAULT_MODEL] = DEFAULT_MODELS.get(provider)

            return self.async_create_entry(
                title=f"AI Config Assistant ({self.data[CONF_LLM_PROVIDER]})",
                data=self.data,
            )

        provider = self.data[CONF_LLM_PROVIDER]
        default_model = DEFAULT_MODELS.get(provider, "")

        return self.async_show_form(
            step_id="advanced",
            data_schema=vol.Schema({
                vol.Optional(CONF_DEFAULT_MODEL, default=default_model): str,
                vol.Optional(CONF_TEMPERATURE, default=DEFAULT_TEMPERATURE): vol.All(
                    vol.Coerce(float), vol.Range(min=0.0, max=2.0)
                ),
                vol.Optional(CONF_MAX_TOKENS, default=DEFAULT_MAX_TOKENS): vol.All(
                    vol.Coerce(int), vol.Range(min=100, max=4000)
                ),
            }),
        )

    async def _test_api_key(self, provider: str, api_key: str) -> bool:
        """Test the API key for the specified provider."""
        try:
            # Import litellm for testing
            import litellm
            
            # Set the API key for the provider
            if provider == "openai":
                litellm.openai_key = api_key
                model = "gpt-3.5-turbo"
            elif provider == "anthropic":
                litellm.anthropic_key = api_key
                model = "claude-3-haiku-20240307"
            elif provider == "google":
                litellm.vertex_ai_key = api_key
                model = "gemini-pro"
            else:
                # For other providers, assume it's valid
                return True

            # Make a simple test call
            response = await litellm.acompletion(
                model=model,
                messages=[{"role": "user", "content": "Hello"}],
                max_tokens=5,
                timeout=10,
            )
            
            return response is not None and hasattr(response, 'choices')
            
        except Exception as err:
            _LOGGER.debug("API key test failed: %s", err)
            return False

    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return AIConfigAssistantOptionsFlowHandler(config_entry)


class AIConfigAssistantOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for AI Configuration Assistant."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self.config_entry = config_entry

    async def async_step_init(
        self, user_input: Optional[Dict[str, Any]] = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        current_temperature = self.config_entry.options.get(
            CONF_TEMPERATURE, 
            self.config_entry.data.get(CONF_TEMPERATURE, DEFAULT_TEMPERATURE)
        )
        current_max_tokens = self.config_entry.options.get(
            CONF_MAX_TOKENS,
            self.config_entry.data.get(CONF_MAX_TOKENS, DEFAULT_MAX_TOKENS)
        )

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema({
                vol.Optional(CONF_TEMPERATURE, default=current_temperature): vol.All(
                    vol.Coerce(float), vol.Range(min=0.0, max=2.0)
                ),
                vol.Optional(CONF_MAX_TOKENS, default=current_max_tokens): vol.All(
                    vol.Coerce(int), vol.Range(min=100, max=4000)
                ),
            }),
        )