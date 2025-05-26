// /api/dataPoll/route.ts
import { NextResponse } from "next/server";
import PollFormModel from "@/model/pollFormModel";
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const orgUsername = searchParams.get('orgUsername');
    const userUsername = searchParams.get('userUsername');

    if (!slug) {
      return NextResponse.json(
        { error: "Poll slug is required" },
        { status: 400 }
      );
    }

    // Find poll by slug
    let query = PollFormModel.findOne({ slug });

    // Add population based on available parameters
    if (orgUsername) {
      query = query.populate({
        path: 'organization',
        match: { username: orgUsername },
        select: 'name username'
      });
    } else {
      query = query.populate({
        path: 'organization',
        select: 'name username'
      });
    }

    if (userUsername) {
      query = query.populate({
        path: 'createdBy',
        match: { username: userUsername },
        select: 'name username'
      });
    } else {
      query = query.populate({
        path: 'createdBy',
        select: 'name username'
      });
    }

    const poll = await query.lean();

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // If specific org/user was requested, validate they match
    if (orgUsername && !poll.organization) {
      return NextResponse.json(
        { error: "Poll not found for the specified organization" },
        { status: 404 }
      );
    }

    if (userUsername && !poll.createdBy) {
      return NextResponse.json(
        { error: "Poll not found for the specified user" },
        { status: 404 }
      );
    }

    // Return poll data for public viewing/filling
    const pollData = {
      id: poll._id,
      title: poll.title,
      description: poll.description,
      questions: poll.questions.map(question => ({
        _id: question._id,
        questionText: question.questionText,
        type: question.type,
        options: question.options,
        ratingScale: question.ratingScale || 5
      })),
      responseCount: poll.responses?.length || 0,
      organization: poll.organization,
      createdBy: poll.createdBy,
      slug: poll.slug,
      createdAt: poll.createdAt,
      // Add URL context for frontend if provided
      urlContext: {
        orgUsername: orgUsername || poll.organization?.username,
        userUsername: userUsername || poll.createdBy?.username,
        slug
      }
    };

    return NextResponse.json(pollData);
    
  } catch (error) {
    console.error("Error fetching poll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Get query parameters from the URL
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const orgUsername = searchParams.get('orgUsername');
    const userUsername = searchParams.get('userUsername');

    if (!slug) {
      return NextResponse.json(
        { error: "Poll slug is required" },
        { status: 400 }
      );
    }

    // Find poll
    let query = PollFormModel.findOne({ slug });

    if (orgUsername) {
      query = query.populate({
        path: 'organization',
        match: { username: orgUsername },
        select: 'name username'
      });
    } else {
      query = query.populate({
        path: 'organization',
        select: 'name username'
      });
    }

    if (userUsername) {
      query = query.populate({
        path: 'createdBy',
        match: { username: userUsername },
        select: 'name username'
      });
    } else {
      query = query.populate({
        path: 'createdBy',
        select: 'name username'
      });
    }

    const poll = await query;

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    // If specific org/user was requested, validate they match
    if (orgUsername && !poll.organization) {
      return NextResponse.json(
        { error: "Poll not found for the specified organization" },
        { status: 404 }
      );
    }

    if (userUsername && !poll.createdBy) {
      return NextResponse.json(
        { error: "Poll not found for the specified user" },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Valid answers are required" },
        { status: 400 }
      );
    }

    if (answers.length !== poll.questions.length) {
      return NextResponse.json(
        { error: "All questions must be answered" },
        { status: 400 }
      );
    }

    // Validate each answer
    const questionIds = poll.questions.map(q => q._id.toString());
    
    for (const answer of answers) {
      if (!answer.questionId || !questionIds.includes(answer.questionId.toString())) {
        return NextResponse.json(
          { error: "Invalid question ID in answer" },
          { status: 400 }
        );
      }

      const question = poll.questions.find(q => 
        q._id.toString() === answer.questionId.toString()
      );

      if (!question) continue;

      // Validate based on question type
      switch (question.type) {
        case "single":
          if (!answer.selectedOptions || answer.selectedOptions.length !== 1 || 
              !question.options?.includes(answer.selectedOptions[0])) {
            return NextResponse.json(
              { error: `Invalid answer for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        case "multiple":
          if (!answer.selectedOptions || answer.selectedOptions.length === 0 ||
              !answer.selectedOptions.every(opt => question.options?.includes(opt))) {
            return NextResponse.json(
              { error: `Invalid answer for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        case "agree":
          if (typeof answer.agreement !== 'boolean') {
            return NextResponse.json(
              { error: `Invalid answer for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
        
        case "rating":
          if (typeof answer.rating !== 'number' || 
              answer.rating < 1 || 
              answer.rating > (question.ratingScale || 5)) {
            return NextResponse.json(
              { error: `Invalid rating for question: ${question.questionText}` },
              { status: 400 }
            );
          }
          break;
      }
    }

    // Create and save response
    const response = {
      answers: answers.map(answer => ({
        questionId: answer.questionId,
        selectedOptions: answer.selectedOptions,
        agreement: answer.agreement,
        rating: answer.rating
      })).filter(ans => 
        ans.selectedOptions || 
        ans.agreement !== undefined || 
        ans.rating !== undefined
      ),
      submittedAt: new Date()
    };

    poll.responses.push(response);
    await poll.save();

    const finalOrgUsername = orgUsername || poll.organization?.username;
    const finalUserUsername = userUsername || poll.createdBy?.username;

    return NextResponse.json({ 
      success: true, 
      message: "Response submitted successfully",
      responseId: poll.responses[poll.responses.length - 1]._id,
      totalResponses: poll.responses.length,
      redirectUrl: finalOrgUsername && finalUserUsername 
        ? `/u/org/${finalOrgUsername}/${finalUserUsername}/${slug}/thanks`
        : `/poll/${slug}/thanks`
    });
    
  } catch (error) {
    console.error("Error submitting poll response:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}