"""Panel for AI Configuration Assistant."""
import logging

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.core import HomeAssistant

from .const import DOMAIN, PANEL_NAME, PANEL_TITLE, PANEL_ICON, PANEL_URL

_LOGGER = logging.getLogger(__name__)

async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the AI Config Assistant panel."""
    try:
        # Add the JavaScript file
        add_extra_js_url(hass, "/ai-config-assistant-frontend/ai-config-panel.js")
        
        # Register the panel
        hass.components.frontend.async_register_built_in_panel(
            component_name="custom",
            sidebar_title=PANEL_TITLE,
            sidebar_icon=PANEL_ICON,
            frontend_url_path=PANEL_NAME,
            config={
                "_panel_custom": {
                    "name": "ai-config-panel",
                    "embed_iframe": False,
                    "trust_external": False,
                }
            },
        )
        
        _LOGGER.info("AI Configuration Assistant panel registered")
        
    except Exception as err:
        _LOGGER.error("Failed to register panel: %s", err)