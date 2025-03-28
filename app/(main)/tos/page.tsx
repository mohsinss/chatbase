import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ChatSa',
  description: 'Read about the terms and conditions for using ChatSa services.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to ChatSa. By accessing or using our AI chatbot platform and related services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.
              </p>
              <div className="bg-indigo-50 rounded-lg p-6">
                <p className="text-indigo-700">
                  Please read these Terms carefully as they contain important information about your legal rights, remedies, and obligations.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Service Description</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">2.1 Platform Overview</h3>
                  <p className="text-gray-600">
                    ChatSa is an AI chatbot platform that allows businesses to create custom chatbots trained on their knowledge base. Our platform helps you build conversational AI that understands your specific business context.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2.2 Service Features</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Custom AI chatbot creation and training</li>
                    <li>Knowledge base management</li>
                    <li>Analytics and reporting</li>
                    <li>Integration capabilities</li>
                    <li>Customer support tools</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Terms</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">3.1 Account Creation</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>You must be at least 18 years old to create an account</li>
                    <li>You must provide accurate and complete information</li>
                    <li>You are responsible for maintaining account security</li>
                    <li>One person or entity may not maintain multiple free accounts</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3.2 Account Security</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Use strong passwords</li>
                    <li>Keep credentials confidential</li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Report unauthorized access immediately</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription and Payments</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">4.1 Pricing</h3>
                  <p className="text-gray-600">
                    Our pricing is based on subscription tiers with different features and usage limits. Current pricing is available on our website and may be updated from time to time.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">4.2 Payment Terms</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Payments are processed securely through our payment providers</li>
                    <li>Subscriptions are billed in advance on a recurring basis</li>
                    <li>You are responsible for all applicable taxes</li>
                    <li>Failed payments may result in service interruption</li>
                  </ul>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <p className="text-indigo-700 font-medium">
                    We offer a full refund within 7 days of purchase if you're not satisfied with our service. No questions asked.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">5.1 Our Rights</h3>
                  <p className="text-gray-600">
                    ChatSa retains all rights to the platform, including its technology, design, and features. Our trademarks, logos, and service marks are our exclusive property.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">5.2 Your Rights</h3>
                  <p className="text-gray-600">
                    You retain ownership of your content and data. By using our service, you grant us a license to use your content solely for providing and improving our services.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Acceptable Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">6.1 Prohibited Activities</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Use the service for any illegal purposes</li>
                    <li>Upload malicious content or malware</li>
                    <li>Attempt to reverse engineer the platform</li>
                    <li>Share your account credentials</li>
                    <li>Violate any intellectual property rights</li>
                    <li>Upload harmful or discriminatory content</li>
                    <li>Interfere with the service's operation</li>
                    <li>Circumvent any service limitations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">6.2 Content Guidelines</h3>
                  <p className="text-gray-600">Your chatbot content must:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Be accurate and up-to-date</li>
                    <li>Respect intellectual property rights</li>
                    <li>Not contain offensive or harmful material</li>
                    <li>Comply with applicable laws and regulations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data and Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">7.1 Data Collection</h3>
                  <p className="text-gray-600">
                    We collect and process data as described in our{' '}
                    <a href="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">7.2 Data Security</h3>
                  <p className="text-gray-600">
                    We implement industry-standard security measures to protect your data. You are responsible for maintaining the security of your account credentials.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Modifications and Termination</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">8.1 Service Changes</h3>
                  <p className="text-gray-600">
                    We reserve the right to modify, suspend, or discontinue any part of our service at any time. We will notify you of significant changes that may affect your use of the service.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">8.2 Account Termination</h3>
                  <p className="text-gray-600">
                    We may terminate or suspend your access to the service at any time for violations of these Terms or for any other reason we deem appropriate.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  To the fullest extent permitted by law, ChatSa shall not be liable for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits or revenues</li>
                  <li>Loss of data or system damage</li>
                  <li>Service interruptions or failures</li>
                  <li>Actions of third parties</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Dispute Resolution</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Any disputes arising from these Terms will be resolved through:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Initial informal negotiation</li>
                  <li>Mediation if negotiation fails</li>
                  <li>Binding arbitration as a last resort</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600">
                  These Terms are governed by the laws of Saudi Arabia, without regard to its conflict of law principles. Any legal proceedings shall be brought exclusively in the courts of Saudi Arabia.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  For questions about these Terms or our service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>General Inquiries:</strong>{' '}
                      <a href="mailto:mohsinb.alshammari@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                        mohsinb.alshammari@gmail.com
                      </a>
                    </li>
                    {/* <li><strong>Legal Department:</strong>{' '}
                      <a href="mailto:legal@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                        legal@chatsa.com
                      </a>
                    </li> */}
                    <li><strong>Support Team:</strong>{' '}
                      <a href="mailto:support@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                        support@chatsa.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
