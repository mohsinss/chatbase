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

interface NotionInputProps {
  connected?: boolean;
  pages?: {
    id: string;
    title?: string;
    content?: string;
    charCount?: number;
    url?: string;
    properties?: any;
  }[];
  onConnect: (code: string) => void;
}

const NotionInput = ({ connected = false, pages = [], onConnect }: NotionInputProps) => {
  const [showDialog, setShowDialog] = useState(false);

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

    // Listen for message from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'notion-auth-callback') {
        const { code, error } = event.data;
        if (code) {
          // Handle successful auth with code
          onConnect(code);
        } else if (error) {
          alert(`Notion authentication failed: ${error}`);
        }
        popup.close();
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  return (
    <div className="w-full min-h-[600px]">
      <h2 className="text-2xl font-semibold mb-8">Notion</h2>

      {connected ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Connected Notion Pages</h3>
          <div className="overflow-auto max-h-96 mb-4">
            {pages.length > 0 ? (
              <table className="min-w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Char Count</th>
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => {
                    const category = page.properties?.Category?.multi_select?.map((cat: any) => cat.name).join(', ') || 'Uncategorized';
                    const title = page.properties?.['Doc name']?.title?.[0]?.plain_text || page.title || 'Untitled';
                    const charCount = page.charCount || 0;
                    return (
                      <tr key={page.id} className="border border-gray-300">
                        <td className="border border-gray-300 px-4 py-2">{category}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <a href={page.url ?? '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {title}
                          </a>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{charCount}</td>
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
            onClick={handleConnect}
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
