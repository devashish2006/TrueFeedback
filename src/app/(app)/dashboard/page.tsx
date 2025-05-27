'use client';

import { MessageCard } from '@/components/ui/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '../../../../types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, LogOut, Copy, Bell, BarChart3, MessageSquare, Users, TrendingUp, Zap } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const newValue = !acceptMessages;
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: newValue,
      });
      setValue('acceptMessages', newValue);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  const handleFastForwardPolls = () => {
    router.push('/ask');
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Premium Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/90 backdrop-blur-lg border-b border-orange-500/20 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-50"
      >
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-2 sm:mr-3 flex items-center justify-center shadow-lg">
            <BarChart3 size={16} className="sm:hidden text-white" />
            <BarChart3 size={20} className="hidden sm:block text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">
            <span className="text-orange-500">True</span>
            <span className="text-white">Feedback</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={handleFastForwardPolls}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium flex items-center px-4 sm:px-6 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base"
          >
            <Zap className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">FastForwardPolls</span>
            <span className="sm:hidden">Polls</span>
          </Button>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="bg-white/5 hover:bg-white/10 text-white font-medium flex items-center px-3 sm:px-6 py-2 rounded-xl transition-all duration-300 border border-white/10 hover:border-orange-500/30 text-sm sm:text-base"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 sm:mb-12 text-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 px-2">
            Welcome back, {username}
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 font-light px-4">Your premium feedback management hub</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-orange-500">{messages.length}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Total Messages</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Anonymous feedback received</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-orange-500">{acceptMessages ? 'ON' : 'OFF'}</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Status</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Message acceptance</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-orange-500">100%</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">Privacy</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Completely anonymous</p>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Share Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-1 lg:col-span-2 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-3 sm:mr-4 flex items-center justify-center">
                <Copy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Share Your Profile</h2>
            </div>
            <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Share this link to receive anonymous feedback from anyone</p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="w-full p-3 sm:p-4 bg-black/40 text-gray-200 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-xs sm:text-sm break-all"
              />
              <Button
                onClick={copyToClipboard}
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </motion.div>

          {/* Settings Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-3 sm:mr-4 flex items-center justify-center">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Settings</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-black/30 rounded-xl border border-gray-700/50">
                <div className="flex-1 min-w-0">
                  <span className="text-white font-medium text-sm sm:text-base">Accept Messages</span>
                  <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    {acceptMessages ? 'Currently receiving messages' : 'Messages are disabled'}
                  </p>
                </div>
                <div className="ml-3 sm:ml-4">
                  <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-orange-500/20 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-3 sm:mr-4 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Messages</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="w-full sm:w-auto border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 rounded-xl flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 text-sm sm:text-base"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="sm:inline">Refresh Messages</span>
              <span className="sm:hidden">Refresh</span>
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <MessageCard
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-black/20 rounded-xl border border-gray-700/30">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-4 sm:mb-6">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500/60" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-center max-w-md text-sm sm:text-base px-4">
                Share your profile link to start receiving anonymous feedback from your audience.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Premium Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="border-t border-orange-500/10 py-6 sm:py-8 text-center"
      >
        <div className="flex items-center justify-center mb-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
            <BarChart3 size={10} className="sm:hidden text-white" />
            <BarChart3 size={12} className="hidden sm:block text-white" />
          </div>
          <span className="text-orange-500 font-semibold text-sm sm:text-base">True</span>
          <span className="text-white font-semibold text-sm sm:text-base">Feedback</span>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm">© 2025 • Premium Anonymous Feedback Platform</p>
      </motion.footer>
    </div>
  );
}

export default UserDashboard;