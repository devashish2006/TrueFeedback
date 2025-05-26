import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import OrganizationModel from "@/model/organisation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

// Updated configuration for Next.js 13+
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Ensure DB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Retrieve session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const username = session.user.username;
    if (!username) {
      return NextResponse.json(
        { error: "Username not found in session" },
        { status: 400 }
      );
    }

    const organization = await OrganizationModel.findOne({ username });
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { organization },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}