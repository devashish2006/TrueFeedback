import { NextResponse } from "next/server";
import PollFormModel from "@/model/pollFormModel";
import dbConnect from '@/lib/dbConnect';
import { Types } from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Extract poll slug from URL path or search params
    const { searchParams, pathname } = new URL(request.url);
    let slug = searchParams.get('slug');
    
    // If slug not in search params, extract from pathname
    // Route pattern: /u/org/[orgUsername]/[userUsername]/[slug]
    if (!slug) {
      const pathSegments = pathname.split('/');
      slug = pathSegments[pathSegments.length - 1]; // Get last segment as slug
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Poll slug is required" },
        { status: 400 }
      );
    }

    // Find poll by slug
    const poll = await PollFormModel.findOne({ slug });

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Valid answers are required" },
        { status: 400 }
      );
    }

    // Validate that all questions are answered
    if (answers.length !== poll.questions.length) {
      return NextResponse.json(
        { error: "All questions must be answered" },
        { status: 400 }
      );
    }

    // Validate answers against poll questions
    const questionIds = poll.questions.map(q => q._id.toString());
    
    // Validate each answer corresponds to an actual question in the poll
    for (const answer of answers) {
      if (!answer.questionId) {
        return NextResponse.json(
          { error: "Each answer must include a questionId" },
          { status: 400 }
        );
      }

      // Check if the questionId exists in this poll
      if (!questionIds.includes(answer.questionId.toString())) {
        return NextResponse.json(
          { error: `Question with ID ${answer.questionId} not found in this poll` },
          { status: 400 }
        );
      }

      // Find the question to validate the answer format
      const question = poll.questions.find(q => 
        q._id.toString() === answer.questionId.toString()
      );

      if (!question) continue;

      // Validate answer based on question type
      switch (question.type) {
        case "single":
          if (!answer.selectedOptions || answer.selectedOptions.length !== 1) {
            return NextResponse.json(
              { error: `Single choice question requires exactly one answer for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          if (!question.options?.includes(answer.selectedOptions[0])) {
            return NextResponse.json(
              { error: `Invalid option selected for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        case "multiple":
          if (!answer.selectedOptions || answer.selectedOptions.length === 0) {
            return NextResponse.json(
              { error: `Multiple choice question requires at least one answer for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          for (const option of answer.selectedOptions) {
            if (!question.options?.includes(option)) {
              return NextResponse.json(
                { error: `Invalid option selected for question: ${question.questionText}` },
                { status: 400 }
              );
            }
          }
          break;
        
        case "agree":
          if (typeof answer.agreement !== 'boolean') {
            return NextResponse.json(
              { error: `Agreement question requires a boolean value for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        case "rating":
          if (typeof answer.rating !== 'number' || 
              answer.rating < 1 || 
              answer.rating > (question.ratingScale || 5)) {
            return NextResponse.json(
              { error: `Rating question requires a number between 1 and ${question.ratingScale || 5} for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        default:
          return NextResponse.json(
            { error: `Unknown question type: ${question.type}` },
            { status: 400 }
          );
      }
    }

    // Create the response object
    const response = {
      answers: answers.map(answer => ({
        questionId: new Types.ObjectId(answer.questionId),
        selectedOptions: answer.selectedOptions || undefined,
        agreement: answer.agreement !== undefined ? answer.agreement : undefined,
        rating: answer.rating || undefined
      })),
      submittedAt: new Date()
    };

    // Add response to poll
    poll.responses.push(response);
    await poll.save();

    return NextResponse.json({ 
      success: true, 
      message: "Response submitted successfully",
      responseId: poll.responses[poll.responses.length - 1]._id,
      totalResponses: poll.responses.length
    });
    
  } catch (error) {
    console.error("Error submitting poll response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch poll by slug (for public access)
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams, pathname } = new URL(request.url);
    let slug = searchParams.get('slug');
    
    // If slug not in search params, extract from pathname
    // Route pattern: /u/org/[orgUsername]/[userUsername]/[slug]
    if (!slug) {
      const pathSegments = pathname.split('/');
      slug = pathSegments[pathSegments.length - 1]; // Get last segment as slug
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Poll slug is required" },
        { status: 400 }
      );
    }

    // First, get the poll with responses to count them
    const pollWithResponses = await PollFormModel.findOne({ slug }).lean();
    
    if (!pollWithResponses) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Now get poll data without responses for public display
    const poll = await PollFormModel.findOne(
      { slug },
      { responses: 0 } // Exclude responses for privacy
    )
    .populate('organization', 'name username')
    .lean();

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // Return poll data for filling out (without existing responses)
    return NextResponse.json({
      id: poll._id,
      title: poll.title,
      description: poll.description,
      questions: poll.questions,
      responseCount: pollWithResponses.responses?.length || 0,
      organization: poll.organization,
      slug: poll.slug,
      createdAt: poll.createdAt
    });
    
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}