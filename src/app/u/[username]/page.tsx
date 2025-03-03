'use client';
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
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
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const messageSchema = z.object({
  content: z.string().nonempty('Message cannot be empty'),
});

type MessageSchema = z.infer<typeof messageSchema>;

const SendMessage = () => {
  const { username } = useParams();
  const router = useRouter();

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const { toast } = useToast();

  const [suggestions, setSuggestions] = useState<{ id: string; message: string }[]>([]);
  const [isSuggestLoading, setSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

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

      toast({
        title: 'Message sent successfully!',
        description: response.data.message,
        variant: 'default',
      });
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          TrueFeedback
        </h1>
        <p className="text-gray-300 mt-2 text-lg">Your Anonymous Feedback Platform</p>
      </motion.div>

      {/* Send Message Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <h3 className="text-2xl font-semibold text-gray-100">Send a Message to {username}</h3>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Your Message to {username}</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your message here..."
                          className="resize-none bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-4"
                          disabled={form.formState.isSubmitting || isSuggestLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={!form.watch('content') || form.formState.isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform py-3 rounded-lg"
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Send It'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggested Messages Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-2xl mt-8"
      >
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <h3 className="text-2xl font-semibold text-gray-100">Suggested Messages</h3>
          </CardHeader>
          <CardContent>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="w-full bg-gray-700 text-white hover:bg-gray-600 hover:scale-105 transform py-3 rounded-lg mb-4"
            >
              {isSuggestLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Suggest Messages'
              )}
            </Button>

            {isSuggestLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-gray-300">
                  {isTyping ? 'Thinking of the perfect message...' : 'Loading...'}
                </p>
              </div>
            ) : error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="outline"
                    className="w-full bg-gray-700 text-white hover:bg-gray-600 transition-colors hover:scale-105 transform py-3 rounded-lg"
                    onClick={() => handleMessageClick(suggestion.message)}
                  >
                    {suggestion.message}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No messages to suggest at the moment.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-8"
      >
        <h3 className="text-lg font-semibold text-gray-300">
          Start receiving anonymous messages with TrueFeedback! Engage in open, honest, and meaningful conversations today.
        </h3>
        <Button
          onClick={() => router.push('/')}
          className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform py-3 rounded-lg"
        >
          Onboard
        </Button>
      </motion.div>
    </div>
  );
};

export default SendMessage;