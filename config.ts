import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "أنظمة الأعمال المتقدمة",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Create intelligent AI chatbots trained on your custom knowledge base. Build conversational AI that understands your business.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "chatsa.co",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: {
      Free: {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceId: "",
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Free",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for small businesses and startups",
        // The price you want to display, the one user will be charged on Stripe.
        price: 0,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 0,
        features: [
          { name: "Custom trained AI chatbot" },
          { name: "Knowledge base integration" },
          { name: "Basic analytics" },
          { name: "Email support" },
        ],
        credits: 20,
        charactersLimit: 1024 * 400,
        teamMemberLimit: 1,
        chatbotLimit: 1,
        linksLimit: 10,
      },
      Hobby: {
        priceId: "",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        description: "For growing teams needing more power",
        price: 19,
        priceAnchor: 0,
        features: [],
        name: "Hobby",
        credits: 2000,
        charactersLimit: 33 * 1024 * 1024,
        teamMemberLimit: 1,
        chatbotLimit: 2,
        linksLimit: 0,
      },
      Standard: {
        priceId: "",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        description: "For growing teams needing more power",
        price: 199,
        priceAnchor: 0,
        features: [],
        name: "Standard",
        credits: 10000,
        charactersLimit: 0,
        teamMemberLimit: 3,
        chatbotLimit: 5,
        linksLimit: 0,
      },
      Unlimited: {
        priceId: "",
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        description: "For growing teams needing more power",
        price: 399,
        priceAnchor: 0,
        features: [],
        name: "unlimited",
        credits: 40000,
        charactersLimit: 0,
        teamMemberLimit: 5,
        chatbotLimit: 10,
        linksLimit: 0,
      },
    },
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Chatsa <noreply@resend.chatsa.co>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Mohsin at Chatsa <mohsin@resend.chatsa.co>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "mohsinb.alshammari@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "light",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["light"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/api/auth/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
