import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Team from "@/models/Team";
import Chatbot from "@/models/Chatbot";

export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    await connectMongo();
    
    // Remove 'team-' prefix if it exists
    const cleanTeamId = params.teamId;
    
    const team = await Team.findOne({ 
      $or: [
        { teamId: cleanTeamId },
        { teamId: params.teamId }
      ]
    });

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    return NextResponse.json({
      ...team
    });

  } catch (error) {
    console.error("Error fetching team:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    await connectMongo();
    const body = await request.json();
    
    // Remove 'team-' prefix if it exists
    const cleanTeamId = params.teamId;
    
    const team = await Team.findOneAndUpdate(
      { 
        $or: [
          { teamId: cleanTeamId },
          { teamId: params.teamId }
        ]
      },
      { 
        name: body.name,
        teamId: body.url // Store without prefix
      },
      { new: true }
    );

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    // Update the chatbot's teamId
    await Chatbot.updateMany(
      { teamId: params.teamId }, // Find chatbots with the old teamId
      { teamId: body.url } // Update to the new teamId
    );

    return NextResponse.json(team);

  } catch (error) {
    console.error("Error updating team:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 