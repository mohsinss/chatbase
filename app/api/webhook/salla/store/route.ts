import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import SallaIntegration from '@/models/SallaIntegration';
import Chatbot from '@/models/Chatbot';
import Dataset from '@/models/Dataset';

async function retrainChatbot(dataset: any, sallaIntegration: any) {
  const sallaTrieveId = dataset.sallaTrieveId;
  const datasetId = dataset.datasetId;

  //delete previous trained products data
  if (sallaTrieveId !== undefined && sallaTrieveId !== "undefined") {
    try {
      // Fetch the file metadata before deletion
      const response1 = await fetch(`https://api.trieve.ai/api/file/${sallaTrieveId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
        }
      });

      if (!response1.ok) {
        throw new Error(`Failed to fetch file metadata: ${response1.statusText}`);
      }

      const data = await response1.json();

      // Delete the file using the provided fileId
      const response = await fetch(`https://api.trieve.ai/api/file/${sallaTrieveId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Organization": process.env.TRIEVE_ORG_ID!,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      // Delete associated chunks using the uniqueTag from the file metadata for pdftext files
      const response3 = await fetch(`https://api.trieve.ai/api/chunk`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": datasetId, // Use datasetId since it's guaranteed to be present
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            filter: {
              must: [
                {
                  field: "metadata.uniqueTag",
                  match_all: [data.metadata.uniqueTag]
                }
              ]
            }
          }
        )
      });

      if (!response3.ok) {
        throw new Error(`Failed to delete chunks: ${response3.statusText}`);
      }
    } catch (error) {
      console.error('Error during previous data deletion:', error);
      // Continue execution even if deletion fails
    }
  }

  //retrain products data
  let sallaProducts = [];
  let sallaAdditionalInfo = sallaIntegration.additionalInfo;
  if (sallaIntegration) {
    const sallaProductsAccum: any[] = [];
    let currentPage = 1;
    let totalPages = 1;

    try {
      do {
        const url = new URL('https://api.salla.dev/admin/v2/products');
        url.searchParams.append('per_page', '65');
        url.searchParams.append('page', currentPage.toString());

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${sallaIntegration.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          console.error(`Failed to fetch Salla products: ${res.status} ${res.statusText}`);
          break;
        }

        const data = await res.json();

        if (data && data.success && Array.isArray(data.data)) {
          sallaProductsAccum.push(...data.data);
        }

        if (data && data.pagination && typeof data.pagination.totalPages === 'number') {
          totalPages = data.pagination.totalPages;
        } else {
          totalPages = 1;
        }

        currentPage++;
      } while (currentPage <= totalPages);
    } catch (error) {
      console.error('Error fetching Salla products:', error);
    }

    sallaProducts = sallaProductsAccum;
    let sallaText = '';
    if (sallaProducts.length > 0) {
      sallaText += `${sallaAdditionalInfo}\n\n`;
      sallaText += `Salla Products:\n\n`;
      sallaProducts.forEach(product => {
        sallaText += `Product Name: ${product.name}\n`;
        sallaText += `Description: ${product.description || ''}\n`;
        sallaText += `Price: ${product.price?.amount || ''} ${product.price?.currency || ''}\n`;
        sallaText += `URL: ${product.url || product.urls?.customer || ''}\n`;
        // sallaText += `SKU: ${product.sku || ''}\n`;
        sallaText += `Main Image: ${product.main_image || ''}\n`;
        sallaText += `\n`;
      });

      const base64SallaFile = Buffer.from(sallaText, 'utf-8').toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      if (sallaText) {
        const metadata = {
          uniqueTag: `texttexttexttextsalla-${Date.now()}` // Append timestamp to ensure uniqueness
        };

        try {
          const add_salla_response = await fetch("https://api.trieve.ai/api/file", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
              "TR-Dataset": datasetId,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(
              {
                base64_file: base64SallaFile,
                file_name: 'texttexttexttextsalla.txt',
                metadata
              }
            )
          });

          let responseData = await add_salla_response.json();

          if (!add_salla_response.ok) {
            throw new Error(`Failed to update text: ${add_salla_response.statusText} - ${JSON.stringify(responseData)}`);
          }

          const trieveId = responseData.file_metadata.id;
          dataset.sallaTrieveId = trieveId;
        } catch (error) {
          console.error('Error uploading Salla text file:', error);
        }
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get(process.env.SALLA_STORE_WEBHOOK_HEADER_KEY);

    const body = await request.json();
    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_SALLA == "1") {
      try {
        // Collect all headers into an object
        const headersObj: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headersObj[key] = value;
        });

        const response = await fetch(process.env.ENDPOINT_LOGGING_SALLA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            headers: headersObj,
            body: body
          }),
        });

        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', JSON.stringify(body));
        // Continue execution even if logging fails
      }
    }
    await connectMongo();

    const event = body.event;
    const merchantId = body.merchant; // Fix typo from 'merchat' to 'merchant'
    if (!merchantId) {
      return NextResponse.json({ error: 'Missing merchant ID' }, { status: 400 });
    }
    const filter = { merchantId };
    const sallaIntegration = await SallaIntegration.findOne(filter);
    if (!sallaIntegration) {
      return NextResponse.json({ error: 'Salla integration not found' }, { status: 404 });
    }
    const chatbotId = sallaIntegration.settings?.chatbotId;
    if (!chatbotId) {
      return NextResponse.json({ error: 'Chatbot ID not found in Salla integration settings' }, { status: 404 });
    }
    const chatbot = await Chatbot.findOne({ chatbotId });
    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }
    const dataset = await Dataset.findOne({ chatbotId });
    if (!dataset) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    // if (authHeader !== process.env.SALLA_STORE_WEBHOOK_HEADER_VALUE) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    switch (event) {
      case "product.created":
      case "product.updated":
      case "product.deleted":
        await retrainChatbot(dataset, sallaIntegration);
        break;
      default:
        return NextResponse.json({ error: `${event} not supported` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Salla webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
