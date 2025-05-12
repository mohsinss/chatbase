import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { sourceLanguage, targetLanguage, content } = await req.json()

    const prompt = `You are a professional translator specializing in restaurant and food service content. 
    Translate the following content from ${sourceLanguage} to ${targetLanguage}.
    
    Rules:
    1. Maintain the exact same JSON structure
    2. Only translate the values, not the keys
    3. For menu items, ensure food names are culturally appropriate
    4. Keep any numbers, prices, or special characters unchanged
    5. For message templates, maintain the same variables (like {table}, {order}, etc.)
    6. Ensure translations are natural and idiomatic in the target language
    7. Return ONLY the JSON object with the translations, no additional text
    
    Content to translate:
    ${JSON.stringify(content, null, 2)}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional translator specializing in restaurant and food service content. Your translations must be accurate, culturally appropriate, and maintain the exact same structure as the input. Return ONLY the JSON object with the translations, no additional text."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })

    // Extract JSON from the response
    const responseText = completion.choices[0].message.content || '{}'
    const translatedContent = JSON.parse(responseText)

    return NextResponse.json(translatedContent)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate translations' },
      { status: 500 }
    )
  }
} 