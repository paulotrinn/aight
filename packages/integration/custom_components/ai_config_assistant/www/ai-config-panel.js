customElements.define('ai-config-panel', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._hass = null;
    this._currentTab = 'generate';
    this._entities = [];
    this._autocompleteTimeout = null;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
      this._loadEntities();
    }
  }

  _render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          font-family: var(--paper-font-common-base_-_font-family);
          background: var(--primary-background-color);
          color: var(--primary-text-color);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--divider-color);
        }

        .header h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 400;
        }

        .header .status {
          font-size: 14px;
          color: var(--secondary-text-color);
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--divider-color);
        }

        .tab {
          padding: 12px 24px;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
          text-transform: uppercase;
          transition: all 0.3s ease;
        }

        .tab:hover {
          background: rgba(0, 0, 0, 0.04);
        }

        .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        .content {
          display: none;
        }

        .content.active {
          display: block;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .card {
          background: var(--card-background-color);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        .input-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 14px;
          color: var(--secondary-text-color);
        }

        input, textarea, select {
          width: 100%;
          padding: 12px;
          background: var(--card-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          color: var(--primary-text-color);
          font-family: inherit;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.3s;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        textarea {
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
        }

        .code-editor {
          font-family: 'Roboto Mono', 'Consolas', 'Monaco', monospace;
          font-size: 13px;
          line-height: 1.5;
        }

        button {
          padding: 12px 24px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        button:hover {
          background: var(--dark-primary-color);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        button.secondary {
          background: transparent;
          color: var(--primary-color);
          border: 1px solid var(--primary-color);
        }

        button.secondary:hover {
          background: rgba(3, 169, 244, 0.1);
        }

        .button-group {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .output-section {
          margin-top: 24px;
        }

        .output-code {
          padding: 16px;
          background: var(--secondary-background-color);
          border-radius: 4px;
          overflow-x: auto;
          border: 1px solid var(--divider-color);
          margin-top: 8px;
        }

        .output-code pre {
          margin: 0;
          font-family: 'Roboto Mono', 'Consolas', monospace;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .entity-autocomplete {
          position: relative;
        }

        .entity-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--card-background-color);
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: none;
          margin-top: 4px;
        }

        .entity-suggestions.show {
          display: block;
        }

        .entity-suggestion {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid var(--divider-color);
          transition: background 0.2s;
        }

        .entity-suggestion:hover {
          background: var(--secondary-background-color);
        }

        .entity-suggestion:last-child {
          border-bottom: none;
        }

        .entity-name {
          font-weight: 500;
          font-size: 14px;
        }

        .entity-info {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 2px;
        }

        .preview-section {
          margin-top: 16px;
          padding: 12px;
          background: var(--secondary-background-color);
          border-radius: 4px;
        }

        .preview-entity {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--divider-color);
        }

        .preview-entity:last-child {
          border-bottom: none;
        }

        .message {
          padding: 12px;
          border-radius: 4px;
          margin: 16px 0;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .message.success {
          background: var(--success-color, #4caf50);
          color: white;
        }

        .message.error {
          background: var(--error-color, #f44336);
          color: white;
        }

        .message.warning {
          background: var(--warning-color, #ff9800);
          color: white;
        }

        .message.info {
          background: var(--info-color, #2196f3);
          color: white;
        }

        .loading {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
          vertical-align: middle;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }

        h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 500;
        }

        .example-prompts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .example-chip {
          padding: 6px 12px;
          background: var(--primary-color);
          color: white;
          border-radius: 16px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .example-chip:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      </style>

      <div class="container">
        <div class="header">
          <h1>Aight</h1>
          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="status" id="entity-count"></div>
            <button id="reload-btn" class="secondary" style="min-width: auto; padding: 8px 16px;">🔄 Reload</button>
          </div>
        </div>

        <div class="tabs">
          <button class="tab active" data-tab="generate">Generate</button>
          <button class="tab" data-tab="validate">Validate</button>
          <button class="tab" data-tab="preview">Preview</button>
          <button class="tab" data-tab="help">Help</button>
        </div>

        <div class="content active" id="generate">
          <div class="card">
            <div class="input-group">
              <label>Configuration Type</label>
              <select id="config-type">
                <option value="automation">Automation</option>
                <option value="script">Script</option>
                <option value="scene">Scene</option>
                <option value="dashboard">Dashboard</option>
                <option value="template">Template Sensor</option>
              </select>
              <div class="help-text">Select the type of configuration you want to generate</div>
            </div>

            <div class="input-group entity-autocomplete">
              <label>Describe what you want to create</label>
              <textarea id="prompt" placeholder="Example: Turn on living room lights when motion is detected after sunset"></textarea>
              <div class="entity-suggestions" id="entity-suggestions"></div>
              <div class="help-text">Use natural language to describe your automation. Entity names will autocomplete as you type.</div>
              
              <div class="example-prompts">
                <div class="example-chip" data-prompt="Turn on lights when I arrive home">Arrival automation</div>
                <div class="example-chip" data-prompt="Send notification when washing machine is done">Appliance monitor</div>
                <div class="example-chip" data-prompt="Dim lights for movie time">Scene creator</div>
                <div class="example-chip" data-prompt="Turn off everything when leaving">Away mode</div>
              </div>
            </div>

            <div class="button-group">
              <button id="generate-btn">Generate Configuration</button>
              <button id="clear-btn" class="secondary">Clear</button>
            </div>
          </div>

          <div class="output-section" id="generate-output" style="display: none;">
            <div class="card">
              <h3>Generated Configuration</h3>
              <div id="explanation"></div>
              <div class="output-code">
                <pre id="generated-config"></pre>
              </div>
              <div class="button-group">
                <button id="copy-btn">Copy to Clipboard</button>
                <button id="validate-generated-btn" class="secondary">Validate</button>
                <button id="preview-generated-btn" class="secondary">Preview</button>
              </div>
            </div>
          </div>
        </div>

        <div class="content" id="validate">
          <div class="card">
            <div class="input-group">
              <label>Configuration Type</label>
              <select id="validate-type">
                <option value="automation">Automation</option>
                <option value="script">Script</option>
                <option value="scene">Scene</option>
                <option value="dashboard">Dashboard</option>
                <option value="template">Template Sensor</option>
              </select>
            </div>

            <div class="input-group">
              <label>Configuration YAML</label>
              <textarea id="config-yaml" class="code-editor" placeholder="Paste your YAML configuration here..."></textarea>
              <div class="help-text">Paste your YAML configuration to validate its syntax</div>
            </div>

            <div class="button-group">
              <button id="validate-btn">Validate Configuration</button>
            </div>

            <div id="validation-results"></div>
          </div>
        </div>

        <div class="content" id="preview">
          <div class="card">
            <div class="input-group">
              <label>Configuration Type</label>
              <select id="preview-type">
                <option value="automation">Automation</option>
                <option value="script">Script</option>
                <option value="scene">Scene</option>
                <option value="dashboard">Dashboard</option>
                <option value="template">Template Sensor</option>
              </select>
            </div>

            <div class="input-group">
              <label>Configuration YAML</label>
              <textarea id="preview-yaml" class="code-editor" placeholder="Paste your YAML configuration here..."></textarea>
              <div class="help-text">Preview how your configuration will work with current entity states</div>
            </div>

            <div class="button-group">
              <button id="preview-btn">Preview with Live Data</button>
            </div>

            <div id="preview-results"></div>
          </div>
        </div>

        <div class="content" id="help">
          <div class="card">
            <h3>How to Use Aight</h3>
            
            <h4>Generate Configurations</h4>
            <p>Use natural language to describe what you want. Examples:</p>
            <ul>
              <li>"Turn on porch light at sunset and off at sunrise"</li>
              <li>"Alert me when the garage door is left open for more than 10 minutes"</li>
              <li>"Create a bedtime routine that locks doors and turns off lights"</li>
              <li>"Show all temperature sensors on a dashboard"</li>
            </ul>

            <h4>Entity Autocomplete</h4>
            <p>Start typing entity names like <code>light.</code> or <code>switch.</code> to see suggestions from your system.</p>

            <h4>Validate & Preview</h4>
            <p>Use the Validate tab to check YAML syntax, and Preview to see how configurations work with your current entity states.</p>

            <h4>Reload Integration</h4>
            <p>Click the "🔄 Reload" button in the header to reload the integration without restarting Home Assistant. This is useful when:</p>
            <ul>
              <li>Installing updates to the integration</li>
              <li>Changing configuration settings</li>
              <li>Troubleshooting issues</li>
            </ul>

            <h4>Available Services</h4>
            <p>You can also use these services programmatically:</p>
            <ul>
              <li><code>ai_config_assistant.generate_config</code> - Generate configurations</li>
              <li><code>ai_config_assistant.validate_config</code> - Validate YAML</li>
              <li><code>ai_config_assistant.preview_config</code> - Preview with live data</li>
              <li><code>ai_config_assistant.reload</code> - Reload the integration</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="temp-messages"></div>
    `;

    this._attachListeners();
  }

  _attachListeners() {
    const root = this.shadowRoot;

    // Tab switching
    root.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        root.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        root.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        const target = root.getElementById(targetId);
        if (target) target.classList.add('active');
        
        this._currentTab = targetId;
      });
    });

    // Example chips
    root.querySelectorAll('.example-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        root.getElementById('prompt').value = prompt;
      });
    });

    // Generate button
    const generateBtn = root.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this._generateConfig());
    }

    // Clear button
    const clearBtn = root.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        root.getElementById('prompt').value = '';
        root.getElementById('generate-output').style.display = 'none';
      });
    }

    // Copy button
    const copyBtn = root.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const config = root.getElementById('generated-config').textContent;
        navigator.clipboard.writeText(config).then(() => {
          this._showMessage('Copied to clipboard!', 'success');
        });
      });
    }

    // Validate button
    const validateBtn = root.getElementById('validate-btn');
    if (validateBtn) {
      validateBtn.addEventListener('click', () => this._validateConfig());
    }

    // Preview button
    const previewBtn = root.getElementById('preview-btn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => this._previewConfig());
    }

    // Entity autocomplete with debouncing
    const promptField = root.getElementById('prompt');
    if (promptField) {
      promptField.addEventListener('input', (e) => {
        clearTimeout(this._autocompleteTimeout);
        this._autocompleteTimeout = setTimeout(() => {
          this._handleEntityAutocomplete(e.target.value);
        }, 150);
      });
      
      // Hide suggestions when clicking outside
      promptField.addEventListener('blur', () => {
        setTimeout(() => {
          const suggestionsDiv = root.getElementById('entity-suggestions');
          suggestionsDiv.classList.remove('show');
        }, 200); // Small delay to allow click on suggestion
      });
    }

    // Transfer generated config to validate
    const validateGeneratedBtn = root.getElementById('validate-generated-btn');
    if (validateGeneratedBtn) {
      validateGeneratedBtn.addEventListener('click', () => {
        const config = root.getElementById('generated-config').textContent;
        root.getElementById('config-yaml').value = config;
        root.querySelector('[data-tab="validate"]').click();
      });
    }

    // Transfer generated config to preview
    const previewGeneratedBtn = root.getElementById('preview-generated-btn');
    if (previewGeneratedBtn) {
      previewGeneratedBtn.addEventListener('click', () => {
        const config = root.getElementById('generated-config').textContent;
        root.getElementById('preview-yaml').value = config;
        root.querySelector('[data-tab="preview"]').click();
      });
    }

    // Reload button
    const reloadBtn = root.getElementById('reload-btn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => this._reloadIntegration());
    }
  }

  async _loadEntities() {
    if (!this._hass) return;

    try {
      this._entities = Object.keys(this._hass.states).map(entityId => ({
        entity_id: entityId,
        friendly_name: this._hass.states[entityId].attributes.friendly_name || entityId,
        state: this._hass.states[entityId].state
      }));
      
      const entityCount = this.shadowRoot.getElementById('entity-count');
      if (entityCount) {
        entityCount.textContent = this._entities.length + ' entities loaded';
      }
    } catch (error) {
      console.error('Failed to load entities:', error);
    }
  }

  async _generateConfig() {
    const root = this.shadowRoot;
    const prompt = root.getElementById('prompt').value;
    const configType = root.getElementById('config-type').value;

    if (!prompt) {
      this._showMessage('Please enter a description', 'error');
      return;
    }

    const generateBtn = root.getElementById('generate-btn');
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span class="loading"></span> Generating...';

    try {
      await this._hass.callService('ai_config_assistant', 'generate_config', {
        prompt: prompt,
        type: configType
      });

      root.getElementById('generate-output').style.display = 'block';
      
      this._showMessage('Configuration generated! The result will appear in the logs.', 'success');
      
      // For now, show a sample configuration
      const sampleConfig = this._getSampleConfig(configType, prompt);
      root.getElementById('generated-config').textContent = sampleConfig;
      
      root.getElementById('explanation').innerHTML = '<div class="message info">Check Home Assistant logs for the actual AI-generated configuration.</div>';
      
    } catch (error) {
      this._showMessage('Error: ' + error.message, 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerHTML = 'Generate Configuration';
    }
  }

  async _validateConfig() {
    const root = this.shadowRoot;
    const configYaml = root.getElementById('config-yaml').value;
    const configType = root.getElementById('validate-type').value;

    if (!configYaml) {
      this._showMessage('Please enter a configuration', 'error');
      return;
    }

    const validateBtn = root.getElementById('validate-btn');
    validateBtn.disabled = true;
    validateBtn.innerHTML = '<span class="loading"></span> Validating...';

    try {
      await this._hass.callService('ai_config_assistant', 'validate_config', {
        config: configYaml,
        type: configType
      });

      const resultsDiv = root.getElementById('validation-results');
      resultsDiv.innerHTML = '<div class="card"><div class="message success">Validation request sent! Check the logs for detailed results.</div></div>';
      
    } catch (error) {
      this._showMessage('Error: ' + error.message, 'error');
    } finally {
      validateBtn.disabled = false;
      validateBtn.innerHTML = 'Validate Configuration';
    }
  }

  async _previewConfig() {
    const root = this.shadowRoot;
    const configYaml = root.getElementById('preview-yaml').value;
    const configType = root.getElementById('preview-type').value;

    if (!configYaml) {
      this._showMessage('Please enter a configuration', 'error');
      return;
    }

    const previewBtn = root.getElementById('preview-btn');
    previewBtn.disabled = true;
    previewBtn.innerHTML = '<span class="loading"></span> Loading Preview...';

    try {
      await this._hass.callService('ai_config_assistant', 'preview_config', {
        config: configYaml,
        type: configType
      });

      const resultsDiv = root.getElementById('preview-results');
      resultsDiv.innerHTML = '<div class="card"><div class="message info">Preview request sent! Check the logs for results.</div></div>';
      
    } catch (error) {
      this._showMessage('Error: ' + error.message, 'error');
    } finally {
      previewBtn.disabled = false;
      previewBtn.innerHTML = 'Preview with Live Data';
    }
  }

  _handleEntityAutocomplete(text) {
    const root = this.shadowRoot;
    const suggestionsDiv = root.getElementById('entity-suggestions');

    // Enhanced pattern to catch partial entity names
    const entityPattern = /(?:^|\s)([a-z_]+\.[\w]*?)$/i;
    const match = text.match(entityPattern);

    if (match && this._entities.length > 0) {
      const query = match[1].toLowerCase();
      const queryParts = query.split('.');
      const domain = queryParts[0];
      const entityPart = queryParts[1] || '';

      // Filter entities by domain and partial entity name
      const suggestions = this._entities
        .filter(entity => {
          const entityId = entity.entity_id.toLowerCase();
          const entityParts = entityId.split('.');
          
          // Must match domain and entity part should contain the query substring
          return entityParts[0] === domain && 
                 (entityPart === '' || entityParts[1].includes(entityPart));
        })
        .sort((a, b) => {
          // Sort by relevance: exact matches first, then partial matches
          const aId = a.entity_id.toLowerCase();
          const bId = b.entity_id.toLowerCase();
          const aExact = aId === query;
          const bExact = bId === query;
          
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          // Then by starts with
          const aStarts = aId.startsWith(query);
          const bStarts = bId.startsWith(query);
          
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          
          // Finally alphabetical
          return aId.localeCompare(bId);
        })
        .slice(0, 10);

      if (suggestions.length > 0) {
        suggestionsDiv.innerHTML = suggestions.map(entity => 
          '<div class="entity-suggestion" data-entity="' + entity.entity_id + '">' +
          '<div class="entity-name">' + entity.entity_id + '</div>' +
          '<div class="entity-info">' + entity.friendly_name + ' (' + entity.state + ')</div>' +
          '</div>'
        ).join('');

        suggestionsDiv.classList.add('show');

        suggestionsDiv.querySelectorAll('.entity-suggestion').forEach(suggestion => {
          suggestion.addEventListener('click', () => {
            const entityId = suggestion.dataset.entity;
            const textarea = root.getElementById('prompt');
            const currentText = textarea.value;
            const newText = currentText.substring(0, currentText.lastIndexOf(match[1])) + entityId + ' ';
            textarea.value = newText;
            suggestionsDiv.classList.remove('show');
            textarea.focus();
          });
        });
      } else {
        suggestionsDiv.classList.remove('show');
      }
    } else {
      suggestionsDiv.classList.remove('show');
    }
  }

  _showMessage(text, type) {
    const root = this.shadowRoot;
    const container = root.getElementById('temp-messages') || root.querySelector('.container');
    
    const msg = document.createElement('div');
    msg.className = 'message ' + type;
    msg.textContent = text;
    msg.style.position = 'fixed';
    msg.style.top = '20px';
    msg.style.right = '20px';
    msg.style.zIndex = '9999';
    msg.style.maxWidth = '400px';
    
    container.appendChild(msg);
    
    setTimeout(() => msg.remove(), 5000);
  }

  _getSampleConfig(type, prompt) {
    // Return sample configurations based on type
    const samples = {
      automation: `alias: Generated Automation
description: "${prompt}"
trigger:
  - platform: state
    entity_id: binary_sensor.motion_sensor
    to: 'on'
condition:
  - condition: sun
    after: sunset
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room`,
      
      script: `alias: Generated Script
sequence:
  - service: light.turn_on
    target:
      entity_id: light.all_lights
  - delay:
      seconds: 30
  - service: light.turn_off
    target:
      entity_id: light.all_lights`,
      
      scene: `name: Generated Scene
entities:
  light.living_room:
    state: on
    brightness: 128
    color_temp: 300
  light.bedroom:
    state: off`,
    
      dashboard: `type: entities
title: Generated Dashboard
entities:
  - entity: sensor.temperature
  - entity: sensor.humidity
  - entity: switch.smart_plug`,
  
      template: `- sensor:
  - name: "Generated Sensor"
    state: "{{ states('sensor.temperature') | float * 1.8 + 32 }}"
    unit_of_measurement: "°F"`
    };
    
    return samples[type] || '# Generated configuration will appear here';
  }

  async _reloadIntegration() {
    const root = this.shadowRoot;
    const reloadBtn = root.getElementById('reload-btn');
    
    if (!this._hass) {
      this._showMessage('Home Assistant connection not available', 'error');
      return;
    }
    
    reloadBtn.disabled = true;
    reloadBtn.innerHTML = '🔄 Reloading...';
    
    try {
      await this._hass.callService('ai_config_assistant', 'reload');
      this._showMessage('Integration reloaded successfully! 🎉', 'success');
      
      // Refresh entities after reload
      setTimeout(() => {
        this._loadEntities();
      }, 1000);
      
    } catch (error) {
      this._showMessage('Failed to reload integration: ' + error.message, 'error');
    } finally {
      reloadBtn.disabled = false;
      reloadBtn.innerHTML = '🔄 Reload';
    }
  }
});