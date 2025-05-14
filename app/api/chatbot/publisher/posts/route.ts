import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import FacebookPage from "@/models/FacebookPage";
import fetch from "node-fetch";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chatbotId = searchParams.get("chatbotId");
  const platform = searchParams.get("platform");
  const platformId = searchParams.get("platformId");
  const status = searchParams.get("status"); // optional filter by status

  if (!chatbotId || !platform) {
    return NextResponse.json({ error: "Missing chatbotId or platform" }, { status: 400 });
  }

  try {
    await connectMongo();

    const query: any = { chatbotId, platform, platformId };
    if (status) {
      query.status = status;
    }

    const posts = await Post.find(query).sort({ date: -1 }).lean();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongo();

    const body = await request.json();
    const { chatbotId, platform, title, content, status, date, platformId } = body;

    if (!chatbotId || !platform || !content || !status || !date || !platformId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // If platform is messenger (Facebook), post to Facebook page
    if (platform === "messenger" && status === "published") {
      const fbPage = await FacebookPage.findById(platformId);
      if (!fbPage) {
        return NextResponse.json({ error: "Facebook page not found" }, { status: 400 });
      }

      const postToFacebook = async (): Promise<boolean> => {
        try {
          const url = `https://graph.facebook.com/v22.0/${fbPage.pageId}/feed`;
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: content,
              access_token: fbPage.access_token,
            }),
          });
          const data = await response.json();
          if (response.ok && data.id) {
            console.log(`Posted to Facebook with post id: ${data.id}`);
            return true;
          } else {
            console.error("Facebook API error:", data);
            return false;
          }
        } catch (error) {
          console.error("Error posting to Facebook:", error);
          return false;
        }
      };

      const success = await postToFacebook();
      if (!success) {
        return NextResponse.json({ error: "Failed to post to Facebook" }, { status: 500 });
      }
    }

    const newPost = new Post({
      chatbotId,
      platform,
      platformId,
      title,
      content,
      status,
      date: new Date(date),
    });

    await newPost.save();

    return NextResponse.json({ success: true, post: newPost });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
