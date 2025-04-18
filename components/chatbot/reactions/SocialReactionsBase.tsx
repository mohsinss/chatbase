"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Switch } from "@headlessui/react";
import { IconLoader, IconTrash } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

export interface SocialPage {
  _id: string;
  pageId: string;
  name: string;
  display_phone_number?: string;
  access_token: string;
}

export interface SocialReactionsSettings {
  prompt?: string;
  delay?: number;
  prompt1?: string;
  delay1?: number;
  commentDmEnabled?: boolean;
  welcomeDmEnabled?: boolean;
  welcomeDmResponseType?: "template" | "prompt";
  welcomeDmPrompt?: string;
  welcomeDmTemplate?: string;
  welcomeDmDelay?: number;
  replyDmEnabled?: boolean;
  replyDmResponseType?: "template" | "prompt";
  replyDmPrompt?: string;
  replyDmTemplate?: string;
  replyDmDelay?: number;
  keywordDmEnabled?: boolean;
  keywordTriggers?: Array<{ 
    keyword: string; 
    responseType?: "template" | "prompt";
    prompt?: string; 
    template?: string;
    delay?: number 
  }>;
  likeDmEnabled?: boolean;
  likeDmPrompt?: string;
  likeDmDelay?: number;
  likeDmFirstOnly?: boolean;
  likeDmSpecificPosts?: Array<{ postUrl: string; prompt?: string; delay?: number }>;
}

export interface SocialReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
  platform: 'facebook' | 'instagram';
  apiBasePath: string;
  integrationKey: string;
  primaryColor: string;
  secondaryColor?: string;
  headerBgClass: string;
  headerIcon: React.ReactNode;
  headerTitle: string;
  headerDescription: string;
}

export const useSocialReactions = (props: SocialReactionsProps) => {
  const { chatbot, platform, apiBasePath, integrationKey } = props;
  
  const [isFetchingSettings, setIsFetchingSettings] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [pages, setPages] = useState<SocialPage[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [settingsData, setSettingsData] = useState<SocialReactionsSettings | null>(null);

  // Set connection status based on chatbot integrations
  useEffect(() => {
    setIsConnected(!!chatbot?.integrations?.[integrationKey]);
  }, [chatbot, integrationKey]);

  // Fetch pages
  const fetchPages = useCallback(async (chatbotId: string) => {
    setIsFetchingSettings(true);
    try {
      const response = await fetch(`${apiBasePath}?chatbotId=${chatbotId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${platform} pages`);
      }

      const pages = await response.json();
      setPages(pages);
      
      // If there are pages, select the first one by default
      if (pages.length > 0) {
        setSelectedPageId(pages[0]._id);
        await fetchSettings(pages[0]._id);
      } else {
        setIsFetchingSettings(false);
      }
    } catch (error) {
      console.error(`Error fetching ${platform} pages:`, error);
      toast.error(`Failed to fetch ${platform} pages.`);
      setIsFetchingSettings(false);
    }
  }, [apiBasePath, platform]);

  // Fetch settings for a specific page
  const fetchSettings = useCallback(async (pageId: string) => {
    setIsFetchingSettings(true);
    try {
      const response = await fetch(`${apiBasePath}/settings?_id=${pageId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettingsData(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to fetch settings.");
    }
    setIsFetchingSettings(false);
  }, [apiBasePath]);

  // Save settings
  const saveSettings = useCallback(async () => {
    if (!selectedPageId) {
      toast.error(`No ${platform} page selected`);
      return;
    }
    
    setIsSavingSettings(true);
    try {
      const response = await fetch(`${apiBasePath}/settings?_id=${selectedPageId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save settings");
      }

      toast.success("Settings saved successfully!");
    } catch (error: any) {
      console.error(error.message);
      toast.error(error.message);
    }
    setIsSavingSettings(false);
  }, [apiBasePath, platform, selectedPageId, settingsData]);

  // Handle page change
  const handlePageChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pageId = e.target.value;
    setSelectedPageId(pageId);
    await fetchSettings(pageId);
  }, [fetchSettings]);

  // Handle connect
  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
    } finally {
      setIsConnecting(false);
    }
  }, [platform]);

  // Initialize
  useEffect(() => {
    fetchPages(chatbot.id);
  }, [chatbot.id, fetchPages]);

  return {
    isFetchingSettings,
    isConnected,
    isConnecting,
    isSavingSettings,
    pages,
    selectedPageId,
    settingsData,
    setSettingsData,
    saveSettings,
    handlePageChange,
    handleConnect
  };
};

// Utility components
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-semibold text-gray-900 mb-4">{children}</h3>
);

export const ToggleSwitch = ({ 
  checked, 
  onChange, 
  primaryColor,
  disabled = false
}: { 
  checked?: boolean; 
  onChange: (checked: boolean) => void; 
  primaryColor: string;
  disabled?: boolean;
}) => (
  <Switch
    checked={checked || false}
    onChange={onChange}
    className={`${checked ? primaryColor : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    disabled={disabled}
  >
    <span className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
  </Switch>
);

export const ResponseTypeSelector = ({
  responseType,
  onChange,
  disabled,
  primaryColor
}: {
  responseType?: string;
  onChange: (type: "template" | "prompt") => void;
  disabled: boolean;
  primaryColor: string;
}) => (
  <div className="mb-3">
    <label className={`block text-sm font-medium mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>Response Type</label>
    <div className="flex gap-4">
      <label className="flex items-center">
        <input
          type="radio"
          className={`form-radio h-4 w-4 ${primaryColor.includes('purple') ? 'text-purple-600' : 'text-blue-600'}`}
          checked={responseType !== "template"}
          onChange={() => onChange("prompt")}
          disabled={disabled}
        />
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>AI Prompt</span>
      </label>
      <label className="flex items-center">
        <input
          type="radio"
          className={`form-radio h-4 w-4 ${primaryColor.includes('purple') ? 'text-purple-600' : 'text-blue-600'}`}
          checked={responseType === "template"}
          onChange={() => onChange("template")}
          disabled={disabled}
        />
        <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>Template Response</span>
      </label>
    </div>
  </div>
);

export const TextAreaField = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = "",
  primaryColor
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  primaryColor: string;
}) => (
  <div>
    <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>
    <textarea
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-${primaryColor.includes('purple') ? 'purple' : 'blue'}-500 focus:border-${primaryColor.includes('purple') ? 'purple' : 'blue'}-500 ${disabled ? 'bg-gray-50' : ''}`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

export const NumberField = ({
  label,
  value,
  onChange,
  disabled = false,
  primaryColor
}: {
  label: string;
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  primaryColor: string;
}) => (
  <div>
    <label className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</label>
    <input
      type="number"
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-${primaryColor.includes('purple') ? 'purple' : 'blue'}-500 focus:border-${primaryColor.includes('purple') ? 'purple' : 'blue'}-500 ${disabled ? 'bg-gray-50' : ''}`}
      value={value || 0}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    />
  </div>
);
