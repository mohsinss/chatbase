# Chatbot API Components

This directory contains modular components for the chatbot API functionality. The code has been split into smaller, more maintainable files to improve organization and readability.

## Directory Structure

- `index.ts` - Exports all components for easier imports
- `clients.ts` - API client initializations (OpenAI, Deepseek, XAI)
- `tools.ts` - Function calling tools definitions
- `helpers.ts` - Helper functions for message processing
- `models.ts` - Model configurations and constants
- `cors.ts` - CORS handling utilities

### Handler Files

- `anthropic-handler.ts` - Handler for Anthropic Claude models
- `gemini-handler.ts` - Handler for Google Gemini models
- `deepseek-handler.ts` - Handler for Deepseek models
- `grok-handler.ts` - Handler for Grok models
- `openai-handler.ts` - Handler for OpenAI models
- `question-flow-handler.ts` - Handler for question flow logic

## Usage

Import components from the index file:

```typescript
import { 
  setCorsHeaders, 
  handleOptionsRequest,
  handleAnthropicRequest,
  handleGeminiRequest,
  handleDeepseekRequest,
  handleGrokRequest,
  handleOpenAIRequest,
  handleQuestionFlow
} from '../../../../components/chatbot/api';
```

## Benefits of This Structure

1. **Maintainability**: Each file has a single responsibility, making it easier to maintain and update.
2. **Readability**: Smaller files are easier to read and understand.
3. **Testability**: Modular components are easier to test in isolation.
4. **Reusability**: Components can be reused in other parts of the application.
5. **Collaboration**: Multiple developers can work on different components simultaneously.
