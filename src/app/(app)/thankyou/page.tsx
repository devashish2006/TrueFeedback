'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { CheckCircle, BarChart3, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function ThankYouPage() {
  const params = useParams();
  const { username, name, slug } = params;
  const [pollTitle, setPollTitle] = useState('');
  
  useEffect(() => {
    // Fetch poll data to get title (optional)
    const fetchPollInfo = async () => {
      try {
        const response = await fetch(`/api/polls/response?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPollTitle(data.title);
        }
      } catch (error) {
        console.error("Error fetching poll title:", error);
      }
    };
    
    fetchPollInfo();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div className="text-2xl font-bold">
              <span className="text-orange-500">True</span>
              <span className="text-white">Feedback</span>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
            <span className="text-orange-500 font-semibold text-sm">FastForwardPolls</span>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-lg w-full">
            {/* Success Card */}
            <div className="bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden">
              <div className="p-12 text-center">
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 scale-110"></div>
                    <CheckCircle className="relative h-20 w-20 text-green-500" />
                  </div>
                </div>
                
                {/* Title */}
                <h1 className="text-4xl font-bold text-white mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Response Submitted!
                </h1>
                
                {/* Subtitle */}
                <p className="text-gray-300 text-lg mb-4 leading-relaxed">
                  Your feedback for {pollTitle ? `"${pollTitle}"` : 'this poll'} has been successfully recorded.
                </p>
                
                <p className="text-gray-400 text-sm mb-10">
                  Thank you for taking the time to share your valuable insights with us.
                </p>
                
                {/* Action Buttons */}
                <div className="space-y-4 mb-12">
                  <Link 
                    href={`/u/org/${username}/${name}`} 
                    className="block w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5"
                  >
                    Explore More Polls
                  </Link>
                  
                  <Link 
                    href="/" 
                    className="block w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5"
                  >
                    Start Receiving Anonymous Messages
                  </Link>
                  
                  <Link 
                    href="/" 
                    className="block w-full py-4 px-8 rounded-2xl bg-gray-800/60 hover:bg-gray-700/60 backdrop-blur-sm text-white font-medium transition-all duration-300 border border-gray-700 hover:border-gray-600"
                  >
                    Back to Home
                  </Link>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-2xl p-6 border border-orange-500/20 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Start Your Journey with <span className="text-orange-500">True</span><span className="text-white">Feedback</span>
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Create powerful polls, collect anonymous feedback, and gain valuable insights at lightning speed.
                  </p>
                  <Link 
                    href="/" 
                    className="inline-block py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-colors"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="text-center mt-8 space-y-4">
              <div className="text-gray-400 text-sm">
                <span className="text-orange-500 font-semibold">FastForwardPolls</span> by{' '}
                <span className="text-orange-500 font-medium">True</span>
                <span className="text-white font-medium">Feedback</span>
              </div>
              
              <div className="text-gray-500 text-xs">
                Powered by{' '}
                <span className="text-orange-500 font-medium">True</span>
                <span className="text-white font-medium">Feedback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-6">
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">Follow us:</span>
                <div className="flex space-x-3">
                  <Link 
                    href="/" 
                    className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Twitter className="h-4 w-4 text-gray-400 group-hover:text-white" />
                  </Link>
                  <Link 
                    href="/" 
                    className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Linkedin className="h-4 w-4 text-gray-400 group-hover:text-white" />
                  </Link>
                  <Link 
                    href="/" 
                    className="w-10 h-10 bg-gray-800/60 hover:bg-gray-700/60 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <Instagram className="h-4 w-4 text-gray-400 group-hover:text-white" />
                  </Link>
                </div>
              </div>

              {/* Built by */}
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Built with ❤️ by{' '}
                  <span className="text-orange-500 font-medium">Devashish</span>
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  © {new Date().getFullYear()} TrueFeedback. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}