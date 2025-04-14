"use client";

import { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { IconInfoCircle, IconBrandSpotify } from "@tabler/icons-react";
import Spinner from "@/components/Spinner";

interface ShopifyReactionsProps {
  chatbot: {
    integrations: {
      [key: string]: boolean;
    };
  };
}

const ShopifyReactions = ({ chatbot }: ShopifyReactionsProps) => {
  const [isFetchingSettings, setIsFetchingSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [settingsData, setSettingsData] = useState({
    prompt: "",
    delay: 0,
    productViewEnabled: false,
    productViewPrompt: "Interested in this product? I can help you with any questions!",
    productViewDelay: 0,
    cartAbandonmentEnabled: false,
    cartAbandonmentPrompt: "Your cart is waiting! Need help completing your purchase?",
    cartAbandonmentDelay: 0,
    orderStatusEnabled: false,
    orderStatusPrompt: "Your order status has been updated. How can I help you today?",
    orderStatusDelay: 0,
    customerSupportEnabled: false,
    customerSupportPrompt: "How can I assist you with your order today?",
    customerSupportDelay: 0,
    productSpecificEnabled: false,
    productSpecificSettings: []
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // TODO: Implement actual Shopify connection logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to Shopify:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-0 h-full">
      {/* Fixed Shopify header */}
      <div className="fixed top-[120px] left-[70px] md:left-48 right-0 z-10">
        <div className="bg-[#95BF47] text-white p-6">
          <div className="flex items-center gap-3">
            <IconBrandSpotify className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-2xl font-semibold">Shopify Reactions</h1>
              <p className="mt-1 text-white/80">Manage your Shopify chatbot reactions and settings.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable content with top padding for fixed header */}
      <div className="flex flex-col gap-6 p-6 bg-[#F7F9F9] mt-[120px]">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product View Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.productViewEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, productViewEnabled: enabled })}
                  className={`${settingsData.productViewEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.productViewEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Product Views</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.productViewEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.productViewPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, productViewPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.productViewDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, productViewDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Abandonment Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.cartAbandonmentEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, cartAbandonmentEnabled: enabled })}
                  className={`${settingsData.cartAbandonmentEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.cartAbandonmentEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Cart Abandonment</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.cartAbandonmentEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.cartAbandonmentPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, cartAbandonmentPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.cartAbandonmentDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, cartAbandonmentDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.orderStatusEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, orderStatusEnabled: enabled })}
                  className={`${settingsData.orderStatusEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.orderStatusEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Respond to Order Status Updates</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.orderStatusEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.orderStatusPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, orderStatusPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.orderStatusDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, orderStatusDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.customerSupportEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, customerSupportEnabled: enabled })}
                  className={`${settingsData.customerSupportEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.customerSupportEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Customer Support</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.customerSupportEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Response Template</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.customerSupportPrompt}
                  onChange={(e) => setSettingsData({ ...settingsData, customerSupportPrompt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Delay (seconds)</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  value={settingsData.customerSupportDelay}
                  onChange={(e) => setSettingsData({ ...settingsData, customerSupportDelay: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product-Specific Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Switch
                  checked={settingsData.productSpecificEnabled}
                  onChange={(enabled) => setSettingsData({ ...settingsData, productSpecificEnabled: enabled })}
                  className={`${settingsData.productSpecificEnabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span className={`${settingsData.productSpecificEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                </Switch>
                <span className="text-sm font-medium text-gray-700">Enable Product-Specific Settings</span>
              </div>
            </div>

            <div className={`space-y-4 ${!settingsData.productSpecificEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {(settingsData.productSpecificSettings || []).map((setting, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Product ID</label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Product ID"
                      value={setting.productId}
                      onChange={(e) => {
                        const newSettings = [...(settingsData.productSpecificSettings || [])];
                        newSettings[index].productId = e.target.value;
                        setSettingsData({ ...settingsData, productSpecificSettings: newSettings });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Prompt</label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Custom response for this product"
                      value={setting.prompt}
                      onChange={(e) => {
                        const newSettings = [...(settingsData.productSpecificSettings || [])];
                        newSettings[index].prompt = e.target.value;
                        setSettingsData({ ...settingsData, productSpecificSettings: newSettings });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Custom Delay (seconds)</label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                      value={setting.delay}
                      onChange={(e) => {
                        const newSettings = [...(settingsData.productSpecificSettings || [])];
                        newSettings[index].delay = Number(e.target.value);
                        setSettingsData({ ...settingsData, productSpecificSettings: newSettings });
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const newSettings = [...(settingsData.productSpecificSettings || [])];
                      newSettings.splice(index, 1);
                      setSettingsData({ ...settingsData, productSpecificSettings: newSettings });
                    }}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove Product Setting
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newSettings = [...(settingsData.productSpecificSettings || []), { productId: '', prompt: '', delay: 0 }];
                  setSettingsData({ ...settingsData, productSpecificSettings: newSettings });
                }}
                className="text-sm font-medium text-blue-500 hover:text-blue-700"
              >
                + Add Product Setting
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopifyReactions; 