import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import ChatbotInterfaceSettings from "@/models/ChatbotInterfaceSettings";
import connectMongo from "@/libs/mongoose";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    await connectMongo();

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const chatbotId = formData.get('chatbotId') as string;
    const imageType = formData.get('imageType') as string;
    
    if (!file || !chatbotId || !imageType) {
      console.error("Missing fields:", { file: !!file, chatbotId, imageType });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `${chatbotId}/${imageType}-${Date.now()}${getExtension(file.type)}`;

    console.log("Uploading to S3:", {
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

    const publicUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("Updating MongoDB with URL:", publicUrl);

    // Update the interface settings with the new image URL
    const updateField = imageType === 'profile' ? 'profilePictureUrl' : 'chatIconUrl';
    try {
      await ChatbotInterfaceSettings.findOneAndUpdate(
        { chatbotId },
        { [updateField]: publicUrl },
        { upsert: true }
      );
    } catch (dbError) {
      console.error("MongoDB update error:", dbError);
      throw new Error(`Database update failed: ${dbError.message}`);
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json({ 
      error: "Failed to upload image",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

function getExtension(contentType: string): string {
  const extensions: { [key: string]: string } = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/svg+xml': '.svg',
  };
  return extensions[contentType] || '.jpg';
} 