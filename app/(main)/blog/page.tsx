import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Calendar, Clock } from "lucide-react";

const featuredPosts = [
  {
    id: 'ai-chatbots-customer-support',
    title: "How AI Chatbots are Revolutionizing Customer Support",
    excerpt: "Discover how businesses are leveraging AI chatbots to provide 24/7 support and improve customer satisfaction.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=80",
    category: "Customer Support",
    date: "March 15, 2024",
    readTime: "8 min read"
  },
  {
    id: 'ai-chatbots-productivity',
    title: "Boosting Productivity with AI-Powered Chatbots",
    excerpt: "Learn how AI chatbots are helping teams automate repetitive tasks and focus on what matters most.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=80",
    category: "Productivity",
    date: "March 10, 2024",
    readTime: "6 min read"
  },
  {
    id: 'future-ai-business',
    title: "The Future of AI in Business Communication",
    excerpt: "Explore the latest trends in AI communication and how they're shaping the future of business.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1100&q=80",
    category: "Technology",
    date: "March 5, 2024",
    readTime: "7 min read"
  }
];

const blogPosts = [
  {
    id: 'implementing-ai-chatbots',
    title: "Implementing AI Chatbots: A Step-by-Step Guide",
    excerpt: "A comprehensive guide to implementing AI chatbots in your business operations.",
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1100&q=80",
    category: "Guide",
    date: "March 1, 2024",
    readTime: "10 min read"
  },
  {
    id: 'measuring-ai-roi',
    title: "Measuring ROI of AI Chatbot Implementation",
    excerpt: "Learn how to measure and maximize the return on investment from your AI chatbot.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1100&q=80",
    category: "Business",
    date: "February 25, 2024",
    readTime: "5 min read"
  },
  {
    id: 'ai-chatbot-training',
    title: "Best Practices for AI Chatbot Training",
    excerpt: "Essential tips and best practices for training your AI chatbot effectively.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1100&q=80",
    category: "Development",
    date: "February 20, 2024",
    readTime: "8 min read"
  },
  {
    id: 'ai-vs-traditional-support',
    title: "AI Chatbots vs Traditional Support: A Comparison",
    excerpt: "Comparing traditional customer support methods with AI-powered solutions.",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=1100&q=80",
    category: "Analysis",
    date: "February 15, 2024",
    readTime: "6 min read"
  },
  {
    id: 'ai-chatbot-security',
    title: "Security Considerations for AI Chatbots",
    excerpt: "Important security measures to consider when implementing AI chatbots.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1100&q=80",
    category: "Security",
    date: "February 10, 2024",
    readTime: "7 min read"
  },
  {
    id: 'customizing-ai-chatbots',
    title: "Customizing AI Chatbots for Your Business Needs",
    excerpt: "How to tailor AI chatbots to meet your specific business requirements.",
    image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1100&q=80",
    category: "Customization",
    date: "February 5, 2024",
    readTime: "9 min read"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">AI Chatbot Insights</h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover the latest trends, best practices, and success stories in AI chatbot implementation
            </p>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              Subscribe to Newsletter
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-blue-600 font-medium">
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
