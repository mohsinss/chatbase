import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Providers from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import sgMail from '@sendgrid/mail';

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      // server: {
      //   host: 'smtp.sendgrid.net',
      //   port: 587,
      //   auth: {
      //     user: 'apikey', // This is the username SendGrid expects
      //     pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
      //   },
      // },
      from: process.env.EMAIL_FROM,
      //@ts-ignore
      sendVerificationRequest: async ({ identifier: email, url, token, baseUrl, provider }) => {
        const { server, from } = provider;
        // Initialize SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Create email data
        const msg = {
          to: email,
          from,
          subject: `Sign in link for ${baseUrl}`,
          text: `Use the link below to sign in:\n\n${url}\n\n`,
          html: `<p>Use the link below to sign in:</p><p><a href="${url}">${url}</a></p>`,
        };

        // Send email
        await sgMail.send(msg);
      },
    }),
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/icon.png`,
  },
};

export default NextAuth(authOptions);
