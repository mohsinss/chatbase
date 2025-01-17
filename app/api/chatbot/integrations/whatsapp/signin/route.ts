import { Boom } from "@hapi/boom";
import makeWASocket, { Browsers, fetchLatestBaileysVersion, useMultiFileAuthState, makeCacheableSignalKeyStore, WASocket } from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import NodeCache from "node-cache";
import MAIN_LOGGER from '@/lib/pino';
import { NextResponse } from 'next/server';

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";

const sock: Record<string, WASocket> = {};
const qrcode: Record<string, string> = {};
const pairingCode: Record<string, string> = {};
const msgRetryCounterCache = new NodeCache();
const logger = MAIN_LOGGER.child({});

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(`./credentials/${token}`);

    sock[token] = makeWASocket({
      version,
      browser: Browsers.ubuntu("AdiKhanOfficial"),
      logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger),
      },
      msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
    });

    sock[token].ev.on("connection.update", async (update) => {
      const { connection, qr } = update;
      if (connection === "open") {
        return NextResponse.json({ message: "Connected", user: sock[token].user });
      }
      if (qr) {
        QRCode.toDataURL(qr, (err, url) => {
          if (err) console.error(err);
          qrcode[token] = url;
          // Emit QR code to the client or handle as needed
          // Here we can emit an event or send a response to the client
          // For example, using a WebSocket or similar mechanism
          // emitQRCodeToClient(token, url); // Uncomment and implement this function
        });
      }
    });

    // Save credentials on update
    sock[token].ev.on("creds.update", saveCreds);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}