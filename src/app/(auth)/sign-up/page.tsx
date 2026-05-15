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
import { ApiResponse } from "@/types/ApiResponse"
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
      const checkUsernameUnique = async() => {
        if (debouncedUsername) {
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
      }
      checkUsernameUnique();
    }
    ,[debouncedUsername])


    const onSubmit = async(data : z.infer<typeof signUpSchema>) => {
      try {
        console.log(data)
        setIsSubmitting(true)
        const response = await axios.post<ApiResponse>('/api/sign-up', data)
        console.log(response.data)
        router.replace(`/verfiy/${username}`)
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
  <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white flex items-center justify-center px-4 py-10">

    {/* Premium Background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.15),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_25%)]" />

    {/* Glow Effects */}
    <div className="absolute top-[-100px] left-[-120px] h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
    <div className="absolute bottom-[-120px] right-[-120px] h-[32rem] w-[32rem] rounded-full bg-purple-500/20 blur-3xl animate-pulse" />

    {/* Grid */}
    <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />

    {/* Card */}
    <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_0_60px_rgba(0,255,255,0.08)]">

      {/* Animated Border */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      <div className="p-8 md:p-10">

        {/* Badge */}
        <div className="mb-6 flex items-center justify-center">
          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-300 backdrop-blur-md">
            ✨ Premium Anonymous Platform
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_40px_rgba(34,211,238,0.35)]">
            <div className="absolute inset-[1px] rounded-3xl bg-[#0B1120]" />
            <span className="relative z-10 text-2xl font-black tracking-wider text-white">
              TF
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
              Join True Feedback
            </span>
          </h1>

          <p className="text-sm md:text-base leading-relaxed text-slate-400 max-w-sm mx-auto">
            Experience a next-generation anonymous feedback platform crafted with premium modern interactions.
          </p>
        </div>

        {/* Features */}
        <div className="mt-7 flex items-center justify-center gap-5 text-xs text-slate-400">
          <div className="flex items-center gap-2">🔒 Secure</div>
          <div className="h-4 w-px bg-white/10" />
          <div>⚡ Realtime</div>
          <div className="h-4 w-px bg-white/10" />
          <div>🛡 Private</div>
        </div>

        {/* Form */}
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onSubmit)}
            className="mt-10 space-y-5"
          >

            {/* Username */}
            <FormField
              control={registerForm.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-300">
                    Username
                  </FormLabel>

                  <FormControl>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 focus-within:border-cyan-400/50 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.15)]">
                      <Input
                        placeholder="Choose your username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setUsername(e.target.value)
                        }}
                        className="border-0 bg-transparent px-5 py-6 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 pointer-events-none" />
                    </div>
                  </FormControl>

                  {checkingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                  )}

                  <p
                    className={`text-xs ${
                      usernameMessage === "Username is unique"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {usernameMessage}
                  </p>

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-300">
                    Email Address
                  </FormLabel>

                  <FormControl>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 focus-within:border-purple-400/50 focus-within:shadow-[0_0_25px_rgba(168,85,247,0.15)]">
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="border-0 bg-transparent px-5 py-6 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-300">
                    Password
                  </FormLabel>

                  <FormControl>
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 focus-within:border-blue-400/50 focus-within:shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                      <Input
                        type="password"
                        placeholder="Create strong password"
                        {...field}
                        className="border-0 bg-transparent px-5 py-6 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </FormControl>

                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative mt-3 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 py-6 font-semibold tracking-wide text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(34,211,238,0.35)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  Create Premium Account →
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Already a member?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-cyan-400 transition hover:text-cyan-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  </div>
)
}

export default page
