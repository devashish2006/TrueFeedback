import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrganizationModel from '@/model/organisation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // Retrieve session using NextAuth
    const session = await getServerSession(authOptions);
    console.log("Session from API:", session);
    if (!session || !session.user || !session.user.username) {
      console.log("Session or username not found.");
      return NextResponse.json({ organization: false }, { status: 200 });
    }

    const username = session.user.username;
    console.log("Username from session:", username);

    // Use a case-insensitive query to match the username
    const organization = await OrganizationModel.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    }).lean().exec();

    console.log("Organization query result:", organization);

    if (organization) {
      return NextResponse.json({ organization: true }, { status: 200 });
    } else {
      return NextResponse.json({ organization: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking organization existence:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
