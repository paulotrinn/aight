# UI Specification

This is the UI/UX specification for the spec detailed in @.agent-os/specs/2025-01-06-conversational-interface/spec.md

> Created: 2025-01-06
> Version: 1.0.0

## Visual Design System

### Layout Structure
```
┌────────────────────────────────────────┐
│  Header (48px)                         │
├────────────────────────────────────────┤
│                                        │
│  Conversation Area                     │
│  (flex-grow, overflow-y: auto)        │
│                                        │
├────────────────────────────────────────┤
│  Input Area (auto-height, min: 56px)  │
└────────────────────────────────────────┘
```

### Color Scheme
```css
/* Message Bubbles */
--message-user-bg: var(--primary-color);
--message-user-text: var(--text-primary-color);
--message-assistant-bg: var(--card-background-color);
--message-assistant-text: var(--primary-text-color);
--message-system-bg: var(--secondary-background-color);
--message-system-text: var(--secondary-text-color);

/* Entity Cards */
--entity-detected-bg: rgba(var(--rgb-primary-color), 0.1);
--entity-confirmed-bg: rgba(var(--rgb-success-color), 0.1);
--entity-confirmed-border: var(--success-color);

/* Status Indicators */
--status-typing: var(--info-color);
--status-processing: var(--warning-color);
--status-success: var(--success-color);
--status-error: var(--error-color);
```

### Typography
```css
/* Messages */
.message-content {
  font-size: 14px;
  line-height: 1.5;
  font-family: var(--paper-font-body1_-_font-family);
}

.message-timestamp {
  font-size: 11px;
  color: var(--secondary-text-color);
  font-family: var(--paper-font-caption_-_font-family);
}

/* Configuration Preview */
.config-preview {
  font-family: 'Roboto Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
}
```

## Component Specifications

### Message Bubble
```html
<!-- User Message -->
<div class="message message--user">
  <div class="message__content">
    Turn on the lights when I get home
  </div>
  <div class="message__timestamp">2:34 PM</div>
</div>

<!-- Assistant Message -->
<div class="message message--assistant">
  <div class="message__avatar">
    <ha-icon icon="hass:robot"></ha-icon>
  </div>
  <div class="message__content">
    I'll help you create that automation. I found these entities:
  </div>
  <div class="message__timestamp">2:34 PM</div>
</div>
```

### Entity Confirmation Card
```html
<div class="entity-card">
  <div class="entity-card__header">
    <ha-icon icon="hass:magnify"></ha-icon>
    <span>Detected Entities</span>
  </div>
  <div class="entity-card__list">
    <div class="entity-item entity-item--confirmed">
      <ha-icon icon="hass:lightbulb"></ha-icon>
      <span class="entity-item__id">light.living_room</span>
      <span class="entity-item__name">Living Room Lights</span>
      <mwc-icon-button icon="hass:close" class="entity-item__remove"></mwc-icon-button>
    </div>
    <div class="entity-item entity-item--suggested">
      <ha-icon icon="hass:cellphone"></ha-icon>
      <span class="entity-item__id">device_tracker.phone</span>
      <span class="entity-item__name">Your Phone</span>
      <mwc-icon-button icon="hass:plus" class="entity-item__add"></mwc-icon-button>
    </div>
  </div>
  <div class="entity-card__actions">
    <mwc-button raised>Confirm Selection</mwc-button>
    <mwc-button>Add More</mwc-button>
  </div>
</div>
```

### Configuration Preview
```html
<div class="config-preview-card">
  <div class="config-preview-card__header">
    <span class="config-preview-card__type">Automation</span>
    <span class="config-preview-card__status">
      <ha-icon icon="hass:check-circle"></ha-icon>
      Valid
    </span>
  </div>
  <div class="config-preview-card__content">
    <pre><code class="language-yaml">alias: Come Home Lights
trigger:
  - platform: zone
    entity_id: device_tracker.phone
    zone: zone.home
    event: enter
condition:
  - condition: sun
    after: sunset
action:
  - service: light.turn_on
    target:
      entity_id: light.living_room</code></pre>
  </div>
  <div class="config-preview-card__actions">
    <mwc-button icon="hass:content-copy">Copy</mwc-button>
    <mwc-button icon="hass:pencil">Edit</mwc-button>
    <mwc-button raised icon="hass:play">Deploy</mwc-button>
  </div>
</div>
```

### Input Area
```html
<div class="chat-input">
  <div class="chat-input__container">
    <textarea 
      class="chat-input__field"
      placeholder="Describe what you want to configure..."
      rows="1"
    ></textarea>
    <mwc-icon-button 
      icon="hass:send" 
      class="chat-input__send"
      disabled
    ></mwc-icon-button>
  </div>
  <div class="chat-input__actions">
    <mwc-chip>Automation</mwc-chip>
    <mwc-chip>Scene</mwc-chip>
    <mwc-chip>Script</mwc-chip>
    <mwc-chip>Dashboard</mwc-chip>
  </div>
</div>
```

## Animation Specifications

### Message Entry
```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message {
  animation: slideInUp 0.3s ease-out;
}
```

### Typing Indicator
```css
@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

.typing-indicator span {
  animation: typing 1.4s infinite;
}
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
```

### Loading States
```css
.loading-shimmer {
  background: linear-gradient(
    90deg,
    var(--card-background-color) 0%,
    var(--divider-color) 50%,
    var(--card-background-color) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

## Responsive Design

### Mobile (< 768px)
- Full-width message bubbles
- Collapsed quick actions (expandable)
- Simplified entity cards
- Touch-friendly button sizes (min 44px)

### Tablet (768px - 1024px)
- 80% max-width for message bubbles
- Side-by-side entity items
- Floating action buttons

### Desktop (> 1024px)
- 60% max-width for message bubbles
- Multi-column entity grid
- Keyboard shortcuts enabled
- Hover states for all interactive elements

## Accessibility

### ARIA Labels
```html
<div role="log" aria-label="Conversation history" aria-live="polite">
  <div role="article" aria-label="Assistant message">...</div>
  <div role="article" aria-label="Your message">...</div>
</div>
```

### Keyboard Navigation
- Tab: Navigate through interactive elements
- Enter: Send message / Confirm action
- Escape: Cancel current operation
- Arrow keys: Navigate entity suggestions

### Screen Reader Support
- Announce new messages
- Describe entity detection results
- Read configuration changes
- Provide action confirmations