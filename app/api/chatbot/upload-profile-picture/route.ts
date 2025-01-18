import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const chatbotId = formData.get('chatbotId') as string;

    if (!file || !chatbotId) {
      return NextResponse.json(
        { error: 'File and chatbotId are required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `chatbots/${chatbotId}/profile/${uuidv4()}-${file.name}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          ContentDisposition: 'inline',
        })
      );
    } catch (uploadError) {
      console.error('S3 Upload Error:', uploadError);
      throw uploadError;
    }

    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error },
      { status: 500 }
    );
  }
} 