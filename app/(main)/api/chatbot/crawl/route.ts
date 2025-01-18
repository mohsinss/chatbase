import { NextResponse } from 'next/server';

interface LinkInfo {
  url: string;
  chars: number;
}

async function fetchLinks(url: string, visited: Set<string>): Promise<LinkInfo[]> {
  if (visited.has(url)) {
    return []; // End condition: if the URL has already been visited, return an empty array
  }
  
  visited.add(url); // Mark this URL as visited

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ChatbotCrawler/1.0;)'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.statusText}`);
  }

  const html = await response.text();
  
  // Remove all HTML tags and scripts
  const cleanedHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''); // Remove scripts
  const cleanedHtml1 = cleanedHtml.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove scripts
  const cleanedHtml2 = cleanedHtml1.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ''); // Remove scripts
  const cleanedHtml3 = cleanedHtml2.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ''); // Remove scripts
  const cleanedHtml4 = cleanedHtml3.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ''); // Remove scripts
  const bodyContentMatch = cleanedHtml4.match(/<body[^>]*>([\s\S]*?)<\/body>/i); // Match content inside <body> tags
  const textOnly = bodyContentMatch ? bodyContentMatch[1].replace(/<[^>]*>/g, ' ') : ''; // Remove all HTML tags from body content

  const linkRegex = new RegExp(`href=["'](${url}[^"']*)["']`, 'g');
  const foundLinks: LinkInfo[] = [{url, chars: textOnly.length}];
  console.log(url, textOnly.length)
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const cleanedUrl = match[1].split('#')[0]; // Remove everything after '#' from the URL
    console.log(cleanedUrl)
    
    // Check for duplication before adding to foundLinks
    if (!foundLinks.some(link => link.url === cleanedUrl)) {
      foundLinks.push({ url: cleanedUrl, chars: 0 }); // Initialize chars count to 0 for the current URL
    }
  }
  
  // Recursively fetch links from found links
  for (const link of foundLinks) {
    if (!visited.has(link.url)) { // Check if the link has already been visited
      const newLinks = await fetchLinks(link.url, visited);
      // foundLinks.push(...newLinks);

      // Update chars count for existing URLs in foundLinks
      for (const newLink of newLinks) {
        const existingLink = foundLinks.find(link => link.url === newLink.url);
        if (existingLink) {
          if(newLink.chars != 0)
            existingLink.chars = newLink.chars; // Update chars count for the existing URL
        } else {
          foundLinks.push(newLink)
        }
      }
    }
  }

  // Update chars count for the current URL after fetching links
  // for (const link of foundLinks) {
  //   if(link.url == url)
  //     link.chars = textOnly.length; // Update chars count for the current URL
  // }

  return foundLinks;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const visited = new Set<string>(); // Set to track visited links
    const allLinks = await fetchLinks(url, visited); // Fetch all links starting from the provided URL

    return NextResponse.json({ foundLinks: allLinks });

  } catch (error) {
    console.error('Crawl error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to crawl URL' },
      { status: 500 }
    );
  }
} 