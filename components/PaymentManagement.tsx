"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { formatDate, formatCurrency } from "@/libs/utils-payment";

interface PaymentManagementProps {
  teamId: string;
}

interface PaymentHistoryData {
  team: {
    id: string;
    name: string;
    plan: string;
    customerId: string;
    dueDate: string;
    nextRenewalDate: string;
    credits: number;
    billingInfo: {
      email: string;
      address: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
      };
      paymentMethod: Array<{
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
      }>;
    };
  };
  subscription: {
    id: string;
    status: string;
    plan: string;
    isYearly: boolean;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    startDate: string;
  } | null;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: string;
    dueDate: string;
    paidAt?: string;
    description: string;
    periodStart: string;
    periodEnd: string;
    plan?: string;
    lineItems: Array<{
      description: string;
      amount: number;
      quantity: number;
    }>;
    subtotal: number;
    tax?: number;
    discount?: number;
    total: number;
    pdf?: string;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: {
      type: string;
      brand?: string;
      last4?: string;
      exp_month?: number;
      exp_year?: number;
    };
    refundedAmount?: number;
    refundReason?: string;
    createdAt: string;
  }>;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({ teamId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PaymentHistoryData | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== 'undefined') {
      const fetchPaymentHistory = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/payments/history?teamId=${teamId}`, {
            // Add cache: 'no-store' to prevent static generation issues
            cache: 'no-store',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (!response.ok) {
            // Handle non-2xx responses
            if (response.status === 401) {
              toast.error("Please login to access your chatbot settings");
              return;
            } else if (response.status === 403) {
              toast.error("Please upgrade your plan to access this chatbot feature");
              throw new Error("Unauthorized");
            }
            
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching payment history:", err);
          setError("Failed to load payment history. Please try again later.");
          toast.error("Something went wrong with your chatbot request");
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentHistory();
    }
  }, [teamId]);

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll still have access until the end of your billing period.")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          action: "cancel",
        }),
        // Add cache: 'no-store' to prevent static generation issues
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh data
      const historyResponse = await fetch(`/api/payments/history?teamId=${teamId}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!historyResponse.ok) {
        throw new Error(`HTTP error! status: ${historyResponse.status}`);
      }
      
      const data = await historyResponse.json();
      setData(data);
      
      alert("Your subscription has been canceled and will end at the end of the current billing period.");
    } catch (err) {
      console.error("Error canceling subscription:", err);
      alert("Failed to cancel subscription. Please try again later.");
      toast.error("Something went wrong with your request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setActionLoading(true);
      const response = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          action: "reactivate",
        }),
        // Add cache: 'no-store' to prevent static generation issues
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Refresh data
      const historyResponse = await fetch(`/api/payments/history?teamId=${teamId}`, {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!historyResponse.ok) {
        throw new Error(`HTTP error! status: ${historyResponse.status}`);
      }
      
      const data = await historyResponse.json();
      setData(data);
      
      alert("Your subscription has been reactivated successfully.");
    } catch (err) {
      console.error("Error reactivating subscription:", err);
      alert("Failed to reactivate subscription. Please try again later.");
      toast.error("Something went wrong with your request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      setActionLoading(true);
      const response = await fetch("/api/payments/customer-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teamId,
          returnUrl: window.location.href,
        }),
        // Add cache: 'no-store' to prevent static generation issues
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (err) {
      console.error("Error accessing customer portal:", err);
      alert("Failed to access customer portal. Please try again later.");
      toast.error("Something went wrong with your request");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>No payment data available.</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Subscription Information */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Subscription Details</h2>
          
          {data.subscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm opacity-70">Plan</p>
                  <p className="font-semibold">{data.subscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Status</p>
                  <p className="font-semibold capitalize">
                    {data.subscription.status}
                    {data.subscription.cancelAtPeriodEnd && " (Cancels at period end)"}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Billing Cycle</p>
                  <p className="font-semibold">{data.subscription.isYearly ? "Yearly" : "Monthly"}</p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Current Period Ends</p>
                  <p className="font-semibold">{formatDate(new Date(data.subscription.currentPeriodEnd))}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-4">
                {data.subscription.cancelAtPeriodEnd ? (
                  <button 
                    className="btn btn-primary" 
                    onClick={handleReactivateSubscription}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                    Reactivate Subscription
                  </button>
                ) : (
                  <button 
                    className="btn btn-outline btn-error" 
                    onClick={handleCancelSubscription}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                    Cancel Subscription
                  </button>
                )}
                
                <button 
                  className="btn btn-outline" 
                  onClick={handleUpdatePaymentMethod}
                  disabled={actionLoading}
                >
                  {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                  Update Payment Method
                </button>
              </div>
            </div>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>No active subscription found.</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Payment Method</h2>
          
          {data.team.billingInfo?.paymentMethod && data.team.billingInfo.paymentMethod.length > 0 ? (
            <div className="space-y-4">
              {data.team.billingInfo.paymentMethod.map((method, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="bg-base-200 p-3 rounded-lg">
                    {method.brand === 'visa' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                    )}
                    {method.brand === 'mastercard' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><circle cx="9" cy="12" r="3"/><circle cx="15" cy="12" r="3"/></svg>
                    )}
                    {method.brand !== 'visa' && method.brand !== 'mastercard' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold capitalize">{method.brand} •••• {method.last4}</p>
                    <p className="text-sm opacity-70">Expires {method.exp_month}/{method.exp_year}</p>
                  </div>
                </div>
              ))}
              
              <button 
                className="btn btn-outline btn-sm mt-4" 
                onClick={handleUpdatePaymentMethod}
                disabled={actionLoading}
              >
                {actionLoading ? <span className="loading loading-spinner loading-xs"></span> : null}
                Update Payment Method
              </button>
            </div>
          ) : (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <span>No payment method on file.</span>
              <button 
                className="btn btn-sm" 
                onClick={handleUpdatePaymentMethod}
                disabled={actionLoading}
              >
                Add Payment Method
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Invoices */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Invoice History</h2>
          
          {data.invoices && data.invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{formatDate(new Date(invoice.createdAt))}</td>
                      <td>{formatCurrency(invoice.total, invoice.currency)}</td>
                      <td>
                        <span className={`badge ${
                          invoice.status === 'paid' ? 'badge-success' : 
                          invoice.status === 'open' ? 'badge-warning' : 
                          invoice.status === 'uncollectible' ? 'badge-error' : 
                          'badge-ghost'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td>
                        {invoice.pdf && (
                          <a 
                            href={invoice.pdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-ghost btn-xs"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                            PDF
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>No invoices found.</span>
            </div>
          )}
        </div>
      </div>

      {/* Payments */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Payment History</h2>
          
          {data.payments && data.payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{formatDate(new Date(payment.createdAt))}</td>
                      <td>{formatCurrency(payment.amount, payment.currency)}</td>
                      <td>
                        {payment.paymentMethod.brand && payment.paymentMethod.last4 ? (
                          <span className="capitalize">{payment.paymentMethod.brand} •••• {payment.paymentMethod.last4}</span>
                        ) : (
                          <span className="capitalize">{payment.paymentMethod.type || 'Unknown'}</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${
                          payment.status === 'succeeded' ? 'badge-success' : 
                          payment.status === 'pending' ? 'badge-warning' : 
                          payment.status === 'failed' ? 'badge-error' : 
                          payment.status === 'refunded' ? 'badge-info' : 
                          'badge-ghost'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>No payments found.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
