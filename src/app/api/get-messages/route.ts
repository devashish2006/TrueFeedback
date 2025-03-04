import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user : User = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    // First check if the user exists at all
    const userExists = await UserModel.findById(userId);
    
    if (!userExists) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }
    
    // If user exists but may not have messages, proceed with aggregation
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          messagesExist: { $cond: { if: { $isArray: "$messages" }, then: { $size: "$messages" }, else: 0 } },
          messages: 1
        }
      }
    ]).exec();
    
    // Check if messages array exists and has items
    if (user[0].messagesExist === 0) {
      return Response.json(
        { 
          messages: [], 
          message: 'No messages to display',
          success: true 
        },
        { status: 200 }
      );
    }
    
    // If we have messages, do the sorting
    const userWithSortedMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();

    return Response.json(
      { 
        messages: userWithSortedMessages[0].messages,
        success: true 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return new Response(
      JSON.stringify({
        message: 'Internal server error',
        success: false,
      }),
      { status: 500 }
    );
  }
}