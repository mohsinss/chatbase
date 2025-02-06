"use client";

import { useState, useEffect } from "react";
import { IconCopy, IconExternalLink } from "@tabler/icons-react";
import { QRCodeCanvas } from 'qrcode.react';

interface ShareSectionProps {
  chatbotId: string;
  domain: string;
}

const ShareSection = ({ chatbotId, domain }: ShareSectionProps) => {
  const [copied, setCopied] = useState(false);
  const [copiedQR, setCopiedQR] = useState(false);
  const chatbotUrl = `http://${domain}/chatbot/${chatbotId}?standalone=true`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(chatbotUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleVisit = () => {
    window.open(chatbotUrl, '_blank');
  };

  const handleCopyQR = async () => {
    const canvas = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
    if (!blob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ]);
      setCopiedQR(true);
      setTimeout(() => setCopiedQR(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Share</h2>
        <p className="text-gray-600 mb-6">
          To add the chatbot anywhere on your website, add this iframe to your html code
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg space-y-4">
        {/* URL Display */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">{domain}</span>
          <div className="bg-white p-4 rounded border border-gray-200">
            <code className="text-sm text-gray-800 break-all">
              {chatbotUrl}
            </code>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
            disabled={copied}
          >
            <IconCopy className="w-4 h-4" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handleVisit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
          >
            <IconExternalLink className="w-4 h-4" />
            <span>Visit</span>
          </button>
        </div>
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col justify-center items-center py-4">
        <QRCodeCanvas id="qr-code-canvas" value={chatbotUrl} />
        {/* Action Buttons for QR Code */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCopyQR}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
            disabled={copiedQR}
          >
            <IconCopy className="w-4 h-4" />
            <span>{copiedQR ? "Copied!" : "Copy"}</span>
          </button>

          <button
            onClick={handleVisit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
          >
            <IconExternalLink className="w-4 h-4" />
            <span>Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareSection; 