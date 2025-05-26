import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Organization from "@/model/organisation";
import dotenv from "dotenv";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

dotenv.config();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    // Connect to database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI as string);
    }

    // Get session and verify user
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json(
        { error: "Unauthorized - Please log in" },
        { status: 401 }
      );
    }
    const username = session.user.username;

    // Parse request body
    const body = await req.json();
    const { name, description } = body;

    // Validate inputs
    if (!name || name.trim().length < 3) {
      return NextResponse.json(
        { error: "Organization name must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Find and update organization
    const updatedOrg = await Organization.findOneAndUpdate(
      { username },
      {
        name: name.trim(),
        description: description.trim(),
      },
      { new: true }
    );

    if (!updatedOrg) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Organization updated successfully",
        organization: updatedOrg,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
