"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Linkedin, Twitter, Youtube } from 'lucide-react'
import DashboardNav from "@/components/DashboardNav"

interface Author {
  name: string;
  image: string;
}

interface ChangelogEntry {
  title: string;
  date: string;
  author: Author;
  content: string;
  details?: string[];
  image?: string;
}

const changelogEntries: ChangelogEntry[] = [
  {
    title: "Introducing AI Actions",
    date: "16 Dec 2024",
    author: { name: "Mohsin Alshammari", image: "/placeholder.svg?height=40&width=40" },
    content: "Today, we're excited to announce AI Actions! AI Actions turn your chatbot into an AI Agent that can take actions by calling any API. This lets the agent do things like upgrade_subscription, track_shipment, book_appointment, and more.",
    details: [
      "Set up your API in Chatsa or select from prebuilt actions",
      "Provide a prompt to guide the Agent on when and how to use the action",
      "Your AI Agent takes care of the rest, executing actions for your customers, giving them a mind-blowing experience",
      "These actions can be internal APIs for app-specific tasks or APIs for external tools your business uses like a ticketing system, a CRM, e-commerce platform, or really anything else"
    ]
  },
  {
    title: "Introducing Claude and Gemini Models",
    date: "12 Dec 2024",
    author: { name: "Mohsin Alshammari", image: "/placeholder.svg?height=40&width=40" },
    content: "We are excited to announce that Chatsa now supports the latest AI models from Anthropic and Google! Alongside our existing GPT models, you can now access new powerful models.",
    details: [
      "Claude 3 Haiku - Fastest and most cost-effective",
      "Claude 3.5 Sonnet - Balanced performance and capability",
      "Claude 3 Opus - Most powerful for complex tasks",
      "Gemini 1.5 Pro - Google's latest advanced model",
      "Gemini 1.5 Flash - Optimized for quick responses"
    ]
  },
  {
    title: "WhatsApp Integration Launch",
    date: "1 Dec 2024",
    author: { name: "Maxwell Timothy", image: "/placeholder.svg?height=40&width=40" },
    content: "We're thrilled to announce our new WhatsApp Integration! Connect your chatbot directly to WhatsApp and engage with your customers on their preferred messaging platform.",
    details: [
      "Easy setup with WhatsApp Business API",
      "Automated responses to customer inquiries",
      "Rich media support including images and documents",
      "Real-time conversation handling",
      "Available in the Connect -> Integrations section of your dashboard"
    ]
  },
  {
    title: "Custom Voice Generation",
    date: "25 Nov 2024",
    author: { name: "Mohsin Alshammari", image: "/placeholder.svg?height=40&width=40" },
    content: "Introducing voice capabilities to your chatbots! Now you can add natural-sounding voice responses to enhance user engagement.",
    details: [
      "Multiple voice options and accents available",
      "Adjustable speech rate and pitch",
      "Support for multiple languages",
      "Real-time voice generation",
      "Perfect for accessibility and voice-first interfaces"
    ]
  },
  {
    title: "Advanced Analytics Dashboard",
    date: "15 Nov 2024",
    author: { name: "Maxwell Timothy", image: "/placeholder.svg?height=40&width=40" },
    content: "We've completely revamped our analytics dashboard with powerful new features to help you understand your chatbot's performance better.",
    details: [
      "Real-time conversation monitoring",
      "Advanced user engagement metrics",
      "Customizable reporting periods",
      "Export capabilities for detailed analysis",
      "Integration with popular analytics platforms"
    ]
  },
  {
    title: "Multi-Language Support Enhancement",
    date: "5 Nov 2024",
    author: { name: "Mohsin Alshammari", image: "/placeholder.svg?height=40&width=40" },
    content: "We're expanding our language support! Your chatbot can now communicate fluently in over 95 languages.",
    details: [
      "Automatic language detection",
      "Real-time translation capabilities",
      "Regional dialect support",
      "Custom vocabulary for industry-specific terms",
      "Language-specific conversation flows"
    ]
  }
];

function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
  return (
    <Card className="relative mb-8 last:mb-0">
      <div className="absolute left-[-33px] top-6 h-6 w-6 rounded-full border-4 border-background bg-primary" />
      <CardHeader className="flex items-center gap-4 pb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={entry.author.image} alt={entry.author.name} />
          <AvatarFallback>{entry.author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">{entry.date}</p>
          <h2 className="text-2xl font-bold">{entry.title}</h2>
          <p className="text-sm text-muted-foreground">{entry.author.name}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p>{entry.content}</p>
          {entry.details && (
            <ul className="mt-4 space-y-2">
              {entry.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {entry.image && (
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image src={entry.image} alt={`Screenshot for ${entry.title}`} fill className="object-cover" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SocialHeader() {
  return (
    <div className="flex items-center gap-4 bg-muted/40 rounded-lg p-4 mb-8">
      <div className="flex gap-3">
        <Link 
          href="https://linkedin.com/company/chatsa" 
          className="text-muted-foreground hover:text-foreground transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Linkedin className="h-6 w-6" />
          <span className="sr-only">Follow us on LinkedIn</span>
        </Link>
        <Link 
          href="https://twitter.com/chatsa" 
          className="text-muted-foreground hover:text-foreground transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Twitter className="h-6 w-6" />
          <span className="sr-only">Follow us on Twitter</span>
        </Link>
        <Link 
          href="https://youtube.com/chatsa" 
          className="text-muted-foreground hover:text-foreground transition-colors" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Youtube className="h-6 w-6" />
          <span className="sr-only">Follow us on YouTube</span>
        </Link>
      </div>
      <p className="text-sm text-muted-foreground">
        Follow us and stay up to date with everything Chatsa!
      </p>
    </div>
  );
}

export default function ChangelogPage() {
  return (
    <div className="pt-32 pb-16 max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Changelog</h1>
      <div className="prose max-w-none">
        <p>Stay up to date with the latest updates and features.</p>
        {/* Add changelog entries here */}
      </div>
    </div>
  );
} 