'use client';
import React, { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
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
  Building2,
  AlertTriangle
} from 'lucide-react';

const messageSchema = z.object({
  content: z.string().nonempty('Message cannot be empty'),
});

type MessageSchema = z.infer<typeof messageSchema>;

interface OrganizationData {
  name: string;
  description: string;
  logoUrl: string;
  _id: string;
  createdAt: string;
  __v: number;
}

const SendMessageOrg = () => {
  const params = useParams() as { orgUsername: string; userUsername: string };
  const { orgUsername, userUsername } = params;
  const router = useRouter();
  const { toast } = useToast();

  const [org, setOrg] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(500);

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const fetchOrgDetails = useCallback(async () => {
  if (!orgUsername) {
    setError('Organization username is missing');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);
    
    // Fetch organization data using the correct API endpoint
    const response = await axios.get(`/api/publicOrganisationDetails?orgUsername=${userUsername}`);

    if (response?.data?.organization) {
      setOrg(response.data.organization);
    } else {
      throw new Error('Invalid response format');
    }
  } catch (err) {
    console.error('Error fetching organization details:', err);
    const axiosError = err as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || 
                        axiosError.message || 
                        'Failed to load organization details. Please check if the organization exists.';
    setError(errorMessage);
    
    toast({
      title: 'Error Loading Organization',
      description: errorMessage,
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
}, [orgUsername, toast]);

  useEffect(() => {
    fetchOrgDetails();
  }, [fetchOrgDetails]);

  useEffect(() => {
    if (typeof window !== 'undefined' && orgUsername && userUsername) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/org/${orgUsername}/${userUsername}`);
    }
  }, [orgUsername, userUsername]);

  const onSubmit = async (data: MessageSchema) => {
    if (!orgUsername) {
      toast({
        title: 'Error',
        description: 'Organization username is required.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Try multiple possible API endpoints for sending messages
      let response;
      try {
        // First try the organization-specific endpoint
        response = await axios.post('/api/sendOrganisationMessage', {
          content: data.content,
          orgUsername: orgUsername,
          username: userUsername,
        });
      } catch (err) {
        // Fallback to generic send message endpoint
        try {
          response = await axios.post('/api/send-message', {
            content: data.content,
            orgUsername: orgUsername,
            username: userUsername,
          });
        } catch (err2) {
          // Try another common pattern
          response = await axios.post('/api/messages/send', {
            content: data.content,
            orgUsername: orgUsername,
            username: userUsername,
          });
        }
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
      form.reset({ content: '' });
      setCharactersLeft(500);
      
      toast({
        title: 'Message sent successfully!',
        description: response?.data?.message || 'Your anonymous feedback has been delivered.',
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 
                          'An error occurred while sending your message. Please try again.';
      
      toast({
        title: 'Error Sending Message',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCharactersLeft(500 - value.length);
    form.setValue('content', value);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-orange-400 mb-2">Loading Organization</h2>
          <p className="text-gray-400">Please wait while we fetch the details...</p>
          <p className="text-gray-500 text-sm mt-2">Looking for: {orgUsername}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !org) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Organization Not Found</h2>
          <p className="text-gray-400 mb-6">
            {error || `We couldn't find an organization with the username "${orgUsername}". Please check the URL and try again.`}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => fetchOrgDetails()}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation Bar */}
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
          onClick={() => router.push('/')}
          variant="ghost"
          className="bg-white/5 hover:bg-white/10 text-white font-medium flex items-center px-6 py-2 rounded-xl transition-all duration-300 border border-white/10 hover:border-orange-500/30"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> 
          Back to Home
        </Button>
      </motion.nav>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-50 inset-0 flex items-center justify-center p-4"
            >
              <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-lg text-white p-8 rounded-2xl shadow-2xl border border-orange-500/30 text-center max-w-md w-full">
                <div className="mb-6 w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-orange-400">Message Delivered!</h2>
                <p className="text-gray-300 mb-6">Your anonymous feedback has been sent to {org.name} successfully.</p>
                <Button
                  onClick={() => setShowSuccess(false)}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-xl w-full transition-all duration-300"
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 min-h-screen flex flex-col justify-center relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Organization Logo */}
          {org.logoUrl && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-6 inline-block"
            >
              <div className="absolute inset-0 -m-2 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-full blur-sm opacity-50"></div>
              <img
                src={org.logoUrl}
                alt={org.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-orange-500/50 shadow-2xl"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          )}
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
            {org.name}
          </h1>
          <p className="text-xl text-gray-400 mb-6">Send Anonymous Feedback</p>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-orange-500" />
              <span>100% Anonymous</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-orange-500" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-orange-500" />
              <span>Organization Feedback</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Organization Description Card */}
          {org.description && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-orange-500/10 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-orange-500/10 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-4 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">About {org.name}</h3>
                      <p className="text-gray-400">Learn more about this organization</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-300 leading-relaxed text-lg">{org.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Send Message Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-orange-500/20 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-b border-orange-500/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 mr-4 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Compose Your Message</h3>
                    <p className="text-orange-200">Your identity will remain completely anonymous</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-orange-300 font-medium flex items-center text-lg">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Your Anonymous Message to {org.name}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Textarea
                                {...field}
                                placeholder="Share your honest feedback, suggestions, or thoughts anonymously with this organization..."
                                className="min-h-40 bg-black/40 text-white border border-gray-600/50 focus:border-orange-500 focus:ring-orange-500 rounded-xl p-6 resize-none placeholder-gray-400 text-lg leading-relaxed"
                                disabled={form.formState.isSubmitting}
                                onChange={handleTextareaChange}
                                maxLength={500}
                              />
                              <div className="absolute bottom-3 right-3 text-sm text-gray-400 bg-black/50 px-2 py-1 rounded">
                                {charactersLeft} remaining
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      disabled={!form.watch('content') || form.formState.isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {form.formState.isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Sending to {org.name}...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Send className="h-5 w-5 mr-2" />
                          <span>Send Anonymous Feedback</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center justify-center text-gray-400 text-sm">
                    <Lock className="w-4 h-4 mr-2 text-orange-500" />
                    <span>Your message is encrypted and completely anonymous</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Button
            onClick={() => router.push('/')}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium transition-all py-3 rounded-xl border border-white/10 hover:border-orange-500/30 flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
          
          <Button
            onClick={() => {
              if (profileUrl) {
                navigator.clipboard.writeText(profileUrl);
                toast({
                  title: 'Profile URL Copied!',
                  description: 'Share this link to receive more anonymous feedback.',
                });
              }
            }}
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-medium transition-all py-3 rounded-xl border border-orange-500/30 hover:border-orange-500/50 flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share This Profile
          </Button>
        </motion.div>
      </div>

      {/* Premium Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="border-t border-orange-500/10 py-8 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 mr-2 flex items-center justify-center">
            <BarChart3 size={12} className="text-white" />
          </div>
          <span className="text-orange-500 font-semibold">True</span>
          <span className="text-white font-semibold">Feedback</span>
        </div>
        
        <div className="flex items-center justify-center gap-6 mb-4">
          <a 
            href="https://github.com/devashish2006" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-orange-500 transition-all transform hover:scale-110"
          >
            <Github className="w-6 h-6" />
          </a>
          <a 
            href="https://twitter.com/your-twitter" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-orange-500 transition-all transform hover:scale-110"
          >
            <Twitter className="w-6 h-6" />
          </a>
          <a 
            href="https://instagram.com/your-insta" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-orange-500 transition-all transform hover:scale-110"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>
        
        <div className="text-gray-500 text-sm">
          <p>
            Developed by{' '}
            <a
              href="https://github.com/devashish2006"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-400 transition-all"
            >
              Devashish Mishra
            </a>
          </p>
          
          {profileUrl && (
            <p className="text-gray-600 text-xs mt-2">
              URL: <span className="text-orange-500/70">{profileUrl}</span>
            </p>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mt-2">© 2025 • Premium Anonymous Feedback Platform</p>
      </motion.footer>
    </div>
  );
};

export default SendMessageOrg;