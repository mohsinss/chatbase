"use client";

import { IconBrandWhatsapp } from "@tabler/icons-react";
import { IconLoader, IconTrash } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";
import {
  useSocialReactions,
  SocialReactionsProps,
  SectionTitle,
  ToggleSwitch,
  ResponseTypeSelector,
  TextAreaField,
  NumberField
} from "./SocialReactionsBase";

interface WhatsAppReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
    id: string;
    name: string;
  };
}

const WhatsAppReactions = ({ chatbot }: WhatsAppReactionsProps) => {
  // Configuration for WhatsApp
  const config: SocialReactionsProps = {
    chatbot,
    platform: 'facebook', // Using facebook as the platform type since WhatsApp is owned by Meta
    apiBasePath: '/api/chatbot/integrations/whatsapp',
    integrationKey: 'whatsapp',
    primaryColor: 'bg-[#25D366]',
    headerBgClass: 'bg-[#25D366]',
    headerIcon: <IconBrandWhatsapp className="w-8 h-8 text-white" />,
    headerTitle: 'WhatsApp Reactions',
    headerDescription: 'Manage your WhatsApp chatbot reactions and settings.'
  };

  // Use the shared hook for social reactions
  const {
    isFetchingSettings,
    isSavingSettings,
    pages: whatsappNumbers,
    selectedPageId,
    settingsData,
    setSettingsData,
    saveSettings,
    handlePageChange
  } = useSocialReactions(config);

  return (
    <div className="flex flex-col h-full">
      {/* Fixed WhatsApp header */}
      <div className="sticky top-0 z-10">
        <div className={config.headerBgClass + " text-white p-6"}>
          <div className="flex items-center gap-3">
            {config.headerIcon}
            <div>
              <h1 className="text-2xl font-semibold">{config.headerTitle}</h1>
              <p className="mt-1 text-white/80">{config.headerDescription}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-6 bg-[#F0F2F5]">
          {isFetchingSettings ? (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <IconLoader className="animate-spin w-8 h-8 mx-auto" />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* WhatsApp Number Selector */}
              <div className="bg-white p-6 rounded-lg">
                <SectionTitle>Select WhatsApp Number</SectionTitle>
                <div className="space-y-4">
                  {whatsappNumbers.length === 0 ? (
                    <p className="text-gray-500">No WhatsApp numbers connected. Please connect a WhatsApp number first.</p>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                        <select
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                          value={selectedPageId}
                          onChange={handlePageChange}
                        >
                          {whatsappNumbers.map((number) => (
                            <option key={number._id} value={number._id}>
                              {number.display_phone_number}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={saveSettings}
                          disabled={isSavingSettings}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#25D366] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          {isSavingSettings ? (
                            <>
                              <Spinner className="w-4 h-4 mr-2" />
                              Saving...
                            </>
                          ) : (
                            "Save Settings"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {whatsappNumbers.length !== 0 && (
                <>
                  {/* Message Settings */}
                  <div className="bg-white p-6 rounded-lg">
                    <SectionTitle>Message Settings</SectionTitle>
                    <div className="space-y-4">
                      <TextAreaField
                        label="Prompt"
                        value={settingsData?.prompt}
                        onChange={(value) => setSettingsData({ ...settingsData, prompt: value })}
                        primaryColor={config.primaryColor}
                      />
                      <NumberField
                        label="Delay (seconds)"
                        value={settingsData?.delay}
                        onChange={(value) => setSettingsData({ ...settingsData, delay: value })}
                        primaryColor={config.primaryColor}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppReactions;
