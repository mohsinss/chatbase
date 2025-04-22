import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import dbConnect from "@/lib/dbConnect";
import WhatsAppNumber from "@/models/WhatsAppNumber";

// Facebook Graph API base URL
const GRAPH_API_URL = "https://graph.facebook.com/v22.0";

/**
 * GET: Fetch WhatsApp message templates
 * Required query parameters:
 * - _id: WhatsApp number ID in our database
 * - wabaId: WhatsApp Business Account ID
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");
    const wabaId = searchParams.get("wabaId");

    if (!_id || !wabaId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the WhatsApp number in our database
    const whatsappNumber = await WhatsAppNumber.findById(_id);
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number not found" },
        { status: 404 }
      );
    }

    // Get the access token 
    const accessToken = whatsappNumber.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Facebook access token not configured" },
        { status: 500 }
      );
    }

    // Fetch templates from Facebook Graph API
    const url = new URL(`${GRAPH_API_URL}/${wabaId}/message_templates`);
    url.searchParams.append("access_token", accessToken);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch templates" },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({ data: data.data });
  } catch (error) {
    console.error("Error fetching WhatsApp templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

/**
 * POST: Create a new WhatsApp message template
 * Required body parameters:
 * - name: Template name
 * - category: Template category (MARKETING, UTILITY, AUTHENTICATION)
 * - language: Template language code (e.g., en_US)
 * - components: Template components (header, body, footer, buttons)
 * - wabaId: WhatsApp Business Account ID
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { error: "Missing WhatsApp number ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the WhatsApp number in our database
    const whatsappNumber = await WhatsAppNumber.findById(_id);
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number not found" },
        { status: 404 }
      );
    }

    // Get the access token
    const accessToken = whatsappNumber.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Facebook access token not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { name, category, language, components, wabaId } = body;

    if (!name || !category || !language || !components || !wabaId) {
      return NextResponse.json(
        { error: "Missing required template parameters" },
        { status: 400 }
      );
    }

    // Create template using Facebook Graph API
    const url = new URL(`${GRAPH_API_URL}/${wabaId}/message_templates`);
    url.searchParams.append("access_token", accessToken);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        category,
        language,
        components,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false,
          error: errorData.error?.message || "Failed to create template" 
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: data,
      message: "Template created successfully",
    });
  } catch (error) {
    console.error("Error creating WhatsApp template:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete a WhatsApp message template
 * Required body parameters:
 * - templateId: ID of the template to delete
 * - wabaId: WhatsApp Business Account ID
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return NextResponse.json(
        { error: "Missing WhatsApp number ID" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the WhatsApp number in our database
    const whatsappNumber = await WhatsAppNumber.findById(_id);
    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number not found" },
        { status: 404 }
      );
    }

    // Get the access token
    const accessToken = whatsappNumber.accessToken;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Facebook access token not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { templateId, wabaId } = body;

    if (!templateId || !wabaId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Delete template using Facebook Graph API
    const url = new URL(`${GRAPH_API_URL}/${templateId}`);
    url.searchParams.append("access_token", accessToken);
    
    const response = await fetch(url.toString(), {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { 
          success: false,
          error: errorData.error?.message || "Failed to delete template" 
        },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting WhatsApp template:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
