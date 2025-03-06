import { NextResponse } from "next/server";
import axios from "axios";
import connectMongo from "@/libs/mongoose";
import InstagramPage from "@/models/InstagramPage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard?instagram_connected=false', req.url));
  }

  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI; // Set this in your environment variables

  try {
    // Exchange code for short-lived access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          client_id: clientId,
          redirect_uri: redirectUri,
          client_secret: clientSecret,
          code,
        },
      }
    );

    const shortLivedToken = tokenResponse.data.access_token;

    // Exchange short-lived token for long-lived token
    const longLivedResponse = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: clientId,
          client_secret: clientSecret,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    const longLivedToken = longLivedResponse.data.access_token;

    // Get user's Facebook Pages
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v18.0/me/accounts`,
      {
        params: { access_token: longLivedToken },
      }
    );

    const pages = pagesResponse.data.data;

    // Connect to MongoDB
    await connectMongo();

    // Get current user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL('/dashboard?instagram_connected=false', req.url));
    }

    // Store tokens and page info securely in your database
    for (const page of pages) {
      await InstagramPage.updateOne(
        { pageId: page.id, userId: session.user.id },
        {
          $set: {
            pageId: page.id,
            userId: session.user.id,
            access_token: page.access_token,
            name: page.name,
          },
        },
        { upsert: true }
      );
    }

    // Redirect user back to your app
    return NextResponse.redirect(new URL('/dashboard?instagram_connected=true', req.url));
  } catch (error: any) {
    console.error('Instagram OAuth error:', error.response?.data || error.message);
    return NextResponse.redirect(new URL('/dashboard?instagram_connected=false', req.url));
  }
}