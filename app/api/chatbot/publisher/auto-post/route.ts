import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import FacebookPage from "@/models/FacebookPage";
import { postToFacebook } from "@/lib/facebook";

// This endpoint is intended to be called by a cron job to auto-post scheduled posts
export async function GET() {
  try {
    await connectMongo();

    // Find all scheduled posts with date <= now and platform "messenger" (Facebook)
    const now = new Date();
    const scheduledPosts = await Post.find({
      status: "scheduled",
      date: { $lte: now },
      platform: "messenger"
    });

    let postedCount = 0;

    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_CRON == "1") {
      try {
        const response = await fetch(process.env.ENDPOINT_LOGGING_CRON, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'auto-post', now }),
        });

        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', JSON.stringify(event));
        // Continue execution even if logging fails
      }
    }

    for (const post of scheduledPosts) {
      try {
        if (post.platform == "messenger" && post.status === "scheduled") {
          // Find FacebookPage to get access token
          const fbPage = await FacebookPage.findOne({
            chatbotId: post.chatbotId,
            pageId: post.platformId,
          });
          if (!fbPage) {
            console.error(`FacebookPage not found for pageId: ${post.platformId}`);
            continue;
          }
          const success = await postToFacebook(post.platformId, post.content, fbPage.access_token);
          if (success) {
            post.status = "published";
            await post.save();
            postedCount++;
          } else {
            console.error(`Failed to post to Facebook for post id: ${post._id}`);
          }
        }
      } catch (err) {
        console.error(`Error posting to Facebook for post id: ${post._id}`, err);
      }
    }

    return NextResponse.json({ success: true, postedCount });
  } catch (error) {
    console.error("Failed to auto-post scheduled posts:", error);
    return NextResponse.json({ error: "Failed to auto-post scheduled posts" }, { status: 500 });
  }
}
