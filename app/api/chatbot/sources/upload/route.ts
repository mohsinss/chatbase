import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

export const dynamic = 'force-dynamic';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const reqformData = await req.formData();
    // Validate form data
    const file = reqformData.get('file') as File | null;
    const fileName = reqformData.get('fileName') as string | null;
    const datasetId = reqformData.get('datasetId') as string | null;
    const conversionPrompt = reqformData.get('conversionPrompt') as string | null;
    const model = reqformData.get('model') as string | null;

    if (!file || !fileName || !datasetId) {
      return NextResponse.json(
        { error: "Missing required fields: file, fileName, or datasetId." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileNameParts = fileName.split('.');
    const name = fileNameParts.slice(0, -1).join('.');
    const extension = fileNameParts.slice(-1)[0];

    // Insert the date between the name and extension
    const newFileName = `${name}-${Date.now()}.${extension}`;

    const key = `${datasetId}/${newFileName}`;
    let fileUrl;

    console.log("Uploading file to S3:", {
      bucket: process.env.AWS_S3_BUCKET_NAME,
      key,
      contentType: file.type
    });

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );
    } catch (s3Error) {
      console.error("S3 upload error:", s3Error);
      throw new Error(`S3 upload failed: ${s3Error.message}`);
    }
    fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    let trieve_data;
    let charCount;
    let status;

    await connectMongo();

    const dataset = await DatasetModel.findOne({ datasetId });

    if (dataset) {
      //Add necessary logic in the future.
    } else {
      throw new Error(`No dataset found with id: ${datasetId}`);
    }

    if (file.type === 'application/pdf') {
      // create OCR task for pdf
      const provider = model === "Chunkr" ? "Chunkr" : "LLM";
      const formData = {
        file_name: newFileName,
        base64_file: buffer.toString('base64'),
        provider,
        llm_model: model || 'openai/gpt-4o-mini',
        system_prompt: conversionPrompt || 'Convert the following PDF page to markdown. Return only the markdown with no explanation text. Do not exclude any content from the page.',
      };

      const trieve_response = await fetch("https://pdf2md.trieve.ai/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.TRIEVE_PDF2MD_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      if (!trieve_response.ok) {
        throw new Error(`Error while creating trieve task for OCR. Please try again later. ${trieve_response.statusText}`);
      }

      trieve_data = await trieve_response.json();
    } else if (file.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append('Files[0]', file, fileName);
      formData.append('StoreFile', 'true');

      const convertApiResponse = await fetch('https://v2.convertapi.com/convert/images/to/pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CONVERTAPI_KEY}`
        },
        body: formData
      });

      if (!convertApiResponse.ok) {
        throw new Error(`Error while converting image to PDF. Please try again later. ${convertApiResponse.statusText}`);
      }

      const convertApiData = await convertApiResponse.json();
      console.log(convertApiData);
      const pdfUrl = convertApiData.Files[0].Url;

      // Fetch the PDF file
      const pdfResponse = await fetch(pdfUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Error while fetching the PDF file. Please try again later. ${pdfResponse.statusText}`);
      }
      const pdfBuffer = await pdfResponse.arrayBuffer();

      // create OCR task for pdf
      const provider = model === "Chunkr" ? "Chunkr" : "LLM";
      const formData1 = {
        file_name: newFileName,
        base64_file: Buffer.from(pdfBuffer).toString('base64'),
        provider,
        llm_model: model || 'openai/gpt-4o-mini',
        system_prompt: conversionPrompt || 'Convert the following PDF page to markdown. Return only the markdown with no explanation text. Do not exclude any content from the page.',
      };

      const trieve_response = await fetch("https://pdf2md.trieve.ai/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.TRIEVE_PDF2MD_API_KEY,
        },
        body: JSON.stringify(formData1),
      });

      if (!trieve_response.ok) {
        throw new Error(`Error while creating trieve task for OCR. Please try again later. ${trieve_response.statusText}`);
      }

      trieve_data = await trieve_response.json();
    } else if (file.type === 'text/plain') {
      charCount = Buffer.byteLength(buffer.toString(), 'utf8');
      status = 'Completed';
      console.log(`Text file character count: ${charCount}`);
    }

    dataset.files.push({
      trieveTaskId: trieve_data?.id,
      name: fileName,
      url: fileUrl,
      text: null,
      status: status || trieve_data?.status,
      trained: false,
      charCount
    });
    await dataset.save();

    return NextResponse.json({ trieve_data });
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
