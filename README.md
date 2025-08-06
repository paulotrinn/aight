# AI Configuration Assistant for Home Assistant

A powerful Home Assistant integration that uses AI to help you create configurations through natural language. Generate automations, scripts, dashboards, and more just by describing what you want in plain English!

## Features

🤖 **Natural Language Generation**: Describe what you want in plain English and get valid YAML configurations

🔄 **Live Preview**: See your configuration in action with real entity data before deploying

🎯 **Smart Autocompletion**: Intelligent entity suggestions based on context and existing devices

🔍 **Multi-LLM Support**: Choose from OpenAI, Anthropic Claude, Google Gemini, and more

✅ **Configuration Validation**: Built-in validation with helpful error messages and suggestions

📱 **Modern UI**: Clean, responsive interface that follows Home Assistant design standards

🔧 **Multiple Config Types**: Support for automations, scripts, scenes, dashboards, cards, and templates

## Supported Configuration Types

- **Automations**: Create complex automations with triggers, conditions, and actions
- **Scripts**: Build reusable script sequences
- **Scenes**: Define lighting and device scenes
- **Dashboards**: Generate Lovelace dashboard configurations
- **Cards**: Create individual dashboard cards
- **Template Sensors**: Build template sensors and binary sensors

## Installation

### Quick Install - Full Featured Version

[![Direct Download - Full Featured Version](https://img.shields.io/badge/Download-Full%20Featured%20Version-blue?style=for-the-badge&logo=homeassistant)](https://github.com/toml0006/aight/releases/download/v1.0.0/ai_config_assistant_v1.0.0_full.zip)

Click the button above to download the latest full-featured version with:
- ✨ 4 tabs (Generate, Validate, Preview, Help)
- 🔤 Entity autocomplete with live suggestions
- 🎯 Example prompt chips for quick access
- 📊 Live entity count display
- 🎨 Enhanced UI with animations

### HACS Installation

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=toml0006&repository=aight&category=integration)

### Method 1: HACS (Recommended)

1. **Install HACS** if you haven't already: [HACS Installation](https://hacs.xyz/docs/setup/download)

2. **Add this repository to HACS:**
   - Open HACS in your Home Assistant instance
   - Go to "Integrations" 
   - Click the "..." menu in the top right
   - Select "Custom repositories"
   - Add this repository URL: `https://github.com/toml0006/aight`
   - Category: "Integration"
   - Click "Add"

3. **Install the integration:**
   - Search for "AI Configuration Assistant" in HACS
   - Click "Download"
   - Restart Home Assistant

### Method 2: Manual Installation

1. Copy the `custom_components/ai_config_assistant` directory to your Home Assistant `custom_components` directory
2. Copy the contents of the `www` directory to your Home Assistant `www` directory
3. Restart Home Assistant

## Configuration

### Step 1: Add the Integration

1. Go to Settings → Devices & Services
2. Click "Add Integration"
3. Search for "AI Configuration Assistant"
4. Follow the setup wizard

### Step 2: Configure Your LLM Provider

Choose from supported providers and add your API key:

#### OpenAI
- **Models**: GPT-4, GPT-4-turbo, GPT-3.5-turbo
- **API Key**: Get from [OpenAI Platform](https://platform.openai.com/api-keys)

#### Anthropic Claude
- **Models**: Claude-3 Opus, Sonnet, Haiku
- **API Key**: Get from [Anthropic Console](https://console.anthropic.com/)

#### Google Gemini
- **Models**: Gemini Pro, Gemini Pro Vision
- **API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

#### Other Providers
- **Mistral**: Mistral Large, Medium, Small
- **Groq**: Llama3-70B, Mixtral-8x7B
- **Ollama**: Local models (no API key required)

## Usage

### Basic Usage

1. Navigate to the "AI Config" panel in your Home Assistant sidebar
2. Select the configuration type you want to create
3. Describe what you want in natural language
4. Click "Generate Configuration"
5. Review the generated YAML and live preview
6. Copy or save the configuration

### Example Prompts

**Automations:**
- "Turn on living room lights when motion is detected after sunset"
- "Send notification when front door is left open for 5 minutes"  
- "Turn off all lights when everyone leaves home"

**Scripts:**
- "Good night routine: turn off all lights and lock doors"
- "Movie mode: dim lights to 20% and turn on TV"
- "Morning routine: turn on coffee maker and bathroom lights"

**Dashboards:**
- "Create a security dashboard with all cameras and door sensors"
- "Make a climate control panel for all thermostats"
- "Build an energy monitoring dashboard with power sensors"

### Advanced Features

#### Entity Autocompletion
- Start typing entity names to get intelligent suggestions
- Suggestions are context-aware based on your prompt
- Shows entity states and locations

#### Live Preview
- See how your configuration will look with real entity data
- Preview automations with current trigger states
- Visualize dashboard layouts

#### Configuration Validation
- Built-in YAML syntax validation
- Entity existence checking
- AI-powered logic validation with suggestions

## API Reference

The integration provides several REST API endpoints for advanced usage:

### Generate Configuration
```
POST /api/ai_config_assistant/generate
{
  "prompt": "Turn on lights when motion detected",
  "type": "automation",
  "context": {}
}
```

### Validate Configuration
```
POST /api/ai_config_assistant/validate
{
  "config": "yaml configuration",
  "type": "automation"
}
```

### Get Entity Suggestions
```
POST /api/ai_config_assistant/entity_suggestions
{
  "query": "light",
  "limit": 10,
  "domain_filter": ["light", "switch"]
}
```

## Configuration Examples

### Automation Example
```yaml
alias: "Motion Light Control"
trigger:
  - platform: state
    entity_id: binary_sensor.living_room_motion
    to: "on"
condition:
  - condition: sun
    after: sunset
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room_main
```

### Script Example
```yaml
alias: "Good Night Routine"
sequence:
  - service: light.turn_off
    target:
      area_id: all
  - service: lock.lock
    target:
      entity_id: lock.front_door
  - service: alarm_control_panel.alarm_arm_home
    target:
      entity_id: alarm_control_panel.home_security
```

## Troubleshooting

### Common Issues

**Integration not loading:**
- Check Home Assistant logs for errors
- Ensure all dependencies are installed
- Verify the integration files are in the correct location

**API key errors:**
- Verify your API key is correct and active
- Check that your account has sufficient credits/quota
- Ensure the selected model is available for your account

**Generation not working:**
- Check your internet connection
- Verify the LLM service is operational
- Try with different prompts or models

**Entities not found:**
- Refresh the entity cache by restarting the integration
- Check that entity IDs are correct
- Ensure entities are not disabled

### Debug Logging

Enable debug logging by adding to your `configuration.yaml`:

```yaml
logger:
  default: warning
  logs:
    custom_components.ai_config_assistant: debug
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/toml0006/aight/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/toml0006/aight/discussions)
- **Home Assistant Community**: Visit the [Home Assistant Community Forum](https://community.home-assistant.io/)

## Disclaimer

This integration uses third-party AI services. Please review the privacy policies and terms of service of your chosen LLM provider. Generated configurations should always be reviewed before deployment in production environments.