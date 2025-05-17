import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import DatasetModel from "@/models/Dataset";
import SallaIntegration from "@/models/SallaIntegration";
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IFile {
  trieveId: string;
  trieveTaskId: string;
  url: string;
  name: string;
  text: string;
  charCount: number;
  status: string;
  trained: boolean;
}

export async function POST(req: Request) {
  try {
    const { chatbotId, text, qaPairs, links, questionFlow, youtubeLinks, notionPages, sallaAdditionalInfo } = await req.json();

    if (!chatbotId) {
      return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    let existingDataset = await DatasetModel.findOne({ chatbotId });
    if (!existingDataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // Find the chatbot by its ID
    let existingChatbot = await Chatbot.findOne({ chatbotId });
    if (!existingChatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    let sallaProducts = [];
    if (existingChatbot.integrations.salla == true) {
      // Find sallaIntegration by matching sallaIntegration.settings.chatbotId to chatbotId
      const sallaIntegration = await SallaIntegration.findOne({ "settings.chatbotId": chatbotId });
      if (sallaIntegration) {
        const sallaProductsAccum: any[] = [];
        let currentPage = 1;
        let totalPages = 1;

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

        sallaProducts = sallaProductsAccum;

        sallaIntegration.additionalInfo = sallaAdditionalInfo;
        await sallaIntegration.save();
      }
    }

    let linkText = '';
    let sourcesCount = 0;
    // Iterate over each link to fetch content and count characters
    for (let link of links) {
      const response = await fetch(link.link);
      if (!response.ok) {
        console.error(`Failed to fetch content from ${link}: ${response.statusText}`);
        continue; // Skip to the next link if there's an error
      }
      const content = await response.text();
      // Function to remove HTML tags and scripts
      const stripHTMLTagsAndScripts = (str: string) => {
        // Remove script tags
        // str = str.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, ' ');
        const cleanedHtml = str.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''); // Remove scripts
        const cleanedHtml1 = cleanedHtml.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, ''); // Remove scripts
        const cleanedHtml2 = cleanedHtml1.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ''); // Remove scripts
        const cleanedHtml3 = cleanedHtml2.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ''); // Remove scripts
        const cleanedHtml4 = cleanedHtml3.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ''); // Remove scripts
        const bodyContentMatch = cleanedHtml4.match(/<body[^>]*>([\s\S]*?)<\/body>/i); // Match content inside <body> tags
        const textOnly = bodyContentMatch ? bodyContentMatch[1].replace(/<[^>]*>/g, ' ') : ''; // Remove all HTML tags from body content
        // Remove all other HTML tags
        return textOnly;
      };

      const cleanedContent = stripHTMLTagsAndScripts(content);
      // console.log(cleanedContent);
      // Parse the HTML and extract the body text
      const charCount = cleanedContent.length; // Get character count
      link.chars = charCount; // Update link with character count
      console.log(`Fetched content from ${link.link} with ${charCount} characters.`);
      // console.log(bodyText); // Log the body text
      linkText += cleanedContent + '\n';
    }
    sourcesCount += links.length;
    sourcesCount += qaPairs.length;
    sourcesCount += text ? 1 : 0;

    // Add sallaProducts text for training
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
      sourcesCount += 1;
    }
    // Convert qaPairs to a string containing only questions and answers
    //@ts-ignore
    const qaString = qaPairs.length > 0 ? qaPairs.map(pair => `Question: ${pair.question} Answer: ${pair.answer}`).join('\n') : '';

    // Process Notion pages to create a combined text and count characters
    let notionText = '';
    let notionCharCount = 0;
    if (notionPages && notionPages.length > 0) {
      for (const page of notionPages) {
        if (page.content) {
          notionText += page.content + '\n';
          notionCharCount += page.charCount || page.content.length;
        }
      }
      sourcesCount += notionPages.length;
    }
    console.log("Converted qaPairs to string:", qaString);

    const base64File = Buffer.from(text, 'utf-8').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    console.log("Base64 encoded file:", base64File)

    const base64QAFile = Buffer.from(qaString, 'utf-8').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const base64LinksFile = Buffer.from(linkText, 'utf-8').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const base64SallaFile = Buffer.from(sallaText, 'utf-8').toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    existingDataset.text = text;
    // Perform update with error catching
    const updatedDataset = await DatasetModel.findOneAndUpdate(
      { chatbotId: chatbotId },
      { $set: { text, qaPairs, links, questionFlow } },
      {
        new: true,
        runValidators: true,
        // Add this to get more detailed error information
        validateBeforeSave: true
      }
    );

    if (!updatedDataset) {
      // Check if the document still exists
      const checkDataset = await DatasetModel.findOne({ chatbotId });
      console.log("Document check after failed update:", checkDataset);
      throw new Error("Dataset not found during update");
    }

    // clear all chunks in the dataset
    const clear_dataset_response = await fetch(`https://api.trieve.ai/api/dataset/clear/${existingDataset.datasetId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId,
      }
    });

    if (!clear_dataset_response.ok) {
      throw new Error(`Failed to clear dataset: ${clear_dataset_response.statusText}`);
    }

    const add_text_response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64File,
          file_name: 'texttexttexttext.txt',
          metadata: {
            type: 'text'
          },
        }
      )
    });

    let responseData = await add_text_response.json();

    if (!add_text_response.ok) {
      throw new Error(`Failed to update text: ${add_text_response.statusText} - ${JSON.stringify(responseData)}`);
    }

    const add_qa_response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64QAFile,
          file_name: 'texttexttexttextqa.txt',
          metadata: {
            type: 'qa'
          },
        }
      )
    });

    responseData = await add_qa_response.json();

    if (!add_qa_response.ok) {
      throw new Error(`Failed to update text for qa: ${add_qa_response.statusText} - ${JSON.stringify(responseData)}`);
    }

    const add_links_response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": existingDataset.datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64LinksFile,
          file_name: 'texttexttexttextlink.txt',
          metadata: {
            type: 'link'
          },
        }
      )
    });

    responseData = await add_links_response.json();

    if (!add_links_response.ok) {
      throw new Error(`Failed to update text for qa: ${add_links_response.statusText} - ${JSON.stringify(responseData)}`);
    }

    // Iterate over the files in existingDataset
    for (let file of existingDataset.files) {
      // Check if the file status is "Completed" and it is not trained
      if (file.status === "Completed") {
        let text = '';

        if (file.trieveTaskId) {
          const resp = await fetch(
            `https://pdf2md.trieve.ai/api/task/${file.trieveTaskId}?limit=1000`,
            {
              headers: {
                Authorization: process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY,
              },
            }
          );

          if (!resp.ok) throw new Error("Failed to fetch pages");

          const data = await resp.json();

          if (data.pages) {
            //@ts-ignore
            data.pages.forEach(page => {
              text += page.content + "\n";
            });
          }
        }

        // Check if the file name ends with .txt
        if (file.name.endsWith('.txt')) {
          // Fetch the text from the file URL
          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`Failed to fetch content from ${file.url}: ${response.statusText}`);
          }
          text = await response.text();
        }

        const base64PDFText = Buffer.from(text, 'utf-8').toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const metadata = {
          uniqueTag: `${file.name}-${Date.now()}` // Append timestamp to ensure uniqueness
        };

        const add_pdf_response = await fetch("https://api.trieve.ai/api/file", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
            "TR-Dataset": existingDataset.datasetId,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            {
              base64_file: base64PDFText,
              file_name: changeExtensionToTxt(file.name),
              metadata
            }
          )
        });

        responseData = await add_pdf_response.json();

        if (!add_pdf_response.ok) {
          throw new Error(`Failed to update text for qa: ${add_pdf_response.statusText} - ${JSON.stringify(responseData)}`);
        }

        // Mark the file as trained
        file.trieveId = responseData.file_metadata.id;
        file.trained = true;
      }
    }

    // Process Notion pages as a single combined file
    if (notionPages && notionPages.length > 0) {
      let combinedContent = '';
      notionPages.forEach((page: any) => {
        if (page.content) {
          combinedContent += page.content + '\n';
        }
      });

      const base64CombinedContent = Buffer.from(combinedContent, 'utf-8').toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const metadata = {
        uniqueTag: `notion-combined-${Date.now()}`
      };

      const add_notion_response = await fetch("https://api.trieve.ai/api/file", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": existingDataset.datasetId,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64_file: base64CombinedContent,
          file_name: `notion-combined.txt`,
          metadata
        })
      });

      const notionResponseData = await add_notion_response.json();
      console.log("Notion response data:", notionResponseData);
      if (!add_notion_response.ok) {
        throw new Error(`Failed to update Notion combined pages: ${add_notion_response.statusText} - ${JSON.stringify(notionResponseData)}`);
      }

      // Mark all Notion pages as trained in dataset
      // existingDataset.notionPages = existingDataset.notionPages.map((page: any) => ({
      //   ...page,
      //   trieveId: notionResponseData.file_metadata.id,
      //   trained: true
      // }));
    }

    if (sallaText) {
      const add_salla_response = await fetch("https://api.trieve.ai/api/file", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": existingDataset.datasetId,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          {
            base64_file: base64SallaFile,
            file_name: 'texttexttexttextsalla.txt',
            metadata: {
              type: 'text'
            },
          }
        )
      });

      let responseData = await add_salla_response.json();

      if (!add_salla_response.ok) {
        throw new Error(`Failed to update text: ${add_salla_response.statusText} - ${JSON.stringify(responseData)}`);
      }
    }

    // Process YouTube links similarly
    for (let ytLink of youtubeLinks) {
      if (!ytLink.transcript || ytLink.status !== "transcripted") {
        continue; // Skip if no transcript or not transcripted
      }

      const transcriptText = ytLink.transcript;
      const base64Transcript = Buffer.from(transcriptText, 'utf-8').toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const metadata = {
        uniqueTag: `youtube-${ytLink.id}-${Date.now()}`
      };

      const add_yt_response = await fetch("https://api.trieve.ai/api/file", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
          "TR-Dataset": existingDataset.datasetId,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64_file: base64Transcript,
          file_name: `youtube-${ytLink.id}.txt`,
          metadata
        })
      });

      const ytResponseData = await add_yt_response.json();

      if (!add_yt_response.ok) {
        throw new Error(`Failed to update YouTube transcript: ${add_yt_response.statusText} - ${JSON.stringify(ytResponseData)}`);
      }

      // Mark YouTube link as trained in dataset
      const ytIndex = existingDataset.youtubeLinks.findIndex((l: any) => l.id === ytLink.id);
      if (ytIndex !== -1) {
        existingDataset.youtubeLinks[ytIndex].trieveId = ytResponseData.file_metadata.id;
        existingDataset.youtubeLinks[ytIndex].status = 'trained';
      }
    }

    // Save the updated dataset
    await existingDataset.save();

    const files = existingDataset?.files || [];
    // @ts-ignore

    sourcesCount += files.length
    // Update the chatbot with the sourcesCount
    existingChatbot.sourcesCount = sourcesCount; // Assuming sourcesCount is a field in the Chatbot model
    existingChatbot.lastTrained = new Date();

    await existingChatbot.save(); // Save the updated chatbot

    // Also update lastTrained in dataset
    if (existingDataset) {
      existingDataset.lastTrained = new Date();
      await existingDataset.save();
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error("Training error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to train chatbot" },
      { status: 500 }
    );
  }
}

function changeExtensionToTxt(filename: string) {
  let parsedPath = path.parse(filename);
  parsedPath.ext = '.txt';
  parsedPath.base = `${parsedPath.name}${parsedPath.ext}`;
  return path.format(parsedPath);
}
