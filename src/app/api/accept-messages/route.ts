import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";

// ye POST request accept messages ko true/false(toggle) karne ke liye hai matlab user message recieve kar bhi sakta hai aur nahi bhi
export async function POST(request: Request){
    await dbConnect();

    const session = await getServerSession(authOption)
    const user: User = session?.user as User // yaha user options file se aarha hai  user -> token -> session

    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "Not authenticated"
            },{
                status : 401
            }
        )
    }

    const userId = user._id
    // destructure the request body from frontend
    const {acceptMessages} = await request.json()

    try {
      const updatedUser =  await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages : acceptMessages},
            {new : true}
        )

        if(!updatedUser){
            return Response.json(
            {
                success : false,
                message : "Failed to update user status to accept messages"
            },{
                status : 401
            }
           ) 
        }

        return Response.json(
            {
                success : true,
                message : "Message acceptance status updated successfully"
            },{
                status : 200
            }
        ) 
    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json(
            {
                success : false,
                message : "Failed to update user status to accept messages"
            },{
                status : 500
            }
        )
     }
    
}
 
// ye GET request user ka message acceptance status get karne ke liye hai , yaha se user id se pata chalta hai ki user ka last update kya tha true ya false 
export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOption)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message : "Not authenticated"
            },{
                status : 401
            }
        )
    }

    const userId = user._id 
   try {
     const FoundUser = await UserModel.findById(userId)

    if(!FoundUser){
            return Response.json(
            {
                success : false,
                message : "User not found"
            },{
                status : 404
            }
           ) 
        }

      return Response.json(
            {
                success : true,
                isAcceptingMessages : FoundUser.isAcceptingMessages
            },{
                status : 200
            }
        )   
   } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json(
            {
                success : false,
                message : "Error is getting message acceptance status"
            },{
                status : 500
            }
        )
   }
}