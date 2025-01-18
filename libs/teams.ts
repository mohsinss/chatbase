import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";
import connectMongo from "@/libs/mongoose";

export async function getTeams(userId: string) {
  await connectMongo();
  
  const teams = await Team.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .lean();

  const teamIds = teams.map(team => team.teamId);

  const chatbotsCountPromises = teams.map(async team => {
    return await Chatbot.countDocuments({ teamId: team.teamId });
  });

  const chatbotsCounts = await Promise.all(chatbotsCountPromises);

  return teams.map((team, index) => ({
    id: team.teamId,
    name: team.name ? team.name : `Team ${team.teamId.slice(-4)}`, // Use last 4 chars of ID as name
    chatbotsCount: chatbotsCounts[index], // Use the count of chatbots for each team
    createdAt: team.createdAt
  }));
} 