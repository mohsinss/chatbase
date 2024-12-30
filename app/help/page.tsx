"use client";

import DashboardNav from "@/components/DashboardNav";
import Link from "next/link";

export default function HelpPage() {
  return (
    <>
      <DashboardNav teamId="" />
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Help Center</h1>

        {/* Contact Support Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any questions or issues you may have.
            </p>
            <Link 
              href="mailto:support@example.com"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Email Support
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">How do I create a new chatbot?</h3>
              <p className="text-gray-600">
                Navigate to your team dashboard and click on "Create new chatbot" button. Follow the setup wizard to configure your chatbot.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">How can I invite team members?</h3>
              <p className="text-gray-600">
                Go to team settings and use the "Invite Members" feature to send invitations via email.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">What data sources can I use?</h3>
              <p className="text-gray-600">
                We support various data sources including documents, websites, APIs, and databases.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/docs" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Documentation</h3>
                <p className="text-gray-600">
                  Detailed guides and API documentation
                </p>
              </div>
            </Link>
            <Link href="/changelog" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2">Changelog</h3>
                <p className="text-gray-600">
                  Latest updates and feature releases
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 