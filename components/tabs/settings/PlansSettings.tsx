"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";

interface PlanFeature {
  name: string;
  info?: string;
}

interface Plan {
  name: string;
  price: number;
  yearlyPrice: number;
  period: "Per Month" | "Per Year";
  features: PlanFeature[];
}

export function PlansSettings({ teamId }: { teamId: string }) {
  const [isYearly, setIsYearly] = useState(false);
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [extraMessages, setExtraMessages] = useState(false);
  const [extraChatbots, setExtraChatbots] = useState(false);
  const [customDomains, setCustomDomains] = useState(false);
  const [removeBranding, setRemoveBranding] = useState(false);

  const plans: Plan[] = [
    {
      name: "Hobby",
      price: 19,
      yearlyPrice: 190,
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        { name: "Everything in Free, plus..." },
        { name: "Access to advanced models", info: "?" },
        { name: "2,000 message credits/month" },
        { name: "2 chatbots" },
        { name: "1 AI Action/chatbot" },
        { name: "11,000,000 characters/chatbot" },
        { name: "Unlimited links to train on" },
        { name: "Integrations", info: "?" },
        { name: "Basic Analytics" }
      ]
    },
    {
      name: "Standard",
      price: 99,
      yearlyPrice: 990,
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        { name: "Everything in Hobby, plus..." },
        { name: "10,000 message credits/month" },
        { name: "5 chatbots" },
        // { name: "2 AI Actions/chatbot" },
        { name: "3 team members" }
      ]
    },
    {
      name: "Unlimited",
      price: 399,
      yearlyPrice: 3990,
      period: isYearly ? "Per Year" : "Per Month",
      features: [
        { name: "Everything in Standard, plus..." },
        { name: "40,000 message credits/month included (Messages over the limit will use your OpenAI API Key)" },
        { name: "10 chatbots" },
        // { name: "3 AI Actions/chatbot" },
        { name: "5 team members" },
        { name: "Remove &apos;Powered by Chatbase&apos;" },
        { name: "Advanced Analytics" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Pricing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={`text-sm ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            isYearly ? 'bg-indigo-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isYearly ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Yearly</span>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="bg-white rounded-lg border border-gray-200 p-8 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">
                ${isYearly ? plan.yearlyPrice : plan.price}
              </span>
              <span className="text-gray-500 ml-2">{plan.period}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-green-500 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{feature.name}</span>
                  {feature.info && (
                    <button className="ml-1 w-4 h-4 rounded-full border text-xs">?</button>
                  )}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 px-4 rounded-lg border border-gray-200 
                ${
                  plan.name === "Standard"
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                }
                transition-colors`}
            >
              Upgrade
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <div className="space-y-6">
        {/* Auto recharge credits */}
        <div className="rounded-xl border p-6">
          <h3 className="text-2xl">Auto recharge credits</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl">$9 per 1000 message credits</div>
                <p className="text-gray-500 mt-1">
                  When your credits falls below a certain threshold, we&apos;ll automatically add credits that don&apos;t expire to your account, ensuring uninterrupted service.
                </p>
              </div>
              <Switch 
                checked={autoRecharge}
                onCheckedChange={setAutoRecharge}
              />
            </div>
          </div>
        </div>

        {/* Extra message credits */}
        <div className="rounded-xl border p-6">
          <h3 className="text-2xl">Extra message credits</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-xl">$7 per 1000 messages / month</div>
              <Switch 
                checked={extraMessages}
                onCheckedChange={setExtraMessages}
              />
            </div>
          </div>
        </div>

        {/* Extra chatbots */}
        <div className="rounded-xl border p-6">
          <h3 className="text-2xl">Extra chatbots</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-xl">$7 per chatbot / month</div>
              <Switch 
                checked={extraChatbots}
                onCheckedChange={setExtraChatbots}
              />
            </div>
          </div>
        </div>

        {/* Custom Domains */}
        <div className="rounded-xl border p-6">
          <h3 className="text-2xl">Custom Domains</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl">$59 / month</div>
                <p className="text-gray-500 mt-1">
                  Use your own custom domains for the embed script, iframe, and chatbot link
                </p>
              </div>
              <Switch 
                checked={customDomains}
                onCheckedChange={setCustomDomains}
              />
            </div>
          </div>
        </div>

        {/* Remove Branding */}
        <div className="rounded-xl border p-6">
          <h3 className="text-2xl">Remove &apos;Powered By Chatbase&apos;</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl">$39 / month</div>
                <p className="text-gray-500 mt-1">
                  Remove the Chatbase branding from the iframe and widget
                </p>
              </div>
              <Switch 
                checked={removeBranding}
                onCheckedChange={setRemoveBranding}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 