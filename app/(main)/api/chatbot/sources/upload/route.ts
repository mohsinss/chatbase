import { NextResponse } from "next/server";
import { TrieveSDK } from "trieve-ts-sdk";
import { Buffer } from 'buffer'; // Import Buffer if necessary
export const dynamic = 'force-dynamic';
// import { PDFDocument } from "pdf-lib";
import PDFParser from "pdf2json";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    // Validate form data
    const file = formData.get('file') as File | null;
    const fileName = formData.get('fileName') as string | null;
    const datasetId = formData.get('datasetId') as string | null;

    if (!file || !fileName || !datasetId) {
      return NextResponse.json(
        { error: "Missing required fields: file, fileName, or datasetId." },
        { status: 400 }
      );
    }

    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    let metadata;

    // Convert to base64url encoding as specified in the docs
    const base64String = Buffer.from(arrayBuffer)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    console.log(file)
    // Check if the file is a PDF
    if (file.type === 'application/pdf') {
      try {
        const buffer = Buffer.from(new Uint8Array(arrayBuffer)); // Convert Uint8Array to Buffer
        // const pdfData = await pdf(buffer); // Await the pdf-parse function
        // const pdfText = pdfData.text; // Get the extracted text
        // const characterCount = pdfText.length; // Count characters in the PDF text

        // const pdfDoc = await PDFDocument.load(arrayBuffer);

        // let characterCount = 0;
    
        // Loop through each page and extract text
        // const pages = pdfDoc.getPages();
        // for (const page of pages) {
        //   const textContent = await page.doc.getTextContent();
        //   const textItems = textContent.items;
        //   for (const item of textItems) {
        //     characterCount += item.str.length; // Count characters in each text item
        //   }
        // }

        const pdfParser = new PDFParser();
    
        // Create a Promise to handle the parsing
        const characterCountPromise = new Promise((resolve, reject) => {

          //@ts-ignore
          pdfParser.on("pdfParser_dataError", errData => {
            console.error("PDF parsing error:", errData.parserError);
            reject(errData.parserError);
          });
    
          //@ts-ignore
          pdfParser.on("pdfParser_dataReady", pdfData => {
            let characterCount = 0; // Declare a variable to hold the character count    
            // Loop through each page and count characters
            //@ts-ignore
            pdfData.Pages.forEach(page => {
              //@ts-ignore
              page.Texts.forEach(text => {
                // Decode and count characters
                const decodedText = decodeURIComponent(text.R[0].T);
                characterCount += decodedText.length; // Count characters in the decoded text
              });
            });
    
            resolve(characterCount); // Resolve with the character count
          });
    
          // Parse the PDF from the ArrayBuffer
          pdfParser.parseBuffer(Buffer.from(arrayBuffer));
        });
    
        // Await the promise to get the character count
        const characterCount = await characterCountPromise;

        metadata = {
          sizeInBytes: arrayBuffer.byteLength, // Size in bytes of the original data
          sizeInCharacters: characterCount, // Use character count from PDF text
          uniqueTag: `${fileName}-${Date.now()}` // Append timestamp to ensure uniqueness
        };
      } catch (pdfError) {
        console.error("PDF parsing error:", pdfError);
        return NextResponse.json(
          { error: "Failed to parse PDF file." },
          { status: 400 }
        );
      }
    } else {
      metadata = {
        sizeInBytes: arrayBuffer.byteLength, // Size in bytes of the original data
        sizeInCharacters: base64String.length, // Size in characters of the base64 string
        uniqueTag: `${fileName}-${Date.now()}` // Append timestamp to ensure uniqueness
      };
    }
    
    const response = await fetch("https://api.trieve.ai/api/file", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.TRIEVE_API_KEY}`,
        "TR-Dataset": datasetId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(
        {
          base64_file: base64String,
          file_name: fileName,
          metadata,
        }
      )
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("File upload failed:", data);
      throw new Error(data.message || "Failed to upload file");
    }
    // const trieve = new TrieveSDK({
    //   apiKey: process.env.TRIEVE_API_KEY!,
    //   datasetId: datasetId,
    //   organizationId: process.env.TRIEVE_ORG_ID!
    // });

    // console.log('Uploading file:', {
    //   fileName,
    //   fileType: file.type,
    //   datasetId
    // });

    // const data = await trieve.uploadFile({
    //   base64_file: base64String,
    //   file_name: fileName,
    //   create_chunks: true,
    //   description: `File uploaded for chatbot ${datasetId}`,
    //   metadata: {
    //     teamId: formData.get('teamId'),
    //     chatbotId: datasetId,
    //     mime_type: file.type
    //   },
    //   target_splits_per_chunk: 20,
    //   rebalance_chunks: true,
    //   split_delimiters: ['.', '!', '?', '\n'],
    //   tag_set: [`chatbot-${datasetId}`]
    // });

    return NextResponse.json(data);
  } catch (error) {
    console.error("File upload error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}
