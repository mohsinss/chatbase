"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';

interface ChatbotType {
  chatbotId: string;
  name: string;
  conversationCount: number;
}

interface TeamType {
  teamId: string;
  chatbots: ChatbotType[];
  isExpanded?: boolean;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  teams: TeamType[];
  totalTeams: number;
  totalChatbots: number;
  isExpanded?: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkAdminAndFetchUsers();
  }, []);

  const checkAdminAndFetchUsers = async () => {
    try {
      const authRes = await fetch('/api/admin/auth');
      if (!authRes.ok) {
        router.push('/dashboard');
        return;
      }

      const usersRes = await fetch('/api/admin/users');
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      
      const data = await usersRes.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpansion = (userId: string) => {
    setUsers(users.map(user => ({
      ...user,
      isExpanded: user._id === userId ? !user.isExpanded : user.isExpanded
    })));
  };

  const toggleTeamExpansion = (userId: string, teamId: string) => {
    setUsers(users.map(user => {
      if (user._id !== userId) return user;
      return {
        ...user,
        teams: user.teams.map(team => ({
          ...team,
          isExpanded: team.teamId === teamId ? !team.isExpanded : team.isExpanded
        }))
      };
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DashboardNav teamId="" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="border rounded-lg overflow-hidden">
              <div 
                onClick={() => toggleUserExpansion(user._id)}
                className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="text-sm text-gray-500">
                  Teams: {user.totalTeams} | Chatbots: {user.totalChatbots}
                </div>
              </div>

              {user.isExpanded && (
                <div className="p-4 bg-white">
                  {user.teams.map(team => (
                    <div key={team.teamId} className="ml-4 border-l">
                      <div 
                        onClick={() => toggleTeamExpansion(user._id, team.teamId)}
                        className="p-2 cursor-pointer hover:bg-gray-50 flex justify-between"
                      >
                        <span>Team: {team.teamId}</span>
                        <span>{team.chatbots.length} Chatbots</span>
                      </div>

                      {team.isExpanded && (
                        <div className="ml-4 space-y-2">
                          {team.chatbots.map(chatbot => (
                            <div 
                              key={chatbot.chatbotId}
                              className="p-2 hover:bg-gray-50 cursor-pointer flex justify-between"
                              onClick={() => router.push(`/dashboard/admin/conversations/${chatbot.chatbotId}`)}
                            >
                              <span>{chatbot.name}</span>
                              <span>{chatbot.conversationCount} Conversations</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 