{% if installed %}
## AI Configuration Assistant is installed!

The AI Configuration Assistant panel has been added to your Home Assistant sidebar.

**Next steps:**
1. Configure your LLM provider (OpenAI, Anthropic, Google, etc.)
2. Get an API key from your chosen provider
3. Start generating configurations with natural language!

**Quick start:**
- Go to Settings → Devices & Services
- Add the "AI Configuration Assistant" integration
- Enter your API key
- Visit the "AI Config" panel in your sidebar

{% else %}
## AI Configuration Assistant

Transform your Home Assistant configuration experience with AI-powered natural language generation!

**Features:**
🤖 Generate automations, scripts, dashboards by describing what you want in plain English
🔄 Live preview with real entity data before deploying
🎯 Smart entity autocompletion based on your devices
🔍 Support for multiple AI providers (OpenAI, Anthropic, Google, and more)
✅ Built-in configuration validation with helpful suggestions

**Supported Configuration Types:**
- Automations (triggers, conditions, actions)
- Scripts (sequence of actions)
- Scenes (device states)
- Dashboards (Lovelace UI)
- Template sensors and binary sensors

**Example prompts:**
- "Turn on living room lights when motion is detected after sunset"
- "Create a good night routine that locks doors and turns off all lights"
- "Make a security dashboard with all cameras and door sensors"

**Requirements:**
- Home Assistant 2025.1+
- API key from supported LLM provider (OpenAI, Anthropic, Google, etc.)

Ready to make Home Assistant configuration as easy as having a conversation? Install now!
{% endif %}