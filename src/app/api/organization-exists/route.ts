import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrganizationModel from '@/model/organisation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

// Modern Next.js configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Retrieve session using NextAuth
    const session = await getServerSession(authOptions);
    
    // Check if user is logged in and has username
    if (!session || !session.user || !session.user.username) {
      return NextResponse.json(
        { isOrganizationMember: false, message: "User not authenticated or missing username" },
        { status: 200 }
      );
    }

    const username = session.user.username;

    // Find organization with matching username (case-insensitive)
    const organization = await OrganizationModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    }).lean().exec();

    // Return whether organization exists for this user
    return NextResponse.json(
      { 
        isOrganizationMember: !!organization,
        message: organization ? "User belongs to an organization" : "User does not belong to any organization"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error checking organization membership:", error);
    return NextResponse.json(
      { error: "Failed to check organization membership", details: (error as Error).message },
      { status: 500 }
    );
  }
}