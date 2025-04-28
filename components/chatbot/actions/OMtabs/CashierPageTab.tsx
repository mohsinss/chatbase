"use client";

import { useState } from "react";
import { IconCopy, IconExternalLink } from "@tabler/icons-react";
import { QRCodeCanvas } from 'qrcode.react';
import { Card } from "@/components/ui/card";

interface CashierPageTabProps {
  chatbotId: string;
  actionId: string;
  domain?: string;
}

const CashierPageTab = ({ chatbotId, actionId, domain = window.location.host }: CashierPageTabProps) => {
  const [copied, setCopied] = useState(false);
  const [copiedQR, setCopiedQR] = useState(false);
  
  // Generate the cashier page URL
  const cashierPageUrl = `http://${domain}/chatbot/${chatbotId}/cashier?actionId=${actionId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cashierPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleVisit = () => {
    window.open(cashierPageUrl, '_blank');
  };

  const handleCopyQR = async () => {
    const canvas = document.getElementById('cashier-qr-code-canvas') as HTMLCanvasElement;
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
    <div className="w-full space-y-6 py-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Cashier Page</h2>
        <p className="text-gray-600 mb-4">
          Share this link with your staff to manage orders and view the cashier interface
        </p>
      </div>

      <Card className="bg-gray-50 p-6 rounded-lg space-y-4">
        {/* URL Display */}
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">Cashier Page URL</span>
          <div className="bg-white p-4 rounded border border-gray-200">
            <code className="text-sm text-gray-800 break-all">
              {cashierPageUrl}
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
      </Card>

      {/* QR Code Display */}
      <Card className="p-6 rounded-lg">
        <div className="flex flex-col justify-center items-center py-4">
          <h3 className="text-lg font-medium mb-4">Scan QR Code to access Cashier Page</h3>
          <QRCodeCanvas id="cashier-qr-code-canvas" value={cashierPageUrl} size={200} />
          {/* Action Buttons for QR Code */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopyQR}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
              disabled={copiedQR}
            >
              <IconCopy className="w-4 h-4" />
              <span>{copiedQR ? "Copied!" : "Copy QR"}</span>
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
      </Card>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Share this cashier page with your staff to manage incoming orders. 
          They can view, process, and mark orders as complete from this interface.
        </p>
      </div>
    </div>
  );
};

export default CashierPageTab;
