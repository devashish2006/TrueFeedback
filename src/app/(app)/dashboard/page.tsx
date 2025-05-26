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
import { Loader2, RefreshCcw, LogOut, Copy, Bell, BarChart3, MessageSquare, Users, TrendingUp } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { motion } from 'framer-motion';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

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
        className="bg-black/90 backdrop-blur-lg border-b border-orange-500/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center shadow-lg">
            <BarChart3 size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            <span className="text-orange-500">True</span>
            <span className="text-white">Feedback</span>
          </h1>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="bg-white/5 hover:bg-white/10 text-white font-medium flex items-center px-6 py-2 rounded-xl transition-all duration-300 border border-white/10 hover:border-orange-500/30"
        >
          <LogOut className="h-4 w-4 mr-2" /> 
          Logout
        </Button>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
            Welcome back, {username}
          </h1>
          <p className="text-xl text-gray-400 font-light">Your premium feedback management hub</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-500">{messages.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Total Messages</h3>
            <p className="text-gray-400 text-sm">Anonymous feedback received</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-500">{acceptMessages ? 'ON' : 'OFF'}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Status</h3>
            <p className="text-gray-400 text-sm">Message acceptance</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/10 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-500">100%</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Privacy</h3>
            <p className="text-gray-400 text-sm">Completely anonymous</p>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          {/* Share Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-span-1 xl:col-span-2 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-4 flex items-center justify-center">
                <Copy className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Share Your Profile</h2>
            </div>
            <p className="text-gray-400 mb-6">Share this link to receive anonymous feedback from anyone</p>
            <div className="flex flex-col sm:flex-row items-stretch gap-4">
              <input
                type="text"
                value={profileUrl}
                disabled
                className="flex-1 p-4 bg-black/40 text-gray-200 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm"
              />
              <Button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25"
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
            className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-4 flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Settings</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700/50">
                <div>
                  <span className="text-white font-medium">Accept Messages</span>
                  <p className="text-gray-400 text-sm mt-1">
                    {acceptMessages ? 'Currently receiving messages' : 'Messages are disabled'}
                  </p>
                </div>
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                  className="data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-600"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/20 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-4 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Your Messages</h2>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
              className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500 rounded-xl flex items-center gap-3 px-6 py-3 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
              Refresh Messages
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="flex flex-col items-center justify-center py-16 bg-black/20 rounded-xl border border-gray-700/30">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 flex items-center justify-center mb-6">
                <MessageSquare className="h-10 w-10 text-orange-500/60" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No messages yet</h3>
              <p className="text-gray-500 text-center max-w-md">
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
        className="border-t border-orange-500/10 py-8 text-center"
      >
        <div className="flex items-center justify-center mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
            <BarChart3 size={12} className="text-white" />
          </div>
          <span className="text-orange-500 font-semibold">True</span>
          <span className="text-white font-semibold">Feedback</span>
        </div>
        <p className="text-gray-500 text-sm">© 2025 • Premium Anonymous Feedback Platform</p>
      </motion.footer>
    </div>
  );
}

export default UserDashboard;