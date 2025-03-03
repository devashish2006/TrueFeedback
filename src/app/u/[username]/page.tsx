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
  const [isTyping, setIsTyping] = useState(false); // Simulate AI typing

  const fetchSuggestedMessages = async () => {
    setSuggestLoading(true);
    setError(null);
    setIsTyping(true); // Start typing animation

    const timeout = setTimeout(() => {
      setSuggestLoading(false);
      setIsTyping(false);
    }, 4000);

    try {
      console.log('Fetching suggested messages...');
      const apiUrl = '/api/suggest-messages'; 
      console.log('Calling API:', apiUrl);
      
      const response = await axios.post(apiUrl);
      console.log('Suggested messages response:', response.data);

      // Simulate AI generating suggestions one by one
      if (response.data.suggestions) {
        setSuggestions([]); // Clear previous suggestions
        for (let i = 0; i < response.data.suggestions.length; i++) {
          setTimeout(() => {
            setSuggestions((prev) => [...prev, response.data.suggestions[i]]);
          }, i * 800); // Delay between suggestions
        }
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      console.error('Error fetching suggested messages:', axiosError);
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
      console.error('Username is missing or invalid');
      toast({
        title: 'Error',
        description: 'Username is required.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Form submit data:', { content: data.content, username });

    try {
      const apiUrl = '/api/send-message'; 
      console.log('Calling API:', apiUrl);

      const response = await axios.post(apiUrl, {
        content: data.content, 
        username, 
      });

      console.log('Send message response:', response.data);
      toast({
        title: 'Message sent successfully!',
        description: response.data.message,
        variant: 'default',
      });
      form.reset({ content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Error sending message:', axiosError);
      toast({
        title: 'Error',
        description:
          axiosError.response?.data?.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Send a Message to {username}</h3>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message to {username}</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your message here..."
                        className="resize-none"
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
              >
                {form.formState.isSubmitting ? 'Sending...' : 'Send It'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Suggested Messages</h3>
        </CardHeader>
        <CardContent>
          <Button
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
            variant="outline"
            className="mb-4"
          >
            {isSuggestLoading ? 'Generating suggestions...' : 'Suggest Messages'}
          </Button>

          {isSuggestLoading ? (
            <div className="relative flex items-center justify-center space-x-2">
              <div className="loader-ring">
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
                <div className="loader-dot"></div>
              </div>
              <div className="absolute flex items-center justify-center text-lg font-semibold text-gray-600">
                {isTyping ? 'Thinking of the perfect message...' : 'Loading...'}
              </div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : suggestions.length > 0 ? (
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  variant="outline"
                  className="w-full text-left hover:bg-gray-100 transition-colors"
                  onClick={() => handleMessageClick(suggestion.message)}
                >
                  {suggestion.message}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No messages to suggest at the moment.</p>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mt-8">
        <h3 className="text-lg font-semibold">Start receiving anonymous messages with TrueFeedback! Engage in open, honest, and meaningful conversations today.</h3>
        <Button onClick={() => router.push('/')} className="mt-4">Go to Home</Button>
      </div>
    </div>
  );
};

export default SendMessage;