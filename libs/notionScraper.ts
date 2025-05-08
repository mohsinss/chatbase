async function fetchPageBlocks(accessToken: string, blockId: string): Promise<any[]> {
  const blocks: any[] = [];
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Notion-Version': '2022-06-28',
  };

  let startCursor: string | undefined = undefined;

  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
    if (startCursor) {
      url.searchParams.append('start_cursor', startCursor);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blocks for blockId ${blockId}: ${response.statusText}`);
    }

    const data = await response.json();
    blocks.push(...data.results);

    startCursor = data.has_more ? data.next_cursor : undefined;
  } while (startCursor);

  // Recursively fetch children blocks if any
  for (const block of blocks) {
    if (block.has_children) {
      block.children = await fetchPageBlocks(accessToken, block.id);
    }
  }

  return blocks;
}

export async function scrapeNotionPagesWithContent(accessToken: string): Promise<any[]> {
  const notionApiUrl = 'https://api.notion.com/v1/search';
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json',
  };

  const body = JSON.stringify({
    filter: {
      property: 'object',
      value: 'page',
    },
  });

  const response = await fetch(notionApiUrl, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Notion pages: ${response.statusText}`);
  }

  const data = await response.json();

  const pagesWithContent = [];

  for (const page of data.results) {
    const blocks = await fetchPageBlocks(accessToken, page.id);
    pagesWithContent.push({
      page,
      blocks,
    });
  }

  return pagesWithContent;
}
