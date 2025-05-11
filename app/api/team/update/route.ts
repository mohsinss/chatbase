import { NextResponse } from "next/server";
import connectDB from "@/libs/mongoose";
import Team from "@/models/Team";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const team = await Team.findOneAndUpdate(
      { teamId: body.teamId },
      { 
        name: body.name,
        description: body.description,
        billingInfo: body.billingInfo,
      },
      { new: true }
    );

    return NextResponse.json(team._doc);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update team settings" }, 
      { status: 500 }
    );
  }
} 