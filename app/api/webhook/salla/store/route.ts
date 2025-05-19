import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SallaIntegration from '@/models/SallaIntegration';
import Chatbot from '@/models/Chatbot';
import connectMongo from '@/libs/mongoose';

async function fetchSallaAppSettings(appId: number, accessToken: string) {
  const res = await fetch(`https://api.salla.dev/admin/v2/apps/${appId}/settings`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch app settings: ${res.statusText}`);
  }
  return res.json();
}

async function fetchSallaStoreInfo(accessToken: string) {
  const res = await fetch('https://accounts.salla.sa/oauth2/user/info', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch store info: ${res.statusText}`);
  }
  return res.json();
}

async function subscribeSallaWebhook(accessToken: string) {
  const res = await fetch('https://api.salla.dev/admin/v2/webhooks', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch store info: ${res.statusText}`);
  }
  return res.json();
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get(process.env.SALLA_STORE_WEBHOOK_HEADER_KEY);

    const body = await request.json();
    // Log webhook data if enabled
    if (process.env.ENABLE_WEBHOOK_LOGGING_SALLA == "1") {
      try {
        const response = await fetch(process.env.ENDPOINT_LOGGING_SALLA, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          console.error(`Webhook logging error: ${response.status}`);
        }
      } catch (error) {
        console.error('Webhook logging error:', JSON.stringify(body));
        // Continue execution even if logging fails
      }
    }

    if (authHeader !== process.env.SALLA_STORE_WEBHOOK_HEADER_VALUE) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Salla webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
