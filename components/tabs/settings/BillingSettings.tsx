"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

interface BillingSettingsProps {
  teamId: string;
  team?: any;
}

interface BillingDetails {
  organizationName: string;
  country: string;
  addressLine1: string;
  billingEmail: string;
  taxType: string;
  taxId: string;
}

export function BillingSettings({ teamId, team }: BillingSettingsProps) {
  console.log("team", team)
  const router = useRouter();
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    organizationName: team?.name || "",
    country: team?.billingInfo?.address?.country || "United States",
    addressLine1: team?.billingInfo?.address?.line1 || "",
    billingEmail: team?.billingInfo?.email || "maljoaithen@gmail.com",
    taxType: "None",
    taxId: "N/A"
  });

  return (
    <div className="space-y-8">
      {/* Subscription Details */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Subscription Details</h2>
        <div className="flex items-center gap-2 mb-6">
          <span>You are on the</span>
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">APPSUMO_TIER2</span>
          <span>plan for $159</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>5,000 message credits/month (Messages over the limit will use your OpenAI API Key)</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>40 chatbots</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>6,000,000 characters/chatbot</span>
          </div>
          {/* <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>2 AI Actions/chatbot</span>
          </div> */}
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>Unlimited links to train on</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>API access</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>Integrations</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>Embed on unlimited websites</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>View chat history</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>Remove &apos;Powered by Chatbase&apos;</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>Option to choose GPT-4 and GPT-4-Turbo</span>
          </div>
        </div>

        <button 
          onClick={() => router.push(`/dashboard/${teamId}/settings/plans`)}
          className="mt-6 px-6 py-2 bg-black text-white rounded-lg"
        >
          Manage Subscriptions
        </button>
      </div>

      {/* Usage */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Usage</h2>
        <div className="space-y-2">
          <div>Credits consumed: <span className="font-medium">119</span></div>
          <div>Subscription limit: <span className="font-medium">5000</span></div>
          <p className="text-gray-600">
            Your credits renew at the start of every calendar month but your extra credits will remain as it is.
          </p>
          <div>Next renewal: <span className="font-medium">January 1st</span></div>
        </div>
      </div>

      {/* Billing Details */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Billing Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Organisation name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={billingDetails.organizationName}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, organizationName: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Country or region</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={billingDetails.country}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, country: e.target.value }))}
            >
              <option>United States</option>
              {/* Add other countries */}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Address line 1</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={billingDetails.addressLine1}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, addressLine1: e.target.value }))}
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Billing Email */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Billing Email</h2>
        <p className="text-gray-600 mb-4">
          By default, all invoices will be sent to the email address of the team&apos;s creator. If you prefer to use a different email address for receiving invoices, please enter it here.
        </p>
        <input
          type="email"
          className="w-full p-2 border rounded-lg mb-4"
          value={billingDetails.billingEmail}
          onChange={(e) => setBillingDetails(prev => ({ ...prev, billingEmail: e.target.value }))}
        />
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-gray-800 text-white rounded-lg">
            Save
          </button>
        </div>
      </div>

      {/* Tax ID */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Tax ID</h2>
        <p className="text-gray-600 mb-4">
          If you want your upcoming invoices to display a specific tax ID, please enter it here.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Tax type</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={billingDetails.taxType}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, taxType: e.target.value }))}
            >
              <option>None</option>
              {/* Add other tax types */}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">ID</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg bg-gray-50"
              value={billingDetails.taxId}
              disabled
            />
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Billing Method */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Billing Method</h2>
        <div className="border-b pb-4">
          <div className="grid grid-cols-3 text-gray-600">
            <div>Brand</div>
            <div>Number (Last 4)</div>
            <div>Exp. Date</div>
          </div>
        </div>
        <div className="py-8 text-center text-gray-600">
          No results.
        </div>
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-gray-800 text-white rounded-lg">
            Add
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Billing History</h2>
        <div className="border-b pb-4">
          <div className="grid grid-cols-4 text-gray-600">
            <div>Invoice Number</div>
            <div>Date</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
        </div>
        <div className="py-8 text-center text-gray-600">
          No results.
        </div>
      </div>
    </div>
  );
} 