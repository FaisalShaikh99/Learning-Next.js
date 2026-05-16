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
    // agar username hai ya nahi hai uska message backend se aayega
    const [usernameMessage, setUsernameMessage] = useState('')
    // one type of loader while send request
    const [checkingUsername, setCheckingUsername] = useState(false)
    // form submit ke liye state
    const [isSubmitting, setIsSubmitting] = useState(false)


    // debounce value se jab user type karte stop hota hai 300 miliseconds baad ye useDebounceValue exe hogi
    const [debouncedUsername] = useDebounceValue(username, 300)
    const router = useRouter();

    // zod implementation
    const registerForm = useForm({
      resolver : zodResolver(signUpSchema),
      defaultValues : {
        username : '',
        email : '', 
        password : ''
      }
    });

    // check username
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
          console.log(response)
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
        //console.log(data)
        setIsSubmitting(true)
        const response = await axios.post<ApiResponse>('/api/sign-up', data)
       // console.log(response.data)
        toast.success("Register Successfully done!", {
            description: "Welcome True Feedback!",
            style: {
              background: '#dcfce7',      // green background
              border: '1px solid #22c55e',
              color: '#166534',           // dark green text
            }
          })
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)
      } catch (error) {
        console.error("Error in signup", error)
         const axiosError = error as AxiosError<ApiResponse>;
         let errorMessage = axiosError.response?.data.message
         toast("Signup failed", {
              description: errorMessage,
            })
         setIsSubmitting(false)
      }

    }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="username" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                    />
                  </FormControl>
                  {checkingUsername && <Loader2 className="animate-spin h-4 w-4" />}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
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
                'Signup'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page