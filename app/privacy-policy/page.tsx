import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://chatsa.co 
// - Name: Chatsa
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: mohsinb.alshammari@gmail.com

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Privacy Policy | ${config.appName}`,
  canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: 2024-03-20

Thank you for visiting Chatsa ("we," "us," or "our"). This Privacy Policy outlines how we collect, use, and protect your personal and non-personal information when you use our website located at https://chatsa.co (the "Website") and our AI chatbot services.

By accessing or using the Website and our services, you agree to the terms of this Privacy Policy. If you do not agree with the practices described in this policy, please do not use the Website or our services.

1. Information We Collect

1.1 Personal Data

We collect the following personal information:
- Name: To personalize your experience and communicate effectively
- Email: To send important information about your account, updates, and communications
- Payment Information: To process your subscription payments securely (processed by trusted third-party payment processors)
- Knowledge Base Data: Content you provide to train your AI chatbot

1.2 Non-Personal Data

We use web cookies and similar technologies to collect non-personal information such as:
- IP address
- Browser type
- Device information
- Usage patterns
- Chatbot interaction data

2. Purpose of Data Collection

We collect and use your data to:
- Process your subscription
- Train and customize your AI chatbot
- Analyze and improve our services
- Provide customer support
- Send important updates about our service

3. Data Security

We implement industry-standard security measures to protect your data. Your knowledge base content is encrypted and securely stored. We do not share your data with third parties except as necessary for service provision.

4. Children's Privacy

Chatsa is not intended for children under 13. We do not knowingly collect personal information from children. If you believe your child has provided us with personal information, please contact us immediately.

5. Updates to the Privacy Policy

We may update this Privacy Policy to reflect changes in our practices or for operational, legal, or regulatory reasons. We'll notify you of significant changes via email.

6. Contact Information

For questions about this Privacy Policy, contact us at:

Email: mohsinb.alshammari@gmail.com

For all other inquiries, please visit our Support page on the Website.

By using Chatsa, you consent to the terms of this Privacy Policy.`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
