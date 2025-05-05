import { openai } from './clients';

// Helper function to translate text using OpenAI
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text;
  try {
    const translationResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that translates HTML interface text to \${targetLang}. 
        
        Important rules:
        - DO NOT wrap the result in code block markers like \`\`\`html or \`\`\`.`
        },
        {
          role: 'user',
          content: `Translate the following HTML to ${targetLang}:\n\n${text}`
        }
      ],
      temperature: 0,
      max_tokens: 1000,
    });
    console.log(text)
    console.log(translationResponse.choices[0].message.content.trim())
    return translationResponse.choices[0].message.content.trim();
  } catch (error) {
    console.error('Translation error:', error);
    return text; // fallback to original text
  }
}

// Helper function to translate JSON user-facing fields recursively
export async function translateJsonFields(obj: any, targetLang: string): Promise<any> {
  if (typeof obj === 'string') {
    return await translateText(obj, targetLang);
  } else if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateJsonFields(item, targetLang));
    }
    return translatedArray;
  } else if (typeof obj === 'object' && obj !== null) {
    const translatedObj: any = {};
    for (const key of Object.keys(obj)) {
      // Only translate user-facing text fields
      if (['title', 'body', 'footer', 'text', 'description', 'name'].includes(key)) {
        translatedObj[key] = await translateJsonFields(obj[key], targetLang);
      } else {
        translatedObj[key] = obj[key];
      }
    }
    return translatedObj;
  } else {
    return obj;
  }
}
