"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, CreditCard, Calendar, AlertCircle } from "lucide-react";
import config from "@/config";

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

interface TeamData {
  name: string;
  plan: string;
  credits: number;
  dueDate: string;
  nextRenewalDate: string;
  billingInfo: {
    email: string;
    address: {
      line1: string;
      country: string;
    };
    paymentMethod: Array<{
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    }>;
    paymentFailed?: boolean;
    lastPaymentFailure?: string;
  };
}

export function BillingSettings({ teamId, team }: BillingSettingsProps) {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    organizationName: team?.name || "",
    country: team?.billingInfo?.address?.country || "United States",
    addressLine1: team?.billingInfo?.address?.line1 || "",
    billingEmail: team?.billingInfo?.email || "",
    taxType: "None",
    taxId: "N/A"
  });

  useEffect(() => {
    if (team) {
      // If team data is passed as prop, use it
      setTeamData({
        name: team.name || "",
        plan: team.plan || "Free",
        credits: team.credits || 0,
        dueDate: team.dueDate || "",
        nextRenewalDate: team.nextRenewalDate || "",
        billingInfo: team.billingInfo || {
          email: "",
          address: { line1: "", country: "" },
          paymentMethod: []
        }
      });
      setLoading(false);
    } else {
      // Otherwise fetch team data
      fetchTeamData();
    }
  }, [teamId, team]);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/team/${teamId}`);
      if (!response.ok) throw new Error("Failed to fetch team data");

      const data = await response.json();
      setTeamData(data);

      // Update billing details from fetched data
      setBillingDetails({
        organizationName: data.name || "",
        country: data.billingInfo?.address?.country || "United States",
        addressLine1: data.billingInfo?.address?.line1 || "",
        billingEmail: data.billingInfo?.email || "",
        taxType: "None",
        taxId: "N/A"
      });
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get plan details from config
  const getPlanDetails = (planName: string) => {
    const plans = config.stripe.plans;
    // Check if the plan exists in the config, otherwise return the Free plan
    return plans[planName as keyof typeof plans] || plans.Free;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days remaining until renewal
  const getDaysRemaining = (dateString: string) => {
    if (!dateString) return 0;
    const renewalDate = new Date(dateString);
    const today = new Date();
    const diffTime = renewalDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const planDetails = teamData ? getPlanDetails(teamData.plan) : getPlanDetails("Free");
  const daysRemaining = teamData?.nextRenewalDate ? getDaysRemaining(teamData.nextRenewalDate) : 0;

  return (
    <div className="space-y-8">
      {/* Subscription Details */}
      <div className="rounded-xl border p-6">
        <h2 className="text-2xl mb-4">Subscription Details</h2>
        <div className="flex items-center gap-2 mb-6">
          <span>You are on the</span>
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
            {teamData?.plan || "Free"}
          </span>
          <span>plan {planDetails.price ? `for $${planDetails.price}` : ""}</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>{planDetails.credits.toLocaleString()} message credits/month (Messages over the limit will use your OpenAI API Key)</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5 text-green-500" />
            <span>{planDetails.chatbotLimit} chatbots</span>
          </div>
          {planDetails.charactersLimit > 0 && (
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 text-green-500" />
              <span>{planDetails.charactersLimit.toLocaleString()} characters/chatbot</span>
            </div>
          )}
          {planDetails.linksLimit === 0 ? (
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 text-green-500" />
              <span>Unlimited links to train on</span>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 mt-0.5 text-green-500" />
              <span>{planDetails.linksLimit} links to train on</span>
            </div>
          )}
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
          {teamData?.plan !== "Free" && (
            <>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 text-green-500" />
                <span>Remove &apos;Powered by Chatbase&apos;</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 mt-0.5 text-green-500" />
                <span>Option to choose GPT-4 and GPT-4-Turbo</span>
              </div>
            </>
          )}
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>Credits consumed:</div>
            <div className="font-medium">{teamData?.credits || 0}</div>
          </div>

          <div className="flex justify-between items-center">
            <div>Subscription limit:</div>
            <div className="font-medium">{planDetails.credits.toLocaleString()}</div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${(teamData?.credits || 0) > planDetails.credits
                  ? "bg-red-500"
                  : (teamData?.credits || 0) > planDetails.credits * 0.8
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
              style={{ width: `${Math.min(((teamData?.credits || 0) / planDetails.credits) * 100, 100)}%` }}
            ></div>
          </div>

          <p className="text-gray-600">
            Your credits renew at the start of every calendar month but your extra credits will remain as they are.
          </p>

          <div className="flex items-center gap-2 mt-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              Next renewal: <span className="font-medium">{teamData?.nextRenewalDate ? formatDate(teamData.nextRenewalDate) : "N/A"}</span>
              {daysRemaining > 0 && <span className="ml-2 text-sm text-gray-500">({daysRemaining} days remaining)</span>}
            </div>
          </div>

          {(teamData?.credits || 0) > planDetails.credits && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 rounded-md">
              <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Credit limit exceeded</p>
                <p className="text-red-600 text-sm">
                  You have exceeded your plan's credit limit. Messages will now use your OpenAI API Key.
                </p>
              </div>
            </div>
          )}

          {teamData?.billingInfo?.paymentFailed && (
            <div className="flex items-start gap-2 mt-2 p-3 bg-red-50 rounded-md">
              <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-medium">Payment Failed</p>
                <p className="text-red-600 text-sm">
                  Your last payment attempt failed. Please update your payment method to avoid service interruption.
                  {teamData?.billingInfo?.lastPaymentFailure && (
                    <span className="block mt-1">
                      Failed on: {formatDate(teamData.billingInfo.lastPaymentFailure)}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => router.push(`/dashboard/${teamId}/settings/billing/add-payment-method`)}
                  className="mt-2 px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Update Payment Method
                </button>
              </div>
            </div>
          )}
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
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="China">China</option>
              <option value="India">India</option>
              <option value="Brazil">Brazil</option>
              {/* Add other countries as needed */}
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
            <button
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={async () => {
                try {
                  const response = await fetch(`/api/team/update`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      teamId,
                      billingInfo: {
                        ...teamData?.billingInfo,
                        address: {
                          ...teamData?.billingInfo?.address,
                          line1: billingDetails.addressLine1,
                          country: billingDetails.country
                        }
                      },
                      name: billingDetails.organizationName
                    }),
                  });

                  if (response.ok) {
                    alert('Billing details saved successfully');
                    fetchTeamData();
                  } else {
                    alert('Failed to save billing details');
                  }
                } catch (error) {
                  console.error('Error saving billing details:', error);
                  alert('An error occurred while saving billing details');
                }
              }}
            >
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
          <button
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            onClick={async () => {
              try {
                const response = await fetch(`/api/team/update`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    teamId,
                    billingInfo: {
                      ...teamData?.billingInfo,
                      email: billingDetails.billingEmail
                    }
                  }),
                });

                if (response.ok) {
                  alert('Billing email saved successfully');
                  fetchTeamData();
                } else {
                  alert('Failed to save billing email');
                }
              } catch (error) {
                console.error('Error saving billing email:', error);
                alert('An error occurred while saving billing email');
              }
            }}
          >
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
              <option value="None">None</option>
              <option value="VAT">VAT</option>
              <option value="GST">GST</option>
              <option value="ABN">ABN</option>
              <option value="EIN">EIN</option>
              <option value="TIN">TIN</option>
              <option value="ITIN">ITIN</option>
              <option value="SSN">SSN</option>
              <option value="EORI">EORI</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">ID</label>
            <input
              type="text"
              className={`w-full p-2 border rounded-lg ${billingDetails.taxType === 'None' ? 'bg-gray-50' : 'bg-white'}`}
              value={billingDetails.taxId}
              onChange={(e) => setBillingDetails(prev => ({ ...prev, taxId: e.target.value }))}
              disabled={billingDetails.taxType === 'None'}
              placeholder={billingDetails.taxType !== 'None' ? `Enter your ${billingDetails.taxType} number` : ''}
            />
          </div>

          <div className="flex justify-end">
            <button
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={async () => {
                if (billingDetails.taxType === 'None') return;

                try {
                  const response = await fetch(`/api/team/update`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      teamId,
                      billingInfo: {
                        ...teamData?.billingInfo,
                        taxType: billingDetails.taxType,
                        taxId: billingDetails.taxId
                      }
                    }),
                  });

                  if (response.ok) {
                    alert('Tax information saved successfully');
                    fetchTeamData();
                  } else {
                    alert('Failed to save tax information');
                  }
                } catch (error) {
                  console.error('Error saving tax information:', error);
                  alert('An error occurred while saving tax information');
                }
              }}
              disabled={billingDetails.taxType === 'None'}
            >
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

        {teamData?.billingInfo?.paymentMethod && teamData.billingInfo.paymentMethod.length > 0 ? (
          <div className="divide-y">
            {teamData.billingInfo.paymentMethod.map((method, index) => (
              <div key={index} className="grid grid-cols-3 py-4">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="capitalize">{method.brand}</span>
                </div>
                <div>•••• {method.last4}</div>
                <div>{method.exp_month}/{method.exp_year}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-600">
            No payment methods found.
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => router.push(`/dashboard/${teamId}/settings/billing/add-payment-method`)}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Add Payment Method
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
