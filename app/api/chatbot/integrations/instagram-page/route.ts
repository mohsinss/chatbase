import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import axios from "axios";
import InstagramPage from "@/models/InstagramPage";

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
    const existingInstagramPage = await InstagramPage.findOne({ chatbotId, pageId });

    // Check if chatbotId is provided
    if (!existingInstagramPage) {
      return new NextResponse("instagram Page is not exist.", { status: 400 });
    }

    const page_access_token = existingInstagramPage.access_token;

    // UnSubscribe Page to webhook
    const response1 = await axios.delete(`https://graph.facebook.com/v22.0/${pageId}/subscribed_apps?subscribed_fields=messaging_postbacks,messages,mention,conversations,feed,message_mention,group_feed&access_token=${page_access_token}`, {
      headers: { Authorization: `Bearer ${process.env.FACEBOOK_USER_ACCESS_TOKEN}` }
    });
    if (!response1.data.success) {
      return NextResponse.json({ success: false, message: response1.data.error?.message || 'Page UnSubscription failed.' });
    }

    const result = await InstagramPage.deleteOne({ pageId });

    if (result.deletedCount > 0) {
      // Check if there are any more numbers for this chatbotId
      const remainingNumbers = await InstagramPage.find({ chatbotId });
      if (remainingNumbers.length === 0) {
        // Find the Chatbot with chatbotId and update integrations.whatsapp to false
        const chatbot = await Chatbot.findOneAndUpdate(
          { chatbotId }, // find a document with chatbotId
          {
            // update the integrations field
            $set: { "integrations.instagram": false }
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
  const instagramPages = await InstagramPage.find({ chatbotId });

  if (instagramPages.length === 0) {
    // Find the Chatbot with chatbotId and update integrations.whatsapp to false
    const chatbot = await Chatbot.findOneAndUpdate(
      { chatbotId }, // find a document with chatbotId
      {
        // update the integrations field
        $set: { "integrations.instagram": false }
      },
      {
        new: true, // return the new Chatbot instead of the old one
      }
    );
  }

  return NextResponse.json(instagramPages);

}