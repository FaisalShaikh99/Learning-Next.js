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
import { Input } from '@/components/ui/input';
import { useState } from "react"
import { Loader2 } from "lucide-react"
const verifyAccount = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)

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

            toast("success", {
                description: response.data.message
            })

            router.replace('/sign-in')
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in verification account", error)
            const axiosError = error as AxiosError<ApiResponse>;
            toast("Signup failed", {
                description: axiosError.response?.data.message,
            })        
            setIsSubmitting(false)
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to  email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                'Submit'
              )}
            </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default verifyAccount