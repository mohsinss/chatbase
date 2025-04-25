/**
 * Logging utilities for WhatsApp webhook
 */

/**
 * Log webhook data to external service if enabled
 */
export async function logWebhookData(data: any): Promise<void> {
  if (process.env.ENABLE_WEBHOOK_LOGGING_WHATSAPP === "1") {
    try {
      // Send data to the specified URL with error handling for JSON.stringify
      let jsonData;
      try {
        jsonData = JSON.stringify(data);
      } catch (stringifyError) {
        console.error('Error stringifying webhook data:', stringifyError);
        // Create a simplified version of the data that can be stringified
        jsonData = JSON.stringify({
          error: 'Failed to stringify original data',
          message: stringifyError.message,
          dataType: typeof data,
          dataKeys: data ? Object.keys(data) : []
        });
      }
      
      const response = await fetch('http://webhook.mrcoders.org/whatsapp.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Log error with safe stringification
      try {
        console.error('Error logging webhook data:', JSON.stringify(data));
      } catch (stringifyError) {
        console.error('Error logging webhook data (stringify failed):', stringifyError.message);
      }
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
      // Send error data to the specified URL with error handling
      let errorJson;
      try {
        // Try to stringify the error object
        errorJson = JSON.stringify(error);
      } catch (stringifyError) {
        console.error('Error stringifying error object:', stringifyError);
        // Create a simplified version of the error that can be stringified
        errorJson = JSON.stringify({
          error: 'Failed to stringify original error',
          message: error.message || 'Unknown error',
          stack: error.stack,
          name: error.name
        });
      }
      
      const response = await fetch('http://webhook.mrcoders.org/whatsapp-error.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: errorJson,
      });
    }
    
    // Log error locally
    console.error('WhatsApp webhook error:', error);
  } catch (loggingError) {
    console.error('Error while logging webhook error:', loggingError);
  }
}
