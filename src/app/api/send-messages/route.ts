import {dbConnect} from '@/lib/dbConnect'
import UserModel, { Message } from '@/model/user.model'

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username, content} = await request.json();

        const user = await UserModel.findOne({username})
        if(!user){
             return Response.json({
                success : false,
                message : "User not found"
            },{status : 404})
        }

        const acceptingMessages = user.isAcceptingMessage
        if(!acceptingMessages){
            return Response.json({
                success : false,
                message : "User not accepting messages"
            },{status : 400})
        }

        console.log(acceptingMessages)

        const newMessage = {content, createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        console.log("New messages : ", newMessage)
        return Response.json({
                success : true,
                message : "Message sent successfully"
            },{status : 200})

    } catch (error) {
        console.log("Error adding message",error)
           return Response.json({
            success : false,
            message : "Internal server error"
        },{status : 400})
    }
}