# Aight - AI Configuration Assistant for Home Assistant

🚀 **v1.4.0** - The most advanced Home Assistant AI configuration tool with **conversational chat interface**!

📖 **[Documentation & Demo](https://toml0006.github.io/aight/)** | 📦 **[Download Latest](https://github.com/toml0006/aight/releases/latest)** | 💬 **[Community](https://github.com/toml0006/aight/discussions)**

**Aight** is a powerful Home Assistant integration that uses AI to help you create configurations through natural language. No more YAML editing - just chat with the AI and get working configurations instantly!

## ✨ Key Features

💬 **Conversational Chat Interface**: Chat naturally with AI - no forms, no interruptions, just results!

🤖 **Smart Entity Detection**: Automatically finds relevant entities based on your prompt

🚀 **One-Click Deployment**: Deploy automations, scripts, and scenes directly to Home Assistant

🔄 **Iterative Refinement**: Say "also turn on the TV" or "but only on weekdays" to modify configurations

🔍 **Multi-LLM Support**: OpenAI, Anthropic Claude, Google Gemini, Groq, Ollama, and OpenRouter

🛠️ **Advanced Error Handling**: Detailed error logs with progressive disclosure for easy debugging

📱 **Mobile Responsive**: Beautiful interface that works perfectly on phones, tablets, and desktops

## Supported Configuration Types

- **Automations**: Create complex automations with triggers, conditions, and actions
- **Scripts**: Build reusable script sequences
- **Scenes**: Define lighting and device scenes
- **Dashboards**: Generate Lovelace dashboard configurations
- **Cards**: Create individual dashboard cards
- **Template Sensors**: Build template sensors and binary sensors

## Installation

### 🚀 Quick Install - Latest Version

[![Download Latest Version](https://img.shields.io/badge/Download-v1.4.0%20Latest-success?style=for-the-badge&logo=homeassistant)](https://github.com/toml0006/aight/releases/latest/download/aight.zip)

**v1.4.0** includes the revolutionary **conversational chat interface**:
- 💬 Natural chat experience - just type what you want!
- 🎯 Automatic entity detection - no manual selection needed
- 🚀 One-click deployment to Home Assistant
- 🔄 Iterative refinement with follow-up messages
- 🛠️ Advanced error logging for easy debugging
- 📱 Mobile-first responsive design

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
   - Search for "Aight" or "AI Configuration Assistant" in HACS
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
3. Search for "Aight" or "AI Configuration Assistant"
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

## 🎯 How It Works - Conversational Interface

### The New Chat Experience

![Chat Interface](https://img.shields.io/badge/NEW-Conversational%20Chat-brightgreen?style=for-the-badge)

1. **Open the Chat Tab**: Navigate to "AI Config" panel and click the "Chat" tab
2. **Just Type**: Describe what you want in natural language
3. **Get Results**: The AI automatically detects entities and generates configuration
4. **Deploy Instantly**: Click the Deploy button to add it to Home Assistant
5. **Refine as Needed**: Say "also turn on the TV" or "but only on weekdays"

### Example Conversation

```
You: Alert me when the garage door is left open for more than 10 minutes

🤖 Assistant: Great! I've created an automation for you:
[Shows YAML configuration with Deploy button]

You: Also send the alert to my phone

🤖 Assistant: I've updated the automation to include phone notifications:
[Shows updated configuration]
```

### Chat Commands
- **"reload"** - Reload automations after deployment
- **"also [action]"** - Add additional actions
- **"but only [condition]"** - Add conditions
- **"change [detail]"** - Modify specific parts

## Usage

### Classic Form Interface (Still Available)

1. Navigate to the "AI Config" panel in your Home Assistant sidebar
2. Click the "Form" tab for the traditional interface
3. Select the configuration type you want to create
4. Describe what you want in natural language
5. Click "Generate Configuration"
6. Review the generated YAML and live preview
7. Copy or save the configuration

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

## 📝 Changelog

### v1.4.0 (Latest) - Enhanced Error Handling & UI Feedback
- ✅ Added user-friendly error messages for common LLM issues (quota, auth, network)
- 💳 OpenAI quota exceeded errors now show direct billing link
- 🔑 API key errors provide clear configuration instructions
- 🌐 Network and timeout errors have helpful messages
- 💬 Service layer now properly surfaces errors to chat UI
- 👁️ Errors appear in chat instead of just logs

### v1.3.9 - Enhanced Service Debugging
- 🔍 Added detailed service response logging for troubleshooting

### v1.3.8 - Full LLM Functionality Restored
- ✅ Removed test response and restored actual AI configuration generation
- 🆕 Added OpenRouter provider support with proper API configuration  
- 🔇 Improved service logging to be less verbose while maintaining debugging
- 🔧 Fixed service response detection works perfectly with HA 2025.7
- 🛠️ Enhanced error handling and response formatting
- 🤖 Service now properly calls AI models for real configuration responses

### v1.3.7 - Critical Fix for HA 2025.7
- 🚨 Fixed critical issue where return_response was always False
- ✅ Now checks both call.return_response and call.data.get('return_response')
- 🎯 Returns hardcoded success response for testing
- 📊 Enhanced logging to show both response flags
- 🔧 Service now properly detects when response is requested

### v1.3.6 - Enhanced Service Debugging
- 🔍 Changed all service debug logs to WARNING level for visibility
- ⚠️ Added explicit check for return_response parameter
- 📊 Enhanced test response with data_received field
- 🛠️ Service now always returns data for debugging purposes
- 💡 Better error messages to diagnose service call issues

### v1.3.5 - Hotfix for SupportsResponse Compatibility
- 🚨 Fixed AttributeError: SupportsResponse.REQUIRED doesn't exist in older HA versions
- ✅ Reverted to SupportsResponse.OPTIONAL for compatibility
- 🔧 Integration now loads properly without errors

### v1.3.4 - Critical Service Response Fix
- 🔧 Fixed service response issue by changing to SupportsResponse.REQUIRED
- ✅ Service now properly returns configuration data instead of just context
- 📊 Added comprehensive response logging for debugging
- 🛠️ Fixed malformed services.yaml with proper entity field support
- 🎯 Synced all fixes to packages directory

### v1.3.3 - Enhanced Debugging
- 🔍 Added comprehensive service call debugging and logging
- 📊 Enhanced error logs now show full service responses
- 🛠️ Better error classification and troubleshooting information
- 💡 Console logging for real-time debugging of service issues
- 🎯 Improved error context for faster issue resolution

### v1.3.2 - Smart Entity Filtering
- 🎯 Fixed "Unknown error" issue by implementing intelligent entity filtering
- 🏠 Added location-based entity detection (e.g., "gym lights" finds gym-specific entities)
- ⚡ Limited entity payload to 100 entities max to prevent service timeout
- 📊 Enhanced error logs with detailed entity filtering information
- 🔍 Added console debugging for troubleshooting entity selection

### v1.3.1 - Enhanced Error Handling
- 🔧 Fixed send button styling to be perfectly circular
- 📋 Added progressive error disclosure with detailed debug logs
- 🛠️ Enhanced error context for better troubleshooting
- 🎨 Improved UI polish and visual feedback

### v1.3.0 - Streamlined Chat Experience  
- 🚫 Removed entity confirmation UI - fully automatic now
- 🤖 Smart domain detection sends only relevant entities to LLM
- 🚀 Working Deploy button for automations, scripts, and scenes
- 💬 Added "reload" command and refinement capabilities

### v1.2.1 - Service Response Fix
- ✅ Fixed "Unknown error" issue with service response handling
- 🔄 Added backward compatibility for older Home Assistant versions
- 🔧 Improved entity ID extraction in chat flow

### v1.2.0 - Conversational Interface
- 💬 Revolutionary chat-first interface with message bubbles
- 🎯 Automatic entity detection and confirmation cards
- 🔄 Multi-turn conversation support with context management
- 📱 Mobile-responsive design with smooth animations

## Support

- **📖 Documentation**: Visit [toml0006.github.io/aight](https://toml0006.github.io/aight/) for full documentation and examples
- **🐛 Issues**: Report bugs and request features on [GitHub Issues](https://github.com/toml0006/aight/issues)
- **💬 Discussions**: Join the conversation in [GitHub Discussions](https://github.com/toml0006/aight/discussions)
- **🏡 Community**: Visit the [Home Assistant Community Forum](https://community.home-assistant.io/)

## Disclaimer

This integration uses third-party AI services. Please review the privacy policies and terms of service of your chosen LLM provider. Generated configurations should always be reviewed before deployment in production environments.