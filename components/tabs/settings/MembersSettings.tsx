"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface Member {
  email: string;
  role: "Member" | "Owner";
  memberSince: string;
}

export function MembersSettings({ teamId, team }: { teamId: string, team: any }) {
  const { data: session } = useSession();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteFields, setInviteFields] = useState([{ email: "", role: "Member" }]);
  const [currentMember, setCurrentMember] = useState<Member>({
    email: "",
    role: "Owner",
    memberSince: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMember, setActiveMember] = useState(-1);

  useEffect(() => {
    if (session?.user?.email) {
      setCurrentMember(prev => ({
        ...prev,
        email: session.user.email
      }));
    }
  }, [session]);

  const addInviteField = () => {
    setInviteFields([...inviteFields, { email: "", role: "Member" }]);
  };

  const removeInviteField = (index: number) => {
    setInviteFields(inviteFields.filter((_, i) => i !== index));
  };

  const updateInviteField = (index: number, field: "email" | "role", value: string) => {
    const newFields = [...inviteFields];
    newFields[index][field] = value;
    setInviteFields(newFields);
  };

  const sendInvites = async () => {
    setIsLoading(true);
    try {
      // Validate emails before sending invites
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (let field of inviteFields) {
        if (field.email.trim().length == 0) {
          toast.error(`Please fill the values`);
          setIsLoading(false);
          return;
        }
        if (!emailRegex.test(field.email)) {
          toast.error(`Invalid email: ${field.email}`);
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ members: inviteFields, teamId }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error data from response
        throw new Error(errorData.error); // Throw error with message from response
      }

      const responseData = await response.json(); // Get response data

      if (responseData.success) { // Check if success property is true
        toast.success('Invites sent successfully'); // Display success toast
      }
      
      window.location.reload();

      // Close the invite dialog after successful invite
      setIsInviteOpen(false);
    } catch (error) {
      console.error('Failed to send invites:', error);
      toast.error(error.message);
    }
    setIsLoading(false)
  };

  const deleteMember = async (index: number) => {
    setIsLoading(true);
    try {
      const member = team.members[index];
      const response = await fetch('/api/team/remove-member', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, email: member.email }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error data from response
        throw new Error(errorData.error); // Throw error with message from response
      }
      
      window.location.reload();

      toast.success('Member removed successfully'); 
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error(error.message);
    }
    setIsLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Members <span className="text-gray-500 text-lg">1/3</span></h2>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-3 gap-4 p-4 text-gray-500">
          <div>User</div>
          <div>Member since</div>
          <div>Role</div>
        </div>

        <div className="grid grid-cols-3 gap-4 p-4 items-center border-t">
          <div>{currentMember.email}</div>
          <div>{currentMember.memberSince}</div>
          <div className="flex items-center justify-between">
            <span>Admin</span>
            {/* <button className="p-2 hover:bg-gray-100 rounded-full">⋮</button> */}
          </div>
        </div>
        {
          //@ts-ignore
          team?.members.map((member, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 p-4 items-center border-t">
              <div>{member.email}</div>
              <div>{new Date(member.memberSince).toLocaleDateString()}</div>
              <div className="flex items-center justify-between">
                <span>{member.role}</span>
                <button className="p-1 hover:bg-gray-100 rounded-full relative"
                  onClick={() => { setDropdownOpen(!dropdownOpen); setActiveMember(index) }}>
                  ⋮
                  {dropdownOpen && activeMember == index && (
                    <div className="absolute right-4 -top-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <button onClick={() => { deleteMember(index); setDropdownOpen(false) }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-500 ">
                        <IconTrash className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setIsInviteOpen(true)}
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          Invite members
        </button>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <button
            onClick={() => setIsInviteOpen(false)}
            className="absolute hidden right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              👥
            </div>
            <div>
              <h3 className="text-xl font-medium">Invite members</h3>
              <p className="text-gray-500">Invite your team members.</p>
            </div>
          </div>

          <div className="space-y-3">
            {inviteFields.map((field, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={field.email}
                  onChange={(e) => updateInviteField(index, "email", e.target.value)}
                  className="flex-1 rounded-lg border p-2"
                />
                <select
                  value={field.role}
                  onChange={(e) => updateInviteField(index, "role", e.target.value)}
                  className="rounded-lg border p-2 bg-white"
                >
                  <option>Member</option>
                  <option>Admin</option>
                </select>
                <button
                  onClick={() => removeInviteField(index)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addInviteField}
            className="w-full mt-3 p-2 rounded-lg border border-dashed text-purple-500 hover:bg-purple-50"
          >
            + Add member
          </button>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={sendInvites}
              className="px-4 py-2 rounded-lg bg-black text-white"
              disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Send invite(s)'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 