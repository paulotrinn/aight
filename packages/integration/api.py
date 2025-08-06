"""API endpoints for AI Configuration Assistant."""
import logging
from typing import Any, Dict
import json

from aiohttp import web
from aiohttp.web import Request, Response
import voluptuous as vol

from homeassistant.core import HomeAssistant
from homeassistant.components.http import HomeAssistantView
from homeassistant.helpers import config_validation as cv

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

class EntitySuggestionsView(HomeAssistantView):
    """View for entity suggestions API."""
    
    url = "/api/ai_config_assistant/entity_suggestions"
    name = "api:ai_config_assistant:entity_suggestions"
    requires_auth = True

    async def post(self, request: Request) -> Response:
        """Handle entity suggestions request."""
        hass: HomeAssistant = request.app["hass"]
        
        try:
            data = await request.json()
            query = data.get("query", "")
            limit = data.get("limit", 10)
            domain_filter = data.get("domain_filter")

            entity_manager = hass.data[DOMAIN].get("entity_manager")
            if not entity_manager:
                return web.json_response(
                    {"error": "Entity manager not available"}, status=500
                )

            suggestions = await entity_manager.get_entity_suggestions(
                query=query,
                domain_filter=domain_filter,
                limit=limit
            )

            # Convert suggestions to JSON-serializable format
            result = []
            for suggestion in suggestions:
                result.append({
                    "entity_id": suggestion.entity_id,
                    "name": suggestion.name,
                    "domain": suggestion.domain,
                    "score": suggestion.score,
                    "context": suggestion.context,
                })

            return web.json_response(result)

        except Exception as err:
            _LOGGER.error("Error in entity suggestions: %s", err)
            return web.json_response(
                {"error": str(err)}, status=500
            )


class ConfigGenerationView(HomeAssistantView):
    """View for config generation API."""
    
    url = "/api/ai_config_assistant/generate"
    name = "api:ai_config_assistant:generate" 
    requires_auth = True

    async def post(self, request: Request) -> Response:
        """Handle configuration generation request."""
        hass: HomeAssistant = request.app["hass"]
        
        try:
            data = await request.json()
            prompt = data.get("prompt", "")
            config_type = data.get("type", "automation")
            context = data.get("context", {})
            
            if not prompt.strip():
                return web.json_response(
                    {"error": "Prompt is required"}, status=400
                )

            config_generator = hass.data[DOMAIN].get("config_generator")
            if not config_generator:
                return web.json_response(
                    {"error": "Config generator not available"}, status=500
                )

            result = await config_generator.generate_config(
                prompt=prompt,
                config_type=config_type,
                context=context
            )

            return web.json_response({
                "success": result.success,
                "config": result.config,
                "explanation": result.explanation,
                "entities_used": result.entities_used,
                "warnings": result.warnings,
            })

        except Exception as err:
            _LOGGER.error("Error in config generation: %s", err)
            return web.json_response(
                {"error": str(err)}, status=500
            )


class ConfigValidationView(HomeAssistantView):
    """View for config validation API."""
    
    url = "/api/ai_config_assistant/validate"
    name = "api:ai_config_assistant:validate"
    requires_auth = True

    async def post(self, request: Request) -> Response:
        """Handle configuration validation request."""
        hass: HomeAssistant = request.app["hass"]
        
        try:
            data = await request.json()
            config_yaml = data.get("config", "")
            config_type = data.get("type", "automation")
            
            if not config_yaml.strip():
                return web.json_response(
                    {"error": "Configuration is required"}, status=400
                )

            config_generator = hass.data[DOMAIN].get("config_generator")
            if not config_generator:
                return web.json_response(
                    {"error": "Config generator not available"}, status=500
                )

            result = await config_generator.validate_config(
                config_yaml=config_yaml,
                config_type=config_type
            )

            return web.json_response({
                "valid": result.valid,
                "errors": result.errors,
                "warnings": result.warnings,
                "suggestions": result.suggestions,
            })

        except Exception as err:
            _LOGGER.error("Error in config validation: %s", err)
            return web.json_response(
                {"error": str(err)}, status=500
            )


class ConfigPreviewView(HomeAssistantView):
    """View for config preview API."""
    
    url = "/api/ai_config_assistant/preview"
    name = "api:ai_config_assistant:preview"
    requires_auth = True

    async def post(self, request: Request) -> Response:
        """Handle configuration preview request."""
        hass: HomeAssistant = request.app["hass"]
        
        try:
            data = await request.json()
            config_yaml = data.get("config", "")
            config_type = data.get("type", "automation")
            
            if not config_yaml.strip():
                return web.json_response(
                    {"error": "Configuration is required"}, status=400
                )

            entity_manager = hass.data[DOMAIN].get("entity_manager")
            if not entity_manager:
                return web.json_response(
                    {"error": "Entity manager not available"}, status=500
                )

            result = await entity_manager.preview_config(
                config_yaml=config_yaml,
                config_type=config_type
            )

            return web.json_response({
                "preview_html": result.preview_html,
                "entities_referenced": result.entities_referenced,
                "warnings": result.warnings,
                "errors": result.errors,
            })

        except Exception as err:
            _LOGGER.error("Error in config preview: %s", err)
            return web.json_response(
                {"error": str(err)}, status=500
            )


class EntitiesView(HomeAssistantView):
    """View for entities API."""
    
    url = "/api/ai_config_assistant/entities"
    name = "api:ai_config_assistant:entities"
    requires_auth = True

    async def get(self, request: Request) -> Response:
        """Get entities information."""
        hass: HomeAssistant = request.app["hass"]
        
        try:
            domain = request.query.get("domain")
            area = request.query.get("area")
            
            entity_manager = hass.data[DOMAIN].get("entity_manager")
            if not entity_manager:
                return web.json_response(
                    {"error": "Entity manager not available"}, status=500
                )

            if domain:
                entities = await entity_manager.get_entities_by_domain(domain)
            elif area:
                entities = await entity_manager.get_entities_by_area(area)
            else:
                # Return summary information
                return web.json_response({
                    "entity_count": entity_manager.entity_count,
                    "last_update": entity_manager.last_update.isoformat() if entity_manager.last_update else None,
                    "domains": list(entity_manager._entities_by_domain.keys()),
                    "areas": list(entity_manager._entities_by_area.keys()),
                })

            # Convert entities to JSON-serializable format
            result = []
            for entity in entities:
                result.append({
                    "entity_id": entity.entity_id,
                    "name": entity.name,
                    "domain": entity.domain,
                    "state": entity.state,
                    "area_name": entity.area_name,
                    "device_name": entity.device_name,
                    "attributes": entity.attributes,
                })

            return web.json_response(result)

        except Exception as err:
            _LOGGER.error("Error in entities endpoint: %s", err)
            return web.json_response(
                {"error": str(err)}, status=500
            )


async def async_register_api_views(hass: HomeAssistant) -> None:
    """Register API views."""
    try:
        hass.http.register_view(EntitySuggestionsView())
        hass.http.register_view(ConfigGenerationView())
        hass.http.register_view(ConfigValidationView())
        hass.http.register_view(ConfigPreviewView())
        hass.http.register_view(EntitiesView())
        
        _LOGGER.info("AI Configuration Assistant API views registered")
        
    except Exception as err:
        _LOGGER.error("Failed to register API views: %s", err)