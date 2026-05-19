'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from '@/message.json'
import autoPlay from 'embla-carousel-autoplay'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, MessageSquare, ShieldCheck, Bot } from "lucide-react"

import { useSession } from 'next-auth/react'

function Home() {
  const { data: session } = useSession()

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-[#121212] text-gray-900 dark:text-[#EAEAEA] font-sans selection:bg-[#D1495B]/30 transition-colors">
      
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center text-center overflow-hidden">
        
        {/* Abstract Background Element */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#EDAE48]/20 to-[#D1495B]/20 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 dark:border-[#2A2A2A] bg-gray-50 dark:bg-[#1A1A1A] text-[#EDAE48] mb-8 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Empower your growth
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.1]">
            Authentic feedback, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EDAE48] to-[#D1495B]">
              unfiltered insights.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-[#A0A0A0] max-w-2xl mb-10 leading-relaxed font-light">
            True Feedback helps you collect genuine thoughts from your audience. Improve your craft with 100% anonymity and smart AI-powered message suggestions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-full px-8 h-14 text-base transition-opacity font-medium border-0">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-full px-8 h-14 text-base transition-opacity font-medium border-0">
                    Start for free
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] hover:bg-gray-50 dark:hover:bg-[#252525] hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-[#D1D1D1] transition-colors">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-24 bg-gray-50 dark:bg-[#161616] border-y border-gray-200 dark:border-[#2A2A2A] transition-colors">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
           
           {/* Card 1 */}
           <div className="flex flex-col p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] hover:border-[#D1495B]/50 dark:hover:border-[#D1495B]/50 transition-colors shadow-sm">
             <div className="w-12 h-12 bg-gray-100 dark:bg-[#252525] text-[#EDAE48] rounded-xl flex items-center justify-center mb-6">
               <ShieldCheck className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Total Anonymity</h3>
             <p className="text-gray-600 dark:text-[#8A8A8A] text-sm leading-relaxed">
               Share your unique link anywhere. We ensure complete privacy for senders, giving them the confidence to be brutally honest.
             </p>
           </div>

           {/* Card 2 */}
           <div className="flex flex-col p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] hover:border-[#EDAE48]/50 dark:hover:border-[#EDAE48]/50 transition-colors shadow-sm">
             <div className="w-12 h-12 bg-gray-100 dark:bg-[#252525] text-[#D1495B] rounded-xl flex items-center justify-center mb-6">
               <Bot className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">AI Suggestions</h3>
             <p className="text-gray-600 dark:text-[#8A8A8A] text-sm leading-relaxed">
               Integrated with Gemini to intelligently suggest contextual messages, ensuring your audience never faces writer's block.
             </p>
           </div>

           {/* Card 3 */}
           <div className="flex flex-col p-8 rounded-2xl bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] hover:border-[#D1495B]/50 dark:hover:border-[#D1495B]/50 transition-colors shadow-sm">
             <div className="w-12 h-12 bg-gray-100 dark:bg-[#252525] text-[#EDAE48] rounded-xl flex items-center justify-center mb-6">
               <MessageSquare className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Clean Dashboard</h3>
             <p className="text-gray-600 dark:text-[#8A8A8A] text-sm leading-relaxed">
               Read and manage your feedback effortlessly. A beautiful, distraction-free environment to process what people really think.
             </p>
           </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="py-32 flex flex-col items-center px-6">
        <div className="text-center mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Real insights.</h2>
          <p className="text-gray-600 dark:text-[#A0A0A0] text-lg font-light">See how genuine feedback drives real growth.</p>
        </div>

        <Carousel 
          plugins={[autoPlay({ delay: 4000 })]}
          className="w-full max-w-lg md:max-w-3xl lg:max-w-5xl"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {messages.map((message, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] flex flex-col rounded-xl overflow-hidden group hover:border-[#4A4A4A] transition-colors shadow-sm">
                    <CardHeader className="pb-2 px-6 pt-6">
                      <h4 className="font-semibold text-gray-800 dark:text-[#D1D1D1]">{message.title}</h4>
                    </CardHeader>
                    <CardContent className="flex-grow px-6 pt-2 pb-6">
                      <p className="text-gray-600 dark:text-[#8A8A8A] text-sm leading-relaxed">{message.content}</p>
                    </CardContent>
                    <CardFooter className="px-6 pb-4 pt-0 text-xs text-gray-500 dark:text-[#5A5A5A] font-medium border-t border-gray-100 dark:border-[#2A2A2A] mt-auto">
                      <div className="pt-4">{message.received}</div>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-[-4rem] border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-[#A0A0A0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#252525]" />
            <CarouselNext className="right-[-4rem] border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] text-gray-500 dark:text-[#A0A0A0] hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#252525]" />
          </div>
        </Carousel>
      </section>
      
      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 dark:text-[#5A5A5A] text-sm border-t border-gray-200 dark:border-[#2A2A2A]">
        <p>© {new Date().getFullYear()} True Feedback. Designed for humans.</p>
      </footer>
    </main>
  )
}

export default Home