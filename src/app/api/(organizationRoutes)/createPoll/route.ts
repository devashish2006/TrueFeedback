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
  const session = await getServerSession({ req: request, ...authOptions });

  // Session/user check
  if (!session || !session.user?.username) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const username = session.user.username;

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

    // Valid types from the schema
    const validDBTypes = ["single", "multiple", "agree", "rating"];
    
    // Normalize and validate questions
    const normalizedQuestions = questions.map((q: any) => {
      // Validate required fields
      if (!q.questionText || typeof q.questionText !== "string") {
        throw new Error('All questions must have valid text');
      }

      if (!q.type || typeof q.type !== "string") {
        throw new Error('All questions must have a valid type');
      }

      // Map frontend types to schema types
      let type: string;
      switch (q.type.toUpperCase()) {
        case 'SINGLE':
          type = 'single';
          break;
        case 'MULTIPLE_CHOICE':
          type = 'multiple';
          break;
        case 'AGREE_DISAGREE':
          type = 'agree';
          break;
        case 'RATING':
          type = 'rating';
          break;
        default:
          throw new Error(`Invalid question type: ${q.type}`);
      }

      // Validate options for choice types
      if (type === "single" || type === "multiple") {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          throw new Error('Choice questions must have at least 2 options');
        }
      }

      // Return properly formatted question object
      const question: any = {
        questionText: q.questionText,
        type,
      };

      // Add options if present
      if (Array.isArray(q.options) && q.options.length > 0) {
        question.options = q.options;
      }

      // Add rating scale if needed
      if (type === 'rating') {
        question.ratingScale = 5; // Default to 5-star rating
      }

      return question;
    });

    const slug = `${username}-${nanoid(8)}`;

    // Create the poll
    const poll = await PollFormModel.create({
      title,
      description: description || '',
      questions: normalizedQuestions,
      createdBy: org._id,
      organization: org._id,
      slug,
    });

    // Get organization username (name field) and user username from session
    const orgUsername = org.name; // Organization username from the model
    const userUsername = username; // User username from session

    // Construct the poll URL with the new format
    const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.truefeedback.xyz'}/u/org/${orgUsername}/${userUsername}/${slug}`;

    return NextResponse.json(
      { 
        message: 'Poll created successfully', 
        poll,
        pollUrl
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Poll creation error:', error);
    return NextResponse.json(
      { message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}