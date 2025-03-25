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
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const messageSchema = z.object({
  content: z.string().nonempty('Message cannot be empty'),
});

type MessageSchema = z.infer<typeof messageSchema>;

// Shape of the organization data returned by your API
interface OrganizationData {
  name: string;
  description: string;
  logoUrl: string;
  _id: string;
  createdAt: string;
  __v: number;
}

const SendMessageOrg = () => {
  // Expecting the route: /u/org/[orgUsername]/[userUsername]
  const params = useParams() as { orgUsername: string; userUsername: string };
  const { orgUsername, userUsername } = params;
  const router = useRouter();
  const { toast } = useToast();

  const [org, setOrg] = useState<OrganizationData | null>(null);

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  // Fetch organization details from your API endpoint using orgUsername from the URL.
const fetchOrgDetails = useCallback(async () => {
  try {
    // Pass the orgUsername as a query parameter to the API
    const res = await axios.get(`/api/publicOrganisationDetails?orgUsername=${orgUsername}`);
    setOrg(res.data.organization);
  } catch (err) {
    console.error('Error fetching organization details:', err);
    toast({
      title: 'Error',
      description: 'Failed to load organization details.',
      variant: 'destructive',
    });
  }
}, [orgUsername, toast]);


  useEffect(() => {
    fetchOrgDetails();
  }, [fetchOrgDetails]);

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
      // Send the message using the organization username from the URL
      const response = await axios.post('/api/send-message', {
        content: data.content,
        username: userUsername,
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

  if (!org) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading organization details...
      </div>
    );
  }

  // Build the unique URL using the orgUsername and userUsername from the route.
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/org/${orgUsername}/${userUsername}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Organization Details Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-6 px-2 text-center"
      >
        {org.logoUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={org.logoUrl}
              alt={org.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500 shadow-lg"
            />
          </div>
        )}
        <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          {org.name}
        </h1>
        {/* Separate boundary for description */}
        <div className="mt-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-300 text-base sm:text-lg">{org.description}</p>
        </div>
      </motion.div>

      {/* Send Message Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">
              Send a Message to {orgUsername}
            </h3>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your message here..."
                          className="resize-none bg-gray-700 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg p-4"
                          disabled={form.formState.isSubmitting}
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

      {/* Onboard Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-md mt-8"
      >
        <Button
          onClick={() => router.push('/')}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform py-3 rounded-lg"
        >
          Onboard
        </Button>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 text-center"
      >
        <p className="text-gray-400">
          Developed by{' '}
          <a
            href="https://github.com/devashish2006"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:underline"
          >
            Devashish Mishra
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SendMessageOrg;
