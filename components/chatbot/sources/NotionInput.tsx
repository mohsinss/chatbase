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
  onConnect: () => void;
}

const NotionInput = ({ onConnect }: NotionInputProps) => {
  const [showDialog, setShowDialog] = useState(false);

  const handleConnect = () => {
    setShowDialog(true);
    // Add your Notion OAuth flow here
  };

  return (
    <div className="w-full min-h-[600px]">
      <h2 className="text-2xl font-semibold mb-8">Notion</h2>

      <div className="flex justify-center items-center h-[400px]">
        <Button
          onClick={handleConnect}
          className="flex items-center gap-2 bg-white border hover:bg-gray-50 text-gray-800 px-6 py-4 h-auto text-base"
        >
          <IconBrandNotion className="w-6 h-6" />
          Connect Notion
        </Button>
      </div>

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
                className="h-8 w-8"
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
              Please don&apos;t unselect already selected pages.
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
                onConnect();
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