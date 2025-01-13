import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface WebsiteInputProps {
  links: { id: string; link: string, chars: number }[];
  setLinks: React.Dispatch<React.SetStateAction<{ id: string; link: string }[]>>;
}

const WebsiteInput: React.FC<WebsiteInputProps> = ({ links, setLinks }) => {
  const [crawlUrl, setCrawlUrl] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);

  const normalizeUrl = (url: string) => {
    try {
      const normalized = new URL(url);
      return normalized.origin + normalized.pathname.replace(/\/$/, ''); // Remove trailing slash
    } catch (error) {
      return url; // Return as is if URL is invalid
    }
  };

  const onFetchLinks = useCallback(async () => {
    const normalizedCrawlUrl = normalizeUrl(crawlUrl);

    // Check for duplication
    if (links.some(link => normalizeUrl(link.link) === normalizedCrawlUrl)) {
      alert('This link already exists.');
      return;
    }

    setIsCrawling(true);

    try {
      // Use our API endpoint instead of direct fetch
      const response = await fetch('/api/chatbot/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizedCrawlUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URL');
      }

      const { html, foundLinks } = await response.json();

      // Create a temporary DOM element to parse the HTML
      // const parser = new DOMParser();
      // const doc = parser.parseFromString(html, 'text/html');

      // // Get all links from the page
      // const foundLinks = Array.from(doc.querySelectorAll('a'))
      //   .map(a => a.href)
      //   .filter(href => {
      //     try {
      //       const url = new URL(href, normalizedCrawlUrl); // Add base URL for relative links
      //       // Only include links from the same domain
      //       return url.origin === new URL(normalizedCrawlUrl).origin;
      //     } catch {
      //       return false;
      //     }
      //   })
      //   // Remove duplicates
      //   .filter((href, index, self) => self.indexOf(href) === index)
      //   // Normalize URLs
      //   .map(href => normalizeUrl(href));

      // Add the original URL and all found links
      const newLinks = [...foundLinks].map(link => ({
        id: new Date().getTime() + Math.random().toString(),
        link: link.url,
        chars: link.chars,
      }));

      // Filter out any duplicates with existing links
      const uniqueNewLinks = newLinks.filter(
        newLink => !links.some(existingLink => 
          normalizeUrl(existingLink.link) === normalizeUrl(newLink.link)
        )
      );

      setLinks(prevLinks => [...prevLinks, ...uniqueNewLinks]);

    } catch (error) {
      console.error('Error crawling links:', error);
      alert('Failed to crawl links. Please check the URL and try again.');
    } finally {
      setIsCrawling(false);
    }
  }, [crawlUrl, links, setLinks]);

  const deleteLink = (linkid: string) => {
    const newLinks = links.filter(link => link.id !== linkid);
    setLinks(newLinks);
  }

  return (
    <div className="w-full space-y-8">
      <h2 className="text-2xl font-semibold">Website</h2>
      
      {/* Crawl Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Crawl</h3>
        <div className="flex gap-3">
          <Input
            value={crawlUrl}
            onChange={(e) => setCrawlUrl(e.target.value)}
            placeholder="https://www.example.com"
            className="flex-1"
          />
          <Button 
            onClick={onFetchLinks}
            className="bg-black text-white hover:bg-gray-800"
            disabled={isCrawling}
          >
            {isCrawling ? 'Crawling...' : 'Fetch links'}
          </Button>
        </div>
        <p className="text-gray-600 text-sm">
          This will crawl all the links starting with the URL (not including files on the website).
        </p>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-4 text-gray-500">OR</span>
        </div>
      </div>

      {/* Sitemap Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Submit Sitemap</h3>
        <div className="flex gap-3">
          <Input
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            placeholder="https://www.example.com/sitemap.xml"
            className="flex-1"
          />
          <Button 
            onClick={() => {console.log('Load sitemap')}}
            className="bg-black text-white hover:bg-gray-800"
          >
            Load sitemap
          </Button>
        </div>
      </div>

      {/* Included Links Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Included Links</h3>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 bg-gray-100 hover:bg-gray-200"
          >
            <IconPlus className="h-5 w-5" />
          </Button>
        </div>
        {/* Links will be listed here */}
        {links.map((link, index) => {
          return <div className='p-4 bg-white rounded-lg border relative' key={'weblink-'+index}>            
            <button
              onClick={() => deleteLink(link.id)}
              className="absolute right-4 top-4 text-gray-400 hover:text-red-500"
            >
              <IconTrash className="h-5 w-5" />
            </button>
            <div className=''>{link.link} : <span>{link.chars}</span></div>            
          </div>
        })}
      </div>
    </div>
  );
};

export default WebsiteInput; 