"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconCopy } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

const EmbedSection = ({ chatbotId, domain }: { chatbotId: string, domain: string }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [embedType, setEmbedType] = useState<"without-identity" | "with-identity">("without-identity");

  useEffect(() => {
    fetchVisibilitySettings();
  }, [chatbotId]);

  const fetchVisibilitySettings = async () => {
    try {
      const response = await fetch(`/api/chatbot/visibility-settings?chatbotId=${chatbotId}`);
      const data = await response.json();

      if (data) {
        setIsPublic(data.isPublic);
      }
    } catch (error) {
      console.error("Failed to fetch visibility settings:", error);
    }
  };

  const handleVisibilityChange = async (newValue: boolean) => {
    setIsPublic(newValue);
    try {
      await fetch("/api/chatbot/visibility-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatbotId,
          isPublic: newValue
        }),
      });
    } catch (error) {
      console.error("Failed to update visibility settings:", error);
      // Optionally revert the UI state if the update fails
      setIsPublic(!newValue);
    }
  };

  const chatBubbleCode = `<script>
  window.embeddedChatbotConfig = {
    chatbotId: "${chatbotId}",
    domain: "${domain}",
    mobileConfig: {
      preventFocusLoss: true,
      handleKeyboard: true
    }
  }
</script>
<script src="https://${domain}/embed.min.js" defer></script>`;

  const iframeCode = `<iframe
  src="http://${domain}/chatbot/${chatbotId}"
  width="100%"
  style="height: 100%; max-height: 700px"
  frameborder="0"
></iframe>`;

  const identityEmbedCode = `<script>
  window.chatsaUserConfig = {
    user_id: "<USER_ID>",
    user_hash: "<USER_HASH>" // this is the hash of the user_id, should be generated on the server
  }
</script>

<script>
  window.embeddedChatbotConfig = {
    chatbotId: "${chatbotId}",
    domain: "${domain}"
  }
</script>
<script src="https://${domain}/embed.min.js" defer></script>`;

  const serverCode = `const crypto = require('crypto');

const secret = '••••••••'; // Your verification secret key
const userId = current_user.id // A string UUID to identify your user

const hash = crypto.createHmac('sha256', secret).update(userId).digest('hex');`;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto py-4 px-8">
      {/* Public Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Embed Settings</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Make Public</span>
          <Switch
            checked={isPublic}
            onChange={handleVisibilityChange}
            className={`${isPublic ? 'bg-primary' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${isPublic ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      <div className={`space-y-8 ${!isPublic && 'opacity-50 pointer-events-none'}`}>
        {/* Embed Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setEmbedType("without-identity")}
            className={`p-4 rounded-lg border-2 transition-all ${embedType === "without-identity"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${embedType === "without-identity"
                ? "border-primary bg-primary"
                : "border-gray-300"
                }`} />
              <div className="text-left">
                <h3 className="font-medium mb-1">Embed code without identity</h3>
                <p className="text-sm text-gray-600">
                  Embed your chatbot without linking it to a specific user.
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setEmbedType("with-identity")}
            className={`p-4 rounded-lg border-2 transition-all ${embedType === "with-identity"
              ? "border-primary bg-primary/5"
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${embedType === "with-identity"
                ? "border-primary bg-primary"
                : "border-gray-300"
                }`} />
              <div className="text-left">
                <h3 className="font-medium mb-1">Embed code with identity</h3>
                <p className="text-sm text-gray-600">
                  Secure embed code to authenticate logged in users.
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Code Sections */}
        {embedType === "without-identity" ? (
          <div className="space-y-6">
            {/* Chat Bubble Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Integration</h3>
              <p className="text-gray-600 mb-4">
                To add a chat bubble to the bottom right of your website add this script tag to your html
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{domain}</span>
                  <button
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    onClick={() => handleCopyCode(chatBubbleCode)}
                  >
                    <IconCopy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                  {chatBubbleCode}
                </pre>
              </div>
            </div>

            {/* Iframe Section */}
            <div>
              <p className="text-gray-600 mb-4">
                To add the chatbot any where on your website, add this iframe to your html code
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium"></span>
                  <button
                    className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    onClick={() => handleCopyCode(iframeCode)}
                  >
                    <IconCopy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                  {iframeCode}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Configuration Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-semibold">Configuration</h3>
                <IconInfoCircle className="w-5 h-5 text-gray-400" />
              </div>

              {/* On the Server Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">On the server</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Secret key</label>
                  <div className="relative">
                    <input
                      type="text"
                      value="••••••••9brj"
                      readOnly
                      className="w-full p-2 rounded-lg border bg-white text-gray-900"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => handleCopyCode("••••••••9brj")}
                    >
                      <IconCopy className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>You&apos;ll need to generate an HMAC on your server for each logged-in user and send it to Chatsa.</p>
                  <p>You&apos;ll need your secret key to add identity verification to your site or app.</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex gap-2 text-amber-800">
                    <IconInfoCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">
                      Keep your secret key safe! Never commit it directly to your repository,
                      client-side code, or anywhere a third party can find it.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium"></span>
                    <button
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      onClick={() => handleCopyCode(serverCode)}
                    >
                      <IconCopy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                  <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                    {serverCode}
                  </pre>
                </div>
              </div>

              {/* On the Site Section */}
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4">On the site</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium"></span>
                    <button
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                      onClick={() => handleCopyCode(identityEmbedCode)}
                    >
                      <IconCopy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                  <pre className="bg-white p-3 rounded border text-sm overflow-x-auto">
                    {identityEmbedCode}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EmbedSection; 