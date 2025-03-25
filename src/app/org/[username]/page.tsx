'use client';
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const messageSchema = z.object({
  content: z.string().nonempty('Message cannot be empty'),
});

type MessageSchema = z.infer<typeof messageSchema>;

const OrgProfile = () => {
  const { username } = useParams();
  const router = useRouter();

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  });

  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Organization Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 px-2"
      >
        <h1 className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          {username}'s Organization
        </h1>
        <p className="text-gray-300 mt-2 text-base sm:text-lg">
          Welcome to {username}'s official organization page. Stay updated and engaged!
        </p>
      </motion.div>
      
      {/* Organization Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg"
      >
        <Image
          src={`/images/org/${username}.jpg`}
          alt="Organization Logo"
          width={160}
          height={160}
          className="object-cover w-full h-full"
        />
      </motion.div>
      
      {/* Organization Description */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-lg text-center text-gray-300 mt-4"
      >
        <p className="text-base sm:text-lg">
          {username}'s organization is dedicated to innovation, excellence, and collaboration.
          We aim to create a positive impact in the industry with our cutting-edge solutions.
        </p>
      </motion.div>
      
      {/* Send Message Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-md sm:max-w-lg mt-8"
      >
        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-100">
              Send a Message to {username}
            </h3>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 transform py-3 rounded-lg"
                >
                  Send It
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OrgProfile;