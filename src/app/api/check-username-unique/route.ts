import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'),
    };

    // Validate the query parameters
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    // Perform a case-insensitive search for the username
    const existingVerifiedUser = await UserModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, 'i') }, // Case-insensitive search
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken. Please choose a different username.',
        },
        { status: 200 }
      );
    }

    // If the username is unique
    return Response.json(
      {
        success: true,
        message: 'Username is unique and available.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username. Please try again later.',
      },
      { status: 500 }
    );
  }
}