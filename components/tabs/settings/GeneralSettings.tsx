"use client";

import { useState, useEffect } from "react";

interface GeneralSettingsProps {
  teamId: string;
}

interface TeamData {
  name: string;
  url: string;
}

const GeneralSettings = ({ teamId }: GeneralSettingsProps) => {
  const [teamData, setTeamData] = useState<TeamData>({
    name: "",
    url: ""
  });

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`/api/team/${teamId}`);
        if (!response.ok) throw new Error('Failed to fetch team data');
        const data = await response.json();
        setTeamData({
          name: data.name || "",
          url: teamId
        });
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, [teamId]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/team/${teamId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: teamData.name,
          url: teamData.url
        }),
      });

      if (!response.ok) throw new Error('Failed to update team data');
      
      const data = await response.json();
      // if (data.teamId !== teamId) {
        window.location.href = `/dashboard/team-${data.teamId}/settings/general`;
      // }
    } catch (error) {
      console.error("Error updating team data:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl">General</h2>
      
      <div className="mt-6 rounded-xl border border-gray-200 p-8">
        <div>
          <label className="text-lg">Team Name</label>
          <input 
            type="text"
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="My team"
            value={teamData.name}
            onChange={(e) => setTeamData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="mt-6">
          <label className="text-lg">Team URL</label>
          <input 
            type="text"
            className="mt-2 w-full rounded-lg border p-3"
            placeholder="team-cb2360fc"
            value={teamData.url}
            onChange={(e) => setTeamData(prev => ({ ...prev, url: e.target.value }))}
          />
          <p className="mt-2 text-gray-500">
            Updating Team URL will cause a redirect to the new url.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleSave}
            className="rounded-lg bg-gray-800 px-6 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mt-20 text-center text-gray-500">DANGER ZONE</div>

      <div className="mt-6 rounded-xl border border-red-200 p-8">
        <h3 className="text-2xl text-red-500">Delete Team</h3>
        <p className="mt-4">
          Once you delete your team account, there is no going back. Please be certain.<br/>
          All your uploaded data and trained chatbots will be deleted. <span className="font-bold">This action is not reversible</span>
        </p>
        <div className="mt-6 flex justify-end">
          <button className="rounded-lg bg-red-500 px-6 py-2 text-white">
            Delete My team
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings; 