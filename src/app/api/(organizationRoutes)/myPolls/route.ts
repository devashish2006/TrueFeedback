import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollFormModel from "@/model/pollFormModel";
import OrganizationModel from "@/model/organisation";
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // First, get the organization for this user
    const organization = await OrganizationModel.findOne({ 
      username: session.user.username 
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Find polls created by this user's organization
    const polls = await PollFormModel.find({
      createdBy: organization._id,  // Changed from session.user.id to organization._id
      organization: organization._id
    })
      .populate("organization", "name username")  // Only populate specific fields
      .lean();

    const pollsWithUrls = polls.map((poll) => {
      // Process responses for better frontend consumption
      const processedResponses = poll.responses.map((response, index) => ({
        id: index + 1, // Since responses don't have _id, use index-based ID
        submittedAt: response.submittedAt,
        answers: response.answers.map(answer => {
          // Find the corresponding question to provide context
          const question = poll.questions.find(q => q._id?.toString() === answer.questionId.toString());
          return {
            questionId: answer.questionId,
            questionText: question?.questionText || 'Question not found',
            questionType: question?.type || 'unknown',
            // Include all possible answer types
            selectedOptions: answer.selectedOptions || [],
            agreement: answer.agreement,
            rating: answer.rating
          };
        })
      }));

      // Calculate response analytics
      const responseAnalytics = {
        totalResponses: poll.responses.length,
        averageCompletionTime: null, // Could be calculated if you track start/end times
        responsesByDate: poll.responses.reduce((acc, response) => {
          const date = response.submittedAt.toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}),
        // Question-level analytics
        questionAnalytics: poll.questions.map(question => {
          const questionResponses = poll.responses.flatMap(response => 
            response.answers.filter(answer => 
              answer.questionId.toString() === question._id?.toString()
            )
          );

          let analytics = {
            questionId: question._id,
            questionText: question.questionText,
            type: question.type,
            totalResponses: questionResponses.length
          };

          // Add type-specific analytics
          switch (question.type) {
            case 'single':
            case 'multiple':
              const optionCounts = {};
              questionResponses.forEach(response => {
                response.selectedOptions?.forEach(option => {
                  optionCounts[option] = (optionCounts[option] || 0) + 1;
                });
              });
              analytics.optionCounts = optionCounts;
              break;

            case 'agree':
              const agreeCounts = { agree: 0, disagree: 0 };
              questionResponses.forEach(response => {
                if (response.agreement === true) agreeCounts.agree++;
                if (response.agreement === false) agreeCounts.disagree++;
              });
              analytics.agreementCounts = agreeCounts;
              break;

            case 'rating':
              const ratings = questionResponses.map(r => r.rating).filter(Boolean);
              analytics.ratingStats = {
                average: ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0,
                min: Math.min(...ratings) || 0,
                max: Math.max(...ratings) || 0,
                distribution: ratings.reduce((acc, rating) => {
                  acc[rating] = (acc[rating] || 0) + 1;
                  return acc;
                }, {})
              };
              break;
          }

          return analytics;
        })
      };

      return {
        ...poll,
        slug: poll.slug,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/u/org/${session.user.username}/${poll.organization.name}/${poll.slug}`,
        status: poll.responses.length > 0 ? 'active' : 'inactive',
        responsesCount: poll.responses.length,
        createdAt: poll.createdAt,
        questionsCount: poll.questions.length,
        // Enhanced response data
        responses: processedResponses,
        analytics: responseAnalytics
      };
    });

    return NextResponse.json(pollsWithUrls);
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');

    if (!pollId) {
      return NextResponse.json(
        { error: "Poll ID is required" },
        { status: 400 }
      );
    }

    // Get user's organization
    const organization = await OrganizationModel.findOne({ 
      username: session.user.username 
    });

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Verify the poll belongs to the user's organization
    const poll = await PollFormModel.findOne({
      _id: pollId,
      createdBy: organization._id,  // Changed from session.user.id
      organization: organization._id
    });

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found or unauthorized" },
        { status: 404 }
      );
    }

    await PollFormModel.deleteOne({ _id: pollId });
    return NextResponse.json({ 
      message: "Poll deleted successfully",
      deletedPoll: {
        id: poll._id,
        slug: poll.slug,
        title: poll.title
      }
    });
  } catch (error) {
    console.error("Error deleting poll:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}