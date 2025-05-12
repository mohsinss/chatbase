import { NextRequest, NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";

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

    if (!chatbotId || !platform || !title || !content || !status || !date || !platformId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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
