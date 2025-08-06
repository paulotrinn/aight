# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-01-06-conversational-interface/spec.md

> Created: 2025-01-06
> Version: 1.0.0

## Endpoints

### POST /api/ai_config_assistant/conversation/message

**Purpose:** Process user message and generate assistant response
**Parameters:** 
- `message`: string - User's input text
- `context`: object - Current conversation context (optional)
- `config_type`: string - Type of configuration to generate (optional)

**Request Body:**
```json
{
  "message": "Turn on the lights when I get home",
  "context": {
    "previous_entities": ["light.living_room"],
    "config_type": "automation",
    "conversation_id": "uuid-1234"
  }
}
```

**Response:**
```json
{
  "response": {
    "message": "I'll help you create that automation. I found these entities:",
    "detected_entities": [
      {
        "entity_id": "light.living_room",
        "friendly_name": "Living Room Lights",
        "confidence": 0.95,
        "reason": "mentioned 'lights'"
      },
      {
        "entity_id": "device_tracker.user_phone",
        "friendly_name": "User's Phone",
        "confidence": 0.85,
        "reason": "home arrival detection"
      }
    ],
    "suggested_config": null,
    "requires_confirmation": true,
    "next_step": "confirm_entities"
  },
  "context": {
    "conversation_id": "uuid-1234",
    "step": "entity_confirmation",
    "partial_config": {}
  }
}
```

**Errors:** 
- 400: Invalid message format
- 401: Unauthorized (missing API key)
- 500: LLM service error

### POST /api/ai_config_assistant/conversation/confirm_entities

**Purpose:** Confirm selected entities and proceed with configuration generation
**Parameters:**
- `conversation_id`: string - Current conversation ID
- `confirmed_entities`: array - List of confirmed entity IDs
- `additional_context`: object - Any additional user preferences

**Request Body:**
```json
{
  "conversation_id": "uuid-1234",
  "confirmed_entities": [
    "light.living_room",
    "device_tracker.user_phone"
  ],
  "additional_context": {
    "only_after_sunset": true
  }
}
```

**Response:**
```json
{
  "configuration": {
    "type": "automation",
    "yaml": "alias: Come Home Lights\n...",
    "validation": {
      "valid": true,
      "warnings": [],
      "errors": []
    }
  },
  "message": "Here's your automation. It will turn on the living room lights when you arrive home after sunset.",
  "actions_available": ["deploy", "edit", "regenerate"]
}
```

### POST /api/ai_config_assistant/conversation/refine

**Purpose:** Refine existing configuration based on additional user input
**Parameters:**
- `conversation_id`: string - Current conversation ID
- `refinement`: string - User's refinement request
- `current_config`: object - Current configuration

**Request Body:**
```json
{
  "conversation_id": "uuid-1234",
  "refinement": "Also turn on the TV",
  "current_config": {
    "type": "automation",
    "yaml": "..."
  }
}
```

**Response:**
```json
{
  "updated_config": {
    "type": "automation",
    "yaml": "...",
    "changes": [
      {
        "type": "action_added",
        "description": "Added action to turn on TV"
      }
    ]
  },
  "message": "I've added an action to turn on the TV. The automation now includes both lights and TV."
}
```

### GET /api/ai_config_assistant/conversation/suggestions

**Purpose:** Get contextual suggestions based on current conversation state
**Parameters:**
- `conversation_id`: string - Current conversation ID
- `partial_text`: string - Current user input (for autocomplete)

**Response:**
```json
{
  "suggestions": [
    {
      "type": "entity",
      "value": "light.bedroom",
      "display": "Bedroom Lights",
      "relevance": 0.9
    },
    {
      "type": "template",
      "value": "when motion is detected",
      "display": "Add motion trigger",
      "relevance": 0.85
    }
  ]
}
```

### POST /api/ai_config_assistant/conversation/deploy

**Purpose:** Deploy generated configuration to Home Assistant
**Parameters:**
- `configuration`: object - Configuration to deploy
- `test_mode`: boolean - Whether to validate without applying

**Response:**
```json
{
  "success": true,
  "deployment_id": "auto_1234",
  "message": "Automation 'Come Home Lights' has been created successfully",
  "location": "/config/automation/edit/auto_1234"
}
```

## WebSocket Events

### Connection
```javascript
// Client connects to WebSocket
ws = new WebSocket('ws://homeassistant.local:8123/api/websocket');

// Subscribe to conversation updates
{
  "type": "ai_config_assistant/subscribe",
  "conversation_id": "uuid-1234"
}
```

### Event Types

**typing_indicator**
```json
{
  "type": "event",
  "event": {
    "event_type": "typing_indicator",
    "data": {
      "is_typing": true,
      "estimated_time": 3000
    }
  }
}
```

**entity_detection_progress**
```json
{
  "type": "event",
  "event": {
    "event_type": "entity_detection_progress",
    "data": {
      "stage": "analyzing",
      "progress": 0.5,
      "found_count": 3
    }
  }
}
```

**configuration_generated**
```json
{
  "type": "event",
  "event": {
    "event_type": "configuration_generated",
    "data": {
      "config_type": "automation",
      "success": true,
      "preview_available": true
    }
  }
}
```

## Error Handling

All endpoints return errors in consistent format:
```json
{
  "error": {
    "code": "INVALID_ENTITIES",
    "message": "Some entities could not be found",
    "details": {
      "missing_entities": ["light.nonexistent"],
      "suggestions": ["light.living_room", "light.bedroom"]
    }
  }
}
```

Error Codes:
- `INVALID_REQUEST`: Malformed request data
- `UNAUTHORIZED`: Missing or invalid API key
- `LLM_ERROR`: LLM service unavailable or error
- `INVALID_ENTITIES`: Referenced entities don't exist
- `INVALID_CONFIG`: Generated configuration fails validation
- `DEPLOYMENT_FAILED`: Configuration deployment failed
- `CONTEXT_EXPIRED`: Conversation context has expired