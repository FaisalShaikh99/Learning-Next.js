import {dbConnect} from '@/lib/dbConnect'
import UserModel from '@/model/user.model'
import { getServerSession } from 'next-auth'
import { User } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'

// when user toggle message accpet button
export async function POST(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session?.user){
       return Response.json({
            success : false,
            message : "Not Authenticated "
        },{status : 401})
    }

    const userId = user._id
    const{acceptMessages} = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {isAcceptingMessage : acceptMessages},//
            {new : true} // naya data return hota hai
            )
            if(!updatedUser){
                return Response.json({
                success : false,
                message : "failed to update user status to accept messages "
             },{status : 401}) 
            }
            return Response.json({
                success : true,
                message : "Message acceptance status updated successfully ",
                updatedUser
            },{status : 200}) 

    } catch (error) {
        console.error('failed to update user status to accept messages')
        return Response.json({
            success : false,
            message : "failed to update user status to accept messages "
        },{status : 500})
    }
}

// GET method show status of message accepting or not
export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user : User = session?.user as User

    if(!session || !session?.user){
       return Response.json({
            success : false,
            message : "Not Authenticated "
        },{status : 401})
    }

    const userId = user._id
    try {
        const user = await UserModel.findById(userId)
        if(!user){
             return Response.json({
            success : false,
            message : "User not found"
         },{status : 404})
        }
        return Response.json({
            success : true,
            // yaha status return ho raha hai ki user message accept ka raha hai ya nahi
            /*agar isAcceptingMessage = true mean toggle on status return hoga otherwise 
              toggle off return hoga*/
            isAcceptingMessage : user.isAcceptingMessage,
            message : "User is found"
         },{status : 200})

    } catch (error) {
         console.error('An Unexpected error occure', error)
        return Response.json({
            success : false,
            message : "An Unexpected error occure"
        },{status : 500})
    }
}