"use client";

import Link from "next/link";

export default function AffiliateSignup() {
  return (
    <div className="min-h-screen bg-gray-50 py-32">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">ChatSA.co</h1>
            <h2 className="text-xl text-gray-600 mb-4">Friends of ChatSA.co</h2>
            <p className="text-gray-600">
              Join Friends of ChatSA.co and receive a 20% commission on all
              payments within the first 12 months for paying customers you refer to{" "}
              <Link href="/" className="text-blue-600 hover:underline">
                www.chatsa.co
              </Link>
              !
            </p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">First name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Last name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum 8 characters, ideally more.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 