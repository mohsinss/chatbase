'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, ChevronLeft, ChevronRight, Twitter, Linkedin, Facebook } from 'lucide-react';

const blogPosts = {
  'ai-chatbots-customer-support': {
    title: "How AI Chatbots are Revolutionizing Customer Support",
    excerpt: "Discover how businesses are leveraging AI chatbots to provide 24/7 support and improve customer satisfaction.",
    content: `
      <article class="prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6 prose-ul:my-6 prose-li:text-gray-600 prose-li:mb-2">
        <h2 class="flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          The Evolution of Customer Support
        </h2>
        <p>
          In today's fast-paced digital world, customers expect immediate responses and 24/7 availability. Traditional customer support methods often fall short of these expectations, leading to frustrated customers and overwhelmed support teams. This is where AI chatbots are making a significant impact.
        </p>

        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 my-8">
          <h4 class="text-xl font-semibold mb-4">The Journey of Customer Support</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 class="font-semibold text-gray-900 mb-2">Past</h5>
              <p class="text-gray-600 text-sm mb-0">Phone-only support, long wait times, limited hours of operation</p>
            </div>
            <div>
              <h5 class="font-semibold text-gray-900 mb-2">Present</h5>
              <p class="text-gray-600 text-sm mb-0">Multi-channel support with AI chatbots, instant responses, 24/7 availability</p>
            </div>
            <div>
              <h5 class="font-semibold text-gray-900 mb-2">Future</h5>
              <p class="text-gray-600 text-sm mb-0">Predictive support, personalized experiences, advanced AI interactions</p>
            </div>
          </div>
        </div>

        <h2 class="flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Key Benefits of AI Chatbots in Customer Support
        </h2>
        
        <h3>1. 24/7 Availability</h3>
        <p>
          Unlike human agents, AI chatbots can provide instant responses around the clock. This means customers can get help whenever they need it, regardless of time zones or business hours. This constant availability has become increasingly important in our globalized economy where customers expect support at any time.
        </p>

        <div class="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
          <p class="text-blue-800 font-medium mb-0">
            "AI chatbots have reduced our response time by 80% and improved customer satisfaction scores by 35%. Our support team now focuses on complex issues while routine queries are handled automatically."
          </p>
          <p class="text-blue-600 text-sm mt-2 mb-0">
            - Sarah Chen, Customer Experience Director at TechCorp
          </p>
        </div>

        <h3>2. Instant Response Times</h3>
        <p>
          AI chatbots can process and respond to customer queries in milliseconds, significantly reducing wait times and improving customer satisfaction. This rapid response capability is particularly crucial in:
        </p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Emergency situations requiring immediate attention</li>
          <li>High-volume periods when human agents are overwhelmed</li>
          <li>Simple queries that can be resolved with quick, accurate responses</li>
          <li>Multi-language support scenarios</li>
        </ul>

        <h3>3. Cost Efficiency</h3>
        <p>
          By handling routine inquiries, AI chatbots allow businesses to reduce support costs while maintaining high-quality service. This enables companies to allocate human resources to more complex issues that require empathy, critical thinking, and personalized attention.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
          <div class="bg-gray-50 p-6 rounded-lg">
            <h4 class="text-xl font-semibold mb-4">Cost Reduction</h4>
            <p class="text-gray-600 mb-4">Average 30-40% reduction in customer support operational costs after implementing AI chatbots.</p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>• Reduced training costs</li>
              <li>• Lower overhead expenses</li>
              <li>• Improved agent efficiency</li>
              <li>• Decreased response time costs</li>
            </ul>
          </div>
          <div class="bg-gray-50 p-6 rounded-lg">
            <h4 class="text-xl font-semibold mb-4">Customer Satisfaction</h4>
            <p class="text-gray-600 mb-4">92% of customers report satisfaction with chatbot interactions when seeking basic support.</p>
            <ul class="text-sm text-gray-600 space-y-2">
              <li>• Instant query resolution</li>
              <li>• 24/7 availability</li>
              <li>• Consistent responses</li>
              <li>• Multi-language support</li>
            </ul>
          </div>
        </div>

        <h2 class="flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Real-World Applications
        </h2>
        
        <h3>1. E-commerce Support</h3>
        <p>
          Online retailers are using AI chatbots to handle order tracking, product inquiries, and return requests, providing seamless shopping experiences. Modern e-commerce chatbots can:
        </p>
        <div class="bg-gray-50 p-6 rounded-lg my-6">
          <ul class="space-y-4">
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 mt-1">✓</span>
              <div>
                <strong class="block text-gray-900">Product Recommendations</strong>
                <p class="text-gray-600 mb-0">Analyze browsing history and preferences to suggest relevant products</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 mt-1">✓</span>
              <div>
                <strong class="block text-gray-900">Order Management</strong>
                <p class="text-gray-600 mb-0">Track orders, process returns, and handle shipping inquiries</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 mr-3 mt-1">✓</span>
              <div>
                <strong class="block text-gray-900">Inventory Checks</strong>
                <p class="text-gray-600 mb-0">Provide real-time stock information and notify when items are back in stock</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 my-12 rounded-xl">
          <h4 class="text-2xl font-bold mb-6">Case Study: Fashion Retailer Success</h4>
          <p class="text-gray-700 mb-6">
            A leading online fashion retailer implemented an AI chatbot and achieved:
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">45%</div>
              <p class="text-gray-600 mb-0">Reduction in Support Tickets</p>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">28%</div>
              <p class="text-gray-600 mb-0">Increase in Sales</p>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">92%</div>
              <p class="text-gray-600 mb-0">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        <h3>2. Financial Services</h3>
        <p>
          Banks and financial institutions leverage chatbots for account inquiries, transaction history, and basic financial advice, ensuring secure and efficient customer service. Advanced features include:
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-lg mb-4">Transaction Monitoring</h4>
            <ul class="space-y-2 text-gray-600">
              <li>• Real-time balance checks</li>
              <li>• Suspicious activity alerts</li>
              <li>• Payment scheduling</li>
              <li>• Transaction categorization</li>
            </ul>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-lg mb-4">Financial Advisory</h4>
            <ul class="space-y-2 text-gray-600">
              <li>• Budget planning assistance</li>
              <li>• Investment suggestions</li>
              <li>• Expense analysis</li>
              <li>• Savings recommendations</li>
            </ul>
          </div>
        </div>

        <h3>3. Healthcare Assistance</h3>
        <p>
          Healthcare providers use AI chatbots for appointment scheduling, basic medical information, and patient pre-screening, improving access to healthcare services. Modern healthcare chatbots can:
        </p>
        <div class="bg-white border border-gray-200 rounded-lg p-6 my-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-lg mb-4">Patient Services</h4>
              <ul class="space-y-2 text-gray-600">
                <li>• Symptom assessment</li>
                <li>• Appointment scheduling</li>
                <li>• Medication reminders</li>
                <li>• Follow-up care coordination</li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-lg mb-4">Administrative Support</h4>
              <ul class="space-y-2 text-gray-600">
                <li>• Insurance verification</li>
                <li>• Medical record access</li>
                <li>• Bill payment assistance</li>
                <li>• Provider information</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 my-12 rounded-xl">
          <h4 class="text-2xl font-bold mb-6">Implementation Success Metrics</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">65%</div>
              <p class="text-gray-600 mb-0">Faster Response Time</p>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">40%</div>
              <p class="text-gray-600 mb-0">Cost Reduction</p>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p class="text-gray-600 mb-0">Availability</p>
            </div>
          </div>
        </div>

        <h2 class="flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Best Practices for Implementation
        </h2>
        
        <p>
          To successfully implement AI chatbots in customer support, consider these key factors:
        </p>

        <ul class="list-none space-y-4 my-6">
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-1">✓</span>
            <div>
              <strong class="block text-gray-900 mb-1">Clear Communication</strong>
              <p class="text-gray-600 mb-0">Ensure transparency about bot capabilities and limitations. Set clear expectations about what the chatbot can and cannot do.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-1">✓</span>
            <div>
              <strong class="block text-gray-900 mb-1">Seamless Handoff</strong>
              <p class="text-gray-600 mb-0">Implement smooth transitions to human agents when needed. Ensure context is preserved during the handoff process.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-1">✓</span>
            <div>
              <strong class="block text-gray-900 mb-1">Regular Updates</strong>
              <p class="text-gray-600 mb-0">Continuously improve based on customer feedback and usage patterns. Keep the knowledge base current.</p>
            </div>
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-3 mt-1">✓</span>
            <div>
              <strong class="block text-gray-900 mb-1">System Integration</strong>
              <p class="text-gray-600 mb-0">Ensure proper integration with existing support systems and customer databases for seamless operation.</p>
            </div>
          </li>
        </ul>

        <div class="bg-gray-50 border border-gray-200 rounded-xl p-8 my-8">
          <h4 class="text-xl font-semibold mb-6">Implementation Checklist</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 class="font-semibold text-gray-900 mb-4">Technical Setup</h5>
              <ul class="space-y-2 text-gray-600">
                <li>✓ Define chatbot objectives</li>
                <li>✓ Choose AI platform</li>
                <li>✓ Design conversation flows</li>
                <li>✓ Set up analytics tracking</li>
                <li>✓ Test bot responses</li>
              </ul>
            </div>
            <div>
              <h5 class="font-semibold text-gray-900 mb-4">Team Preparation</h5>
              <ul class="space-y-2 text-gray-600">
                <li>✓ Train support staff</li>
                <li>✓ Create handoff procedures</li>
                <li>✓ Establish monitoring protocols</li>
                <li>✓ Develop maintenance schedule</li>
                <li>✓ Plan content updates</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 class="flex items-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Future Trends in AI Customer Support
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-lg mb-4">Emotional Intelligence</h4>
            <p class="text-gray-600">Advanced sentiment analysis and emotional recognition capabilities for more empathetic interactions.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-lg mb-4">Predictive Support</h4>
            <p class="text-gray-600">Anticipating customer needs and proactively offering solutions before issues arise.</p>
          </div>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h4 class="font-semibold text-lg mb-4">Voice Integration</h4>
            <p class="text-gray-600">Seamless integration with voice assistants and natural language processing improvements.</p>
          </div>
        </div>

        <div class="border border-gray-200 rounded-xl p-8 my-12">
          <h4 class="text-2xl font-bold mb-6">The Future of AI in Customer Support</h4>
          <p class="text-gray-600 mb-6">
            As AI technology continues to advance, we can expect even more sophisticated capabilities in customer support chatbots. From better natural language understanding to predictive support, the future looks promising for AI-powered customer service.
          </p>
          <div class="flex items-center space-x-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started with AI Chatbots
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
        </div>

        <div class="bg-blue-50 rounded-xl p-8 my-12">
          <h4 class="text-2xl font-bold mb-6">Ready to Transform Your Customer Support?</h4>
          <p class="text-gray-700 mb-6">
            Join thousands of businesses that have already revolutionized their customer support with AI chatbots. Get started today and see the difference for yourself.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="font-bold text-blue-600">5000+</div>
              <div className="text-sm text-gray-600">Businesses Served</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={openCalendar}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-200 flex items-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Schedule a Free Demo
            </Button>
          </div>
        </div>
      </article>
    `,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1100&q=80",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Customer Support",
    tags: ["AI", "Customer Support", "Automation", "Business"],
    relatedPosts: [
      {
        id: 'ai-chatbots-productivity',
        title: 'Boosting Productivity with AI-Powered Chatbots',
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1100&q=80",
      },
      {
        id: 'future-ai-business',
        title: 'The Future of AI in Business Communication',
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1100&q=80",
      }
    ]
  },
  // Add other blog posts here
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog post not found</h1>
        <p className="mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
        <Link href="/blog">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const openCalendar = () => {
    window.open('https://cal.com/mohsin-alshammari-ovkk40/30min', '_blank');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-4 text-sm mb-4">
              <span className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {post.readTime}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <p className="text-xl mb-8">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"
                    alt={post.author}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-lg">{post.author}</div>
                    <div className="text-sm text-white/80">AI Solutions Expert</div>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className="bg-white/20 text-white hover:bg-white/30 flex items-center gap-2 rounded-full px-4 py-1 border-0"
                      onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                    {isShareMenuOpen && (
                      <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-2 z-10">
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Twitter className="h-4 w-4" />
                          Share on Twitter
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Linkedin className="h-4 w-4" />
                          Share on LinkedIn
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Facebook className="h-4 w-4" />
                          Share on Facebook
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-[400px] mb-12 rounded-lg overflow-hidden shadow-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {post.relatedPosts && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {post.relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold">{relatedPost.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tags Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Topics</h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Article
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                Next Article
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Updated CTA Section */}
      <div className="bg-blue-50 rounded-xl p-8 my-12">
        <h4 className="text-2xl font-bold mb-6">Ready to Transform Your Customer Support?</h4>
        <p className="text-gray-700 mb-6">
          Join thousands of businesses that have already revolutionized their customer support with AI chatbots. Get started today and see the difference for yourself.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="font-bold text-blue-600">5000+</div>
            <div className="text-sm text-gray-600">Businesses Served</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="font-bold text-blue-600">98%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="font-bold text-blue-600">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button 
            onClick={openCalendar}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:shadow-lg hover:scale-105 transform transition-all duration-200 flex items-center gap-2"
          >
            <Calendar className="h-5 w-5" />
            Schedule a Free Demo
          </Button>
        </div>
      </div>
    </div>
  );
} 