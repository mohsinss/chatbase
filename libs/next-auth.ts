import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Providers from "next-auth/providers";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import connectMongo from "./mongo";
import sgMail from '@sendgrid/mail';
import User from "@/models/User";
import connectMongo1 from "@/libs/mongoose";
import Account from "@/models/Account";

interface NextAuthOptionsExtended extends NextAuthOptions {
  adapter: any;
}

export const authOptions: NextAuthOptionsExtended = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
//     EmailProvider({
//       // server: {
//       //   host: 'smtp.sendgrid.net',
//       //   port: 587,
//       //   auth: {
//       //     user: 'apikey', // This is the username SendGrid expects
//       //     pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
//       //   },
//       // },
//       from: process.env.EMAIL_FROM,
//       //@ts-ignore
//       sendVerificationRequest: async ({ identifier: email, url, token, baseUrl, provider }) => {
//         const { server, from } = provider;
//         // Initialize SendGrid
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//         // Create email data
//         const msg = {
//           to: email,
//           from,
//           subject: `Sign in link for Chatsa`,
//           text: `Use the link below to sign in:\n\n${url}\n\n`,
//           html: `
//   <p>Use the button below to sign in:</p>
//   <a href="${url}" style="
//     display: inline-block;
//     padding: 10px 20px;
//     background-color: #0070f3;
//     color: #ffffff;
//     text-decoration: none;
//     border-radius: 5px;
//     font-weight: bold;
//   ">
//     Sign In
//   </a>
// `,
//         }

//         // Send email
//         await sgMail.send(msg);
//       },
//     }),
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
          plan: 'Free', // Default plan for new users
          new: true,    // Mark as new user by default
          createdAt: new Date(),
        };
      },
    }),
    ...(process.env.ALLOW_TEST_USERS === 'true' ? [CredentialsProvider({
      name: "Test User",
      credentials: {
        email: { label: "Email", type: "email", value: "test@test.com" }, // default value added here
      },
      //@ts-ignore
      async authorize(credentials) {
        const testUsers = [
          "test@test.com",
          "test2@test.com",
          "test3@test.com", 
          "test4@test.com",
          "test5@test.com",
          "test6@test.com"
        ];
        
        if (credentials && credentials.email && testUsers.includes(credentials.email)) {
          await connectMongo1();

          let user = await User.findOne({ email: credentials.email });

          if (!user) {
            const username = credentials.email.split('@')[0];
            user = await User.create({
              email: credentials.email,
              name: username.charAt(0).toUpperCase() + username.slice(1) + " User",
              plan: 'Free', // Default plan for new users
              new: true,    // Mark as new user by default
              createdAt: new Date(),
            });
          }

          return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image,
            plan: user.plan,
            new: user.new,
          };
        }

        throw new Error("Invalid credentials");
      },
    })] : []),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(connectMongo && { adapter: MongoDBAdapter(connectMongo) }),

  callbacks: {
    session: async ({ session, token }) => {
      // console.log("session Callback:", { session, token });
      if (session?.user) {
        // Add user ID from token
        session.user.id = token.sub;
        
        // Add additional user properties from token
        session.user.plan = token.plan;
        session.user.new = token.new;
        
        // Add any other custom fields you want to include
        // session.user.customField = token.customField;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // console.log("signIn Callback:", { account, user, profile });
      if (account?.provider === 'google' && user?.email) {
        try {
          await connectMongo1();
          const existingUser = await User.findOne({ email: user.email });

          if (existingUser) {
            // If the user already exists, link the Google account to the existing user
            const existingAccount = await Account.findOne({
              provider: 'google',
              providerAccountId: profile?.sub,
            });

            if (!existingAccount && profile?.sub) {
              // Create a new account linked to the existing user
              const newAccount = new Account({
                userId: existingUser._id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: profile.sub,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
              });

              await newAccount.save();
            }

            return true; // Allow sign-in
          } else {
            // If the user doesn't exist, create a new user with the Google account
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              plan: 'Free', // Default plan for new users
              new: true,    // Mark as new user by default
              createdAt: new Date(),
            });
            await newUser.save();

            if (profile?.sub) {
              const newAccount = new Account({
                userId: newUser._id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: profile.sub,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                id_token: account.id_token,
                scope: account.scope,
              });

              await newAccount.save();
            }

            return true; // Allow sign-in
          }
        } catch (error) {
          console.error("SignIn error:", error);
          // Still allow sign-in even if there was an error with our custom logic
          return true;
        }
      }
      return true; // Allow sign-in for other providers
    },
    async jwt({ token, user, account, profile }) {
      // console.log("JWT Callback:", { token, user });
      // Ensure `user` or `account` are not undefined before using them
      if (user) {
        // Add user properties to token
        token.id = user.id;
        
        // Add additional properties from user
        token.plan = user.plan;
        token.new = user.new;
        
        // If there are any other fields you want to add from the user object
        // token.customField = user.customField;
      }
      return token;
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
