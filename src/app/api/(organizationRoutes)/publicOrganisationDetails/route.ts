import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import OrganizationModel from "@/model/organisation";

// Updated configuration for Next.js 13+
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Extract orgUsername from query parameters
    const { searchParams } = new URL(req.url);
    const orgUsername = searchParams.get("orgUsername");

    if (!orgUsername) {
      return NextResponse.json(
        { error: "Organization identifier (orgUsername) not provided" },
        { status: 400 }
      );
    }

    // Decode the URL-encoded username
    const decodedOrgUsername = decodeURIComponent(orgUsername);

    // Find organization by username field first (primary search)
    let organization = await OrganizationModel.findOne({ 
      username: decodedOrgUsername 
    });

    // If not found by username, try searching by name as fallback
    // This handles cases where orgUsername might actually be the organization name
    if (!organization) {
      organization = await OrganizationModel.findOne({ 
        name: decodedOrgUsername 
      });
    }

    if (!organization) {
      return NextResponse.json({ 
        error: "Organization not found",
        details: `No organization found with username or name: ${decodedOrgUsername}`
      }, { status: 404 });
    }

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}