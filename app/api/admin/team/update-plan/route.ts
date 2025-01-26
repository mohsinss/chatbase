import { NextResponse } from 'next/server';
import connectMongo from '@/libs/mongoose';
import Team from '@/models/Team';

export async function PUT(request: Request) {
  try {
    const { teamId, field, value } = await request.json();
    
    await connectMongo();

    // First, get the current team data
    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    let updateQuery;
    
    // Handle plan name updates differently from other fields
    if (field === 'planName') {
      // When changing plan, update plan and set default config
      const defaultConfig = getDefaultConfig(value);
      updateQuery = {
        $set: {
          plan: value,
          config: defaultConfig
        }
      };
    } else {
      // For individual config updates, ensure config exists first
      const currentConfig = team.config || getDefaultConfig(team.plan);
      
      updateQuery = {
        $set: {
          config: {
            ...currentConfig,
            [field]: value
          }
        }
      };
    }

    const result = await Team.updateOne(
      { teamId },
      updateQuery
    );

    if (!result.modifiedCount) {
      return NextResponse.json(
        { error: 'No changes made' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating team plan:', error);
    return NextResponse.json(
      { error: 'Failed to update team plan' },
      { status: 500 }
    );
  }
}

// Helper function to get default config values
function getDefaultConfig(plan: string) {
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
  };

  return defaultConfig[plan as keyof typeof defaultConfig] || defaultConfig.Free;
} 