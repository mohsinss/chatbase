import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bot } from "lucide-react";
import ButtonSignin from "@/components/ButtonSignin";

// Define the use case data
const useCasesData = {
  "customer-support-automation": {
    title: "Customer Support Automation",
    description: "Enhance your customer support with AI-powered automation",
    image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Transform Your Customer Support with AI</h2>
      <p>Customer support automation uses AI to handle routine customer inquiries, providing instant responses 24/7 without human intervention. This technology can significantly reduce response times, lower support costs, and free up your human agents to focus on more complex issues.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>24/7 Availability:</strong> Provide round-the-clock support without increasing staffing costs</li>
        <li><strong>Instant Responses:</strong> Eliminate wait times for customers with immediate answers</li>
        <li><strong>Reduced Support Costs:</strong> Handle a higher volume of inquiries at a fraction of the cost</li>
        <li><strong>Consistent Service:</strong> Deliver the same high-quality responses every time</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our AI chatbot integrates with your existing knowledge base and support systems to provide accurate, helpful responses to customer inquiries. The system can:</p>
      <ul>
        <li>Answer frequently asked questions</li>
        <li>Troubleshoot common issues</li>
        <li>Process returns and refunds</li>
        <li>Collect customer information</li>
        <li>Escalate complex issues to human agents</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Getting started with customer support automation is simple:</p>
      <ol>
        <li>Connect your knowledge base and support documentation</li>
        <li>Train the AI on your specific products and services</li>
        <li>Customize the chatbot's responses and tone</li>
        <li>Integrate with your existing support channels</li>
        <li>Monitor performance and continuously improve</li>
      </ol>
    `
  },
  "lead-generation-and-qualification": {
    title: "Lead Generation & Qualification",
    description: "Capture and qualify leads automatically with conversational AI",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Supercharge Your Lead Generation</h2>
      <p>AI-powered lead generation and qualification transforms how businesses capture and process potential customers. By engaging visitors in natural conversations, our chatbots can identify prospects, collect contact information, and qualify leads before routing them to your sales team.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Automated Lead Capture:</strong> Engage website visitors 24/7 and convert them into leads</li>
        <li><strong>Intelligent Qualification:</strong> Ask the right questions to determine lead quality and intent</li>
        <li><strong>Higher Conversion Rates:</strong> Personalized interactions increase the likelihood of conversion</li>
        <li><strong>Sales Team Efficiency:</strong> Only route qualified leads to your sales team</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our lead generation chatbots use conversational AI to:</p>
      <ul>
        <li>Initiate conversations with website visitors at the optimal moment</li>
        <li>Ask qualifying questions based on visitor behavior and interests</li>
        <li>Collect contact information and other relevant data</li>
        <li>Score leads based on predefined criteria</li>
        <li>Integrate with your CRM to create new lead records</li>
        <li>Schedule meetings with sales representatives for qualified leads</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Setting up lead generation and qualification is straightforward:</p>
      <ol>
        <li>Define your ideal customer profile and qualification criteria</li>
        <li>Customize conversation flows and qualifying questions</li>
        <li>Integrate with your CRM and sales tools</li>
        <li>Deploy the chatbot on your website and landing pages</li>
        <li>Analyze performance and refine your approach</li>
      </ol>
    `
  },
  "appointment-scheduling": {
    title: "Appointment Scheduling",
    description: "Streamline booking processes with AI-powered scheduling",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Effortless Appointment Scheduling</h2>
      <p>AI-powered appointment scheduling eliminates the back-and-forth typically associated with booking appointments. Our chatbots can handle the entire scheduling process, from finding available times to sending reminders, all through natural conversation.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Seamless Booking:</strong> Allow customers to book appointments through simple conversations</li>
        <li><strong>Calendar Integration:</strong> Sync with your team's calendars to show real-time availability</li>
        <li><strong>Automated Reminders:</strong> Send confirmation and reminder messages to reduce no-shows</li>
        <li><strong>Reduced Administrative Work:</strong> Free up staff time previously spent on scheduling</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our appointment scheduling chatbots:</p>
      <ul>
        <li>Integrate with popular calendar systems (Google Calendar, Outlook, etc.)</li>
        <li>Display available time slots based on real-time calendar data</li>
        <li>Allow customers to select preferred times through conversation</li>
        <li>Collect necessary information for the appointment</li>
        <li>Send confirmation emails or text messages</li>
        <li>Provide options to reschedule or cancel appointments</li>
        <li>Send automated reminders before scheduled appointments</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Getting started with AI appointment scheduling is simple:</p>
      <ol>
        <li>Connect your calendar systems</li>
        <li>Configure your availability and booking rules</li>
        <li>Customize the booking flow and information collection</li>
        <li>Set up confirmation and reminder messages</li>
        <li>Deploy the chatbot on your website or other channels</li>
      </ol>
    `
  },
  "document-creation-and-processing": {
    title: "Document Creation & Processing",
    description: "Automate document workflows with AI assistance",
    image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Streamline Document Creation and Processing</h2>
      <p>AI-powered document automation transforms how businesses create, process, and manage documents. Our solution can generate contracts, forms, and other documents based on user inputs and your business templates, reducing manual work and ensuring consistency.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Automated Document Generation:</strong> Create documents instantly based on templates and user inputs</li>
        <li><strong>Template Customization:</strong> Maintain brand consistency while allowing for personalization</li>
        <li><strong>Reduced Errors:</strong> Eliminate typos and inconsistencies common in manual document creation</li>
        <li><strong>Faster Processing:</strong> Reduce document turnaround time from days to minutes</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our document creation and processing solution:</p>
      <ul>
        <li>Stores and manages your document templates</li>
        <li>Collects necessary information through conversational interfaces</li>
        <li>Automatically populates templates with collected data</li>
        <li>Generates professional documents in various formats (PDF, DOCX, etc.)</li>
        <li>Facilitates electronic signatures when needed</li>
        <li>Archives completed documents for future reference</li>
        <li>Extracts data from incoming documents for processing</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Setting up document automation is straightforward:</p>
      <ol>
        <li>Upload your existing document templates</li>
        <li>Define variable fields and data collection requirements</li>
        <li>Configure document generation rules and workflows</li>
        <li>Integrate with your existing systems (CRM, ERP, etc.)</li>
        <li>Test and refine the document generation process</li>
      </ol>
    `
  },
  "product-recommendations": {
    title: "Product Recommendations",
    description: "Increase sales with personalized AI recommendations",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Boost Sales with Intelligent Product Recommendations</h2>
      <p>AI-powered product recommendations help businesses increase average order value and conversion rates by suggesting relevant products to customers. Our solution analyzes customer preferences, purchase history, and current needs to make personalized recommendations that drive sales.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Personalized Suggestions:</strong> Recommend products tailored to each customer's preferences</li>
        <li><strong>Increased Sales:</strong> Boost average order value and conversion rates</li>
        <li><strong>Enhanced Customer Experience:</strong> Help customers discover products they'll love</li>
        <li><strong>Cross-selling Opportunities:</strong> Suggest complementary products to increase basket size</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our product recommendation system:</p>
      <ul>
        <li>Analyzes customer behavior and purchase history</li>
        <li>Identifies patterns and preferences</li>
        <li>Uses collaborative filtering to find similar customers</li>
        <li>Recommends products based on conversational context</li>
        <li>Adapts recommendations based on customer feedback</li>
        <li>Integrates with your product catalog and inventory system</li>
        <li>Provides real-time recommendations during customer interactions</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Getting started with AI product recommendations is simple:</p>
      <ol>
        <li>Connect your product catalog and inventory system</li>
        <li>Import historical customer data (if available)</li>
        <li>Configure recommendation algorithms and rules</li>
        <li>Customize how recommendations are presented</li>
        <li>Deploy across your website, chatbot, and other channels</li>
        <li>Monitor performance and refine recommendation strategies</li>
      </ol>
    `
  },
  "knowledge-base-assistant": {
    title: "Knowledge Base Assistant",
    description: "Provide instant answers from your knowledge base",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1100&q=80",
    content: `
      <h2>Unlock the Power of Your Knowledge Base</h2>
      <p>A knowledge base assistant transforms how customers and employees access information. Our AI-powered solution can instantly retrieve relevant information from your knowledge base, documentation, or internal resources, providing accurate answers through natural conversation.</p>
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Instant Information Access:</strong> Provide immediate answers to questions</li>
        <li><strong>Reduced Support Tickets:</strong> Deflect common queries from your support team</li>
        <li><strong>Consistent Answers:</strong> Ensure everyone receives the same accurate information</li>
        <li><strong>Self-Service Enablement:</strong> Empower customers and employees to find answers independently</li>
      </ul>
      
      <h3>How It Works</h3>
      <p>Our knowledge base assistant:</p>
      <ul>
        <li>Connects to your existing knowledge base, documentation, and resources</li>
        <li>Indexes and understands the content for quick retrieval</li>
        <li>Interprets user questions to understand their intent</li>
        <li>Retrieves the most relevant information</li>
        <li>Presents answers in a conversational, easy-to-understand format</li>
        <li>Provides links to additional resources when appropriate</li>
        <li>Learns from interactions to improve future responses</li>
      </ul>
      
      <h3>Implementation Process</h3>
      <p>Setting up a knowledge base assistant is straightforward:</p>
      <ol>
        <li>Connect your knowledge base, documentation, and other resources</li>
        <li>Configure indexing and search parameters</li>
        <li>Customize response formats and tone</li>
        <li>Train the AI on your specific domain and terminology</li>
        <li>Deploy across your website, internal systems, or other channels</li>
        <li>Monitor performance and continuously improve the knowledge base</li>
      </ol>
    `
  }
};

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { useCase: string } }): Promise<Metadata> {
  const useCase = useCasesData[params.useCase as keyof typeof useCasesData];
  
  if (!useCase) {
    return {
      title: "Use Case Not Found",
      description: "The requested use case could not be found."
    };
  }
  
  return {
    title: `${useCase.title} | ChatSa`,
    description: useCase.description
  };
}

export default function UseCasePage({ params }: { params: { useCase: string } }) {
  const useCase = useCasesData[params.useCase as keyof typeof useCasesData];
  
  if (!useCase) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Use Case Not Found</h1>
        <p className="mb-8">The requested use case could not be found.</p>
        <Link href="/"><Button>Return Home</Button></Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section with Image Background */}
      <div className="relative h-[400px] md:h-[500px]">
        <img 
          src={useCase.image} 
          alt={useCase.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Link href="/#use-cases" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back to Use Cases
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{useCase.title}</h1>
              <p className="text-xl text-white/90 max-w-3xl">{useCase.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: useCase.content }}></div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Ready to Get Started?</h3>
              <p className="text-gray-700 mb-8">
                Our team can help you implement this solution for your specific business needs. Try it today!
              </p>
              
              <div className="space-y-4">
                <ButtonSignin 
                  text="Get Started Free"
                  extraStyle="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 hover-lift w-4/5 mx-auto"
                />
                
                {/* 
                <Button variant="outline" size="lg" className="hover-lift w-full">
                  <Bot className="mr-2 h-4 w-4" />
                  Try Demo Bot
                </Button>
                */}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-lg mb-4">Related Use Cases</h4>
                <ul className="space-y-3">
                  {Object.entries(useCasesData)
                    .filter(([key]) => key !== params.useCase)
                    .slice(0, 3)
                    .map(([key, relatedUseCase]) => (
                      <li key={key}>
                        <Link 
                          href={`/use-cases/${key}`}
                          className="text-indigo-600 hover:text-indigo-800 flex items-start"
                        >
                          <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {relatedUseCase.title}
                        </Link>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action Section */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Business with ChatSa</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses already using our AI chatbot solutions to improve efficiency and customer experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <ButtonSignin 
              text="Get Started Free"
              extraStyle="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-6 hover-lift w-4/5 mx-auto"
            />
            {/*
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover-lift">
              <Bot className="mr-2 h-4 w-4" />
              Try Demo Bot
            </Button>
            */}
          </div>
        </div>
      </div>
    </div>
  );
} 