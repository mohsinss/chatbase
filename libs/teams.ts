import Team from "@/models/Team";
import connectMongo from "@/libs/mongoose";

export async function getTeams(userId: string) {
  await connectMongo();
  
  const teams = await Team.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .lean();

  return teams.map(team => ({
    id: team.teamId,
    name: `Team ${team.teamId.slice(-4)}`, // Use last 4 chars of ID as name
    chatbotsCount: 0, // You can add actual count if needed
    createdAt: team.createdAt
  }));
} 