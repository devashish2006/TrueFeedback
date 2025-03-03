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
  },
  {
    id: 11,
    message: "I admire your confidence! It’s contagious and inspires everyone around you."
  },
  {
    id: 12,
    message: "You have a unique way of seeing the world. Never lose that perspective!"
  },
  {
    id: 13,
    message: "Your kindness is your superpower. Keep being the amazing person you are!"
  },
  {
    id: 14,
    message: "You’re doing great, but don’t forget to take care of yourself too."
  },
  {
    id: 15,
    message: "Your energy is magnetic! People love being around you."
  },
  {
    id: 16,
    message: "You’re incredibly talented, but don’t forget to ask for help when you need it."
  },
  {
    id: 17,
    message: "Your passion is inspiring! Keep chasing your dreams."
  },
  {
    id: 18,
    message: "You’re a natural leader. People look up to you more than you realize."
  },
  {
    id: 19,
    message: "Your smile is contagious! It brightens everyone’s day."
  },
  {
    id: 20,
    message: "You’re doing an amazing job, but don’t forget to celebrate your wins!"
  },
  {
    id: 21,
    message: "I think I’m falling for you. Your presence makes everything better."
  },
  {
    id: 22,
    message: "You’re the kind of person I could talk to for hours and never get bored."
  },
  {
    id: 23,
    message: "I can’t stop thinking about you. You’re always on my mind."
  },
  {
    id: 24,
    message: "You’re the most beautiful person I’ve ever met, inside and out."
  },
  {
    id: 25,
    message: "I love the way you make me feel. You’re my safe place."
  },
  {
    id: 26,
    message: "You’re the reason I believe in love. Thank you for being you."
  },
  {
    id: 27,
    message: "I’m so angry right now, but I know we can work through this together."
  },
  {
    id: 28,
    message: "Your actions hurt me, but I believe in us and our ability to grow."
  },
  {
    id: 29,
    message: "I’m frustrated, but I still care about you deeply."
  },
  {
    id: 30,
    message: "I need some space right now, but I still value our relationship."
  },
  {
    id: 31,
    message: "I’m upset, but I know we can find a way to move forward."
  },
  {
    id: 32,
    message: "You make my heart skip a beat every time I see you."
  },
  {
    id: 33,
    message: "I love the way you look at me. It makes me feel so special."
  },
  {
    id: 34,
    message: "You’re my favorite person to talk to. I could listen to you forever."
  },
  {
    id: 35,
    message: "I feel so lucky to have you in my life. You’re truly one of a kind."
  },
  {
    id: 36,
    message: "You’re my happy place. Being with you feels like home."
  },
  {
    id: 37,
    message: "I love the way you make me laugh. You’re my favorite comedian."
  },
  {
    id: 38,
    message: "You’re my everything. I can’t imagine my life without you."
  },
  {
    id: 39,
    message: "I’m so grateful for you. You make my life so much better."
  },
  {
    id: 40,
    message: "You’re my rock. I know I can always count on you."
  },
  {
    id: 41,
    message: "I love the way you challenge me to be a better person."
  },
  {
    id: 42,
    message: "You’re my favorite adventure. Life with you is never boring."
  },
  {
    id: 43,
    message: "I love the way you care for others. It’s one of my favorite things about you."
  },
  {
    id: 44,
    message: "You’re my sunshine on a cloudy day. Thank you for being you."
  },
  {
    id: 45,
    message: "I love the way you make me feel seen and heard. You’re truly special."
  },
  {
    id: 46,
    message: "You’re my favorite part of every day. I’m so lucky to have you."
  },
  {
    id: 47,
    message: "I love the way you inspire me to dream bigger. You’re my motivation."
  },
  {
    id: 48,
    message: "You’re my favorite person to share silence with. It’s always comfortable with you."
  },
  {
    id: 49,
    message: "I love the way you make even the ordinary moments feel extraordinary."
  },
  {
    id: 50,
    message: "You’re my favorite chapter in the story of my life. I can’t wait to see what’s next."
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