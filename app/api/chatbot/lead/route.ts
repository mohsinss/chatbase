import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';
import client from "@sendgrid/client";
import User from "@/models/User";
import Lead from "@/models/Lead";
import ChatbotConversation from "@/models/ChatbotConversation";
import connectMongo from "@/libs/mongoose";

const axios = require('axios');

client.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function getEmailValidation(email: string) {
  try {
    const response = await axios.get(`https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACTAPI_KEY}&email=${email}`);
    console.log(response.data);
    return Number(response.data.quality_score) > 0.00;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, chatbotId, customAnswers, conversationId } = await req.json();

    // Initialize text and html strings
    let text = '';
    let html = '';

    // Update text and html strings if fields are present
    if (name) {
      text += `Name: ${name}\n`;
      html += `<p>Name: ${name}</p>`;
    }
    if (email) {
      const email_valid = await getEmailValidation(email);
      if (!email_valid) {
        // If email is not valid, return a response indicating the invalid email
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
      }

      text += `Email: ${email}\n`;
      html += `<p>Email: ${email}</p>`;
    }
    if (phone) {
      text += `Phone: ${phone}\n`;
      html += `<p>Phone: ${phone}</p>`;
    }

    // Create email data
    const msg = {
      to: process.env.LEAD_EMAIL,
      from: process.env.EMAIL_FROM,
      subject: `New customer from chatsa.co`,
      text: text, // Use updated text
      html: html, // Use updated html
    };

    // Send email
    // await sgMail.send(msg);
    const lead = new Lead({
      email: email,
      name: name,
      phone: phone,
      chatbotId: chatbotId,
      customAnswers
    });
    await lead.save();

    // Update ChatbotConversation with new Lead ID
    await ChatbotConversation.findOneAndUpdate(
      { _id: conversationId }, // find a document with _id
      { leadId: lead._id },
      { new: false } // return the updated document
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to save leads settings" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const chatbotId = url.searchParams.get("chatbotId"); // Extract datasetId from query parameters
    
    await connectMongo();
    const leads = await Lead.find({ chatbotId });
    return NextResponse.json(leads);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}