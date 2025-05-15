import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import SallaIntegration from '@/models/SallaIntegration';
import Chatbot from '@/models/Chatbot';

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI || '').catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}

const AUTH_TOKEN = process.env.SALLA_WEBHOOK_AUTH_TOKEN || ''; // Should be stored securely in env variables

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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== AUTH_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    const event = body.event;
    const merchantId = body.merchant;
    const createdAt = body.created_at;
    const data = body.data;

    if (!event || !merchantId || !data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    switch (event) {
      case 'app.installed': {
        // Save basic app info without tokens
        const filter = { merchantId };
        const update = {
          merchantId,
          appId: data.id,
          appName: data.app_name,
          appDescription: data.app_description,
          appType: data.app_type,
          installationDate: data.installation_date,
          storeType: data.store_type,
        };
        await SallaIntegration.findOneAndUpdate(filter, update, { upsert: true, new: true });
        break;
      }
      case 'app.store.authorize': {
        // Save tokens and fetch settings and store info
        const filter = { merchantId };
        const update = {
          merchantId,
          appId: data.id,
          appName: data.app_name,
          appDescription: data.app_description,
          appType: data.app_type,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expires: data.expires,
          scope: data.scope,
          tokenType: data.token_type,
        };

        // Fetch app settings from Salla API
        try {
          const appSettingsResponse = await fetchSallaAppSettings(data.id, data.access_token);
          if (appSettingsResponse && appSettingsResponse.data) {
            (update as any).settings = appSettingsResponse.data.settings;
          }
        } catch (err) {
          console.error('Failed to fetch app settings:', err);
        }

        // Fetch store info from Salla API
        try {
          const storeInfoResponse = await fetchSallaStoreInfo(data.access_token);
          if (storeInfoResponse && storeInfoResponse.data && storeInfoResponse.data.merchant) {
            (update as any).storeInfo = storeInfoResponse.data.merchant;
          }
        } catch (err) {
          console.error('Failed to fetch store info:', err);
        }

        await SallaIntegration.findOneAndUpdate(filter, update, { upsert: true, new: true });
        break;
      }
      case 'app.uninstalled': {
        const filter = { merchantId };
        const sallaIntegration = await SallaIntegration.findOne(filter);
        if (sallaIntegration) {
          await sallaIntegration.deleteOne();
          try {
            await Chatbot.findOneAndUpdate(
              { chatbotId: sallaIntegration?.settings?.chatbotId }, // find a document with chatbotId
              {
                // update the integrations field
                $set: { "integrations.salla": false }
              },
              {
                new: true, // return the new Chatbot instead of the old one
              }
            );
          } catch (e) {
            console.log("failed to update chatbot.integrations.salla to false", e)
          }
        }
        break;
      }
      case 'app.settings.updated': {
        const filter = { merchantId };
        const update = {
          settings: data.settings,
        };
        const sallaIntegration = await SallaIntegration.findOne(filter);
        if (sallaIntegration) {
          // update previous chatbot salla integration status
          try {
            await Chatbot.findOneAndUpdate(
              //@ts-ignore
              { chatbotId: sallaIntegration?.settings?.chatbotId }, // find a document with chatbotId
              {
                // update the integrations field
                $set: { "integrations.salla": false }
              },
              {
                new: true, // return the new Chatbot instead of the old one
              }
            );
          } catch (e) {
            console.log("failed to update chatbot.integrations.salla to false", e)
          }
          sallaIntegration.settings = data.settings;
          await sallaIntegration.save();
          // update current chatbot salla integration status
          try {
            await Chatbot.findOneAndUpdate(
              //@ts-ignore
              { chatbotId: sallaIntegration?.settings?.chatbotId }, // find a document with chatbotId
              {
                // update the integrations field
                $set: { "integrations.salla": true }
              },
              {
                new: true, // return the new Chatbot instead of the old one
              }
            );
          } catch (e) {
            console.log("failed to update chatbot.integrations.salla to false", e)
          }
        } else {
          console.log("can't find proper sallaIntegration.")
        }
        break;
      }
      default:
        return NextResponse.json({ error: 'Event not supported' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling Salla webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
