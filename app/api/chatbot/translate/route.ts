import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { sourceLanguage, targetLanguage, content } = await req.json()

    const prompt = `Translate the following restaurant menu content from ${sourceLanguage} to ${targetLanguage}. 
    Keep the same structure and format. Only translate the values, not the keys.
    Return the response in JSON format exactly matching the input structure.
    
    Content to translate:
    ${JSON.stringify(content, null, 2)}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Translate the content while maintaining the same structure and format. Only translate the values, not the keys. Return the response in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })

    const translatedContent = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json(translatedContent)
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate translations' },
      { status: 500 }
    )
  }
} 