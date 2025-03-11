import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Chatbot from "@/models/Chatbot";
import DatasetModel from "@/models/Dataset"; // Import your MongoDB model
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

//@ts-ignore
async function uploadFile(fileBuffer, fileName) {
  try {
    // Determine file type based on extension
    const fileExtension = path.extname(fileName).toLowerCase();
    const mimeType = fileExtension === '.pdf' ? 'application/pdf' : 'text/plain';

    const file = new File([fileBuffer], fileName, { type: mimeType });
    const response = await openai.files.create({
      file: file,
      purpose: 'assistants'
    });

    console.log("Uploaded file ID:", response);
    return response.id;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
}

//@ts-ignore
async function createVectorStore(chatbotId) {
  try {
    const response = await openai.beta.vectorStores.create({
      name: "Knowledge Base For " + chatbotId
    });
    if (!response?.id) {
      throw new Error("Vector store creation failed - no ID returned");
    }
    console.log("Vector Store created successfully:", response.id);
    return response.id;
  } catch (error) {
    console.error("Failed to create vector store:", error);
    throw new Error("Vector store creation failed");
  }
}

//@ts-ignore
async function createAssistantWithFiles(vectorStoreId) {
  const response = await openai.beta.assistants.create({
    // Available models for assistants:
    model: "gpt-4-turbo-preview",  // Latest GPT-4 model
    // OR
    // model: "gpt-4-1106-preview",   // GPT-4 Turbo
    // model: "gpt-4",                // Original GPT-4
    // model: "gpt-3.5-turbo",        // GPT-3.5 Turbo
    // model: "gpt-3.5-turbo-1106",   // Latest GPT-3.5
    instructions: "You are a knowledgeable assistant that uses the provided files to answer questions.",
    tools: [{ type: "file_search" }],
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStoreId]
      }
    }
  });
  console.log("Assistant ID:", response.id);
  return response.id;
}

//@ts-ignore
async function addFileToVectorStore(vectorStoreId, fileBuffer, fileName) {
  try {
    const file_id = await uploadFile(fileBuffer, fileName);
    const myVectorStoreFile = await openai.beta.vectorStores.files.create(
      vectorStoreId,
      {
        file_id
      }
    );

    console.log("Added file to vector store:", myVectorStoreFile);
    return myVectorStoreFile;
  } catch (error) {
    console.error("Error adding file to vector store:", error);
    throw new Error("Failed to add file to vector store");
  }
}

//@ts-ignore
async function clearVectorStore(vectorStoreId) {
  // Get list of all files in the vector store
  const vectorStoreFiles = await openai.beta.vectorStores.files.list(vectorStoreId);

  // Delete each file
  for (const file of vectorStoreFiles.data) {
    await openai.beta.vectorStores.files.del(vectorStoreId, file.id);
    console.log(`Deleted file ${file.id} from vector store`);
  }

  console.log("Cleared all files from vector store");
}

export async function POST(req: Request) {
  try {
    const { chatbotId, text, qaPairs, links, questionFlow } = await req.json();

    if (!chatbotId) {
      return NextResponse.json({ error: "chatbotId is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    // Convert qaPairs to a string containing only questions and answers
    //@ts-ignore
    const qaString = qaPairs.length > 0 ? qaPairs.map(pair => `Question: ${pair.question} Answer: ${pair.answer}`).join('\n') : '';
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

    await connectMongo();

    let existingDataset = await DatasetModel.findOne({ chatbotId });
    if (!existingDataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
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

    // Save the updated dataset
    await existingDataset.save();

    // Find the chatbot by its ID
    let existingChatbot = await Chatbot.findOne({ chatbotId });
    if (!existingChatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    const files = existingDataset?.files || [];
    // @ts-ignore

    sourcesCount += files.length
    // Update the chatbot with the sourcesCount
    existingChatbot.sourcesCount = sourcesCount; // Assuming sourcesCount is a field in the Chatbot model
    existingChatbot.lastTrained = new Date();

    await existingChatbot.save(); // Save the updated chatbot

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