'use client'

import { Input } from "@/components/ui/input"
import MessageCard from "@/components/ui/messageCard"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message } from "@/model/user.model"
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw, Copy, Link as LinkIcon, Settings2, Inbox } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCopying, setIsCopying] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => (message._id as unknown as string) !== messageId))
    }

    const { data: session, status } = useSession();

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    })
 
    const { register, watch, setValue } = form
    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessageStatus = useCallback(async () =>{
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessage as boolean)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error('Error',{
                description: axiosError.response?.data.message ?? 'Failed to fetch message status',        
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue]);
     
    const fetchMessages = useCallback(async (refresh : boolean = false) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast.success("Refreshed Messages", {
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message ?? 'Failed to fetch messages',
            }) 
        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
    }, [])

    useEffect(() => {
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessageStatus()
    }, [session?.user, fetchAcceptMessageStatus, fetchMessages])

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast.success("Success", {
                description: response.data.message || 'Message acceptance status updated.'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error("Error", {
                description: axiosError.response?.data.message ?? 'Failed to update message setting'
            })
        }
    }

    let baseURL = ''
    let profileURL = ''
    if (typeof window !== 'undefined') {
        baseURL = `${window.location.protocol}//${window.location.host}`
    }
    
    if (session && session.user) {
        const { username } = session.user as User
        profileURL = `${baseURL}/u/${username}`
    }

    const copyToClipboard = () => {
        setIsCopying(true)
        navigator.clipboard.writeText(profileURL)
        toast.success("Copied!", {
            description: 'Profile URL has been copied to clipboard.',
        })
        setTimeout(() => setIsCopying(false), 2000)
    }

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-[#121212]">
                <Loader2 className="h-8 w-8 animate-spin text-[#EDAE48]" />
            </div>
        )
    }

    if (!session || !session.user) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-[#121212]">
                <p className="text-[#A0A0A0] text-lg">Please login to view your dashboard.</p>
            </div>
        )
    }
    
    return (
        <div className="min-h-[calc(100vh-80px)] bg-transparent text-gray-900 dark:text-[#EAEAEA] pt-28 pb-10 transition-colors relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-[#A0A0A0] text-lg">
                        Manage your profile link and view your feedback.
                    </p>
                </div>

                {/* Control Panel (Link & Toggle) */}
                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Unique Link Card */}
                    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-xl border border-[#2A2A2A] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="w-5 h-5 text-[#EDAE48]" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Unique Link</h2>
                            </div>
                            <p className="text-sm text-[#8A8A8A] mb-4">
                                Share this link with your audience to receive anonymous feedback.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4">
                            <Input 
                                type="text"
                                value={profileURL}
                                readOnly
                                className="bg-[#121212] text-white focus-visible:ring-[#EDAE48]/50 cursor-copy border-[#2A2A2A] rounded-xl" 
                            />
                            <Button 
                                onClick={copyToClipboard}
                                className="min-w-[100px] bg-gradient-to-r from-[#EDAE48] to-[#D1495B] hover:opacity-90 text-white rounded-xl transition-colors border-0"
                            >
                                {isCopying ? (
                                    "Copied!"
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>     
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-xl border border-[#2A2A2A] flex flex-col justify-between">
                         <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Settings2 className="w-5 h-5 text-[#EDAE48]" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Message Settings</h2>
                            </div>
                            <p className="text-sm text-[#8A8A8A] mb-4">
                                Toggle whether you want to accept new messages from your unique link.
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-[#121212] rounded-xl border border-[#2A2A2A] mt-4">
                            <span className="text-sm font-medium text-[#D1D1D1]">
                                Accept Messages
                            </span>
                            <div className="flex items-center gap-3">
                                <span className={`text-sm font-medium ${acceptMessages ? 'text-[#EDAE48]' : 'text-gray-500'}`}>
                                    {acceptMessages ? 'Active' : 'Paused'}
                                </span>
                                <Switch
                                    {...register('acceptMessages')}
                                    checked={acceptMessages}
                                    onCheckedChange={handleSwitchChange}
                                    disabled={isSwitchLoading}
                                    className="data-[state=checked]:bg-[#D1495B]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8 bg-[#2A2A2A]" />

                {/* Messages Section */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Inbox className="w-6 h-6 text-[#EDAE48]" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Messages</h2>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#1A1A1A] hover:bg-[#252525] text-[#D1D1D1] hover:text-white border-[#2A2A2A] rounded-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            fetchMessages(true);
                        }}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <RefreshCcw className="h-4 w-4 mr-2" />
                        )}
                        Refresh
                    </Button>
                </div>

                {messages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {messages.map((message) => (
                            <div key={message._id as unknown as string} className="transition-transform duration-300 hover:-translate-y-1">
                                <MessageCard
                                    message={message}
                                    onMessageDelete={handleDeleteMessage}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-dashed border-[#2A2A2A] shadow-xl mt-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#121212] mb-4">
                            <Inbox className="w-8 h-8 text-[#A0A0A0]" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No messages yet</h3>
                        <p className="text-[#8A8A8A] mt-2 max-w-sm mx-auto">
                            Share your unique link with others to start receiving feedback. They will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard