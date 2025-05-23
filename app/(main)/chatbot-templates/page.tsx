'use client';

import { Metadata } from 'next';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Note: This metadata export won't work in client components, so we'll need to move it
// export const metadata: Metadata = {
//   title: 'Chatbot Templates | ChatSa',
//   description: 'Create bots for Facebook Messenger and Websites in minutes. No coding or technical skills required.',
// };

const categories = [
  'Recently added',
  'Real Estate',
  'Restaurant',
  'Mortgage',
  'Insurance',
  'Contests and Promotions',
  'E-Commerce',
  'Healthcare',
  'Event',
  'Car Dealer',
  'Influencer',
  'Publications',
  'Sales',
  'Lead Generation',
  'Brick and Mortar',
];

const templates = [
  {
    id: 1,
    slug: 'instagram-bot-for-lawyers-and-law-firms',
    title: 'INSTAGRAM BOT FOR LAWYERS AND LAW FIRMS',
    description: 'Present your law services in an impressive way and generate more qualified leads on Instagram',
    tags: ['ChatSa', 'INSTAGRAM', 'LAW FIRM', 'ATTORNEY', 'LAWYER', 'CHATBOT LAWYER'],
    image: '/api/placeholder/300/400',
    category: 'Recently added'
  },
  {
    id: 2,
    slug: 'open-house-chatbot-for-instagram',
    title: 'OPEN HOUSE CHATBOT FOR INSTAGRAM',
    description: 'An automated bot funnel to generate real estate leads on Instagram',
    tags: ['LEAD GENERATION', 'SALES', 'INSTAGRAM', 'REAL ESTATE', 'FUNNEL', 'INSTAGRAM BOT', 'REALTOR'],
    image: '/api/placeholder/300/400',
    category: 'Real Estate'
  },
  {
    id: 3,
    slug: 'all-in-one-instagram-bot-for-hotels',
    title: 'ALL-IN-ONE INSTAGRAM BOT FOR HOTELS',
    description: 'This digital helper connects hotels directly with their guests and increases your service level',
    tags: ['HOTEL', 'HOSPITALITY', 'INSTAGRAM', 'CUSTOMER SERVICE'],
    image: '/api/placeholder/300/400',
    category: 'Recently added'
  },
  {
    id: 4,
    slug: 'medi-skin-clinic-bot-for-instagram',
    title: 'MEDI SKIN CLINIC BOT FOR INSTAGRAM',
    description: 'Generate a steady flow of prospective patients in your beauty business',
    tags: ['HEALTHCARE', 'BEAUTY', 'CLINIC', 'INSTAGRAM', 'LEAD GENERATION'],
    image: '/api/placeholder/300/400',
    category: 'Healthcare'
  },
  {
    id: 5,
    slug: 'restaurant-booking-bot',
    title: 'RESTAURANT BOOKING BOT',
    description: 'Automate table reservations and customer inquiries for your restaurant',
    tags: ['ChatSa', 'RESTAURANT', 'BOOKING', 'AUTOMATION', 'CUSTOMER SERVICE', 'FACEBOOK MESSENGER', 'HOSPITALITY', 'LEAD GENERATION'],
    image: '/api/placeholder/300/400',
    category: 'Restaurant'
  },
  {
    id: 6,
    slug: 'real-estate-lead-generator',
    title: 'REAL ESTATE LEAD GENERATOR',
    description: 'Capture and qualify real estate leads automatically',
    tags: ['ChatSa', 'REAL ESTATE', 'LEAD GENERATION', 'AUTOMATION', 'SALES', 'APPOINTMENT BOOKING', 'PROPERTY TOURS', 'MESSENGER', 'BROKER'],
    image: '/api/placeholder/300/400',
    category: 'Real Estate'
  },
  {
    id: 7,
    slug: 'e-commerce-support-bot',
    title: 'E-COMMERCE SUPPORT BOT',
    description: 'Handle customer support and order tracking for online stores',
    tags: ['E-COMMERCE', 'CUSTOMER SUPPORT', 'ORDER TRACKING', 'SALES'],
    image: '/api/placeholder/300/400',
    category: 'E-Commerce'
  },
  {
    id: 8,
    slug: 'insurance-quote-bot',
    title: 'INSURANCE QUOTE BOT',
    description: 'Generate insurance quotes and capture leads automatically',
    tags: ['INSURANCE', 'QUOTES', 'LEAD GENERATION', 'AUTOMATION'],
    image: '/api/placeholder/300/400',
    category: 'Insurance'
  },
  {
    id: 9,
    slug: 'mortgage-calculator-bot',
    title: 'MORTGAGE CALCULATOR BOT',
    description: 'Help customers calculate mortgage payments and pre-qualify for loans',
    tags: ['MORTGAGE', 'CALCULATOR', 'FINANCE', 'LEAD GENERATION'],
    image: '/api/placeholder/300/400',
    category: 'Mortgage'
  },
  {
    id: 10,
    slug: 'event-registration-bot',
    title: 'EVENT REGISTRATION BOT',
    description: 'Streamline event registration and provide event information',
    tags: ['EVENT', 'REGISTRATION', 'AUTOMATION', 'CUSTOMER SERVICE'],
    image: '/api/placeholder/300/400',
    category: 'Event'
  },
  {
    id: 11,
    slug: 'contest-entry-bot',
    title: 'CONTEST ENTRY BOT',
    description: 'Manage contest entries and engage participants with automated responses',
    tags: ['CONTEST', 'PROMOTION', 'ENGAGEMENT', 'SOCIAL MEDIA'],
    image: '/api/placeholder/300/400',
    category: 'Contests and Promotions'
  },
  {
    id: 12,
    slug: 'car-dealership-bot',
    title: 'CAR DEALERSHIP BOT',
    description: 'Help customers find the perfect car and schedule test drives',
    tags: ['CAR DEALER', 'AUTOMOTIVE', 'SALES', 'LEAD GENERATION'],
    image: '/api/placeholder/300/400',
    category: 'Car Dealer'
  }
];

function ChatbotTemplatesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Recently added');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get tag from URL parameters and sync with component state
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
      setSelectedCategory(''); // Clear category when filtering by tag
      setSearchQuery(''); // Clear search when filtering by tag
    } else {
      // If no tag parameter, reset to default state
      setSelectedTag(null);
      if (!searchQuery.trim()) {
        setSelectedCategory('Recently added');
      }
    }
  }, [searchParams, searchQuery]);

  // Filter templates based on category, tag, or search query
  const filteredTemplates = (() => {
    let filtered = templates;

    // If there's a search query, search through all templates
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      
      filtered = templates.filter(template => 
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.category.toLowerCase().includes(query)
      );
    }
    // If there's a tag filter, apply it
    else if (selectedTag) {
      filtered = templates.filter(template => 
        template.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
    } 
    // If there's a category filter, apply it
    else if (selectedCategory === 'Recently added') {
      filtered = templates;
    } else {
      filtered = templates.filter(template => template.category === selectedCategory);
    }

    return filtered;
  })();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedTag(null);
    setSearchQuery(''); // Clear search when changing category
    // Update URL to remove tag parameter
    router.push('/chatbot-templates');
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategory('');
    setSearchQuery(''); // Clear search when clicking tag
    // Update URL with tag parameter
    router.push(`/chatbot-templates?tag=${encodeURIComponent(tag)}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Clear category and tag filters when searching
    if (e.target.value.trim()) {
      setSelectedCategory('');
      setSelectedTag(null);
    } else {
      // When search is cleared, reset to default state
      setSelectedCategory('Recently added');
      setSelectedTag(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('Recently added');
    setSelectedTag(null);
    router.push('/chatbot-templates');
  };

  // Get display title based on current filter
  const getDisplayTitle = () => {
    if (searchQuery.trim()) {
      return `${filteredTemplates.length} Templates found for "${searchQuery}"`;
    }
    if (selectedTag) {
      return `${filteredTemplates.length} Templates tagged with "${selectedTag}"`;
    }
    return `Found ${filteredTemplates.length} Chatbot Templates`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getDisplayTitle()}
          </h1>
          <p className="text-gray-600 mb-6">
            Create bots for Facebook Messenger and Websites in minutes. No coding or technical skills required.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Show active filter */}
          {(selectedTag || searchQuery) && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {searchQuery ? 'Searching for:' : 'Filtering by tag:'}
              </span>
              <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">
                {searchQuery || selectedTag}
              </span>
              <button
                onClick={clearSearch}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Sidebar */}
          <div className="w-44 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-2 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">CATEGORIES</h2>
              <nav className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryChange(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                      selectedCategory === category && !selectedTag && !searchQuery
                        ? 'bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTemplates.map((template) => (
                <Link
                  key={template.id}
                  href={`/chatbot-templates/${template.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group block"
                >
                  <div className="flex h-74">
                    {/* Template Image - Phone Mockup */}
                    <div className="w-1/2  relative overflow-hidden p-4 flex items-center justify-center">
                      <div className="relative group-hover:scale-105 transition-transform duration-300">
                        {/* Phone Container */}
                        <div className="w-32 h-68 bg-black rounded-2xl p-1 shadow-2xl">
                          <div className="w-full h-full bg-white rounded-xl overflow-hidden relative">
                            {/* Phone Header/Status Bar */}
                            {/* <div className="bg-white text-gray-800 text-xs p-0.5 flex items-center justify-between" style={{ fontSize: '6px' }}>
                              <span>12:29</span>
                              <div className="flex space-x-0.5">
                                <div className="w-0.25 h-0.25 bg-gray-800 rounded-full" style={{ width: '1px', height: '1px' }}></div>
                                <div className="w-0.25 h-0.25 bg-gray-800 rounded-full" style={{ width: '1px', height: '1px' }}></div>
                                <div className="w-0.25 h-0.25 bg-gray-800 rounded-full" style={{ width: '1px', height: '1px' }}></div>
                              </div>
                              <span>100%</span>
                            </div> */}

                            {/* Phone Content */}
                            <div className="flex-1 h-[%90]">
                              {template.slug === 'instagram-bot-for-lawyers-and-law-firms' ? (
                                <img 
                                  src="https://botmakers.blob.core.windows.net/screenshots/p1t6lH2aa.png"
                                  alt={template.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                /* Mock Chat Interface for other templates */
                                <div className="p-1 space-y-2 h-full bg-gray-50">
                                  {/* Chat Header */}
                                  <div className="flex items-center space-x-1.5 bg-white rounded-md p-1.5 shadow-sm">
                                    <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                                      <img 
                                        src="/chatbase-icon.png" 
                                        alt="ChatSa" 
                                        className="w-3 h-3 object-contain"
                                      />
                                    </div>
                                    <div>
                                      <div className="text-xs font-medium text-gray-900">{template.title.split(' ')[0]} Bot</div>
                                      <div className="text-xs text-gray-500">ChatSa</div>
                                    </div>
                                  </div>

                                  {/* Chat Messages */}
                                  <div className="space-y-1.5">
                                    <div className="bg-white rounded-md p-1.5 shadow-sm">
                                      <div className="text-xs text-gray-700">
                                        Welcome! How can I help you today?
                                      </div>
                                    </div>
                                    <div className="bg-blue-500 text-white rounded-md p-1.5 ml-4 shadow-sm">
                                      <div className="text-xs">
                                        I need information
                                      </div>
                                    </div>
                                    <div className="bg-white rounded-md p-1.5 shadow-sm">
                                      <div className="text-xs text-gray-700">
                                        I'd be happy to help! What would you like to know?
                                      </div>
                                    </div>
                                    
                                    {/* Category-specific message */}
                                    {template.category === 'Real Estate' && (
                                      <div className="bg-white rounded-md p-1.5 shadow-sm">
                                        <div className="text-xs text-gray-700">
                                          🏠 Looking for properties?
                                        </div>
                                      </div>
                                    )}
                                    {template.category === 'Restaurant' && (
                                      <div className="bg-white rounded-md p-1.5 shadow-sm">
                                        <div className="text-xs text-gray-700">
                                          🍽️ Ready to make a reservation?
                                        </div>
                                      </div>
                                    )}
                                    {template.category === 'Healthcare' && (
                                      <div className="bg-white rounded-md p-1.5 shadow-sm">
                                        <div className="text-xs text-gray-700">
                                          🏥 Book your appointment
                                        </div>
                                      </div>
                                    )}
                                    {template.category === 'E-Commerce' && (
                                      <div className="bg-white rounded-md p-1.5 shadow-sm">
                                        <div className="text-xs text-gray-700">
                                          🛒 Need help with your order?
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Input Area */}
                                  <div className="absolute bottom-1 left-1 right-1">
                                    <div className="bg-white rounded-full px-2 py-1 shadow-sm border">
                                      <div className="text-xs text-gray-400">Type a message...</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Template Content */}
                    <div className="w-1/2 p-2 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 text-sm leading-tight">
                          {template.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {template.description}
                        </p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleTagClick(tag);
                              }}
                              className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                            >
                              {tag}
                            </button>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              +{template.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Unlock Button */}
                      <button 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 group-hover:shadow-md text-sm"
                        onClick={(e) => {
                          e.preventDefault();
                          // Handle button click if needed
                        }}
                      >
                        UNLOCK TEMPLATE
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No templates found</div>
                <div className="text-gray-500 text-sm">
                  {searchQuery 
                    ? `No templates found matching "${searchQuery}"`
                    : selectedTag 
                      ? `No templates found with tag "${selectedTag}"` 
                      : 'Try selecting a different category'
                  }
                </div>
                <button
                  onClick={clearSearch}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  {searchQuery || selectedTag ? 'Clear search and view all templates' : 'View all templates'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatbotTemplates() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    }>
      <ChatbotTemplatesContent />
    </Suspense>
  );
} 