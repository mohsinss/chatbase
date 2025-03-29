"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from '@/components/DashboardNav';
import AdminMetrics from '@/components/AdminMetrics';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  teams: TeamType[];
  totalTeams: number;
  totalChatbots: number;
  isExpanded?: boolean;
  plan?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingChatbot, setDeletingChatbot] = useState<string | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState<string | null>(null);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
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
      setAuthChecking(false);

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

  const handleDeleteUser = async (userId: string) => {
    setDeletingUser(userId);
    try {
      // Find all chatbotIds associated with this user
      const userToDelete = users.find(user => user._id === userId);
      if (!userToDelete) throw new Error('User not found');
      
      // Collect all chatbot IDs from all teams
      const chatbotIds = userToDelete.teams.flatMap(team => 
        team.chatbots.map(bot => bot.chatbotId)
      );
      
      const response = await fetch('/api/admin/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          chatbotIds,
          teamIds: userToDelete.teams.map(team => team.teamId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Update local state to remove deleted user
      setUsers(users.filter(user => user._id !== userId));

    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    } finally {
      setDeletingUser(null);
      setIsDeleteUserDialogOpen(false);
    }
  };

  const initiateUserDelete = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteUserDialogOpen(true);
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
    // router.push(`/dashboard/admin/conversations/${teamId}/${chatbotId}/chat-logs`);
    window.open(`/dashboard/admin/conversations/${teamId}/${chatbotId}/chat-logs`);
  };

  const handleChatbotPreview = async (teamId: string, chatbotId: string) => {
    try {
      // First, ensure admin has access to this chatbot
      const response = await fetch(`/api/admin/access?teamId=${teamId}&chatbotId=${chatbotId}`);
      
      // if (!response.ok) {
      //   alert('Unable to access this chatbot. Please check permissions.');
      //   return;
      // }
      
      // Then navigate to the chatbot playground
      router.push(`/dashboard/${teamId}/chatbot/${chatbotId}`);
    } catch (error) {
      console.error('Error accessing chatbot:', error);
      alert('Failed to access chatbot');
    }
  };

  const handlePlanChange = async (teamId: string, newPlan: string) => {
    setUpdatingPlan(teamId);
    try {
      const response = await fetch('/api/admin/user/update-plan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, plan: newPlan }),
      });

      if (!response.ok) throw new Error('Failed to update plan');

      // Update local state
      setUsers(users.map(user => ({
        ...user,
        teams: user.teams.map(team => 
          team.teamId === teamId ? { ...team, plan: newPlan } : team
        )
      })));
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    } finally {
      setUpdatingPlan(null);
    }
  };

  if (authChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

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
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => initiateUserDelete(user._id)}
                      className={`px-3 py-1 text-sm text-red-500 bg-white border-2 border-red-500 rounded hover:bg-red-50 transition-all ${
                        deletingUser === user._id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={deletingUser === user._id}
                    >
                      {deletingUser === user._id ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                  {user.teams.map(team => (
                    <div key={team.teamId} className="ml-4 border-l">
                      <div 
                        className="p-2 hover:bg-gray-50 group flex justify-between items-center"
                      >
                        <div 
                          className="flex-grow cursor-pointer flex justify-between items-center"
                          onClick={() => toggleTeamExpansion(user._id, team.teamId)}
                        >
                          <div className="flex items-center gap-4">
                            <span>Team: {team.teamId}</span>
                            <div className="flex items-center gap-2">
                              <select
                                value={team.plan}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handlePlanChange(team.teamId, e.target.value);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                disabled={updatingPlan === team.teamId}
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full border-none focus:ring-2 focus:ring-blue-300"
                              >
                                <option value="Free">Free</option>
                                <option value="Standard">Standard</option>
                                <option value="Hobby">Hobby</option>
                                <option value="Unlimited">Unlimited</option>
                              </select>
                              {updatingPlan === team.teamId && (
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          </div>
                          <span>{team.chatbots.length} Chatbots</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.teamId, team.chatbots);
                          }}
                          className={`opacity-0 group-hover:opacity-100 ml-4 px-3 py-1 text-sm text-red-500 bg-white border-2 border-red-500 rounded hover:bg-red-50 transition-all ${
                            deletingTeam === team.teamId ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={deletingTeam === team.teamId}
                        >
                          {deletingTeam === team.teamId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>

                      {team.isExpanded && (
                        <div className="ml-4 space-y-2">
                          {team.chatbots.map(chatbot => (
                            <div 
                              key={chatbot.chatbotId}
                              className="p-2 hover:bg-gray-50 group flex justify-between items-center"
                            >
                              <div className="flex-grow">
                                <span>{chatbot.name}</span>
                                <span className="ml-4 text-gray-500">
                                  {chatbot.conversationCount} Conversations
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleChatbotSelect(user._id, team.teamId, chatbot.chatbotId)}
                                  className="px-3 py-1 text-sm text-blue-500 bg-white border-2 border-blue-500 rounded hover:bg-blue-50 transition-all"
                                >
                                  View History
                                </button>
                                <button
                                  onClick={() => handleChatbotPreview(team.teamId, chatbot.chatbotId)}
                                  className="px-3 py-1 text-sm text-green-500 bg-white border-2 border-green-500 rounded hover:bg-green-50 transition-all"
                                >
                                  Preview Chatbot
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChatbot(chatbot.chatbotId);
                                  }}
                                  className={`opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-red-500 bg-white border-2 border-red-500 rounded hover:bg-red-50 transition-all ${
                                    deletingChatbot === chatbot.chatbotId ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={deletingChatbot === chatbot.chatbotId}
                                >
                                  {deletingChatbot === chatbot.chatbotId ? 'Deleting...' : 'Delete'}
                                </button>
                              </div>
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

      {/* User Delete Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone and all associated data including teams, chatbots, and conversations will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => userToDelete && handleDeleteUser(userToDelete)}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 