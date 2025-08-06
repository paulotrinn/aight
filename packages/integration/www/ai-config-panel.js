customElements.define('ai-config-panel', class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
  }

  _render() {
    this.shadowRoot.innerHTML = [
      '<style>',
      ':host { display: block; padding: 16px; }',
      '.container { max-width: 1200px; margin: 0 auto; }',
      'h1 { font-size: 24px; margin: 0 0 24px 0; }',
      '.card { background: var(--card-background-color, white); border-radius: 8px; padding: 16px; margin-bottom: 16px; box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14); }',
      'label { display: block; margin-bottom: 8px; font-weight: 500; }',
      'input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box; }',
      'textarea { min-height: 100px; font-family: inherit; }',
      'button { padding: 10px 20px; background: #03a9f4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 8px; }',
      'button:hover { background: #0288d1; }',
      'button:disabled { opacity: 0.5; cursor: not-allowed; }',
      '.input-group { margin-bottom: 16px; }',
      '.button-group { margin-top: 16px; }',
      '.output { margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }',
      '.message { padding: 12px; border-radius: 4px; margin: 16px 0; }',
      '.success { background: #4caf50; color: white; }',
      '.error { background: #f44336; color: white; }',
      '.info { background: #2196f3; color: white; }',
      '</style>',
      '<div class="container">',
      '<h1>AI Configuration Assistant</h1>',
      '<div class="card">',
      '<div class="input-group">',
      '<label>Configuration Type</label>',
      '<select id="type">',
      '<option value="automation">Automation</option>',
      '<option value="script">Script</option>',
      '<option value="scene">Scene</option>',
      '<option value="dashboard">Dashboard</option>',
      '<option value="template">Template Sensor</option>',
      '</select>',
      '</div>',
      '<div class="input-group">',
      '<label>Describe what you want</label>',
      '<textarea id="prompt" placeholder="Turn on living room lights when motion is detected after sunset"></textarea>',
      '</div>',
      '<div class="button-group">',
      '<button id="generate">Generate</button>',
      '<button id="clear">Clear</button>',
      '</div>',
      '<div id="result"></div>',
      '</div>',
      '</div>'
    ].join('');

    this._attachListeners();
  }

  _attachListeners() {
    const $ = (id) => this.shadowRoot.getElementById(id);
    
    $('generate').onclick = async () => {
      const prompt = $('prompt').value;
      const type = $('type').value;
      
      if (!prompt) {
        this._showMessage('Please enter a description', 'error');
        return;
      }
      
      $('generate').disabled = true;
      $('generate').textContent = 'Generating...';
      
      try {
        await this._hass.callService('ai_config_assistant', 'generate_config', {
          prompt: prompt,
          type: type
        });
        
        this._showMessage('Configuration generated! Check Home Assistant logs for the result.', 'success');
        
      } catch (err) {
        this._showMessage('Error: ' + err.message, 'error');
      } finally {
        $('generate').disabled = false;
        $('generate').textContent = 'Generate';
      }
    };
    
    $('clear').onclick = () => {
      $('prompt').value = '';
      $('result').innerHTML = '';
    };
  }

  _showMessage(text, type) {
    const result = this.shadowRoot.getElementById('result');
    result.innerHTML = '<div class="message ' + type + '">' + text + '</div>';
  }
});