"use client";

import { useState } from 'react';

interface RecentActivity {
  userId: string;
  userName: string;
  teamId: string;
  chatbotId: string;
  chatbotName: string;
  timestamp: string;
  userMessage: string;
  botResponse: string;
}

interface MetricsProps {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    teams: Array<{
      teamId: string;
      chatbots: Array<{
        chatbotId: string;
        name: string;
        conversationCount: number;
      }>;
    }>;
  }>;
  recentActivities: RecentActivity[];
  onChatbotSelect: (userId: string, teamId: string, chatbotId: string) => void;
}

export default function AdminMetrics({ users, recentActivities, onChatbotSelect }: MetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isActivitiesExpanded, setIsActivitiesExpanded] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  // Calculate total metrics
  const totalUsers = users.length;
  const totalTeams = users.reduce((acc, user) => acc + user.teams.length, 0);
  const totalChatbots = users.reduce((acc, user) => 
    acc + user.teams.reduce((teamAcc, team) => teamAcc + team.chatbots.length, 0), 0);
  const totalConversations = users.reduce((acc, user) => 
    acc + user.teams.reduce((teamAcc, team) => 
      teamAcc + team.chatbots.reduce((botAcc, bot) => botAcc + bot.conversationCount, 0), 0), 0);

  // Search functionality
  const searchResults = !searchTerm ? [] : users.flatMap(user =>
    user.teams.flatMap(team =>
      team.chatbots
        .filter(bot => 
          bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bot.chatbotId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.teamId.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map(bot => ({
          userId: user._id,
          userName: user.name,
          teamId: team.teamId,
          chatbot: bot
        }))
    )
  );

  // Use the passed recentActivities instead of generating mock data
  const sortedRecentActivities = recentActivities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 30);

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      {/* Basic Metrics */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="grid grid-cols-4 gap-4 flex-grow">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-xl">👥</span>
            <div>
              <div className="text-sm text-gray-500">Users</div>
              <div className="font-semibold">{totalUsers}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500 text-xl">🏢</span>
            <div>
              <div className="text-sm text-gray-500">Teams</div>
              <div className="font-semibold">{totalTeams}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-500 text-xl">🤖</span>
            <div>
              <div className="text-sm text-gray-500">Chatbots</div>
              <div className="font-semibold">{totalChatbots}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500 text-xl">💬</span>
            <div>
              <div className="text-sm text-gray-500">Conversations</div>
              <div className="font-semibold">{totalConversations}</div>
            </div>
          </div>
        </div>
        <span className="text-xl">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Expanded Section */}
      {isExpanded && (
        <div className="border-t p-4">
          {/* Search Bar */}
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="xxSearch chatbots, teams..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={`${result.chatbot.chatbotId}-${index}`}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  onClick={() => onChatbotSelect(result.userId, result.teamId, result.chatbot.chatbotId)}
                >
                  <div>
                    <div className="font-medium">{result.chatbot.name}</div>
                    <div className="text-sm text-gray-500">
                      Team: {result.teamId} | User: {result.userName}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {result.chatbot.conversationCount} conversations
                  </div>
                </div>
              ))}
              {searchResults.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No results found
                </div>
              )}
            </div>
          )}

          {/* Recent Activities Section */}
          <div className="mt-6 border-t pt-4">
            <div 
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setIsActivitiesExpanded(!isActivitiesExpanded)}
            >
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <span className="text-blue-500">📊</span>
                <span>Recent Chatbot Activities (Latest 30)</span>
              </h3>
              <span className="text-xl">
                {isActivitiesExpanded ? '▼' : '▶'}
              </span>
            </div>

            {isActivitiesExpanded && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedRecentActivities.map((activity, index) => (
                  <div
                    key={`${activity.chatbotId}-${index}`}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => onChatbotSelect(activity.userId, activity.teamId, activity.chatbotId)}
                    >
                      <div className="flex-grow">
                        <div className="font-medium">{activity.chatbotName}</div>
                        <div className="text-sm text-gray-500">
                          {activity.userName} • {activity.teamId}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedActivity(
                              expandedActivity === `${activity.chatbotId}-${index}` 
                                ? null 
                                : `${activity.chatbotId}-${index}`
                            );
                          }}
                          className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1 rounded"
                        >
                          {expandedActivity === `${activity.chatbotId}-${index}` ? 'Hide' : 'Preview'}
                        </button>
                        <span className="text-lg">
                          {expandedActivity === `${activity.chatbotId}-${index}` ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>
                    
                    {expandedActivity === `${activity.chatbotId}-${index}` && (
                      <div className="border-t bg-yellow-50 p-4">
                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">User Message:</div>
                          <div className="text-sm bg-white p-2 rounded border">
                            {activity.userMessage}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Bot Response:</div>
                          <div className="text-sm bg-yellow-100 p-2 rounded border border-yellow-200">
                            {activity.botResponse}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {sortedRecentActivities.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No recent activities found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 