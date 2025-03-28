import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ChatSa',
  description: 'Learn about how ChatSa collects, uses, and protects your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to ChatSa. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI chatbot platform and related services.
              </p>
              <div className="bg-indigo-50 rounded-lg p-6">
                <p className="text-indigo-700">
                  By using ChatSa, you consent to the data practices described in this Privacy Policy. If you do not agree with the practices described here, please discontinue use of our services.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900">2.1 Personal Data</h3>
                  <p className="text-gray-600 mb-3">We collect the following personal information:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, password (encrypted), profile picture, and business information</li>
                    <li><strong>Payment Information:</strong> Credit card details (processed securely through our payment processors), billing address, and transaction history</li>
                    <li><strong>Knowledge Base Data:</strong> Documents, FAQs, training materials, and other content you provide to train your chatbot</li>
                    <li><strong>Communication Data:</strong> Messages, feedback, and support requests you send us</li>
                    <li><strong>User Preferences:</strong> Settings, preferences, and customization options for your chatbot</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2.2 Non-Personal Data</h3>
                  <p className="text-gray-600 mb-3">We automatically collect:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device identifiers</li>
                    <li><strong>Usage Data:</strong> Access times, pages viewed, links clicked, features used</li>
                    <li><strong>Chatbot Analytics:</strong> Conversation patterns, response effectiveness, user satisfaction metrics</li>
                    <li><strong>Technical Logs:</strong> Error reports, performance data, system configuration</li>
                    <li><strong>Location Data:</strong> General location based on IP address</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2.3 Cookies and Similar Technologies</h3>
                  <p className="text-gray-600 mb-3">We use various tracking technologies including:</p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our service</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
                    <li><strong>Marketing Cookies:</strong> Help us deliver relevant advertisements</li>
                  </ul>
                  <p className="text-gray-600 mt-3">
                    For more information about our cookie practices, please see our{' '}
                    <a href="/cookies" className="text-indigo-600 hover:text-indigo-500">Cookie Policy</a>.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Data</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">3.1 Service Provision</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Process and maintain your account</li>
                    <li>Train and customize your AI chatbot</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send service updates and important notifications</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3.2 Service Improvement</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Analyze usage patterns to improve features</li>
                    <li>Debug and fix technical issues</li>
                    <li>Develop new features and services</li>
                    <li>Conduct research and analytics</li>
                    <li>Generate aggregated insights</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3.3 Communication</h3>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2">
                    <li>Send product updates and newsletters</li>
                    <li>Provide marketing communications (with consent)</li>
                    <li>Respond to support requests</li>
                    <li>Send security alerts</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <div className="space-y-4">
                <p className="text-gray-600">We may share your information with:</p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">4.1 Service Providers</h3>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                      <li>Cloud hosting providers</li>
                      <li>Payment processors</li>
                      <li>Analytics services</li>
                      <li>Customer support tools</li>
                      <li>Email service providers</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">4.2 Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose information if required by law, regulation, legal process, or governmental request.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">4.3 Business Transfers</h3>
                    <p className="text-gray-600">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <div className="bg-indigo-50 rounded-lg p-6 space-y-4">
                <p className="text-indigo-700">
                  We implement comprehensive security measures to protect your data, including:
                </p>
                <ul className="list-disc pl-6 text-indigo-700 space-y-2">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure data centers and backup systems</li>
                  <li>Employee training on security practices</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Data Rights</h2>
              <div className="space-y-4">
                <p className="text-gray-600">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to data processing</li>
                  <li>Export your data</li>
                  <li>Withdraw consent</li>
                </ul>
                <p className="text-gray-600">
                  To exercise these rights, please contact our privacy team at{' '}
                  <a href="mailto:privacy@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                    privacy@chatsa.com
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your information for as long as necessary to provide our services and comply with legal obligations. When data is no longer needed, it is securely deleted or anonymized.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Retention Periods:</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Account information: Until account deletion</li>
                  <li>Payment information: As required by law</li>
                  <li>Chat logs: 12 months</li>
                  <li>Analytics data: 24 months</li>
                  <li>Backup data: 30 days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  ChatSa is not intended for children under 13. We do not knowingly collect personal information from children. If you believe your child has provided us with personal information, please contact us immediately.
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-600">
                    If we learn that we have collected personal information from a child under 13, we will take steps to:
                  </p>
                  <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                    <li>Delete the information as quickly as possible</li>
                    <li>Prevent further collection from the child</li>
                    <li>Notify parents or guardians</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 mb-4">
                We may transfer your information to countries other than your country of residence. When we do so, we implement appropriate safeguards to protect your data in accordance with this Privacy Policy and applicable law.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection Measures:</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Standard contractual clauses</li>
                  <li>Data processing agreements</li>
                  <li>Privacy Shield certification (where applicable)</li>
                  <li>Regional data storage options</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Updates to Privacy Policy</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We may update this Privacy Policy to reflect changes in our practices or for operational, legal, or regulatory reasons. We'll notify you of significant changes via:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Email notification</li>
                  <li>Platform notifications</li>
                  <li>Website announcements</li>
                </ul>
                <div className="bg-indigo-50 rounded-lg p-6">
                  <p className="text-indigo-700">
                    Your continued use of ChatSa after any changes to this Privacy Policy constitutes acceptance of those changes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  If you have questions, concerns, or requests related to this Privacy Policy or your personal data, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Email:</strong>{' '}
                      <a href="mailto:mohsinb.alshammari@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                        mohsinb.alshammari@gmail.com
                      </a>
                    </li>
                    <li><strong>Privacy Team:</strong>{' '}
                      <a href="mailto:privacy@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                        privacy@chatsa.com
                      </a>
                    </li>
                    <li><strong>Data Protection Officer:</strong>{' '}
                      <a href="mailto:dpo@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                        dpo@chatsa.com
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
