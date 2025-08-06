# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-01-06-conversational-interface/spec.md

> Created: 2025-01-06
> Version: 1.0.0

## Technical Requirements

### Phase 1: Core Chat Interface
- Replace current form-based UI with message-based chat interface
- Implement message bubble component with user/assistant distinction
- Add scrollable conversation area with auto-scroll to latest
- Create persistent input area with send button
- Support keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Implement typing indicators and loading states
- Add message timestamps and status indicators

### Phase 2: Enhanced Interaction
- Integrate entity detection into conversation flow
- Create inline entity confirmation cards with accept/reject/modify actions
- Add configuration preview component with syntax highlighting
- Implement quick action buttons for common configuration types
- Support message editing and regeneration
- Add context management for multi-turn conversations
- Create entity autocomplete in input field with @ mentions

## Approach Options

**Option A:** Complete UI Rewrite
- Pros: Clean implementation, modern architecture, optimal UX
- Cons: Larger change, requires full testing, migration complexity

**Option B:** Progressive Enhancement (Selected)
- Pros: Incremental deployment, backwards compatibility, lower risk
- Cons: Some technical debt, needs refactoring later

**Rationale:** Progressive enhancement allows us to ship value incrementally while maintaining stability. We can add the chat interface alongside the existing form, then gradually migrate users.

## Implementation Architecture

### Component Structure
```javascript
// Message Component
class ConversationMessage extends LitElement {
  properties: {
    type: 'user' | 'assistant' | 'system',
    content: string,
    timestamp: Date,
    status: 'sending' | 'sent' | 'error',
    entities?: DetectedEntity[],
    configuration?: GeneratedConfig
  }
}

// Conversation Manager
class ConversationManager {
  messages: Message[]
  context: ConversationContext
  pendingEntities: Entity[]
  
  async processUserInput(text: string)
  async detectEntities(text: string)
  async generateConfiguration(context: ConversationContext)
  updateContext(updates: Partial<ConversationContext>)
}

// Enhanced Input Component  
class ChatInput extends LitElement {
  properties: {
    placeholder: string,
    disabled: boolean,
    suggestions: Entity[],
    quickActions: QuickAction[]
  }
  
  handleSubmit()
  handleAutocomplete()
  handleQuickAction(action: QuickAction)
}
```

### State Management
```javascript
// Conversation State
interface ConversationState {
  messages: Message[];
  context: {
    configType?: 'automation' | 'script' | 'scene';
    detectedEntities: Entity[];
    confirmedEntities: Entity[];
    currentStep: 'intent' | 'entities' | 'conditions' | 'preview' | 'complete';
    metadata: Record<string, any>;
  };
  isProcessing: boolean;
  error?: string;
}
```

### Message Flow
1. User inputs natural language text
2. System detects intent and entities
3. Assistant requests confirmation via inline cards
4. User confirms/modifies entity selection
5. System generates configuration
6. Assistant presents configuration with actions
7. User can refine or deploy

## External Dependencies

None required for Phase 1 & 2 - all functionality uses existing libraries:
- LitElement (already included)
- Home Assistant frontend components (already available)
- Existing LLM integration (already configured)

## Performance Considerations

- Virtual scrolling for long conversations (>100 messages)
- Message pagination and lazy loading
- Debounced entity detection (300ms)
- Cached entity search results
- Optimistic UI updates for better perceived performance

## Browser Compatibility

- Chrome/Edge 90+ (full support)
- Firefox 88+ (full support)  
- Safari 14+ (full support)
- Mobile browsers (responsive design)