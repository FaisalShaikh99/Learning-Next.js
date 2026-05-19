import {dbConnect} from '@/lib/dbConnect'
import { authOptions } from '../auth/[...nextauth]/options'
import UserModel from '@/model/user.model'
import mongoose from 'mongoose'
import { getServerSession, User } from 'next-auth'


export async function GET(request : Request){
    await dbConnect();
     const session = await getServerSession(authOptions)
     const user : User = session?.user as User

     if(!session || !session?.user){
        return Response.json({
            success : false,
            message : "Unauthorized User"
        },{status : 400})
     }

     const userId = new mongoose.Types.ObjectId(user._id)
     try {
        const user = await UserModel.aggregate([
            {$match : {_id : userId}},
            {$unwind :'$messages'},
            {$sort : {'messages.createdAt' : -1}},
            {$group : {_id : '$_id', messages :{$push : '$messages'}}}
        ])

        if(!user || user.length == 0){
            // Agar naya user hai aur koi messages nahi hain, toh error mat do, bas khali array bhejo
            return Response.json({
                success : true,
                messages : []
            },{status : 200})
        }

        return Response.json({
            success : true,
            messages : user[0].messages
        },{status : 200})

     } catch (error) {
        console.log("Error getting messages",error)
           return Response.json({
            success : false,
            message : "Error getting messages"
        },{status : 400})
     }
}