#!/bin/bash

# AI Configuration Assistant Installation Script for Home Assistant
# This script helps install the integration into a Home Assistant instance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
INTEGRATION_NAME="ai_config_assistant"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${GREEN}AI Configuration Assistant Installation Script${NC}"
echo "=============================================="

# Function to detect Home Assistant installation
detect_home_assistant() {
    local HA_PATHS=(
        "$HOME/.homeassistant"
        "/config"
        "/usr/share/hassio/homeassistant"
        "/opt/homeassistant"
    )
    
    for path in "${HA_PATHS[@]}"; do
        if [[ -f "$path/configuration.yaml" ]]; then
            echo "$path"
            return 0
        fi
    done
    
    return 1
}

# Detect Home Assistant configuration directory
if HA_CONFIG=$(detect_home_assistant); then
    echo -e "${GREEN}✓${NC} Found Home Assistant configuration at: $HA_CONFIG"
else
    echo -e "${RED}✗${NC} Could not find Home Assistant configuration directory"
    echo "Please specify the path to your Home Assistant configuration directory:"
    read -r HA_CONFIG
    
    if [[ ! -f "$HA_CONFIG/configuration.yaml" ]]; then
        echo -e "${RED}✗${NC} Invalid Home Assistant configuration directory"
        exit 1
    fi
fi

# Create directories
echo "Creating directories..."
mkdir -p "$HA_CONFIG/custom_components/$INTEGRATION_NAME"
mkdir -p "$HA_CONFIG/www"

# Copy integration files
echo "Copying integration files..."
if [[ -d "$SCRIPT_DIR/custom_components/$INTEGRATION_NAME" ]]; then
    cp -r "$SCRIPT_DIR/custom_components/$INTEGRATION_NAME"/* "$HA_CONFIG/custom_components/$INTEGRATION_NAME/"
    echo -e "${GREEN}✓${NC} Integration files copied"
else
    echo -e "${RED}✗${NC} Integration source files not found"
    exit 1
fi

# Copy frontend files
echo "Copying frontend files..."
if [[ -d "$SCRIPT_DIR/www" ]]; then
    cp -r "$SCRIPT_DIR/www"/* "$HA_CONFIG/www/"
    echo -e "${GREEN}✓${NC} Frontend files copied"
else
    echo -e "${YELLOW}⚠${NC} Frontend files not found, skipping..."
fi

# Check if integration is already configured
echo "Checking configuration..."
if grep -q "$INTEGRATION_NAME" "$HA_CONFIG/configuration.yaml" 2>/dev/null; then
    echo -e "${YELLOW}⚠${NC} Integration appears to be already configured"
else
    echo -e "${GREEN}✓${NC} Integration not yet configured (this is normal for config flow integrations)"
fi

# Set permissions
echo "Setting permissions..."
chmod -R 755 "$HA_CONFIG/custom_components/$INTEGRATION_NAME"
chmod -R 755 "$HA_CONFIG/www"

# Validation
echo "Validating installation..."
required_files=(
    "__init__.py"
    "manifest.json"
    "config_flow.py"
    "const.py"
    "llm_client.py"
    "entity_manager.py"
    "config_generator.py"
    "api.py"
    "panel.py"
    "strings.json"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [[ -f "$HA_CONFIG/custom_components/$INTEGRATION_NAME/$file" ]]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        all_files_exist=false
    fi
done

if [[ "$all_files_exist" == true ]]; then
    echo -e "${GREEN}✓${NC} All required files are present"
else
    echo -e "${RED}✗${NC} Some required files are missing"
    exit 1
fi

# Installation complete
echo ""
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Restart Home Assistant"
echo "2. Go to Settings → Devices & Services"
echo "3. Click 'Add Integration'"
echo "4. Search for 'AI Configuration Assistant'"
echo "5. Follow the setup wizard to configure your LLM provider"
echo ""
echo "After setup, you'll find the 'AI Config' panel in your sidebar."
echo ""
echo "For support and documentation, visit:"
echo "https://github.com/your-username/ai-config-assistant"
echo ""
echo -e "${YELLOW}Note:${NC} You'll need an API key from one of the supported LLM providers:"
echo "- OpenAI (GPT-4, GPT-3.5-turbo)"
echo "- Anthropic (Claude-3)"
echo "- Google (Gemini)"
echo "- Others (Mistral, Groq, Ollama)"
echo ""

# Optional: Check Python dependencies
if command -v python3 &> /dev/null; then
    echo "Checking Python dependencies..."
    missing_deps=()
    
    python3 -c "import litellm" 2>/dev/null || missing_deps+=("litellm")
    python3 -c "import pydantic" 2>/dev/null || missing_deps+=("pydantic")
    python3 -c "import yaml" 2>/dev/null || missing_deps+=("PyYAML")
    
    if [[ ${#missing_deps[@]} -eq 0 ]]; then
        echo -e "${GREEN}✓${NC} All Python dependencies are available"
    else
        echo -e "${YELLOW}⚠${NC} Some Python dependencies may need to be installed:"
        printf ' - %s\n' "${missing_deps[@]}"
        echo "Home Assistant will attempt to install these automatically."
    fi
fi

echo -e "${GREEN}Installation script completed successfully!${NC}"