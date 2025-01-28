import { NextResponse } from 'next/server';

// Predefined feedback messages array
const feedbackMessages = [
  {
    id: 1,
    message: "Your positive attitude lights up the room! Keep spreading that good energy."
  },
  {
    id: 2,
    message: "Consider working on your time management - being punctual can make a big difference!"
  },
  {
    id: 3,
    message: "Your creativity is amazing, but try to focus more on completing tasks before starting new ones."
  },
  {
    id: 4,
    message: "You have great ideas! Practice speaking up more in group discussions."
  },
  {
    id: 5,
    message: "Your work ethic is admirable. Consider taking short breaks to avoid burnout."
  },
  {
    id: 6,
    message: "Try to improve your handwriting - it will make your notes more valuable to yourself and others."
  },
  {
    id: 7,
    message: "Your humor brings joy to others! Just remember to read the room in serious situations."
  },
  {
    id: 8,
    message: "You're great at solving problems! Consider explaining your thought process to help others learn."
  },
  {
    id: 9,
    message: "Your dedication is inspiring! Try to maintain a better work-life balance."
  },
  {
    id: 10,
    message: "You're a good listener, but don't hesitate to share your own thoughts and perspectives."
  }
];

export async function POST(request: Request) {
  try {
    // Get three random feedback messages
    const shuffledFeedback = [...feedbackMessages]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      suggestions: shuffledFeedback
    });

  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate suggestions',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}