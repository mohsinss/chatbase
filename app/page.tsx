import Link from "next/link";
import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const metadata = getSEOTags({
  title: `${config.appName} - AI Chatbot Platform`,
  description: "Create intelligent AI chatbots trained on your custom knowledge base. Build conversational AI that understands your business.",
  canonicalUrlRelative: "/",
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">
          Welcome to {config.appName}
        </h1>
        <p className="mt-4 text-xl">
          Create intelligent AI chatbots trained on your custom knowledge base. Our platform helps you build conversational AI that truly understands your business.
        </p>
        
        <div className="mt-8">
          <Link href="/dashboard" className="btn btn-primary">
            Get Started
          </Link>
          <Link href="/docs" className="btn btn-ghost ml-4">
            Documentation
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
          <ul className="list-disc pl-6">
            <li>Custom trained AI chatbots</li>
            <li>Knowledge base integration</li>
            <li>Real-time analytics</li>
            <li>Multiple integrations</li>
            <li>Advanced conversation handling</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
