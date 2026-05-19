'use client'

import { verifySchema } from "@/schemas/verifySchema"
import type { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { Loader2, MailCheck, RefreshCw } from "lucide-react"

const verifyAccount = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isResending, setIsResending] = useState(false)

    const router = useRouter()
    const params = useParams<{username : string}>()
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver : zodResolver(verifySchema)
    })
 
    const onSubmit = async(data : z.infer<typeof verifySchema>) => {
        try {       
            setIsSubmitting(true)  
            const response = await axios.post(`/api/verify-code`, {
                username : params.username,
                code :  data.code
            })

            toast.success("Success", {
                description: response.data.message
            })

            router.replace('/sign-in')
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in verification account", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Verification failed", {
                description: axiosError.response?.data.message ?? 'Invalid or expired verification code',
            })        
            setIsSubmitting(false)
        }
    }

    const handleResendCode = async () => {
        try {
            setIsResending(true)
            const response = await axios.post(`/api/resend-code`, {
                username: params.username
            })
            
            toast.success("Code Sent", {
                description: response.data.message
            })
        } catch (error) {
            console.error("Error resending code", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error("Failed to resend code", {
                description: axiosError.response?.data.message ?? 'Something went wrong',
            })
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] relative overflow-hidden pt-10">
            <div className="w-full max-w-md p-8 md:p-10 space-y-8 bg-white/80 dark:bg-[#1A1A1A]/80 backdrop-blur-md rounded-3xl shadow-xl dark:shadow-none border border-gray-100 dark:border-[#2A2A2A] relative z-10 mx-4">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EDAE48]/10 text-[#EDAE48] mb-2">
                        <MailCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        Verify Account
                    </h1>
                    <p className="text-gray-500 dark:text-[#A0A0A0] text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                        Enter the 6-digit verification code sent to your registered email.
                    </p>
                </div>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-center w-full">
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field} className="gap-2">
                                                <InputOTPGroup className="gap-2">
                                                    {[...Array(6)].map((_, i) => (
                                                        <InputOTPSlot 
                                                            key={i} 
                                                            index={i} 
                                                            className="w-12 h-14 md:w-14 md:h-16 text-lg md:text-xl rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white focus:border-[#EDAE48] dark:focus:border-[#EDAE48] focus:ring-1 focus:ring-[#EDAE48] transition-all"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-center mt-2 text-[#D1495B]" />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-full h-12 text-base font-medium transition-all shadow-md shadow-[#D1495B]/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </Button>
                    </form>
                </Form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 dark:text-[#A0A0A0]">
                        Didn't receive the code?
                    </p>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="mt-2 text-[#D1495B] hover:text-[#D1495B] hover:bg-[#D1495B]/10 rounded-full h-10 px-6 transition-colors"
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resending...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" /> Resend Code
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default verifyAccount