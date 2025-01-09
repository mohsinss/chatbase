import React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface WebsiteInputProps {
  links: { id: string; link: string }[];
  setLinks: React.Dispatch<React.SetStateAction<{ id: string; link: string }[]>>;
}

const WebsiteInput: React.FC<WebsiteInputProps> = ({ links, setLinks }) => {
  const [crawlUrl, setCrawlUrl] = useState('');
  const [sitemapUrl, setSitemapUrl] = useState('');

  const onFetchLinks = () => {
    setLinks([...links, {
      id: new Date().toString(),
      link: crawlUrl,
    }])
  }

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
            onClick={() => onFetchLinks()}
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
            <div className=''>{link.link}</div>            
          </div>
        })}
      </div>
    </div>
  );
};

export default WebsiteInput; 