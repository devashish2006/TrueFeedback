'use client';

import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { useRouter } from 'next/navigation';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/sign-in'); // Redirect to the sign-in page
  };

  const handleSignUpClick = () => {
    router.push('/sign-up'); // Redirect to the sign-up page
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Sign In / Sign Up Buttons */}
        <div className="flex space-x-4 mb-8">
          <button
            className="px-6 py-3 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-700 hover:border-gray-700 transition-colors"
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <button
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white font-semibold transition-all"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </div>

        {/* Carousel for Messages */}
        <div className="relative w-full max-w-lg md:max-w-xl flex-grow">
          <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full h-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{message.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0" />
                      <div>
                        <p>{message.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600">
              &#8592;
            </CarouselPrevious>
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600">
              &#8594;
            </CarouselNext>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2025 True Feedback. All rights reserved.
      </footer>
    </div>
  );
}
