'use client';
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  MessageCircle, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Lock, 
  Share2, 
  Github, 
  Twitter, 
  Instagram,
  BarChart3,
  Home,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Copy
} from 'lucide-react';
import { z } from 'zod';

const messageSchema = z.object({
  content: z.string().nonempty('Message cannot be empty'),
});

type MessageSchema = z.infer<typeof messageSchema>;

const SendMessage = () => {
  const { username } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<{ id: string; message: string }[]>([]);
  const [isSuggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [charactersLeft, setCharactersLeft] = useState(500);

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [username]);

  const fetchSuggestedMessages = async () => {
    setSuggestLoading(true);
    setError(null);
    setIsTyping(true);

    const timeout = setTimeout(() => {
      setSuggestLoading(false);
      setIsTyping(false);
    }, 4000);

    try {
      const response = await axios.post('/api/suggest-messages');
      if (response.data.suggestions) {
        setSuggestions([]);
        for (let i = 0; i < response.data.suggestions.length; i++) {
          setTimeout(() => {
            setSuggestions((prev) => [...prev, response.data.suggestions[i]]);
          }, i * 800);
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Failed to fetch suggestions.');
    } finally {
      clearTimeout(timeout);
      setSuggestLoading(false);
      setIsTyping(false);
    }
  };

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
    setCharactersLeft(500 - message.length);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharactersLeft(500 - value.length);
    form.setValue('content', value);
  };

  const onSubmit = async (data: MessageSchema) => {
    if (!username) {
      toast({
        title: 'Error',
        description: 'Username is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.post('/api/send-message', {
        content: data.content,
        username,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      form.reset({ content: '' });
      setCharactersLeft(500);
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message ||
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyProfileUrl = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Copied!',
        description: 'Profile URL copied to clipboard',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-400/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <BarChart3 size={16} className="text-white" />
              </div>
              <div className="font-bold text-lg">
                <span className="text-orange-500">True</span>
                <span className="text-white">Feedback</span>
              </div>
            </div>
            
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
            >
              <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 text-center max-w-md w-full shadow-2xl">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-white">Message Sent!</h2>
                <p className="text-slate-400 mb-6 text-sm">Your anonymous feedback has been delivered securely.</p>
                <Button
                  onClick={() => setShowSuccess(false)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-2 px-6 rounded-lg w-full"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Send Anonymous Feedback
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-6">
            to <span className="text-orange-500 font-semibold">@{username}</span>
          </p>
          
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-orange-500" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-orange-500" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Message Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="bg-slate-900/50 backdrop-blur-xl border border-slate-700 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your Message</h3>
                    <p className="text-sm text-slate-400">Share your thoughts anonymously</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                placeholder="Write your honest feedback, thoughts, or questions here..."
                                className="min-h-32 bg-slate-800/50 text-white border border-slate-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-lg p-4 resize-none placeholder-slate-400 transition-colors"
                                disabled={form.formState.isSubmitting}
                                onChange={handleTextareaChange}
                                maxLength={500}
                              />
                              <div className="absolute bottom-3 right-3 text-xs text-slate-500 bg-slate-800/80 px-2 py-1 rounded">
                                {charactersLeft} left
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400 text-sm" />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      disabled={!form.watch('content')?.trim() || form.formState.isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {form.formState.isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="h-4 w-4 mr-2" />
                          <span>Send Message</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-center text-slate-500 text-xs">
                    <Lock className="w-3 h-3 mr-2 text-orange-500" />
                    <span>Messages are encrypted and completely anonymous</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-900/30 backdrop-blur-xl border border-slate-800 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                      <p className="text-sm text-slate-400">Get ideas for your message</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={fetchSuggestedMessages}
                    disabled={isSuggestLoading}
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10"
                  >
                    {isSuggestLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {isSuggestLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    </div>
                    <p className="text-slate-400 text-sm text-center">Generating suggestions...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full bg-slate-800/30 hover:bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/50 hover:border-orange-500/50 transition-all duration-200 p-3 rounded-lg text-left justify-start h-auto text-sm"
                          onClick={() => handleMessageClick(suggestion.message)}
                        >
                          {suggestion.message}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Click the sparkle icon to get AI suggestions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1 bg-slate-800/30 hover:bg-slate-800/60 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Home</span>
            </Button>
            
            <Button
              onClick={copyProfileUrl}
              variant="outline"
              className="flex-1 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 border-orange-500/30 hover:border-orange-500/50 transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              <span>Copy Profile Link</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-slate-800 py-8 mt-12"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
              <BarChart3 size={12} className="text-white" />
            </div>
            <span className="text-orange-500 font-semibold">True</span>
            <span className="text-white font-semibold">Feedback</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <a 
              href="https://github.com/devashish2006" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com/your-twitter" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a 
              href="https://instagram.com/your-insta" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-orange-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-slate-500 text-xs">© 2025 TrueFeedback • Anonymous feedback platform</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default SendMessage;