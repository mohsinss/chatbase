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
  period: "Monthly" | "Yearly";
  features: PlanFeature[];
}

export function PlansSettings({ teamId }: { teamId: string }) {
  const [autoRecharge, setAutoRecharge] = useState(false);
  const [extraMessages, setExtraMessages] = useState(false);
  const [extraChatbots, setExtraChatbots] = useState(false);
  const [customDomains, setCustomDomains] = useState(false);
  const [removeBranding, setRemoveBranding] = useState(false);

  const plans: Plan[] = [
    {
      name: "Hobby",
      price: 19,
      period: "Monthly",
      features: [
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
      period: "Monthly",
      features: [
        { name: "Everything in Hobby, plus..." },
        { name: "10,000 message credits/month" },
        { name: "5 chatbots" },
        { name: "2 AI Actions/chatbot" },
        { name: "3 team members" }
      ]
    },
    {
      name: "Unlimited",
      price: 399,
      period: "Monthly",
      features: [
        { name: "Everything in Standard, plus..." },
        { name: "40,000 message credits/month included (Messages over the limit will use your OpenAI API Key)" },
        { name: "10 chatbots" },
        { name: "3 AI Actions/chatbot" },
        { name: "5 team members" },
        { name: "Remove &apos;Powered by Chatbase&apos;" },
        { name: "Advanced Analytics" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Pricing Plans */}
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="rounded-xl border p-6 space-y-6">
            <div>
              <h3 className="text-2xl">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-5xl font-medium">${plan.price}</span>
                <span className="text-gray-500 ml-2">Per Month</span>
              </div>
              {plan.name === "Hobby" && (
                <div className="mt-4 inline-flex rounded-lg border">
                  <button className="px-4 py-1 bg-white rounded-lg">Monthly</button>
                  <button className="px-4 py-1 text-gray-500">Yearly</button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-gray-500">
                {plan.features[0].name}
              </h4>
              {plan.features.slice(1).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5" />
                  <span>{feature.name}</span>
                  {feature.info && (
                    <button className="ml-1 w-4 h-4 rounded-full border text-xs">?</button>
                  )}
                </div>
              ))}
            </div>

            <button className={`w-full py-2 rounded-lg border ${
              plan.name === "Standard" ? "bg-black text-white" : ""
            }`}>
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