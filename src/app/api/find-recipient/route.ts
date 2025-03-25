import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import OrganizationModel from "@/model/organisation";

// Modern Next.js configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get the query parameter "username"
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username query parameter is required" },
        { status: 400 }
      );
    }

    // First, search in UserModel
    let recipient = await UserModel.findOne({ username }).lean().exec();
    if (recipient) {
      return NextResponse.json(
        { recipient, type: "user" },
        { status: 200 }
      );
    }

    // If not found in UserModel, search in OrganizationModel
    recipient = await OrganizationModel.findOne({ username }).lean().exec();
    if (recipient) {
      return NextResponse.json(
        { recipient, type: "organization" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Recipient not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in GET /api/find-recipient:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}