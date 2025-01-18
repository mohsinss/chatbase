'use client'

import React from 'react';
import Link from 'next/link';
import Sidebar from '@/components/guide/Sidebar';

const TeamsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Breadcrumb */}
      <div className="bg-white border-b fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/guide" className="text-gray-600">Guide</Link>
            <span className="text-gray-400">/</span>
            <Link href="/guide/getting-started" className="text-gray-600">Getting started</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">Create and Manage Teams</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 flex pt-16">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 py-8 ml-64">
          <section className="prose max-w-none">
            <h1 className="text-4xl font-bold mb-8">Create and Manage Teams</h1>
            
            <p className="text-lg text-gray-600 mb-12">
              Organize your users in Chatsa teams for better collaboration and permission control.
            </p>

            {/* Creating a Team Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Creating a Team</h2>
              <ol className="space-y-6 mt-4">
                <li>
                  <p>Head over to your Chatsa account dashboard, and click on the Settings tab at the top of the page.</p>
                  {/* Image placeholder */}
                </li>

                <li>
                  <p>All existing Chatsa members have been migrated to a default Chatsa team associated with their account name. You can see a list of your default team by clicking on the teams dropdown at the top left corner of the dashboard.</p>
                  <p className="mt-2">To create a new team, click on the Create Team button on the Select team dropdown menu.</p>
                  {/* Image placeholder */}
                </li>

                <li>
                  <p>On the next page, provide a name for your team, a preferred URL (if you aren't comfortable with the auto-generated one), and then click on the Create button. The new team will be created and automatically added to your list of teams.</p>
                  {/* Image placeholder */}
                </li>
              </ol>
            </section>

            {/* Inviting Members Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Inviting Members to a Team</h2>
              <ol className="space-y-6 mt-4">
                <li>
                  <p>From your Chatsa account dashboard, click on the teams dropdown at the top left corner of the page and select the team you want to invite a member to.</p>
                  {/* Image placeholder */}
                </li>

                <li>
                  <p>On the team page, click on the Settings tab at the top of the page.</p>
                </li>

                <li>
                  <p>Click on Members on the left sidebar.</p>
                </li>

                <li>
                  <p>Click the Invite members button.</p>
                  {/* Image placeholder */}
                </li>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                  <p className="text-yellow-700">
                    <strong>Note:</strong> If the button is disabled and you get an error message saying: "You have reached the maximum number of members for your plan," then you need to upgrade your plan for that Team. Each team on Chatsa has its own chatbots, billing info, and billing plans. This means your plans are not shared across teams, and the privileges and limitations are unique to each team based on the plan. If you have any questions, please contact support@chatsa.co.
                  </p>
                </div>

                <li>
                  <p>If the button is enabled, once you click on the Invite Members button, you will be prompted to provide an email address for the member to be invited.</p>
                </li>

                <li>
                  <p>Provide an email address and use the drop-down next to the email address input field to select the role you want the member to have and then click Send Invite(s).</p>
                  {/* Image placeholder */}
                </li>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
                  <p className="text-blue-700">
                    <strong>Note:</strong> There are distinct roles within a team – Owners and Members. Owners can change team settings, including billing info, plans, and team name, and can delete the team. They can also manage all the chatbots within the team. Members can ONLY manage the chatbots. This includes updating training data, seeing analytics, and deleting chatbots, but they cannot alter team settings.
                  </p>
                </div>

                <li>
                  <p>Once an invitee receives the invite email from Chatsa, they'll be able to follow the provided link to join the team. The invited members would have to create a Chatsa account to be able to log into the Chatsa platform and access the team.</p>
                </li>
              </ol>
            </section>

            {/* Remember Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold">Remember:</h2>
              <ul className="list-disc ml-6 mt-4 space-y-2">
                <li>Each team has its own chatbots, billing information, and plan. These are not shared between teams.</li>
                <li>Owners can change team settings (billing, plan, name), delete the team, and manage all chatbots within the team.</li>
                <li>Members can only manage chatbots (train them, see data, delete them). They cannot change team settings.</li>
                <li>Invite links expire 24 hours after it has been sent to an invitee.</li>
              </ul>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TeamsPage; 