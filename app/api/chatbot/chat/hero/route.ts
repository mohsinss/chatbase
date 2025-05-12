import { NextRequest, NextResponse } from 'next/server';

// Import modular components
import {
  handleOptionsRequest,
} from '@/components/chatbot/api';

// Define platform-specific prompts
const PLATFORM_PROMPTS = {
  whatsapp: `You are a friendly and helpful WhatsApp chatbot for Golden Gym. 
  Your tone is casual, warm, and conversational. 
  You provide information about gym memberships, classes, trainers, and facilities.
  You use emojis occasionally to make the conversation more engaging.
  You're knowledgeable about fitness, nutrition, and wellness.
  You're designed to help potential members learn about Golden Gym and encourage them to visit.`,
  
  twitter: `You are a concise and engaging Twitter chatbot for Golden Gym.
  Your responses are short, to the point, and under 280 characters when possible.
  You use hashtags occasionally and have a slightly more casual, trendy tone.
  You provide quick information about gym promotions, classes, and events.
  You're designed to be informative while maintaining Twitter's fast-paced nature.`,
  
  facebook: `You are a friendly and informative Facebook chatbot for Golden Gym.
  Your tone is warm, community-focused, and slightly more formal than Twitter but still conversational.
  You provide detailed information about gym facilities, classes, trainers, and community events.
  You're designed to build a sense of community and encourage engagement with Golden Gym's Facebook page.`,
  
  instagram: `You are a trendy and visually-oriented Instagram chatbot for Golden Gym.
  Your tone is energetic, motivational, and uses emojis frequently.
  You focus on fitness inspiration, workout tips, and the visual aspects of the gym.
  You occasionally mention Instagram-specific features like stories, reels, and highlights.
  You're designed to be engaging and inspire followers to visit Golden Gym.`,
  
  web: `You are a professional and helpful web chatbot for Golden Gym.
  Your tone is friendly but more formal and business-oriented than social media platforms.
  You provide comprehensive information about memberships, classes, trainers, and facilities.
  You're designed to answer customer inquiries efficiently and encourage website visitors to sign up for memberships or schedule tours.`
};

// Golden Gym information
const GYM_INFO = {
  name: "Golden Gym",
  description: "A premium fitness center offering state-of-the-art equipment, expert trainers, and a variety of classes.",
  membershipPlans: [
    { name: "Basic", price: "$29/month", features: ["Access to gym floor", "Basic equipment usage", "Locker room access"] },
    { name: "Premium", price: "$49/month", features: ["Unlimited gym access", "2 free personal training sessions monthly", "Group classes", "Sauna access", "Nutritional guidance"] },
    { name: "VIP", price: "$79/month", features: ["All Premium features", "Unlimited personal training", "Priority class booking", "Exclusive VIP lounge", "Monthly massage session"] }
  ],
  classes: [
    { name: "HIIT", description: "High-intensity interval training for maximum calorie burn", schedule: "Mon-Fri 6PM, Sat 10AM" },
    { name: "Yoga", description: "Improve flexibility and reduce stress", schedule: "Mon, Wed, Fri 7AM, Tue, Thu 6PM" },
    { name: "Spin", description: "Indoor cycling for cardio fitness", schedule: "Mon-Fri 5PM, Sat 9AM" },
    { name: "Zumba", description: "Dance-based fitness class", schedule: "Tue, Thu 7PM, Sat 11AM" },
    { name: "Boxing", description: "Boxing techniques for fitness and strength", schedule: "Mon, Wed 6PM, Fri 5PM" }
  ],
  trainers: [
    { name: "Mike", specialty: "HIIT and Strength Training", experience: "10+ years" },
    { name: "Sarah", specialty: "Yoga and Pilates", experience: "8 years" },
    { name: "David", specialty: "Weight Loss and Nutrition", experience: "12 years" },
    { name: "Emma", specialty: "Rehabilitation and Injury Prevention", experience: "7 years" }
  ],
  facilities: [
    "State-of-the-art cardio equipment",
    "Free weights and resistance machines",
    "Indoor swimming pool",
    "Sauna and steam room",
    "Basketball court",
    "Indoor track",
    "Café with healthy food options",
    "Childcare services"
  ],
  hours: {
    weekdays: "5AM-11PM",
    saturday: "7AM-10PM",
    sunday: "8AM-8PM"
  },
  location: "123 Fitness Avenue, Health City",
  contact: {
    phone: "(555) 123-4567",
    email: "info@goldengym.com"
  }
};

export async function OPTIONS(req: NextRequest) {
  return handleOptionsRequest();
}

export async function POST(req: NextRequest) {
  try {
    const { platform, message, language } = await req.json();
    
    if (!platform || !message) {
      return NextResponse.json(
        { error: 'Platform and message are required' },
        { status: 400 }
      );
    }
    
    // Get the appropriate prompt for the platform
    const platformPrompt = PLATFORM_PROMPTS[platform as keyof typeof PLATFORM_PROMPTS] || PLATFORM_PROMPTS.web;
    
    // Create a system prompt that includes both platform-specific instructions and gym information
    const systemPrompt = `${platformPrompt}
    
    Here is information about Golden Gym that you can use to answer questions:
    
    Name: ${GYM_INFO.name}
    Description: ${GYM_INFO.description}
    
    Membership Plans:
    ${GYM_INFO.membershipPlans.map(plan => 
      `- ${plan.name} (${plan.price}): ${plan.features.join(', ')}`
    ).join('\n')}
    
    Classes:
    ${GYM_INFO.classes.map(cls => 
      `- ${cls.name}: ${cls.description}. Schedule: ${cls.schedule}`
    ).join('\n')}
    
    Trainers:
    ${GYM_INFO.trainers.map(trainer => 
      `- ${trainer.name}: ${trainer.specialty} (${trainer.experience} experience)`
    ).join('\n')}
    
    Facilities:
    ${GYM_INFO.facilities.map(facility => `- ${facility}`).join('\n')}
    
    Hours:
    - Weekdays: ${GYM_INFO.hours.weekdays}
    - Saturday: ${GYM_INFO.hours.saturday}
    - Sunday: ${GYM_INFO.hours.sunday}
    
    Location: ${GYM_INFO.location}
    Contact: ${GYM_INFO.contact.phone}, ${GYM_INFO.contact.email}
    
    Respond to the user's message in a helpful, informative way that matches the platform's style.
    If the user asks about something not covered in the information provided, politely explain that you don't have that information but can help with what you do know about Golden Gym.`;
    
    // Call the AI API to generate a response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate response');
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}