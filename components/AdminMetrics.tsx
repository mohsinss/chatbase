"use client";

import { useState } from 'react';

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
  onChatbotSelect: (userId: string, teamId: string, chatbotId: string) => void;
}

export default function AdminMetrics({ users, onChatbotSelect }: MetricsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
              placeholder="Search chatbots, teams..."
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
        </div>
      )}
    </div>
  );
} 