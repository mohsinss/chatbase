import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

export async function POST(req: Request) {
    try {
      const {name, email, phone} = await req.json();

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
  
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
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
      return NextResponse.json({ error: "Failed to save leads settings" }, { status: 500 });
    }
  } 