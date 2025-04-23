# Instagram Webhook Components

This directory contains modular components for the Instagram webhook functionality. The code has been split into smaller, more maintainable files to improve organization and readability.

## Directory Structure

- `index.ts` - Exports all components for easier imports
- `cache.ts` - Cache management for frequently accessed data
- `models.ts` - Functions for retrieving models (Instagram page, chatbot, dataset)
- `messaging.ts` - Functions for sending messages (typing indicators, text, images, buttons)
- `conversation.ts` - Functions for managing conversations

### Handlers Directory

- `handlers/index.ts` - Exports all handlers for easier imports
- `handlers/message-handler.ts` - Handlers for direct messages, including message unsend events
- `handlers/comment-handler.ts` - Handlers for comments
- `handlers/like-handler.ts` - Handlers for likes
- `handlers/dm-handler.ts` - Handlers for DM reactions to comments
- `handlers/question-flow.ts` - Handlers for question flow
- `handlers/ai-response.ts` - Handlers for AI responses

## Usage

Import components from the index file:

```typescript
import { 
  handleMessengerEvent,
  handleCommentEvent,
  handleLikeEvent
} from '../../../components/webhook/instagram';
```

## Benefits of This Structure

1. **Maintainability**: Each file has a single responsibility, making it easier to maintain and update.
2. **Readability**: Smaller files are easier to read and understand.
3. **Testability**: Modular components are easier to test in isolation.
4. **Reusability**: Components can be reused in other parts of the application.
5. **Collaboration**: Multiple developers can work on different components simultaneously.
