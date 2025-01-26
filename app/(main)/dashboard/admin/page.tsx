"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import AdminMetrics from '@/components/AdminMetrics';

interface ChatbotType {
  chatbotId: string;
  name: string;
  conversationCount: number;
}

interface TeamType {
  teamId: string;
  chatbots: ChatbotType[];
  isExpanded?: boolean;
  plan: string;
  config?: {
    chatbotLimit: number;
    messageCredits: number;
    teamMemberLimit: number;
  };
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
  const [deletingChatbot, setDeletingChatbot] = useState<string | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
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

  const handleDeleteChatbot = async (chatbotId: string) => {
    if (!confirm('Are you sure you want to delete this chatbot? This action cannot be undone.')) {
      return;
    }

    setDeletingChatbot(chatbotId);
    try {
      const response = await fetch('/api/chatbot/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatbotId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete chatbot');
      }

      // Update the local state to remove the deleted chatbot
      setUsers(users.map(user => ({
        ...user,
        teams: user.teams.map(team => ({
          ...team,
          chatbots: team.chatbots.filter(bot => bot.chatbotId !== chatbotId),
        })),
        totalChatbots: user.totalChatbots - 1,
      })));

    } catch (error) {
      console.error('Error deleting chatbot:', error);
      alert('Failed to delete chatbot');
    } finally {
      setDeletingChatbot(null);
    }
  };

  const handleDeleteTeam = async (teamId: string, chatbots: ChatbotType[]) => {
    if (!confirm('Are you sure you want to delete this team? All chatbots within this team will also be deleted. This action cannot be undone.')) {
      return;
    }

    setDeletingTeam(teamId);
    try {
      const response = await fetch('/api/admin/team/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          teamId,
          chatbotIds: chatbots.map(bot => bot.chatbotId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete team');
      }

      // Update the local state to remove the deleted team and its chatbots
      setUsers(users.map(user => ({
        ...user,
        teams: user.teams.filter(team => team.teamId !== teamId),
        totalTeams: user.totalTeams - 1,
        totalChatbots: user.totalChatbots - chatbots.length
      })));

    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    } finally {
      setDeletingTeam(null);
    }
  };

  const handleChatbotSelect = (userId: string, teamId: string, chatbotId: string) => {
    // First expand the user
    setUsers(users.map(user => ({
      ...user,
      isExpanded: user._id === userId,
      teams: user.teams.map(team => ({
        ...team,
        isExpanded: team.teamId === teamId
      }))
    })));

    // Then navigate to the chatbot conversations
    router.push(`/dashboard/admin/conversations/${chatbotId}`);
  };

  const handlePlanUpdate = async (teamId: string, field: string, value: any) => {
    try {
      const response = await fetch('/api/admin/team/update-plan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          field,
          value
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update plan');
      }

      // Update local state
      setUsers(users.map(user => ({
        ...user,
        teams: user.teams.map(team => {
          if (team.teamId !== teamId) return team;
          
          // If updating plan name
          if (field === 'planName') {
            return {
              ...team,
              plan: value
            };
          }
          
          // If updating config values
          return {
            ...team,
            config: {
              ...team.config,
              [field]: value
            }
          };
        })
      })));

    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <DashboardNav teamId="" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <AdminMetrics 
          users={users}
          onChatbotSelect={handleChatbotSelect}
        />

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
                        className="p-2 hover:bg-gray-50 group flex justify-between items-center"
                      >
                        <div 
                          className="flex-grow cursor-pointer flex justify-between"
                          onClick={() => toggleTeamExpansion(user._id, team.teamId)}
                        >
                          <span>Team: {team.teamId}</span>
                          <span>{team.chatbots.length} Chatbots</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.teamId, team.chatbots);
                          }}
                          className={`opacity-0 group-hover:opacity-100 ml-4 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-all ${
                            deletingTeam === team.teamId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={deletingTeam === team.teamId}
                        >
                          {deletingTeam === team.teamId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>

                      {team.isExpanded && (
                        <>
                          <PlanManager 
                            team={team}
                            userId={user._id}
                            onUpdate={(field, value) => handlePlanUpdate(team.teamId, field, value)}
                          />
                          <div className="ml-4 space-y-2">
                            {team.chatbots.map(chatbot => (
                              <div 
                                key={chatbot.chatbotId}
                                className="p-2 hover:bg-gray-50 group flex justify-between items-center"
                              >
                                <div 
                                  className="flex-grow cursor-pointer"
                                  onClick={() => router.push(`/dashboard/admin/conversations/${chatbot.chatbotId}`)}
                                >
                                  <span>{chatbot.name}</span>
                                  <span className="ml-4 text-gray-500">
                                    {chatbot.conversationCount} Conversations
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChatbot(chatbot.chatbotId);
                                  }}
                                  className={`opacity-0 group-hover:opacity-100 ml-4 px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 transition-all ${
                                    deletingChatbot === chatbot.chatbotId ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={deletingChatbot === chatbot.chatbotId}
                                >
                                  {deletingChatbot === chatbot.chatbotId ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
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

const PlanManager = ({ 
  team, 
  userId,
  onUpdate 
}: { 
  team: TeamType; 
  userId: string;
  onUpdate: (field: string, value: any) => Promise<void>;
}) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [editableValues, setEditableValues] = useState({
    chatbotLimit: 0,
    messageCredits: 0,
    teamMemberLimit: 0
  });
  
  const plans = ["Free", "Hobby", "Standard", "Unlimited"] as const;

  // Default values based on plan
  const defaultConfig = {
    Free: {
      chatbotLimit: 1,
      messageCredits: 20,
      teamMemberLimit: 1
    },
    Hobby: {
      chatbotLimit: 2,
      messageCredits: 2000,
      teamMemberLimit: 1
    },
    Standard: {
      chatbotLimit: 5,
      messageCredits: 10000,
      teamMemberLimit: 3
    },
    Unlimited: {
      chatbotLimit: 999,
      messageCredits: 999999,
      teamMemberLimit: 999
    }
  } as const;

  // Ensure we have a valid plan, defaulting to "Free" if invalid
  const currentPlan = team.plan && plans.includes(team.plan as any) ? team.plan : "Free";

  // Use team's config or default values based on plan
  const config = team.config || defaultConfig[currentPlan as keyof typeof defaultConfig];

  // Initialize editable values when component mounts or team changes
  useEffect(() => {
    setEditableValues({
      chatbotLimit: config.chatbotLimit ?? defaultConfig[currentPlan as keyof typeof defaultConfig].chatbotLimit,
      messageCredits: config.messageCredits ?? defaultConfig[currentPlan as keyof typeof defaultConfig].messageCredits,
      teamMemberLimit: config.teamMemberLimit ?? defaultConfig[currentPlan as keyof typeof defaultConfig].teamMemberLimit
    });
  }, [team.teamId, config]);

  const handleValueChange = (field: keyof typeof editableValues, value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    setEditableValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={currentPlan}
            onChange={async (e) => {
              setUpdating('plan');
              await onUpdate('planName', e.target.value);
              setUpdating(null);
            }}
            className="p-2 border rounded"
          >
            {plans.map(plan => (
              <option key={plan} value={plan}>{plan}</option>
            ))}
          </select>
          {updating === 'plan' && <span className="text-sm text-gray-500">Updating...</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600">Chatbot Limit</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editableValues.chatbotLimit}
              onChange={(e) => handleValueChange('chatbotLimit', e.target.value)}
              className="w-24 p-2 border rounded"
            />
            <button
              onClick={async () => {
                setUpdating('chatbotLimit');
                await onUpdate('chatbotLimit', editableValues.chatbotLimit);
                setUpdating(null);
              }}
              disabled={updating === 'chatbotLimit'}
              className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              {updating === 'chatbotLimit' ? '...' : 'Update'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Message Credits/Month</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editableValues.messageCredits}
              onChange={(e) => handleValueChange('messageCredits', e.target.value)}
              className="w-24 p-2 border rounded"
            />
            <button
              onClick={async () => {
                setUpdating('messageCredits');
                await onUpdate('messageCredits', editableValues.messageCredits);
                setUpdating(null);
              }}
              disabled={updating === 'messageCredits'}
              className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              {updating === 'messageCredits' ? '...' : 'Update'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Team Member Limit</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={editableValues.teamMemberLimit}
              onChange={(e) => handleValueChange('teamMemberLimit', e.target.value)}
              className="w-24 p-2 border rounded"
            />
            <button
              onClick={async () => {
                setUpdating('teamMemberLimit');
                await onUpdate('teamMemberLimit', editableValues.teamMemberLimit);
                setUpdating(null);
              }}
              disabled={updating === 'teamMemberLimit'}
              className="px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800"
            >
              {updating === 'teamMemberLimit' ? '...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 