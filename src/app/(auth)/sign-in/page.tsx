'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
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
import { signInSchema } from '@/schemas/signInSchema';
import { toast } from 'sonner';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

 
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Login Failed',{
            description: 'Incorrect username or password'
          });
        } else {
          toast.error('Error',{
            description: result.error
          });
        }
      }

      if (result?.url) {
        toast.success('Logged In Successfully');
        router.replace('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#EDAE48]/20 to-[#D1495B]/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2A2A2A] transition-colors relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="mb-4 text-gray-600 dark:text-[#A0A0A0]">
            Sign in to continue your secret conversations
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-[#D1D1D1]">Email/Username</FormLabel>
                  <Input 
                    {...field} 
                    className="bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] focus-visible:ring-[#EDAE48]/50 text-gray-900 dark:text-white rounded-xl"
                  />
                  <FormMessage className="text-[#D1495B]" />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-[#D1D1D1]">Password</FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    className="bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] focus-visible:ring-[#EDAE48]/50 text-gray-900 dark:text-white rounded-xl"
                  />
                  <FormMessage className="text-[#D1495B]" />
                </FormItem>
              )}
            />
            <Button 
              className="w-full bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-xl h-11 border-0" 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-[#8A8A8A]">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDAE48] to-[#D1495B] font-semibold hover:opacity-80 transition-opacity">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}