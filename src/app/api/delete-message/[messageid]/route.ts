import {dbConnect} from '@/lib/dbConnect'
import UserModel from '@/model/user.model'
import { getServerSession, User } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options';


export async function DELETE(request : Request, {params} :
     {params : Promise<{messageid : string}>}){
     const { messageid: messageId } = await params;
     
     await dbConnect();
     const session = await getServerSession(authOptions)
     const user : User = session?.user as User

     if(!session || !session?.user){
        return Response.json({
            success : false,
            message : "Unauthorized User"
        },{status : 400})
     }  
     try {
          const updateResult = await UserModel.updateOne(
            {_id : user._id},
            // pull operator messages ke array msg id se filter karta hai id milne per delete karta hai 
            {$pull : {messages :{_id : messageId}}} 
          )

          if(updateResult.modifiedCount === 0){
            return Response.json({
                success : false,
                message : "Message not found or already deleted"
            },{status : 400})
          }
          return Response.json({
            success : true,
            message : "Message deleted"
        },{status : 200})

     } catch (error) {
        console.log("Error deleting message",error)
           return Response.json({
            success : false,
            message : "Error deleting messages"
        },{status : 500})
     }
}