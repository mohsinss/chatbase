// Helper function to process messages for deepseek-reasoner
export function processMessagesForReasoner(
  systemPrompt: string, 
  relevant_chunk: string, 
  messages: any[], 
  confidencePrompt: string
) {
  let formattedMessages = [{
    role: 'user',
    content: `${systemPrompt}\n${relevant_chunk}`
  }];

  // Process existing messages
  for (const msg of messages) {
    const lastMsg = formattedMessages[formattedMessages.length - 1];
    if (msg.role === lastMsg.role) {
      // Merge consecutive same-role messages
      lastMsg.content += `\n${msg.content}`;
    } else {
      formattedMessages.push(msg);
    }
  }

  // Note: Commented out in original code
  // const lastMsg = formattedMessages[formattedMessages.length - 1];
  // const confidenceMessage = {
  //   role: 'user',
  //   content: confidencePrompt
  // };
  // if (lastMsg.role === 'user') {
  //   lastMsg.content += `\n${confidencePrompt}`;
  // } else {
  //   formattedMessages.push(confidenceMessage);
  // }

  return formattedMessages;
}
