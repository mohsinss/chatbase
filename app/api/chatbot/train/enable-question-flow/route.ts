import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import DatasetModel from "@/models/Dataset";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { enabled, chatbotId } = await req.json();

    await connectMongo();

    // Find the dataset associated with the user and update the questionFlow enabled status
    const updatedDataset = await DatasetModel.findOneAndUpdate(
      { chatbotId },
      { $set: { questionFlowEnable: enabled } },
      {
        new: true,
        runValidators: true,
        validateBeforeSave: true
      }
    );

    if (!updatedDataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      enabled: enabled
    });

  } catch (error: any) {
    console.error("Error updating question flow status:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update question flow status" },
      { status: 500 }
    );
  }
}