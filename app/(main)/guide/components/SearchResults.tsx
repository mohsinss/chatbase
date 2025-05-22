import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tutorials } from '../chatsa-academy/tutorials';
import { IconSearch, IconBook, IconVideo, IconLink } from '@tabler/icons-react';

interface SearchResult {
  title: string;
  description: string;
  href: string;
  type: 'tutorial' | 'integration' | 'guide';
  tags?: string[];
}

interface SearchResultsProps {
  query: string;
  onClose: () => void;
}

export default function SearchResults({ query, onClose }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search tutorials
    tutorials.forEach(tutorial => {
      if (
        tutorial.title.toLowerCase().includes(searchQuery) ||
        tutorial.description.toLowerCase().includes(searchQuery) ||
        tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      ) {
        searchResults.push({
          title: tutorial.title,
          description: tutorial.description,
          href: `/guide/chatsa-academy/chatbot-styling/${tutorial.id}`,
          type: 'tutorial',
          tags: tutorial.tags
        });
      }
    });

    // Search integrations
    const integrations = [
      { title: 'Whatsapp', href: '/guide/integrations/whatsapp' },
      { title: 'Messenger', href: '/guide/integrations/messenger' },
      { title: 'Instagram', href: '/guide/integrations/instagram' },
      { title: 'Cal.com', href: '/guide/integrations/calcom' },
      { title: 'Zapier', href: '/guide/integrations/zapier' },
      { title: 'Slack', href: '/guide/integrations/slack' },
      { title: 'Wix', href: '/guide/integrations/wix' },
      { title: 'Framer', href: '/guide/integrations/framer' },
      { title: 'Bubble', href: '/guide/integrations/bubble' },
      { title: 'WordPress', href: '/guide/integrations/wordpress' },
      { title: 'Weebly', href: '/guide/integrations/weebly' },
      { title: 'Webflow', href: '/guide/integrations/webflow' },
      { title: 'Shopify', href: '/guide/integrations/shopify' }
    ];

    integrations.forEach(integration => {
      if (integration.title.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          title: integration.title,
          description: `Integration guide for ${integration.title}`,
          href: integration.href,
          type: 'integration'
        });
      }
    });

    // Search getting started guides
    const gettingStartedGuides = [
      { title: 'Chatbot Settings', href: '/guide/getting-started' },
      { title: 'Response Quality', href: '/guide/getting-started/response-quality' },
      { title: 'Custom Domains', href: '/guide/getting-started/custom-domains' },
      { title: 'Create and Manage Teams', href: '/guide/getting-started/teams' }
    ];

    gettingStartedGuides.forEach(guide => {
      if (guide.title.toLowerCase().includes(searchQuery)) {
        searchResults.push({
          title: guide.title,
          description: `Getting started guide for ${guide.title}`,
          href: guide.href,
          type: 'guide'
        });
      }
    });

    setResults(searchResults);
  }, [query]);

  if (!query.trim()) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div 
        className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 text-gray-500">
            <IconSearch className="w-5 h-5" />
            <span>Search results for "{query}"</span>
          </div>
        </div>
        
        <div className="p-4">
          {results.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <Link
                  key={`${result.type}-${index}`}
                  href={result.href}
                  className="block p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {result.type === 'tutorial' && <IconVideo className="w-5 h-5 text-blue-500" />}
                      {result.type === 'integration' && <IconLink className="w-5 h-5 text-green-500" />}
                      {result.type === 'guide' && <IconBook className="w-5 h-5 text-purple-500" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{result.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                      {result.tags && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {result.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 