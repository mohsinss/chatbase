/**
 * Logging utilities for WhatsApp webhook
 */

/**
 * Log webhook data to external service if enabled
 */
export async function logWebhookData(data: any): Promise<void> {
  if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP === "1") {
    try {
      // Send data to the specified URL
      const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error logging webhook data:', error);
    }
  }
}

/**
 * Log error to external service if enabled
 */
export async function logWebhookError(error: any): Promise<void> {
  try {
    // Log error to external service if configured
    if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP === "1") {
      // Send error data to the specified URL
      const response = await fetch('http://webhook.mrcoders.org/whatsapp-error.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    }
    
    // Log error locally
    console.error('WhatsApp webhook error:', error);
  } catch (loggingError) {
    console.error('Error while logging webhook error:', loggingError);
  }
}
