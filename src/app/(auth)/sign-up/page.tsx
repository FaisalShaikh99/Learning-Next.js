'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import z from 'zod'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import type { ApiResponse } from "@/types/ApiResponse"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const page = () =>{
    const [username, setUsername] = useState('') 
    const [usernameMessage, setUsernameMessage] = useState('')
    const [checkingUsername, setCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [debouncedUsername] = useDebounceValue(username, 300)
    const router = useRouter();

    const registerForm = useForm({
      resolver : zodResolver(signUpSchema),
      defaultValues : {
        username : '',
        email : '', 
        password : ''
      }
    });

    useEffect(() => {
      if(debouncedUsername.length === 0) {
        setCheckingUsername(false)
        return
      }
      const checkUsernameUnique = async() => {
        try {
          setCheckingUsername(true)
          setUsernameMessage('')

          const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??  "Error checking username"
          )
        } finally {
          setCheckingUsername(false)
        }
      }
      checkUsernameUnique();
    }
    ,[debouncedUsername])


    const onSubmit = async(data : z.infer<typeof signUpSchema>) => {
      try {
        setIsSubmitting(true)
        const response = await axios.post<ApiResponse>('/api/sign-up', data)
        toast.success("Register Successfully done!", {
            description: "Welcome True Feedback!"
          })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
         console.error("Error in signup", error)
         const axiosError = error as AxiosError<ApiResponse>;
         let errorMessage = axiosError.response?.data.message
         toast.error("Signup failed", {
              description: errorMessage,
            })
         setIsSubmitting(false)
      }
    }
    
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#EDAE48]/20 to-[#D1495B]/20 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-gray-200 dark:border-[#2A2A2A] transition-colors relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-gray-900 dark:text-white">
            Join True Feedback
          </h1>
          <p className="mb-4 text-gray-600 dark:text-[#A0A0A0]">
            Sign up to start your anonymous adventure
          </p>
        </div>
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-[#D1D1D1]">Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username" 
                      className="bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] focus-visible:ring-[#EDAE48]/50 text-gray-900 dark:text-white rounded-xl"
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  {checkingUsername && <Loader2 className="animate-spin h-4 w-4 text-[#EDAE48]" />}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-[#D1495B]'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage className="text-[#D1495B]" />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-[#D1D1D1]">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="email" 
                      className="bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] focus-visible:ring-[#EDAE48]/50 text-gray-900 dark:text-white rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[#D1495B]" />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-[#D1D1D1]">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="password" 
                      className="bg-white dark:bg-[#121212] border-gray-200 dark:border-[#2A2A2A] focus-visible:ring-[#EDAE48]/50 text-gray-900 dark:text-white rounded-xl"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[#D1495B]" />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-xl h-11 border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                'Signup'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-600 dark:text-[#8A8A8A]">
            Already a member?{' '}
            <Link href="/sign-in" className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDAE48] to-[#D1495B] font-semibold hover:opacity-80 transition-opacity">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page