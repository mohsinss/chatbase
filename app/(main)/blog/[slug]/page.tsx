'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2, ChevronLeft, ChevronRight, Twitter, Linkedin, Facebook, Calculator } from 'lucide-react';
import SavingsCalculator from '@/components/SavingsCalculator';
import ChatbotDemo from '@/components/ChatbotDemo';
import { blogPosts } from '@/app/data/blog/posts';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

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

  // Add this to expose both calculator and chatbot functions to the window object
  React.useEffect(() => {
    (window as any).showCalculator = () => setIsCalculatorOpen(true);
    (window as any).showChatbot = () => setIsChatbotOpen(true);
  }, []);

  return (
    <>
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
                  className="object-cover object-[50%_20%]"
                  priority
                />
              </div>
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
            {/* Updated CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 my-16 text-white shadow-xl">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h4 className="text-4xl font-bold mb-4">Ready to Transform Your Customer Support?</h4>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Join thousands of businesses that have already revolutionized their customer support with AI chatbots.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">5000+</div>
                    <div className="text-blue-100">Businesses Served</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">98%</div>
                    <div className="text-blue-100">Satisfaction Rate</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">24/7</div>
                    <div className="text-blue-100">Support Available</div>
                  </div>
                </div>

                {/* Calculator button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-lg font-medium bg-blue-50 hover:bg-blue-100 px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    <Calculator className="h-5 w-5" />
                    Calculate Your Savings - Get Demo
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
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
      </div>

      <SavingsCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onScheduleDemo={() => {
          setIsCalculatorOpen(false);
          openCalendar();
        }}
      />

      <ChatbotDemo
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onScheduleDemo={() => {
          setIsChatbotOpen(false);
          openCalendar();
        }}
      />
    </>
  );
} 