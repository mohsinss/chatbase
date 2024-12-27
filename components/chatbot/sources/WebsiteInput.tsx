import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

interface WebsiteInputProps {
  onFetchLinks: (url: string) => void;
  onLoadSitemap: (url: string) => void;
}

const WebsiteInput = ({ onFetchLinks, onLoadSitemap }: WebsiteInputProps) => {
  const [crawlUrl, setCrawlUrl] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');

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
            onClick={() => onFetchLinks(crawlUrl)}
            className="bg-black text-white hover:bg-gray-800"
          >
            Fetch links
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
            onClick={() => onLoadSitemap(sitemapUrl)}
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
      </div>
    </div>
  );
};

export default WebsiteInput; 