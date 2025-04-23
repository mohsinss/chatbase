// Export all handlers from a single file for easier imports

// Message handlers
export { 
  handleMessengerEvent,
  handleMessengerMessage,
  handleMessengerPostback 
} from './message-handler';

// Comment handlers
export { handleCommentEvent } from './comment-handler';

// Like handlers
export { handleLikeEvent } from './like-handler';

// DM handlers
export { handleCommentDM } from './dm-handler';

// Question flow handlers
export { handleQuestionFlow } from './question-flow';

// AI response handlers
export { handleAIResponse } from './ai-response';
