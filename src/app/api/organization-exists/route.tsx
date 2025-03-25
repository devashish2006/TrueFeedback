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
    await dbConnect();

    // Retrieve session using NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.username) {
      return NextResponse.json(
        { organization: false },
        { status: 200 }
      );
    }

    const username = session.user.username;

    // Case-insensitive search for organization
    const organization = await OrganizationModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }
    }).lean().exec();

    return NextResponse.json(
      { organization: !!organization },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error checking organization existence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}