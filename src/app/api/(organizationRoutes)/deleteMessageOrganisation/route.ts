import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import OrganizationModel from '@/model/organisation';
import PollFormModel from '@/model/pollFormModel';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  // Connect to DB
  await dbConnect();

  // Get session
  const session = await getServerSession(authOptions);

  // Session/user check
  if (!session || !session.user?.username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = session.user.username;
  const name = session.user.name || username; // Fallback to username if name doesn't exist

  try {
    // Check if organization exists
    const org = await OrganizationModel.findOne({ username });
    if (!org) {
      return NextResponse.json(
        { message: 'You must be an organization to create polls' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, questions } = body;

    // Validation
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Normalize and validate questions
    const validTypes = ["SINGLE", "MULTIPLE_CHOICE", "AGREE_DISAGREE", "SCALE", "RATING"];
    const normalizedQuestions = questions.map((q: any) => {
      // Validate required fields
      if (!q.questionText || typeof q.questionText !== "string") {
        throw new Error('All questions must have valid text');
      }

      if (!q.type || typeof q.type !== "string") {
        throw new Error('All questions must have a valid type');
      }

      // Convert type to uppercase to match enum
      let type = q.type.toUpperCase();

      // Handle RATING as an alias for SCALE
      if (type === 'RATING') {
        type = 'SCALE';
      }

      if (!validTypes.includes(type)) {
        throw new Error(`Invalid question type: ${q.type}`);
      }

      // Validate options for choice-based questions
      if (type === "SINGLE" || type === "MULTIPLE_CHOICE") {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          throw new Error('Multiple choice questions must have at least 2 options');
        }
      }

      return {
        questionText: q.questionText,
        type,
        options: q.options || []
      };
    });

    // Generate a unique slug using nanoid
    const slug = nanoid(8);

    // Create the poll
    const poll = await PollFormModel.create({
      title,
      description: description || '',
      questions: normalizedQuestions,
      createdBy: org._id,
      organization: org._id,
      slug,
    });

    // Generate the full URL for the poll
    const pollUrl = `/u/org/${name}/${username}/${slug}`;

    return NextResponse.json(
      { 
        message: 'Poll created successfully', 
        poll,
        pollUrl
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating poll:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}