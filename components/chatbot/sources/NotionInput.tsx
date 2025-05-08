import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconBrandNotion, IconX } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

interface NotionInputProps {
  connected?: boolean;
  pages?: {
    id: string;
    title?: string;
    content?: string;
    charCount?: number;
    url?: string;
    properties?: any;
    last_edited_time?: string;
  }[];
  onConnect: (code: string) => void;
  loading?: boolean;
  lastTrained?: Date;
}

const NotionInput = ({
  connected = false,
  pages = [],
  onConnect,
  loading,
  lastTrained
}: NotionInputProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Determine if retrain is needed by comparing lastTrained with pages' last edit time
  const mostRecentEditTime = pages.reduce((latest, page) => {
    const pageEditTime = page.last_edited_time ? new Date(page.last_edited_time) : null;
    if (pageEditTime && (!latest || pageEditTime > latest)) {
      return pageEditTime;
    }
    return latest;
  }, null as Date | null);
  console.log('mostRecentEditTime', mostRecentEditTime);
  console.log('lastTrained', lastTrained);

  const retrainNeeded = !lastTrained || (mostRecentEditTime ? lastTrained < mostRecentEditTime : false);

  const handleConnect = () => {
    // Open Notion OAuth in a popup window
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
      '/api/auth/notion',
      'Notion OAuth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (!popup) {
      alert('Failed to open popup window. Please allow popups for this site.');
      return;
    }

    setIsConnecting(true);

    // Polling to detect popup close
    const popupTick = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupTick);
        toast.error('Notion OAuth popup closed unexpectedly. Please try again.');
        setIsConnecting(false);
        // Add any additional logic for popup close here
      }
    }, 500);

    // Listen for message from popup
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'notion-auth-callback') {
        clearInterval(popupTick);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Optional delay for better UX
        // Handle the message from the popup
        const { code, error } = event.data;
        if (code) {
          // Handle successful auth with code
          await onConnect(code);
        } else if (error) {
          toast.error(`Notion authentication failed: ${error}`);
        }
        popup.close();
        window.removeEventListener('message', handleMessage);
        setIsConnecting(false);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  if (loading) {
    return (
      <div className="w-full min-h-[600px]">
        <h2 className="text-2xl font-semibold mb-8">Notion</h2>
        <div className="flex justify-center items-center h-[400px]">
          <Button
            disabled
            className="flex items-center gap-2 bg-white border hover:bg-gray-50 text-gray-800 px-6 py-4 h-auto text-base"
          >
            <IconBrandNotion className="w-6 h-6" />
            Loading Notion pages...
          </Button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="w-full min-h-[600px]">
        <h2 className="text-2xl font-semibold mb-8">Notion</h2>
        <div className="flex justify-center items-center h-[400px]">
          <Button
            disabled
            className="flex items-center gap-2 bg-white border hover:bg-gray-50 text-gray-800 px-6 py-4 h-auto text-base"
          >
            <IconBrandNotion className="w-6 h-6" />
            Connecting to Notion...
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[600px]">
      <h2 className="text-2xl font-semibold mb-8">Notion</h2>

      {connected ? (
        <div>
          {retrainNeeded && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
              Retrain is needed: Notion pages have been updated since last training.
            </div>
          )}
          <h3 className="text-lg font-semibold mb-4">Connected Notion Pages</h3>
          <div className="overflow-auto max-h-96 mb-4">
            {pages.length > 0 ? (
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Char Count</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => {
                    const category = page.properties?.Category?.multi_select?.map((cat: any) => cat.name).join(', ') || 'Uncategorized';
                    const title = page.properties?.['Doc name']?.title?.[0]?.plain_text || page.title || 'Untitled';
                    const charCount = page.charCount || 0;
                    const lastUpdated = (page as any).last_edited_time ? new Date((page as any).last_edited_time).toLocaleString() : 'N/A';
                    return (
                      <tr key={page.id} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2">{category}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <a href={page.url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {title}
                          </a>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{charCount}</td>
                        <td className="border border-gray-300 px-4 py-2">{lastUpdated}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No pages found.</p>
            )}
          </div>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => setShowDialog(true)}
          >
            Reconnect Notion
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[400px]">
          <Button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-2 bg-white border hover:bg-gray-50 text-gray-800 px-6 py-4 h-auto text-base"
          >
            <IconBrandNotion className="w-6 h-6" />
            Connect Notion
          </Button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-50 rounded-full p-2">
                  <IconBrandNotion className="w-6 h-6 text-yellow-600" />
                </div>
                <DialogTitle className="text-xl">Connect Notion</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hidden"
                onClick={() => setShowDialog(false)}
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="py-4">
            <h3 className="text-lg font-semibold mb-2">
              A Notion popup will now appear.
            </h3>
            <p className="text-lg font-semibold mb-6">
              Please don't unselect already selected pages.
            </p>
            <DialogDescription className="text-gray-600 space-y-4">
              <p>
                Please note that the pages you select will affect the Notion pages
                Chatsa has access to across all your chatbots, as well as any
                other Chatsa accounts connected to the same Notion account.
              </p>
              <p>
                If you have any previously selected pages for other active
                chatbots. Please leave them selected.
              </p>
            </DialogDescription>
          </div>

          <DialogFooter className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => {
                handleConnect();
                setShowDialog(false);
              }}
            >
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotionInput;
