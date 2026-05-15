import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request : Request){
    await dbConnect();
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }
        // validate username with zod using safeParse() method
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result);

        if(!result.success){
            const usernameError = result.error.format().username?._errors 
            return Response.json({
                success: false,
                message:"Invalid query parameters"
            },{status : 400})
        }

        const {username} = result.data
        const existVerfiedByUser = await UserModel.findOne({username, isVerified : true})
        if(existVerfiedByUser){
            return Response.json({
                success : false,
                message : "Username already taken"
            }, {status : 400})
        }

        return Response.json({
                success : true,
                message : "Username is unique"
            }, {status : 201})
            
    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success : false,
            message: "Error checking username"
        },{status : 500})
    }
}