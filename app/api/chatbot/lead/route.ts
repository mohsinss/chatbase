import { NextResponse } from "next/server";
import sgMail from '@sendgrid/mail';

export async function POST(req: Request) {
    try {
      const {name, email, phone} = await req.json();

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Create email data
      const msg = {
        to: process.env.LEAD_EMAIL, // Change the recipient to the specific email defined in env
        from: process.env.EMAIL_FROM,
        subject: `New POST request data`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n`, // Update the text to include the name, email, and phone from the POST request
        html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Phone: ${phone}</p>`, // Update the HTML to include the name, email, and phone from the POST request
      };
    
      // Send email
      await sgMail.send(msg);
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: "Failed to save leads settings" }, { status: 500 });
    }
  } 