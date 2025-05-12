import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Post from "@/models/Post";
import FacebookPage from "@/models/FacebookPage";
import { postToFacebook } from "@/lib/facebook";

// This endpoint is intended to be called by a cron job to auto-post scheduled posts
export async function POST() {
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
