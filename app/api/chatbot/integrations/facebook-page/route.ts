import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import FacebookPage from "@/models/FacebookPage";
import axios from "axios";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { pageId, chatbotId } = await req.json();

    // Check if chatbotId is provided
    if (!chatbotId) {
      return new NextResponse("chatbotId is missing.", { status: 400 });
    }

    // Check if chatbotId is provided
    if (!pageId) {
      return new NextResponse("pageId is missing.", { status: 400 });
    }

    await connectMongo();
    const existingFBPage = await FacebookPage.findOne({ chatbotId, pageId });

    // Check if chatbotId is provided
    if (!existingFBPage) {
      return new NextResponse("FB Page is not exist.", { status: 400 });
    }

    const page_access_token = existingFBPage.access_token;

    // UnSubscribe Page to webhook
    const response1 = await axios.delete(`https://graph.facebook.com/v22.0/${pageId}/subscribed_apps?subscribed_fields=messages&access_token=${page_access_token}`, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response1.data.success) {
      return NextResponse.json({ success: false, message: response1.data.error?.message || 'Page UnSubscription failed.' });
    }

    const result = await FacebookPage.deleteOne({ pageId });

    if (result.deletedCount > 0) {
      // Check if there are any more numbers for this chatbotId
      const remainingNumbers = await FacebookPage.find({ chatbotId });
      if (remainingNumbers.length === 0) {
        // Find the Chatbot with chatbotId and update integrations.whatsapp to false
        const chatbot = await Chatbot.findOneAndUpdate(
          { chatbotId }, // find a document with chatbotId
          {
            // update the integrations field
            $set: { "integrations.messenger": false }
          },
          {
            new: true, // return the new Chatbot instead of the old one
          }
        );
      }

      return NextResponse.json({ message: "Deleted successfully" });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("FB page deletion error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const chatbotId = url.searchParams.get("chatbotId");

  await connectMongo();
  const facebookPages = await FacebookPage.find({ chatbotId });

  if (facebookPages.length === 0) {
    // Find the Chatbot with chatbotId and update integrations.whatsapp to false
    const chatbot = await Chatbot.findOneAndUpdate(
      { chatbotId }, // find a document with chatbotId
      {
        // update the integrations field
        $set: { "integrations.messenger": false }
      },
      {
        new: true, // return the new Chatbot instead of the old one
      }
    );
  }

  return NextResponse.json(facebookPages);

}