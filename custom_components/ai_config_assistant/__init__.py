"""AI Configuration Assistant integration for Home Assistant."""
import logging
from typing import Any, Dict

import voluptuous as vol
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_KEY, Platform
from homeassistant.core import HomeAssistant, ServiceCall, ServiceResponse, SupportsResponse
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    CONF_LLM_PROVIDER,
    CONF_DEFAULT_MODEL,
    SERVICE_GENERATE_CONFIG,
    SERVICE_VALIDATE_CONFIG,
    SERVICE_PREVIEW_CONFIG,
    SERVICE_RELOAD,
    LLM_PROVIDERS,
)
from .llm_client import LLMClientManager
from .config_generator import ConfigGenerator
from .entity_manager import EntityManager
from .api import async_register_api_views
from .panel import async_register_panel

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = []

CONFIG_SCHEMA = vol.Schema(
    {
        DOMAIN: vol.Schema(
            {
                vol.Required(CONF_LLM_PROVIDER, default="openai"): vol.In(LLM_PROVIDERS),
                vol.Required(CONF_API_KEY): cv.string,
                vol.Optional(CONF_DEFAULT_MODEL): cv.string,
            }
        )
    },
    extra=vol.ALLOW_EXTRA,
)

async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the AI Config Assistant integration."""
    hass.data.setdefault(DOMAIN, {})
    
    # Basic setup only - actual initialization happens in async_setup_entry
    _LOGGER.info("AI Configuration Assistant integration setup")
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up AI Config Assistant from a config entry."""
    # Ensure domain data exists
    hass.data.setdefault(DOMAIN, {})
    
    # Store config entry data
    hass.data[DOMAIN]["config_entry"] = entry
    
    # Initialize core components if not already done
    if "llm_client" not in hass.data[DOMAIN]:
        hass.data[DOMAIN]["llm_client"] = LLMClientManager(hass)
        hass.data[DOMAIN]["config_generator"] = ConfigGenerator(hass)
        hass.data[DOMAIN]["entity_manager"] = EntityManager(hass)
        
        # Initialize entity manager
        await hass.data[DOMAIN]["entity_manager"].initialize()
        
        # Set up config generator
        hass.data[DOMAIN]["config_generator"].setup(
            hass.data[DOMAIN]["llm_client"],
            hass.data[DOMAIN]["entity_manager"]
        )
        
        # Register services
        await _async_register_services(hass)
        
        # Register API endpoints
        await async_register_api_views(hass)
        
        # Register frontend panel
        await async_register_panel(hass)
    
    # Initialize LLM client with config
    llm_client = hass.data[DOMAIN]["llm_client"]
    await llm_client.setup(
        provider=entry.data[CONF_LLM_PROVIDER],
        api_key=entry.data[CONF_API_KEY],
        default_model=entry.data.get(CONF_DEFAULT_MODEL),
    )
    
    _LOGGER.info("AI Configuration Assistant integration loaded successfully")
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload AI Config Assistant config entry."""
    # Clean up resources
    if DOMAIN in hass.data:
        # Clean up LLM client
        llm_client = hass.data[DOMAIN].get("llm_client")
        if llm_client:
            await llm_client.cleanup()
        
        # Remove services
        if hass.services.has_service(DOMAIN, SERVICE_GENERATE_CONFIG):
            hass.services.async_remove(DOMAIN, SERVICE_GENERATE_CONFIG)
        if hass.services.has_service(DOMAIN, SERVICE_VALIDATE_CONFIG):
            hass.services.async_remove(DOMAIN, SERVICE_VALIDATE_CONFIG)
        if hass.services.has_service(DOMAIN, SERVICE_PREVIEW_CONFIG):
            hass.services.async_remove(DOMAIN, SERVICE_PREVIEW_CONFIG)
        if hass.services.has_service(DOMAIN, SERVICE_RELOAD):
            hass.services.async_remove(DOMAIN, SERVICE_RELOAD)
        
        # Clear data
        hass.data.pop(DOMAIN, None)
        
        _LOGGER.info("AI Configuration Assistant integration unloaded")
    
    return True

async def _async_register_services(hass: HomeAssistant) -> None:
    """Register AI Config Assistant services."""
    
    async def generate_config_service(call: ServiceCall) -> ServiceResponse:
        """Generate configuration from natural language input."""
        config_generator = hass.data[DOMAIN]["config_generator"]
        
        prompt = call.data.get("prompt", "")
        config_type = call.data.get("type", "automation")
        context = call.data.get("context", {})
        include_entities = call.data.get("entities", [])
        
        try:
            result = await config_generator.generate_config(
                prompt=prompt,
                config_type=config_type,
                context=context,
                include_entities=include_entities,
            )
            
            # Fire event for backward compatibility
            hass.bus.async_fire(
                "ai_config_assistant_config_generated",
                {
                    "success": True,
                    "config": result.config,
                    "explanation": result.explanation,
                    "entities_used": result.entities_used,
                },
            )
            
            # Return response for new chat interface
            return {
                "success": True,
                "config": result.config,
                "explanation": result.explanation,
                "entities_used": result.entities_used,
            }
            
        except Exception as err:
            _LOGGER.error("Error generating config: %s", err)
            hass.bus.async_fire(
                "ai_config_assistant_config_generated",
                {
                    "success": False,
                    "error": str(err),
                },
            )
            
            # Return error response
            return {
                "success": False,
                "error": str(err),
            }
    
    async def validate_config_service(call: ServiceCall) -> None:
        """Validate a configuration."""
        config_generator = hass.data[DOMAIN]["config_generator"]
        
        config_yaml = call.data.get("config", "")
        config_type = call.data.get("type", "automation")
        
        try:
            result = await config_generator.validate_config(
                config_yaml=config_yaml,
                config_type=config_type,
            )
            
            hass.bus.async_fire(
                "ai_config_assistant_config_validated",
                {
                    "success": True,
                    "valid": result.valid,
                    "errors": result.errors,
                    "warnings": result.warnings,
                },
            )
            
        except Exception as err:
            _LOGGER.error("Error validating config: %s", err)
            hass.bus.async_fire(
                "ai_config_assistant_config_validated",
                {
                    "success": False,
                    "error": str(err),
                },
            )
    
    async def preview_config_service(call: ServiceCall) -> None:
        """Preview a configuration with live data."""
        entity_manager = hass.data[DOMAIN]["entity_manager"]
        
        config_yaml = call.data.get("config", "")
        config_type = call.data.get("type", "automation")
        
        try:
            result = await entity_manager.preview_config(
                config_yaml=config_yaml,
                config_type=config_type,
            )
            
            hass.bus.async_fire(
                "ai_config_assistant_config_previewed",
                {
                    "success": True,
                    "preview": result,
                },
            )
            
        except Exception as err:
            _LOGGER.error("Error previewing config: %s", err)
            hass.bus.async_fire(
                "ai_config_assistant_config_previewed",
                {
                    "success": False,
                    "error": str(err),
                },
            )
    
    async def reload_service(call: ServiceCall) -> None:
        """Reload the AI Configuration Assistant integration."""
        _LOGGER.info("Reloading AI Configuration Assistant integration...")
        
        try:
            # Get the config entry
            config_entry = hass.data[DOMAIN].get("config_entry")
            if not config_entry:
                _LOGGER.error("No config entry found for reload")
                return
            
            # Unload and reload the integration
            await async_unload_entry(hass, config_entry)
            await async_setup_entry(hass, config_entry)
            
            _LOGGER.info("AI Configuration Assistant integration reloaded successfully")
            
            # Fire event to notify UI
            hass.bus.async_fire(
                "ai_config_assistant_reloaded",
                {"success": True, "message": "Integration reloaded successfully"}
            )
            
        except Exception as err:
            _LOGGER.error("Error reloading integration: %s", err)
            hass.bus.async_fire(
                "ai_config_assistant_reloaded",
                {"success": False, "error": str(err)}
            )

    # Register services
    hass.services.async_register(
        DOMAIN, SERVICE_GENERATE_CONFIG, generate_config_service,
        supports_response=SupportsResponse.OPTIONAL
    )
    
    hass.services.async_register(
        DOMAIN, SERVICE_VALIDATE_CONFIG, validate_config_service
    )
    
    hass.services.async_register(
        DOMAIN, SERVICE_PREVIEW_CONFIG, preview_config_service
    )
    
    hass.services.async_register(
        DOMAIN, SERVICE_RELOAD, reload_service
    )