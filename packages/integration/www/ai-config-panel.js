import {
  LitElement,
  html,
  css,
  customElement,
  property,
  state,
} from "lit";

@customElement("ai-config-panel")
export class AIConfigPanel extends LitElement {
  @property({ attribute: false }) hass;
  @property() narrow;
  @property() route;
  @property() panel;

  @state() private _prompt = "";
  @state() private _configType = "automation";
  @state() private _generatedConfig = "";
  @state() private _explanation = "";
  @state() private _isLoading = false;
  @state() private _entities = [];
  @state() private _entitySuggestions = [];
  @state() private _showEntitySuggestions = false;
  @state() private _previewHtml = "";
  @state() private _warnings = [];
  @state() private _errors = [];
  @state() private _isPreviewMode = false;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        background: var(--primary-background-color);
        min-height: 100vh;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 300;
        color: var(--primary-text-color);
      }

      .header .logo {
        width: 40px;
        height: 40px;
        margin-right: 16px;
        background: var(--primary-color);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .header .logo ha-icon {
        --mdc-icon-size: 24px;
        color: white;
      }

      .layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        min-height: 600px;
      }

      @media (max-width: 768px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }

      .input-section {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 24px;
        box-shadow: var(--ha-card-box-shadow);
      }

      .preview-section {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 24px;
        box-shadow: var(--ha-card-box-shadow);
      }

      .section-title {
        font-size: 20px;
        font-weight: 500;
        margin-bottom: 16px;
        color: var(--primary-text-color);
        display: flex;
        align-items: center;
      }

      .section-title ha-icon {
        margin-right: 8px;
        --mdc-icon-size: 24px;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .input-container {
        position: relative;
      }

      .prompt-input {
        width: 100%;
        min-height: 120px;
        padding: 12px;
        border: 2px solid var(--outline-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-family: inherit;
        font-size: 14px;
        resize: vertical;
        transition: border-color 0.2s;
      }

      .prompt-input:focus {
        outline: none;
        border-color: var(--primary-color);
      }

      .config-type-select {
        width: 100%;
        padding: 12px;
        border: 2px solid var(--outline-color);
        border-radius: 8px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
      }

      .generate-button {
        width: 100%;
        padding: 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      .generate-button:hover {
        background: var(--dark-primary-color);
      }

      .generate-button:disabled {
        background: var(--disabled-color);
        cursor: not-allowed;
      }

      .generate-button ha-icon {
        margin-right: 8px;
      }

      .loading-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid transparent;
        border-top: 3px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .preview-tabs {
        display: flex;
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 16px;
      }

      .preview-tab {
        padding: 12px 16px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--secondary-text-color);
        font-size: 14px;
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: all 0.2s;
      }

      .preview-tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .config-output {
        background: var(--code-editor-background-color, #1e1e1e);
        color: var(--code-editor-text-color, #d4d4d4);
        padding: 16px;
        border-radius: 8px;
        font-family: 'Roboto Mono', monospace;
        font-size: 13px;
        line-height: 1.4;
        white-space: pre-wrap;
        overflow-x: auto;
        min-height: 200px;
        border: 1px solid var(--divider-color);
      }

      .preview-content {
        padding: 16px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        min-height: 200px;
        background: var(--secondary-background-color);
      }

      .explanation {
        background: var(--info-color);
        color: white;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 14px;
        line-height: 1.4;
      }

      .warnings, .errors {
        margin-bottom: 16px;
      }

      .warning-item, .error-item {
        padding: 8px 12px;
        border-radius: 4px;
        margin-bottom: 4px;
        font-size: 13px;
      }

      .warning-item {
        background: var(--warning-color);
        color: var(--text-on-warning-color);
      }

      .error-item {
        background: var(--error-color);
        color: var(--text-on-error-color);
      }

      .entity-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 0 0 8px 8px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

      .entity-suggestion-name {
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .entity-suggestion-id {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        font-size: 64px;
        margin-bottom: 16px;
        color: var(--disabled-color);
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        font-size: 18px;
        font-weight: 500;
      }

      .example-prompts {
        margin-top: 16px;
        padding: 16px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .example-prompts h4 {
        margin: 0 0 12px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .example-prompt {
        display: block;
        padding: 8px 12px;
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        margin-bottom: 8px;
        color: var(--primary-text-color);
        text-decoration: none;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .example-prompt:hover {
        border-color: var(--primary-color);
        transform: translateY(-1px);
      }

      .toolbar {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }

      .toolbar-button {
        padding: 8px 12px;
        background: var(--secondary-color);
        color: var(--text-primary-color);
        border: none;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: background 0.2s;
      }

      .toolbar-button:hover {
        background: var(--secondary-color-dark);
      }

      .toolbar-button ha-icon {
        margin-right: 4px;
        --mdc-icon-size: 16px;
      }
    `;
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <div class="logo">
            <ha-icon icon="mdi:robot"></ha-icon>
          </div>
          <h1>AI Configuration Assistant</h1>
        </div>

        <div class="layout">
          <!-- Input Section -->
          <div class="input-section">
            <div class="section-title">
              <ha-icon icon="mdi:message-text"></ha-icon>
              Create Configuration
            </div>

            <div class="form-group">
              <label for="config-type">Configuration Type</label>
              <select
                id="config-type"
                class="config-type-select"
                .value=${this._configType}
                @change=${this._handleConfigTypeChange}
              >
                <option value="automation">Automation</option>
                <option value="script">Script</option>
                <option value="scene">Scene</option>
                <option value="dashboard">Dashboard</option>
                <option value="card">Card</option>
                <option value="sensor">Template Sensor</option>
              </select>
            </div>

            <div class="form-group">
              <label for="prompt">What would you like to create?</label>
              <div class="input-container">
                <textarea
                  id="prompt"
                  class="prompt-input"
                  .value=${this._prompt}
                  @input=${this._handlePromptChange}
                  @focus=${this._showEntitySuggestions}
                  placeholder="Describe what you want to create... For example: 'Turn on living room lights when motion is detected after sunset'"
                ></textarea>
                ${this._showEntitySuggestions && this._entitySuggestions.length > 0
                  ? html`
                      <div class="entity-suggestions">
                        ${this._entitySuggestions.map(
                          (entity) => html`
                            <div
                              class="entity-suggestion"
                              @click=${() => this._selectEntity(entity)}
                            >
                              <div class="entity-suggestion-name">
                                ${entity.name}
                              </div>
                              <div class="entity-suggestion-id">
                                ${entity.entity_id} • ${entity.context}
                              </div>
                            </div>
                          `
                        )}
                      </div>
                    `
                  : ""}
              </div>
            </div>

            <button
              class="generate-button"
              @click=${this._generateConfig}
              .disabled=${this._isLoading || !this._prompt.trim()}
            >
              ${this._isLoading
                ? html`<div class="loading-spinner"></div> Generating...`
                : html`<ha-icon icon="mdi:creation"></ha-icon>Generate Configuration`}
            </button>

            ${this._renderExamplePrompts()}
          </div>

          <!-- Preview Section -->
          <div class="preview-section">
            <div class="section-title">
              <ha-icon icon="mdi:eye"></ha-icon>
              Preview & Results
            </div>

            ${this._renderPreviewContent()}
          </div>
        </div>
      </div>
    `;
  }

  _renderExamplePrompts() {
    if (this._generatedConfig) return "";

    const examples = {
      automation: [
        "Turn on living room lights when motion is detected after sunset",
        "Send notification when front door is left open for 5 minutes",
        "Turn off all lights when everyone leaves home",
      ],
      script: [
        "Good night routine: turn off all lights and lock doors",
        "Movie mode: dim lights and turn on TV",
        "Morning routine: turn on coffee maker and lights",
      ],
      dashboard: [
        "Create a security dashboard with cameras and door sensors",
        "Make a climate control panel for all thermostats",
        "Build an energy monitoring dashboard",
      ],
    };

    const typeExamples = examples[this._configType] || [];

    return html`
      <div class="example-prompts">
        <h4>Example prompts:</h4>
        ${typeExamples.map(
          (example) => html`
            <div class="example-prompt" @click=${() => this._setPrompt(example)}>
              ${example}
            </div>
          `
        )}
      </div>
    `;
  }

  _renderPreviewContent() {
    if (!this._generatedConfig && !this._isLoading) {
      return html`
        <div class="empty-state">
          <ha-icon icon="mdi:robot-outline"></ha-icon>
          <h3>Ready to help!</h3>
          <p>Describe what you'd like to create and I'll generate the configuration for you.</p>
        </div>
      `;
    }

    if (this._isLoading) {
      return html`
        <div class="empty-state">
          <div class="loading-spinner"></div>
          <h3>Generating...</h3>
          <p>Creating your configuration, please wait...</p>
        </div>
      `;
    }

    return html`
      <div class="preview-tabs">
        <button
          class="preview-tab ${!this._isPreviewMode ? "active" : ""}"
          @click=${() => (this._isPreviewMode = false)}
        >
          YAML Config
        </button>
        <button
          class="preview-tab ${this._isPreviewMode ? "active" : ""}"
          @click=${() => (this._isPreviewMode = true)}
        >
          Live Preview
        </button>
      </div>

      <div class="toolbar">
        <button class="toolbar-button" @click=${this._copyConfig}>
          <ha-icon icon="mdi:content-copy"></ha-icon>
          Copy
        </button>
        <button class="toolbar-button" @click=${this._validateConfig}>
          <ha-icon icon="mdi:check-circle"></ha-icon>
          Validate
        </button>
        <button class="toolbar-button" @click=${this._saveConfig}>
          <ha-icon icon="mdi:content-save"></ha-icon>
          Save
        </button>
      </div>

      ${this._explanation
        ? html`<div class="explanation">${this._explanation}</div>`
        : ""}

      ${this._errors.length > 0
        ? html`
            <div class="errors">
              ${this._errors.map(
                (error) => html`<div class="error-item">${error}</div>`
              )}
            </div>
          `
        : ""}

      ${this._warnings.length > 0
        ? html`
            <div class="warnings">
              ${this._warnings.map(
                (warning) => html`<div class="warning-item">${warning}</div>`
              )}
            </div>
          `
        : ""}

      ${this._isPreviewMode
        ? html`
            <div
              class="preview-content"
              .innerHTML=${this._previewHtml}
            ></div>
          `
        : html`<pre class="config-output">${this._generatedConfig}</pre>`}
    `;
  }

  _handleConfigTypeChange(e) {
    this._configType = e.target.value;
    if (this._generatedConfig) {
      this._generateConfig();
    }
  }

  _handlePromptChange(e) {
    this._prompt = e.target.value;
    this._debounceEntitySuggestions();
  }

  _setPrompt(prompt) {
    this._prompt = prompt;
    this.requestUpdate();
  }

  async _generateConfig() {
    if (!this._prompt.trim() || this._isLoading) return;

    this._isLoading = true;
    this._generatedConfig = "";
    this._explanation = "";
    this._warnings = [];
    this._errors = [];

    try {
      await this.hass.callService("ai_config_assistant", "generate_config", {
        prompt: this._prompt,
        type: this._configType,
        context: {},
      });

      // Listen for the result event
      const unsubscribe = this.hass.connection.subscribeEvents(
        (event) => {
          if (event.data.success) {
            this._generatedConfig = event.data.config;
            this._explanation = event.data.explanation;
            this._warnings = event.data.warnings || [];
            this._loadPreview();
          } else {
            this._errors = [event.data.error];
          }
          this._isLoading = false;
          unsubscribe();
        },
        "ai_config_assistant_config_generated"
      );
    } catch (error) {
      this._errors = [error.message];
      this._isLoading = false;
    }
  }

  async _loadPreview() {
    if (!this._generatedConfig) return;

    try {
      await this.hass.callService("ai_config_assistant", "preview_config", {
        config: this._generatedConfig,
        type: this._configType,
      });

      const unsubscribe = this.hass.connection.subscribeEvents(
        (event) => {
          if (event.data.success) {
            this._previewHtml = event.data.preview.preview_html || "";
          }
          unsubscribe();
        },
        "ai_config_assistant_config_previewed"
      );
    } catch (error) {
      console.error("Failed to load preview:", error);
    }
  }

  async _validateConfig() {
    if (!this._generatedConfig) return;

    try {
      await this.hass.callService("ai_config_assistant", "validate_config", {
        config: this._generatedConfig,
        type: this._configType,
      });

      const unsubscribe = this.hass.connection.subscribeEvents(
        (event) => {
          if (event.data.success) {
            this._errors = event.data.errors || [];
            this._warnings = event.data.warnings || [];
          }
          unsubscribe();
        },
        "ai_config_assistant_config_validated"
      );
    } catch (error) {
      this._errors = [error.message];
    }
  }

  _copyConfig() {
    if (this._generatedConfig) {
      navigator.clipboard.writeText(this._generatedConfig);
      // Show toast notification
      this._showNotification("Configuration copied to clipboard");
    }
  }

  _saveConfig() {
    if (this._generatedConfig) {
      // Create download link
      const blob = new Blob([this._generatedConfig], { type: "text/yaml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${this._configType}-config.yaml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  _showNotification(message) {
    // Show Home Assistant notification
    this.hass.callService("persistent_notification", "create", {
      message: message,
      title: "AI Config Assistant",
    });
  }

  _debounceEntitySuggestions() {
    clearTimeout(this._suggestionTimeout);
    this._suggestionTimeout = setTimeout(() => {
      this._loadEntitySuggestions();
    }, 300);
  }

  async _loadEntitySuggestions() {
    if (!this._prompt.trim()) {
      this._entitySuggestions = [];
      return;
    }

    try {
      // Extract potential entity terms from prompt
      const response = await fetch(`/api/ai_config_assistant/entity_suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.hass.auth.accessToken}`,
        },
        body: JSON.stringify({
          query: this._prompt.split(" ").pop(), // Last word
          limit: 5,
        }),
      });

      if (response.ok) {
        this._entitySuggestions = await response.json();
      }
    } catch (error) {
      console.error("Failed to load entity suggestions:", error);
    }
  }

  _showEntitySuggestions() {
    this._showEntitySuggestions = true;
    this._loadEntitySuggestions();
  }

  _selectEntity(entity) {
    const words = this._prompt.split(" ");
    words[words.length - 1] = entity.entity_id;
    this._prompt = words.join(" ");
    this._showEntitySuggestions = false;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this._handleDocumentClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this._handleDocumentClick.bind(this));
  }

  _handleDocumentClick(e) {
    if (!this.shadowRoot.contains(e.target)) {
      this._showEntitySuggestions = false;
    }
  }
}