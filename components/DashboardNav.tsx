"use client";

import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IconSearch, IconPlus, IconMenu2, IconX, IconArrowUp, IconAlertCircle } from "@tabler/icons-react";
import { useSession, signOut } from "next-auth/react";
import ButtonAccount from "./ButtonAccount";
import toast from "react-hot-toast";
import config from "@/config";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlansSettings } from "@/components/tabs/settings/PlansSettings";
import { ChatbotBrandingSettings } from '@/models/ChatbotBrandingSettings'

interface Chatbot {
  chatbotId: string;
  name: string;
  teamId: string;
  createdBy: string;
  sources: any[];
}

// Custom toast styles
const showErrorToast = (message: string) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <IconAlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Error</p>
              <p className="mt-1 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ),
    { duration: 5000, position: 'top-center' }
  );
};

const DashboardNav: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { data: session } = useSession();
  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isChatbotMenuOpen, setIsChatbotMenuOpen] = useState(false);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [teams, setTeams] = useState<any[]>([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [isUpgradePlanModalOpen, setIsUpgradePlanModalOpen] = useState(false);
  const [currentChatbotLimit, setCurrentChatbotLimit] = useState(0);
  const [brandingSettings, setBrandingSettings] = useState<ChatbotBrandingSettings>({ logoUrl: "" });

  // Extract chatbotId from URL path - handle both /chatbot/ and /settings/branding paths
  const currentChatbotId = pathname.includes('/chatbot/') 
    ? pathname.split('/chatbot/')[1]?.split('/')[0] 
    : pathname.includes('/settings/branding') 
      ? pathname.split('/settings/branding')[0]?.split('/').pop() 
      : null;

  console.log('Current pathname:', pathname); // Debug log
  console.log('Extracted chatbotId:', currentChatbotId); // Debug log

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  // Fetch chatbots when component mounts or teamId changes
  useEffect(() => {
    const fetchChatbots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/chatbot/list?teamId=${teamId}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch chatbots');
        }
        const data = await response.json();
        setChatbots(data.chatbots || []);
      } catch (error) {
        console.error("Failed to fetch chatbots:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchChatbots();
    }
  }, [teamId]);

  // Fetch teams when component mounts or teamId changes
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`/api/team/list?teamId=${teamId}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch teams');
        }
        const data = await response.json();
        setTeams(data.teams || []);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, []);

  // Fetch branding settings when component mounts
  useEffect(() => {
    const fetchBrandingSettings = async () => {
      try {
        // If we have a chatbotId, fetch its branding settings
        if (currentChatbotId) {
          const response = await fetch(`/api/chatbot/branding-settings?chatbotId=${currentChatbotId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch branding settings');
          }
          const data = await response.json();
          console.log('Fetched branding settings:', data); // Debug log
          setBrandingSettings(data); // Set all branding data, not just logoUrl
        }
      } catch (error) {
        console.error("Failed to fetch branding settings:", error);
      }
    };

    fetchBrandingSettings();
  }, [currentChatbotId]);

  // Debug log for current branding settings
  useEffect(() => {
    console.log('Current branding settings:', brandingSettings);
  }, [brandingSettings]);

  const handleCreateTeam = async () => {
    try {
      const response = await fetch("/api/team/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();

      if (!data.teamId) {
        throw new Error("No team ID returned from server");
      }

      router.push(`/dashboard/${data.teamId}`);
      setIsTeamMenuOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter chatbots based on search query
  const filteredChatbots = chatbots.filter(chatbot =>
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isRootDashboard = pathname === "/dashboard";

  // Filter teams based on search query
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(teamSearchQuery.toLowerCase())
  );

  // Add function to handle modal close
  const handleUpgradePlanModalClose = () => {
    setIsUpgradePlanModalOpen(false);
  };

  // Create dynamic styles based on branding settings
  const dynamicStyles = {
    container: {
      backgroundColor: brandingSettings.backgroundColor || 'var(--base-100)',
      color: brandingSettings.textColor
    },
    headerImage: brandingSettings.headerUrl ? {
      backgroundImage: `url(${brandingSettings.headerUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      zIndex: -1
    } : undefined,
    button: {
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: brandingSettings.secondaryColor || 'var(--base-200)'
      }
    },
    dropdown: {
      backgroundColor: brandingSettings.backgroundColor || 'var(--base-100)',
      borderColor: brandingSettings.accentColor
    }
  };

  return (
    <div 
      className="border-b z-50 relative"
      style={dynamicStyles.container}
    >
      {/* Header Image Background */}
      {brandingSettings.headerUrl && (
        <div 
          className="absolute inset-0 w-full h-full opacity-10"
          style={dynamicStyles.headerImage}
        />
      )}
      
      {/* Header Text centered over the header image */}
      {brandingSettings.headerText && brandingSettings.headerUrl && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <h2 className="text-3xl font-bold drop-shadow-lg p-4 text-center"
              style={{
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                color: brandingSettings.textColor || "inherit"
              }}>
            {brandingSettings.headerText}
          </h2>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex-shrink-0">
              <Image
                src={brandingSettings.logoUrl || "/icon.png"}
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/icon.png";
                }}
              />
            </Link>

            {/* Always visible navigation */}
            {
              teamId != "" &&
              <div className="flex items-center gap-4">
                {/* Team Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsTeamMenuOpen(!isTeamMenuOpen);
                      setIsChatbotMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out ${
                      brandingSettings.secondaryColor 
                        ? 'hover:bg-opacity-10' 
                        : 'hover:bg-base-200'
                    }`}
                    style={{
                      backgroundColor: isTeamMenuOpen ? (brandingSettings.secondaryColor || 'var(--base-200)') : 'transparent'
                    }}
                  >
                    My Team
                    <svg
                      className="w-4 h-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isTeamMenuOpen && (
                    <div 
                      className="absolute z-10 mt-2 w-72 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                      style={dynamicStyles.dropdown}
                    >
                      {/* Search */}
                      <div className="p-2">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            value={teamSearchQuery}
                            onChange={(e) => setTeamSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-base-200 border-base-300 focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Search team..."
                          />
                        </div>
                      </div>

                      {/* Teams Section */}
                      <div className="px-2 py-1">
                        <p className="px-2 py-1 text-sm text-base-content/70">Teams</p>
                        {filteredTeams.map((team, index) => (
                          <button
                            key={team.id + "-team"}
                            onClick={() => router.push(`/dashboard/${team.id}`)}
                            className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 flex items-center justify-between group"
                          >
                            <span className="text-sm font-medium">{team.name}</span>
                            {teamId === team.teamId && (
                              <svg className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Create Team Button */}
                      <div className="border-t px-2 py-2">
                        <button
                          onClick={handleCreateTeam}
                          className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 text-primary flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Create team</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chatbot Selector - always visible when not on root dashboard */}
                {!isRootDashboard && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsChatbotMenuOpen(!isChatbotMenuOpen);
                        setIsTeamMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md hover:bg-base-200"
                    >
                      Select Chatbot
                      <svg
                        className="w-4 h-4 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isChatbotMenuOpen && (
                      <div className="absolute z-10 mt-2 w-72 rounded-lg shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5">
                        {/* Search */}
                        <div className="p-2">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <IconSearch className="h-4 w-4 text-base-content/50" />
                            </div>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border rounded-md text-sm bg-base-200 border-base-300 focus:outline-none focus:ring-1 focus:ring-primary"
                              placeholder="Search chatbot..."
                            />
                          </div>
                        </div>

                        {/* Chatbots List */}
                        <div className="max-h-64 overflow-y-auto">
                          <div className="px-2 py-1">
                            <p className="px-2 py-1 text-sm text-base-content/70">Chatbots</p>
                            {isLoading ? (
                              <div className="p-4 text-center">
                                <span className="loading loading-spinner loading-sm"></span>
                              </div>
                            ) : chatbots.length === 0 ? (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No chatbots found
                              </div>
                            ) : (
                              filteredChatbots.map((chatbot) => (
                                <button
                                  key={chatbot.chatbotId}
                                  onClick={() => {
                                    router.push(`/dashboard/${teamId}/chatbot/${chatbot.chatbotId}`);
                                    setIsChatbotMenuOpen(false);
                                  }}
                                  className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 flex items-center justify-between group"
                                >
                                  <span className="text-sm font-medium">{chatbot.name}</span>
                                  {currentChatbotId === chatbot.chatbotId && (
                                    <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Create New Chatbot Button */}
                        <div className="border-t px-2 py-2">
                          <button
                            onClick={() => {
                              if (teamId) {
                                try {
                                  //@ts-ignore
                                  const team = teams.find(t => t.id === teamId);
                                  if (team && team.plan) {
                                    //@ts-ignore
                                    const chatbotLimit = config.stripe.plans[team.plan].chatbotLimit;
                                    console.log("chatbotLimit", chatbotLimit);
                                    
                                    if (chatbots.length < chatbotLimit) {
                                      router.push(`/dashboard/${teamId}/create-new-chatbot`);
                                    } else {
                                      setCurrentChatbotLimit(chatbotLimit);
                                      setIsUpgradePlanModalOpen(true);
                                    }
                                  } else {
                                    showErrorToast("Team information not available. Please refresh the page and try again.");
                                  }
                                } catch (error) {
                                  console.error("Error accessing plan limits:", error);
                                  showErrorToast("Could not retrieve plan information. Please try again later.");
                                }
                              }
                              setIsChatbotMenuOpen(false);
                            }}
                            className="w-full px-2 py-2 text-left rounded-md hover:bg-base-200 text-primary flex items-center gap-2"
                          >
                            <IconPlus className="w-5 h-5" />
                            <span className="text-sm font-medium">Create new chatbot</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            }
          </div>

          {/* Right section */}
          <div className="flex items-center">
            {/* Desktop links and account */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/docs"
                className="text-sm font-medium hover:text-primary"
              >
                Docs
              </Link>
              <Link
                href="/help"
                className="text-sm font-medium hover:text-primary"
              >
                Help
              </Link>
              <Link
                href="/changelog"
                className="text-sm font-medium hover:text-primary"
              >
                Changelog
              </Link>
              {/* Account button - now with teamId prop */}
              <ButtonAccount teamId={teamId} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <IconMenu2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu - now includes all items */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Email display */}
            <div className="px-3 py-2 text-sm text-gray-500">
              {session?.user?.email}
            </div>

            {/* Dashboard - now using dynamic teamId */}
            <Link
              href={teamId ? `/dashboard/${teamId}/chatbots` : "/dashboard"}
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Dashboard
            </Link>

            {/* Account Settings */}
            <Link
              href="/account"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Account Settings
            </Link>

            {/* Create or join team */}
            <Link
              href="/team"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Create or join team
            </Link>

            {/* Navigation Links */}
            <Link
              href="/docs"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Docs
            </Link>
            <Link
              href="/help"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Help
            </Link>
            <Link
              href="/changelog"
              className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100"
            >
              Changelog
            </Link>

            {/* Sign out button */}
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-md hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      <Dialog open={isUpgradePlanModalOpen} onOpenChange={handleUpgradePlanModalClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <div className="relative">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-white">
                  <h2 className="text-2xl font-bold">Upgrade Your Plan</h2>
                  <p className="opacity-90">
                    You've reached the limit of {currentChatbotLimit} chatbots on your current plan
                  </p>
                </div>
                <button 
                  onClick={handleUpgradePlanModalClose}
                  className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 border-none text-white"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Note below header */}
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
              <div className="flex gap-3 items-center">
                <span className="bg-blue-100 p-2 rounded-full">
                  <IconArrowUp className="w-4 h-4 text-blue-700" />
                </span>
                <p className="text-blue-800 text-sm">
                  Upgrading your plan gives you access to more chatbots, advanced features, and higher message limits.
                </p>
              </div>
            </div>
            
            {/* Content with slight padding */}
            <div className="p-6">
              <PlansSettings teamId={teamId} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardNav; 