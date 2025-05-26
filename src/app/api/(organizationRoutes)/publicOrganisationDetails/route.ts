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

    // Extract the orgUsername from query parameters: ?orgUsername=Debug
    const { searchParams } = new URL(req.url);
    const orgUsername = searchParams.get("orgUsername");

    if (!orgUsername) {
      return NextResponse.json(
        { error: "Organization identifier (orgUsername) not provided" },
        { status: 400 }
      );
    }

    // Fetch organization details from MongoDB
    const organization = await OrganizationModel.findOne({ name: orgUsername });
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({ organization }, { status: 200 });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}