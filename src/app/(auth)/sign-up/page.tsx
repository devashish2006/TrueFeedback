'use client';

import { ApiResponse } from "../../../../types/ApiResponse";
import { zodResolver } from '@hookform/resolvers/zod';
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounce } from 'use-debounce';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { useToast } from "@/hooks/use-toast";
import { Loader2, BarChart3 } from "lucide-react";
import { motion } from 'framer-motion';

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debouncedUsername] = useDebounce(username, 300);

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
        mode: 'onChange',
    });

    const isValid = form.formState.isValid;

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername.trim()) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                setIsUsernameUnique(null);
                try {
                    const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsernameMessage(response.data.message);
                    setIsUsernameUnique(response.data.success);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? 'Error checking username');
                    setIsUsernameUnique(false);
                } finally {
                    setIsCheckingUsername(false);
                }
            } else {
                setUsernameMessage('');
                setIsUsernameUnique(null);
            }
        };

        checkUsernameUnique();
    }, [debouncedUsername]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.push(`/verify/${data.username}`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Sign Up Failed',
                description: axiosError.response?.data.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-6 text-gray-400"
                    >
                        Sign up to start your journey
                    </motion.p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 font-medium">Username</FormLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setUsername(e.target.value);
                                            }}
                                            className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 h-12 rounded-lg pr-10"
                                        />
                                        {isCheckingUsername && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                            </div>
                                        )}
                                    </div>
                                    {!isCheckingUsername && usernameMessage && (
                                        <p className={`text-sm mt-1 ${isUsernameUnique ? 'text-green-400' : 'text-red-400'}`}>
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage className="text-orange-400" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-300 font-medium">Email</FormLabel>
                                    <Input
                                        {...field}
                                        className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 h-12 rounded-lg"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        We'll send you a verification code
                                    </p>
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
                                        className="bg-gray-800 text-white border-gray-700 focus:border-orange-500 focus:ring-orange-500/20 transition-all duration-200 h-12 rounded-lg"
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
                                type="submit"
                                className={`w-full h-12 font-semibold rounded-lg transition-all duration-200 ${
                                  !isValid || isSubmitting
                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] transform"
                                }`}
                                disabled={!isValid || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
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
                        Already have an account?{' '}
                        <Link
                            href="/sign-in"
                            className="text-orange-500 hover:text-orange-400 transition-colors duration-200 font-medium"
                        >
                            Sign in
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
                        By creating an account, you agree to our
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