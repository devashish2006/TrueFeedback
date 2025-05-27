import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollFormModel from "@/model/pollFormModel";
import OrganizationModel from "@/model/organisation";
import dbConnect from '@/lib/dbConnect';
import { Types } from 'mongoose';

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
      createdBy: organization._id,
      organization: organization._id
    })
      .populate("organization", "name username")
      .lean();

    const pollsWithUrls = polls.map((poll) => {
      // Process responses for better frontend consumption
      const processedResponses = poll.responses.map((response, index) => ({
        id: index + 1,
        submittedAt: response.submittedAt,
        answers: response.answers.map(answer => {
          const question = poll.questions.find(q => q._id?.toString() === answer.questionId.toString());
          return {
            questionId: answer.questionId,
            questionText: question?.questionText || 'Question not found',
            questionType: question?.type || 'unknown',
            selectedOptions: answer.selectedOptions || [],
            agreement: answer.agreement,
            rating: answer.rating
          };
        })
      }));

      // Calculate response analytics
      const responseAnalytics = {
        totalResponses: poll.responses.length,
        averageCompletionTime: null,
        responsesByDate: poll.responses.reduce((acc, response) => {
          const date = response.submittedAt.toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}),
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
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.truefeedback.xyz/'}/u/org/${organization.name}/${session.user.username}/${poll.slug}`,
        status: poll.responses.length > 0 ? 'active' : 'inactive',
        responsesCount: poll.responses.length,
        createdAt: poll.createdAt,
        questionsCount: poll.questions.length,
        responses: processedResponses,
        analytics: responseAnalytics,
        // Explicitly include organization details for frontend
        organizationInfo: {
          id: organization._id,
          name: organization.name,
          username: organization.username
        }
      };
    });

    // Return polls with organization information
    return NextResponse.json({
      polls: pollsWithUrls,
      organization: {
        id: organization._id,
        name: organization.name,
        username: organization.username
      }
    });
  } catch (error) {
    console.error("Error fetching polls:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get pollId from query parameters
    const { searchParams } = new URL(request.url);
    const pollId = searchParams.get('pollId');

    console.log("DELETE request received for pollId:", pollId);

    if (!pollId) {
      return NextResponse.json(
        { error: "Poll ID is required as query parameter (?pollId=...)" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(pollId)) {
      return NextResponse.json(
        { error: "Invalid Poll ID format" },
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

    console.log("Organization found:", organization.name, "ID:", organization._id);

    // Find the poll first to verify ownership
    const poll = await PollFormModel.findById(pollId);

    if (!poll) {
      console.log("Poll not found with ID:", pollId);
      return NextResponse.json(
        { error: "Poll not found" },
        { status: 404 }
      );
    }

    console.log("Poll found:", poll.title);
    console.log("Poll createdBy:", poll.createdBy);
    console.log("Poll organization:", poll.organization);
    console.log("User organization:", organization._id);

    // Check if poll belongs to user's organization
    const pollCreatedBy = poll.createdBy?.toString();
    const pollOrganization = poll.organization?.toString();
    const userOrgId = organization._id.toString();

    if (pollCreatedBy !== userOrgId && pollOrganization !== userOrgId) {
      console.log("Unauthorized access attempt");
      console.log("Poll createdBy:", pollCreatedBy);
      console.log("Poll organization:", pollOrganization);
      console.log("User organization:", userOrgId);
      
      return NextResponse.json(
        { error: "Unauthorized - Poll does not belong to your organization" },
        { status: 403 }
      );
    }

    console.log("Authorization check passed, proceeding with deletion");

    // Delete the poll
    const deleteResult = await PollFormModel.findByIdAndDelete(pollId);
    
    if (!deleteResult) {
      console.log("Failed to delete poll - poll may have been already deleted");
      return NextResponse.json(
        { error: "Failed to delete poll - it may have been already deleted" },
        { status: 404 }
      );
    }

    console.log("Poll deleted successfully:", deleteResult.title);

    return NextResponse.json({ 
      success: true,
      message: "Poll deleted successfully",
      deletedPoll: {
        id: deleteResult._id,
        slug: deleteResult.slug,
        title: deleteResult.title
      },
      organization: {
        id: organization._id,
        name: organization.name,
        username: organization.username
      }
    });

  } catch (error) {
    console.error("Error deleting poll:", error);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}