import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import PollFormModel from "@/model/pollFormModel";
import OrganizationModel from "@/model/organisation";
import dbConnect from '@/lib/dbConnect';

// GET /api/polls/[pollId]/responses
export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pollId } = params;

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

    // Find the poll and verify ownership
    const poll = await PollFormModel.findOne({
      _id: pollId,
      createdBy: organization._id,
      organization: organization._id
    })
      .populate("organization", "name username")
      .lean();

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found or unauthorized" },
        { status: 404 }
      );
    }

    // Process responses with question context
    const processedResponses = poll.responses.map((response, index) => {
      const processedAnswers = response.answers.map(answer => {
        // Find the corresponding question
        const question = poll.questions.find(q => 
          q._id.toString() === answer.questionId.toString()
        );

        return {
          questionId: answer.questionId,
          questionText: question?.questionText || "Question not found",
          questionType: question?.type || "unknown",
          answer: {
            selectedOptions: answer.selectedOptions || [],
            agreement: answer.agreement,
            rating: answer.rating
          },
          // Format answer for display based on question type
          displayValue: formatAnswerForDisplay(answer, question)
        };
      });

      return {
        responseId: response._id,
        responseNumber: index + 1,
        submittedAt: response.submittedAt,
        answers: processedAnswers,
        totalAnswers: processedAnswers.length
      };
    });

    // Calculate response statistics
    const responseStats = calculateResponseStats(poll.questions, poll.responses);

    const result = {
      poll: {
        _id: poll._id,
        title: poll.title,
        description: poll.description,
        organization: poll.organization,
        createdAt: poll.createdAt,
        slug: poll.slug,
        totalQuestions: poll.questions.length,
        totalResponses: poll.responses.length
      },
      questions: poll.questions,
      responses: processedResponses,
      statistics: responseStats
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching poll responses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to format answers for display
function formatAnswerForDisplay(answer, question) {
  if (!question) return "N/A";

  switch (question.type) {
    case "single":
      return answer.selectedOptions?.[0] || "No selection";
    
    case "multiple":
      return answer.selectedOptions?.length > 0 
        ? answer.selectedOptions.join(", ") 
        : "No selections";
    
    case "agree":
      return answer.agreement !== undefined 
        ? (answer.agreement ? "Agree" : "Disagree") 
        : "No response";
    
    case "rating":
      return answer.rating !== undefined 
        ? `${answer.rating}/${question.ratingScale || 5}` 
        : "No rating";
    
    default:
      return "Unknown response type";
  }
}

// Helper function to calculate response statistics
function calculateResponseStats(questions, responses) {
  const stats = {};

  questions.forEach(question => {
    const questionId = question._id.toString();
    const questionStats = {
      questionId,
      questionText: question.questionText,
      questionType: question.type,
      totalResponses: 0,
      data: {}
    };

    // Count responses for this question
    responses.forEach(response => {
      const answer = response.answers.find(a => 
        a.questionId.toString() === questionId
      );

      if (answer) {
        questionStats.totalResponses++;

        switch (question.type) {
          case "single":
            const singleOption = answer.selectedOptions?.[0];
            if (singleOption) {
              questionStats.data[singleOption] = (questionStats.data[singleOption] || 0) + 1;
            }
            break;

          case "multiple":
            answer.selectedOptions?.forEach(option => {
              questionStats.data[option] = (questionStats.data[option] || 0) + 1;
            });
            break;

          case "agree":
            if (answer.agreement !== undefined) {
              const key = answer.agreement ? "Agree" : "Disagree";
              questionStats.data[key] = (questionStats.data[key] || 0) + 1;
            }
            break;

          case "rating":
            if (answer.rating !== undefined) {
              const ratingKey = `Rating ${answer.rating}`;
              questionStats.data[ratingKey] = (questionStats.data[ratingKey] || 0) + 1;
              
              // Calculate average rating
              if (!questionStats.averageRating) {
                questionStats.averageRating = { sum: 0, count: 0 };
              }
              questionStats.averageRating.sum += answer.rating;
              questionStats.averageRating.count++;
            }
            break;
        }
      }
    });

    // Calculate final average for rating questions
    if (question.type === "rating" && questionStats.averageRating) {
      questionStats.averageRating.average = 
        questionStats.averageRating.sum / questionStats.averageRating.count;
    }

    stats[questionId] = questionStats;
  });

  return stats;
}

// Optional: Add endpoint to get responses in CSV format
export async function GET_CSV(request: Request, { params }: { params: { pollId: string } }) {
  // This would be a separate endpoint like /api/polls/[pollId]/responses/csv
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { pollId } = params;

    // Get poll data (similar to above)
    const organization = await OrganizationModel.findOne({ 
      username: session.user.username 
    });

    const poll = await PollFormModel.findOne({
      _id: pollId,
      createdBy: organization._id,
      organization: organization._id
    }).lean();

    if (!poll) {
      return NextResponse.json(
        { error: "Poll not found or unauthorized" },
        { status: 404 }
      );
    }

    // Generate CSV content
    let csvContent = "Response ID,Submitted At";
    
    // Add question headers
    poll.questions.forEach(question => {
      csvContent += `,"${question.questionText.replace(/"/g, '""')}"`;
    });
    csvContent += "\n";

    // Add response rows
    poll.responses.forEach((response, index) => {
      let row = `${index + 1},"${response.submittedAt.toISOString()}"`;
      
      poll.questions.forEach(question => {
        const answer = response.answers.find(a => 
          a.questionId.toString() === question._id.toString()
        );
        
        let cellValue = "";
        if (answer) {
          cellValue = formatAnswerForDisplay(answer, question);
        }
        
        row += `,"${cellValue.replace(/"/g, '""')}"`;
      });
      
      csvContent += row + "\n";
    });

    // Return CSV response
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="poll-${poll.slug}-responses.csv"`
      }
    });

  } catch (error) {
    console.error("Error generating CSV:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}