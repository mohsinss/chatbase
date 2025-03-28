import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | ChatSa',
  description: 'Learn about how ChatSa uses cookies and similar technologies to provide you with the best possible service.',
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-indigo max-w-none">
            <p className="text-gray-600 mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our service, and enabling certain features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security.</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings to enhance your experience.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website.</li>
                <li><strong>Performance Cookies:</strong> Improve the speed and performance of our service.</li>
                <li><strong>Chat History Cookies:</strong> Store conversation history and preferences for our AI chatbot.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Types of Cookies We Use</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Session Cookies</h3>
                  <p className="text-gray-600">Temporary cookies that expire when you close your browser.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Persistent Cookies</h3>
                  <p className="text-gray-600">Remain on your device for a set period or until manually deleted.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Third-Party Cookies</h3>
                  <p className="text-gray-600">Set by third-party services we use for analytics and functionality.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your device and set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our site, and some features may not work as intended.
              </p>
              <div className="bg-indigo-50 rounded-lg p-6">
                <p className="text-indigo-700 font-medium">
                  To modify your cookie settings on ChatSa, click on the "Cookie Settings" button in the footer or adjust your browser settings.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We encourage you to periodically review this page for the latest information on our cookie practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our use of cookies, please contact us at{' '}
                <a href="mailto:privacy@chatsa.com" className="text-indigo-600 hover:text-indigo-500">
                  privacy@chatsa.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 