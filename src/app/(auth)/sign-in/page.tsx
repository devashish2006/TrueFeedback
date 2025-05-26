'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { motion } from 'framer-motion';
import { Loader2, BarChart3 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if the user is already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setIsRedirecting(true);
      toast({
        title: 'Already signed in',
        description: 'Redirecting to your dashboard...',
      });
      router.push('/ask');
    }
  }, [session, status, router, toast]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange', // This activates validation as fields change
  });

  // Check if form is valid - used to enable/disable submit button
  const isFormValid = form.formState.isValid;
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      // Additional validation check before submission
      if (!data.identifier || !data.password) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive',
        });
        return;
      }
      
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error === 'CredentialsSignin' ? 'Incorrect username or password' : result.error,
          variant: 'destructive',
        });
        return;
      }

      // If login is successful, show success message and redirect
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      
      // Use router.push for client-side navigation
      router.push('/ask');
    } catch (error) {
      toast({
        title: 'Network Error',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  // If checking session or redirecting, show loading state
  if (status === 'loading' || isRedirecting) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-orange-500">True</span>
              <span className="text-white">Feedback</span>
            </span>
          </div>
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto" />
          <p className="text-gray-300">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-lg shadow-xl border border-gray-800"
      >
        <div className="text-center">
          {/* TrueFeedback Branding */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 mr-3 flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <span className="text-3xl font-bold">
              <span className="text-orange-500">True</span>
              <span className="text-white">Feedback</span>
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold tracking-tight mb-4 text-white"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 text-gray-400"
          >
            Sign in to continue your journey
          </motion.p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">Email/Username</FormLabel>
                  <Input
                    {...field}
                    autoComplete="username"
                    className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 h-12 rounded-lg"
                    required
                  />
                  <FormMessage className="text-orange-400" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300 font-medium">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="current-password"
                    className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 h-12 rounded-lg"
                    required
                  />
                  <FormMessage className="text-orange-400" />
                </FormItem>
              )}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                className={`w-full h-12 font-semibold rounded-lg transition-all duration-200 ${
                  !isFormValid || isSubmitting
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] transform"
                }`}
                type="submit"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-gray-400">
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-orange-500 hover:text-orange-400 transition-colors duration-200 font-medium"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="pt-6 text-xs text-center text-gray-500 border-t border-gray-800 mt-6"
        >
          <p>
            By signing in, you agree to our
            <br />
            <Link href="/terms" className="text-orange-500 hover:text-orange-400 transition-colors duration-200">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-orange-500 hover:text-orange-400 transition-colors duration-200">
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}