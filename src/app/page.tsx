'use client';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Mail, Github, Linkedin, Instagram, MessageSquare, ChevronRight, Star, BarChart3, Circle, TrendingUp, Users, Zap, Shield, Share2, Eye, CheckCircle, X, Smile, Frown, Meh, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function TrueFeedbackLanding() {
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for access token in cookies
  useEffect(() => {
    const checkAuthToken = () => {
      try {
        // Get all cookies
        const cookies = document.cookie.split(';');
        
        // Look for access token
        const tokenCookie = cookies.find(cookie => 
          cookie.trim().startsWith('accessToken=') || 
          cookie.trim().startsWith('token=') ||
          cookie.trim().startsWith('authToken=')
        );
        
        if (tokenCookie) {
          const token = tokenCookie.split('=')[1];
          if (token && token.trim() !== '') {
            setHasAccessToken(true);
            // If user has token, redirect to /ask
            setTimeout(() => {
              window.location.href = '/ask';
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  // Handle Sign In click
  const handleSignInClick = () => {
    if (hasAccessToken) {
      window.location.href = '/ask';
    } else {
      window.location.href = '/sign-in';
    }
  };

  // Handle Start Free click
  const handleStartFreeClick = () => {
    if (hasAccessToken) {
      window.location.href = '/mypolls';
    } else {
      window.location.href = '/sign-up';
    }
  };

  // Handle Create First Poll click
  const handleCreateFirstPollClick = () => {
    if (hasAccessToken) {
      window.location.href = '/mypolls';
    } else {
      window.location.href = '/sign-up';
    }
  };

  // Handle Start Free Trial click
  const handleStartFreeTrialClick = () => {
    if (hasAccessToken) {
      window.location.href = '/mypolls';
    } else {
      window.location.href = '/sign-up';
    }
  };

  // Handle Schedule Demo click
  const handleScheduleDemoClick = () => {
    if (hasAccessToken) {
      window.location.href = '/ask';
    } else {
      window.location.href = '/sign-in';
    }
  };

  // Handle View Demo click
  const handleViewDemoClick = () => {
    if (hasAccessToken) {
      window.location.href = '/ask';
    } else {
      window.location.href = '/sign-in';
    }
  };

  // Sample data for charts
  const barData = [
    { name: 'Jan', responses: 120 },
    { name: 'Feb', responses: 190 },
    { name: 'Mar', responses: 300 },
    { name: 'Apr', responses: 280 },
    { name: 'May', responses: 450 },
    { name: 'Jun', responses: 520 }
  ];

  const pieData = [
    { name: 'Strongly Agree', value: 35, color: '#f97316' },
    { name: 'Agree', value: 28, color: '#fb923c' },
    { name: 'Neutral', value: 22, color: '#fdba74' },
    { name: 'Disagree', value: 10, color: '#fed7aa' },
    { name: 'Strongly Disagree', value: 5, color: '#fff7ed' }
  ];

  const areaData = [
    { name: 'Week 1', polls: 20, responses: 150 },
    { name: 'Week 2', polls: 35, responses: 280 },
    { name: 'Week 3', polls: 28, responses: 320 },
    { name: 'Week 4', polls: 42, responses: 480 }
  ];

  const messages = [
    {
      title: "Product Feedback Survey",
      content: "Your new feature update is incredible! The user interface feels much more intuitive and the performance improvements are noticeable.",
      received: "2 minutes ago"
    },
    {
      title: "Team Performance Review",
      content: "Anonymous feedback helps us improve our collaboration. The project management approach needs some adjustments for better efficiency.",
      received: "15 minutes ago"
    },
    {
      title: "Customer Service Rating",
      content: "Excellent support experience! The response time was quick and the solution provided was exactly what I needed.",
      received: "1 hour ago"
    }
  ];

  const pollTypes = [
    {
      icon: <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Single Choice Polls",
      description: "Quick yes/no questions or single-select options for decisive feedback",
      color: "from-orange-500 to-amber-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Multiple Choice Polls",
      description: "Comprehensive surveys with multiple selection options for detailed insights",
      color: "from-amber-500 to-yellow-500"
    },
    {
      icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Rating Polls",
      description: "5-star rating system to measure satisfaction and quality effectively",
      color: "from-orange-600 to-red-500"
    },
    {
      icon: <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Agree/Disagree Polls",
      description: "Simple consensus building with agree/disagree response options",
      color: "from-amber-600 to-orange-600"
    }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Custom Dashboard",
      description: "Beautiful, intuitive dashboard with real-time analytics and customizable widgets"
    },
    {
      icon: <Circle className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Advanced Analytics",
      description: "Comprehensive charts, graphs, and visual representations of your data"
    },
    {
      icon: <Share2 className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Unique URL Sharing",
      description: "Generate and share unique URLs for your polls with custom branding"
    },
    {
      icon: <Shield className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Anonymous Collection",
      description: "Collect responses anonymously to encourage honest and authentic feedback"
    },
    {
      icon: <Users className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Organization Ready",
      description: "Perfect for teams, companies, and organizations of all sizes"
    },
    {
      icon: <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12" />,
      title: "Custom Text Feedback",
      description: "Collect detailed written feedback with customizable text input fields"
    }
  ];

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center animate-pulse">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-orange-900/5 to-transparent opacity-30"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-orange-700/10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-amber-600/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-orange-600/5 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-50 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-orange-900/20 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-900/30">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">
                <span className="text-orange-400">True</span>
                <span className="text-white">Feedback</span>
              </h1>
              <p className="text-xs text-gray-400 hidden xs:block">collect Anonymously</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={handleSignInClick}
              className="px-3 sm:px-6 py-2 border border-orange-500/30 text-orange-400 rounded-lg bg-orange-950/10 hover:bg-orange-950/30 hover:border-orange-400/50 transition-all duration-300 text-sm sm:text-base"
            >
              {hasAccessToken ? 'Dashboard' : 'Sign In'}
            </button>
            <button 
              onClick={handleStartFreeClick}
              className="px-3 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-md shadow-orange-900/20 hover:shadow-orange-900/40 transition-all duration-300 text-sm sm:text-base"
            >
              {hasAccessToken ? 'My Polls' : 'Start Free'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative flex-grow z-10">
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex justify-center items-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-900/30 animate-bounce">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-4 sm:mb-6 leading-tight">
              FastForwardPolls
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-3 sm:mb-4">
              Collect Polls at Lightning Speed
            </p>
            <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12 max-w-3xl mx-auto px-2">
              Single polls, multiple choice, ratings, agree/disagree - all with custom dashboards, 
              advanced analytics, and anonymous collection. Perfect for organizations and personal use.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
              <button 
                onClick={handleCreateFirstPollClick}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 transition-all duration-300 text-base sm:text-lg"
              >
                {hasAccessToken ? 'Go to My Polls' : 'Create Your First Poll'}
              </button>
              <button 
                onClick={handleViewDemoClick}
                className="px-6 sm:px-8 py-3 sm:py-4 border border-orange-500/30 text-orange-400 rounded-xl bg-orange-950/10 hover:bg-orange-950/30 hover:border-orange-400/50 transition-all duration-300 text-base sm:text-lg"
              >
                {hasAccessToken ? 'View Dashboard' : 'View Demo'}
              </button>
            </div>

            {/* Live Demo Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
              {/* Bar Chart */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-500/40 transition-all duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  Response Trends
                </h3>
                <div className="w-full h-[160px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 20, right: 15, left: 15, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      />
                      <Bar 
                        dataKey="responses" 
                        radius={[4, 4, 0, 0]}
                      >
                        {barData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill="#f97316" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-500/40 transition-all duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <Circle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Poll Results
                </h3>
                <div className="w-full h-[160px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 15, left: 15, bottom: 10 }}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={65}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Area Chart */}
              <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-500/40 transition-all duration-300">
                <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  Growth Analytics
                </h3>
                <div className="w-full h-[160px] sm:h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 20, right: 15, left: 15, bottom: 5 }}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="responses" 
                        stroke="#f97316" 
                        fill="#f97316" 
                        fillOpacity={0.2}
                        strokeWidth={2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Poll Types Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-gradient-to-b from-transparent to-gray-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-4 sm:mb-6 leading-tight">
                Poll Types for Every Need
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2">
                Choose from multiple poll formats designed to capture exactly the feedback you need
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {pollTypes.map((poll, index) => (
                <div key={index} className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-500/40 hover:transform hover:scale-105 transition-all duration-300 group">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${poll.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:shadow-lg transition-all duration-300`}>
                    {React.cloneElement(poll.icon, { className: "w-6 h-6 sm:w-8 sm:h-8 text-white" })}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{poll.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{poll.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-4 sm:mb-6 leading-tight">
                Powerful Features
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-2">
                Everything you need to create, share, and analyze polls effectively
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 sm:p-8 hover:border-orange-500/40 hover:transform hover:scale-105 transition-all duration-300 group">
                  <div className="text-orange-500 mb-4 sm:mb-6 group-hover:text-orange-400 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Feedback Section */}
        <section className="px-4 sm:px-6 md:px-8 py-12 sm:py-16 bg-gradient-to-b from-gray-900/20 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-3 sm:mb-4 leading-tight">
                Live Anonymous Feedback
              </h2>
              <p className="text-base sm:text-lg text-gray-400 px-2">
                See how real users are sharing their thoughts anonymously
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-6 hover:border-orange-500/40 transition-all duration-300 animate-pulse" style={{animationDelay: `${index * 0.5}s`}}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 truncate">
                          {message.title}
                        </h4>
                        <Star className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" />
                      </div>
                      <p className="text-gray-300 mb-2 text-sm sm:text-base">{message.content}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{message.received}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 md:px-8 py-16 sm:py-20 bg-gradient-to-r from-orange-900/10 to-amber-900/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-4 sm:mb-6 leading-tight">
              Ready to Start Collecting Feedback?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-2">
              Join thousands of organizations using TrueFeedback to make better decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <button 
                onClick={handleStartFreeTrialClick}
                className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl hover:from-orange-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 transition-all duration-300 text-base sm:text-lg"
              >
                {hasAccessToken ? 'Go to My Polls' : 'Start Free Trial'}
              </button>
              <button 
                onClick={handleScheduleDemoClick}
                className="px-6 sm:px-10 py-3 sm:py-4 border border-orange-500/30 text-orange-400 rounded-xl bg-orange-950/10 hover:bg-orange-950/30 hover:border-orange-400/50 transition-all duration-300 text-base sm:text-lg"
              >
                {hasAccessToken ? 'View Dashboard' : 'Schedule Demo'}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 sm:py-12 bg-gradient-to-b from-transparent to-black border-t border-orange-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center md:justify-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
                    TrueFeedback
                  </span>
                  <p className="text-xs sm:text-sm text-gray-400">FastForwardPolls</p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md">
                The platform that transforms anonymous feedback into meaningful insights at lightning speed.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-gray-400 font-medium mb-3 sm:mb-4 text-sm sm:text-base">Connect with me</p>
              <div className="flex gap-3 sm:gap-4">
                <a href="https://github.com/devashish2006" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-950/20 border border-orange-500/30 flex items-center justify-center text-orange-400 hover:text-orange-300 hover:border-orange-400/50 hover:bg-orange-950/40 hover:scale-110 transition-all duration-300">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </a>
                <a href="https://www.linkedin.com/in/devashish-mishra-436891254" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-950/20 border border-orange-500/30 flex items-center justify-center text-orange-400 hover:text-orange-300 hover:border-orange-400/50 hover:bg-orange-950/40 hover:scale-110 transition-all duration-300">
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </a>
                <a href="https://instagram.com/devashish_6363" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-950/20 border border-orange-500/30 flex items-center justify-center text-orange-400 hover:text-orange-300 hover:border-orange-400/50 hover:bg-orange-950/40 hover:scale-110 transition-all duration-300">
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-orange-900/10 text-center">
            <div className="text-xs sm:text-sm text-gray-500 mb-2">
              © 2025 TrueFeedback. All rights reserved.
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Developed with <span className="text-orange-500">❤️</span> by{" "}
              <a href="https://github.com/devashish2006" target="_blank" rel="noopener noreferrer" 
                 className="text-orange-400 hover:text-orange-300 transition-colors">
                Devashish Mishra
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}