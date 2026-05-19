'use client'

import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useCompletion } from '@ai-sdk/react'
import { Loader2, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const spicalChar = "||"

const parseStringMessages = (messageString : string) => {
   return messageString.split(spicalChar)
}

const initialMessageString =
  "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?";

const sendMessages = () => {

  const params = useParams<{username : string}>();
  const username = params.username

  const { complete, completion, isLoading : isSuggestLoading,error} = useCompletion({ 
    api: '/api/suggest-messages',
    streamProtocol: 'text',
    onFinish: (prompt, result) => {
      console.log("AI Completion Finished:", { prompt, result });
      if (!result) {
        toast.error("AI returned empty suggestions.");
      }
    },
    onError: (err) => {
      console.error("AI Completion Error:", err);
      toast.error("Failed to generate suggestions.");
    }
  });

  const form = useForm<z.infer <typeof messageSchema>>({
    resolver : zodResolver(messageSchema)
  })

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async(data:z.infer <typeof messageSchema>) =>{
      setIsLoading(true)
      try {
        const response = await axios.post('/api/send-messages',{
          ...data, username})

         toast.success("Success",{
          description : response.data.message
         }) 
         form.reset({ ...form.getValues(), content: '' });
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error('Error', {
        description: axiosError.response?.data.message ?? 'Failed to send message',
      });
      }finally {
      setIsLoading(false);
     }
  }

    const fetchSuggestedMessages = async() => {
        try {
          await complete('')
        } catch (error) {
          console.error("Error fetching messages : ", error)
        }
      }
  
    return (
     <div className="min-h-screen bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-[#EAEAEA] flex flex-col items-center pt-28 pb-20 px-6 transition-colors relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#EDAE48]/20 to-[#D1495B]/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-3xl space-y-10 relative z-10">
        
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 mb-7 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EDAE48] to-[#D1495B] text-white transition-transform duration-300 group-hover:-rotate-3 shadow-md">
              <Sparkles className="h-5 w-5 " />
            </div>
            <h1 className="text-3xl font-bold mb-7 tracking-tight text-gray-900 dark:text-[#EAEAEA]">
              True Feedback
            </h1>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
            Send Message to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDAE48] to-[#D1495B]">@{username}</span>
          </h1>
          <p className="text-gray-600 dark:text-[#A0A0A0] text-lg">
            Your identity remains completely hidden. Be honest, be kind!
          </p>
        </div>

        {/* Message Form */}
        <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A] shadow-xl rounded-2xl transition-colors">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-[#D1D1D1] text-base font-medium">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your secret message here..."
                          className="resize-none bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] text-gray-900 dark:text-white focus-visible:ring-[#EDAE48]/50 min-h-[120px] text-base p-4 rounded-xl"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[#D1495B]" />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !messageContent}
                    className="bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-full px-8 h-12 font-medium border-0 transition-opacity disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* AI Suggestions Section */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EDAE48]" />
                AI Message Suggestions
              </h3>
              <p className="text-gray-600 dark:text-[#8A8A8A] text-sm mt-1">Don't know what to write? Let AI generate questions for you.</p>
            </div>
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1A1A1A] hover:bg-gray-100 dark:hover:bg-[#252525] text-gray-700 dark:text-[#D1D1D1] hover:text-gray-900 dark:hover:text-white rounded-full"
            >
              {isSuggestLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate New Suggestions'
              )}
            </Button>
          </div>
          
          <Card className="bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2A2A2A] rounded-2xl transition-colors">
            <CardContent className="flex flex-col space-y-3 pt-6">
              {isSuggestLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl bg-gray-100 dark:bg-[#252525]" />
                ))
              ) : error ? (
                <p className="text-[#D1495B] text-center p-4 bg-gray-50 dark:bg-[#121212] rounded-lg border border-gray-200 dark:border-[#2A2A2A]">
                  {error.message}
                </p>
              ) : (
                parseStringMessages(completion || initialMessageString).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start h-auto py-4 px-6 text-left whitespace-normal bg-gray-50 dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] hover:border-[#EDAE48]/50 dark:hover:border-[#EDAE48]/50 hover:bg-gray-100 dark:hover:bg-[#252525] text-gray-700 dark:text-[#EAEAEA] rounded-xl transition-colors"
                    onClick={() => handleMessageClick(message)}
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Divider & Create Account CTA */}
        <div className="border-t border-gray-200 dark:border-[#2A2A2A] pt-10 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Want your own message board?</h3>
            <p className="text-gray-600 dark:text-[#8A8A8A]">Create your account to start receiving anonymous messages today.</p>
          </div>
          <Link href="/sign-up">
            <Button className="rounded-full px-8 h-12 border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#252525] text-gray-900 dark:text-white transition-colors">
              Create Free Account
            </Button>
          </Link>
        </div>

      </div>
    </div>
    )
}

export default sendMessages