/**
 * Service for handling order management AI interactions in WhatsApp
 */
import ChatbotAISettings from "@/models/ChatbotAISettings";
import { addAssistantMessageToConversation } from '@/components/webhook/whatsapp/services/conversationService';
import { sendTextMessage } from '@/components/webhook/whatsapp/services/whatsappService';
import { orderManagementSystemPrompt, orderTools } from "@/components/chatbot/api";
import { filterRecentMessages } from '@/components/webhook/whatsapp/utils/helpers';
import Dataset from "@/models/Dataset";
import Chatbot from "@/models/Chatbot";
import Team from "@/models/Team";
import config from "@/config";

/**
 * Process a message using AI with tool calling for order management
 */
export async function processOrderManagementWithAI(
  chatbotId: string,
  conversation: any,
  text: string,
  phoneNumberId: string,
  from: string,
  actionId: string,
): Promise<{ success: boolean, message: string }> {
  try {
    // Get AI settings
    const aiSettings = await ChatbotAISettings.findOne({ chatbotId });
    const chatbot = await Chatbot.findOne({ chatbotId });
    const dataset = await Dataset.findOne({ chatbotId });
    const team = await Team.findOne({ teamId: chatbot.teamId });

    const internalModel = aiSettings?.model || 'gpt-3.5-turbo';
    const temperature = aiSettings?.temperature ?? 0.7;
    const maxTokens = aiSettings?.maxTokens ?? 500;
    const language = aiSettings?.language || 'en';
    
    let messages = filterRecentMessages(conversation.messages);
      
    // Ensure the current message is included
    if (!messages.some((msg: any) => msg.role === 'user' && msg.content === text)) {
      messages.push({ role: 'user', content: text });
    }
    
    if (team) {
      //@ts-ignore
      const creditLimit = config.stripe.plans[team.plan].credits;
      if (team.credits >= creditLimit) {
        return {
          success: false,
          message: "limit reached, upgrade for more messages."
        };
      }
    }

    if (!dataset) {
      return {
        success: false,
        message: "No dataset found for this chatbot"
      };
    }

    const options = {
      method: 'POST',
      headers: {
        'TR-Dataset': dataset.datasetId,
        Authorization: `Bearer ${process.env.TRIEVE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: messages[messages.length - 1].content,
        search_type: 'semantic',
        page_size: 1
      })
    };

    const chunk_response = await fetch('https://api.trieve.ai/api/chunk/search', options)
    const chunk_response_data = await chunk_response.json();

    if (!chunk_response.ok) {
      console.error("semantic search failed:", chunk_response_data);
      throw new Error(chunk_response_data.message || "semantic search failed.");
    }

    let relevant_chunk = "Please use the following information for answering.\n";
    for (let i = 0; i < chunk_response_data.chunks.length; i++) {
      relevant_chunk += chunk_response_data.chunks[i].chunk.chunk_html;
    }
    relevant_chunk = "";
    let systemPrompt = `${aiSettings?.systemPrompt || 'You are a helpful AI assistant.'} You must respond in ${language} language only. Please provide the result in HTML format that can be embedded in a <div> tag.`;
    systemPrompt += orderManagementSystemPrompt;
    // Import the order management functions
    const { getCategories, getMenus, getMenu, addToCart, submitOrder, getOrders } = await import('@/components/chatbot/api/order-management');
    
    // Process based on model type
    if (internalModel.startsWith('gpt-')) {
      // Import OpenAI for tool calling
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      // Call OpenAI with tool calling
      const response = await openai.chat.completions.create({
        model: internalModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        tools: orderTools,
        tool_choice: "auto",
        temperature: temperature,
        max_tokens: maxTokens
      });
      
      const responseMessage = response.choices[0].message;
      
      // Check if the model wants to call a function
      if (responseMessage.tool_calls) {
        // Process each tool call
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);
          
          let result;
          
          // Execute the appropriate function
          switch (functionName) {
            case "get_categories":
              result = await getCategories(chatbotId, true);
              break;
              
            case "get_menus":
              result = await getMenus(chatbotId, functionArgs.category);
              break;
              
            case "get_menu":
              result = await getMenu(chatbotId, functionArgs.item_id, functionArgs.category);
              break;
              
            case "add_to_cart":
              const quantity = functionArgs.quantity || 1;
              result = await addToCart(chatbotId, functionArgs.item_id, quantity);
              break;
              
            case "track_order":
              result = await getOrders(chatbotId, functionArgs.order_id);
              break;
              
            case "submit_order":
              result = await submitOrder(chatbotId, functionArgs.order);
              break;
              
            default:
              result = "Function not implemented";
          }
          
          // Send the result to the user
          if (typeof result === 'object') {
            // If it's a WhatsApp interactive message format
            if (result.sections) {
              // Replace placeholders in button IDs with actual values
              if (result.sections && result.sections.length > 0) {
                result.sections.forEach((section: any) => {
                  if (section.rows && section.rows.length > 0) {
                    section.rows.forEach((row: any) => {
                      if (row.id) {
                        row.id = row.id
                          .replace('{tableName}', conversation.metadata?.tableName || 'unknown')
                          .replace('{actionId}', actionId);
                      }
                    });
                  }
                });
              }
              
              // Create a WhatsApp list message
              const listPayload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: from,
                type: "interactive",
                interactive: {
                  type: "list",
                  body: {
                    text: result.body || "Please choose an option:"
                  },
                  footer: {
                    text: result.footer || "Select an option to continue."
                  },
                  action: {
                    button: result.button || "Select Option",
                    sections: result.sections || []
                  }
                }
              };
              
              // Send the list message via WhatsApp API
              try {
                const response = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}`
                  },
                  body: JSON.stringify(listPayload)
                });
                
                if (!response.ok) {
                  throw new Error(`WhatsApp API returned ${response.status}`);
                }
              } catch (apiError) {
                console.error('Error sending WhatsApp interactive message:', apiError);
                // Send a simple text message as fallback
                await sendTextMessage(
                  phoneNumberId,
                  from,
                  "There was an error displaying the menu. Please try again."
                );
              }
            } else {
              // For other object results, convert to string
              await sendTextMessage(
                phoneNumberId,
                from,
                JSON.stringify(result, null, 2)
              );
            }
          } else {
            // For string results
            await sendTextMessage(
              phoneNumberId,
              from,
              result
            );
          }
          
          // Add to conversation history
          await addAssistantMessageToConversation(
            conversation,
            typeof result === 'object' ? JSON.stringify(result) : result
          );
        }
        
        return {
          success: true,
          message: "Order management tool call processed"
        };
      } else {
        // If no tool call, just send the response text
        const responseText = responseMessage.content;
        await sendTextMessage(phoneNumberId, from, responseText);
        
        // Add to conversation history
        await addAssistantMessageToConversation(conversation, responseText);
        
        return {
          success: true,
          message: "AI response sent"
        };
      }
    } else {
      // For non-OpenAI models, just send a message that tool calling is not supported
      await sendTextMessage(
        phoneNumberId,
        from,
        "I'm sorry, but order management through AI is only available with OpenAI models. Please contact the restaurant directly."
      );
      
      return {
        success: false,
        message: "Model does not support tool calling"
      };
    }
  } catch (error) {
    console.error('Error processing order management with AI:', error);
    throw error;
  }
}
