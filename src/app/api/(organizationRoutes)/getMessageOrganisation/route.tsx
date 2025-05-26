import dbConnect from '@/lib/dbConnect';
import OrganizationModel from "@/model/organisation";
import mongoose from 'mongoose';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const orgName = _user.username; // use username to identify the organization

  try {
    const orgExists = await OrganizationModel.findOne({ username: orgName });

    if (!orgExists) {
      return Response.json(
        { message: 'Organization not found', success: false },
        { status: 404 }
      );
    }
    
    // Check if messages exist
    const org = await OrganizationModel.aggregate([
      { $match: { username: orgName } },
      {
        $project: {
          messagesExist: {
            $cond: {
              if: { $isArray: '$messages' },
              then: { $size: '$messages' },
              else: 0
            }
          },
          messages: 1
        }
      }
    ]).exec();

    if (org[0].messagesExist === 0) {
      return Response.json(
        {
          messages: [],
          message: 'No messages to display',
          success: true
        },
        { status: 200 }
      );
    }

    // Sort messages by createdAt descending
    const sortedMessages = await OrganizationModel.aggregate([
      { $match: { username: orgName } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } }
    ]).exec();

    return Response.json(
      {
        messages: sortedMessages[0].messages,
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching organization messages:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        success: false,
      }),
      { status: 500 }
    );
  }
}
