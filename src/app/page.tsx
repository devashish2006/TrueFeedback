'use client';

import { Mail, Github, Linkedin, Instagram } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
    router.push('/sign-in');
  };

  const handleSignUpClick = () => {
    router.push('/sign-up');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        {/* Animated Title Section */}
        <motion.section
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-300">
            True Feedback - Where your identity remains a secret.
          </p>
        </motion.section>

        {/* Animated Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex space-x-4 mb-8"
        >
          <button
            className="px-6 py-3 border border-gray-400 text-gray-400 rounded-lg hover:bg-gray-700 hover:border-gray-700 transition-colors hover:scale-105 transform"
            onClick={handleSignInClick}
          >
            Sign In
          </button>
          <button
            className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform"
            onClick={handleSignUpClick}
          >
            Sign Up
          </button>
        </motion.div>

        {/* Carousel for Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative w-full max-w-lg md:max-w-xl flex-grow"
        >
          <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full h-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="w-full bg-gray-800 border-gray-700 hover:shadow-lg hover:border-indigo-500 transition-all">
                    <CardHeader>
                      <CardTitle className="text-xl text-indigo-400">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 text-indigo-400" />
                      <div>
                        <p className="text-gray-300">{message.content}</p>
                        <p className="text-xs text-gray-500">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Buttons */}
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 hover:scale-110 transition-all" />
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 hover:scale-110 transition-all" />
          </Carousel>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-950">
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-300">Connect With ME :)</p>
        </div>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex justify-center space-x-6"
        >
          <a
            href="https://github.com/devashish2006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/devashish-mishra-436891254"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href="https://instagram.com/devashish_6363"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors hover:scale-110 transform"
          >
            <Instagram className="h-6 w-6" />
          </a>
        </motion.div>

        {/* Copyright */}
        <div className="mt-4 text-sm text-gray-500">
          © 2025 True Feedback. All rights reserved.
        </div>
      </footer>
    </div>
  );
}