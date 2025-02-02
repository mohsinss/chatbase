import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';
import client from "@sendgrid/client";
const axios = require('axios');

client.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function getEmailValidation(email : string) {
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
    const { name, email, phone } = await req.json();
    const data = {
      email
    };

    const request = {
      url: `/v3/validations/email`,
      method: "POST" as const,
      body: data,
    };

    const email_valid = await getEmailValidation(email);
    if (!email_valid) {
      // If email is not valid, return a response indicating the invalid email
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // const valication_res = await client.request(request);
    // console.log(valication_res)

    // Initialize text and html strings
    let text = '';
    let html = '';

    // Update text and html strings if fields are present
    if (name) {
      text += `Name: ${name}\n`;
      html += `<p>Name: ${name}</p>`;
    }
    if (email) {
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
    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to save leads settings" }, { status: 500 });
  }
} 