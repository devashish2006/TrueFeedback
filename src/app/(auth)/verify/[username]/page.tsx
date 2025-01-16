'use client'

import { Input } from '@/components/ui/input';
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import * as z from 'zod';
import { ApiResponse } from "../../../../../types/ApiResponse";
import { AxiosError } from "axios";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from '@/components/ui/button';

export default function VerifyCode() {
    const router = useRouter();
    const params = useParams< { username: string } >()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const responce = await axios.post<ApiResponse>(`/api/verify-code`,{
                username: params.username,
                code: data.code
            })
    
            toast({
                title: 'Success',
                description: responce.data.message,
            })
    
            router.replace('/sign-in')
        } catch (error) {
           const axiosError = error as AxiosError<ApiResponse>;
           toast({
            title: 'Verification Failed',
            description: axiosError.response?.data.message ??
            'An error occoured . Please try again',
            variant: 'destructive',
           })
    
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
              </h1>
              <p className="mb-4">Enter the verification code sent to your email</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <Input {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Verify</Button>
              </form>
            </Form>
          </div>
        </div>
      );
}

