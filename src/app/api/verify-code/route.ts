import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request:Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();

        //decodeURIComponent() se 
        // if username = "Faisal%20Shaikh" -> ye encodedUri hai -> yaha space = %20 
        // isse decode karne kene ke liye ye method use hoti hai jiska output username = 'Faisal Shaikh'
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username : decodedUsername})

        if(!user){
            return Response.json({
            success : false,
            message: "User not found"
        },{status : 404})

        }

        const isCodeValid = user.verifyCode == code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true,
            await user.save()            
            return Response.json({
                success : true,
                message : "Account verified successfully"
            },{status : 200})

        }else if(!isCodeNotExpired){
             return Response.json({
                success : false,
                message : "Verification code is expired , please signup again"
            },{status : 405})
        }else{
            return Response.json({
                success : false,
                message : "Incorrect verification code"
            },{status : 400})
        }
    } catch (error) {
        console.error("Error Verification Account", error)
        return Response.json({
            success : false,
            message: "Error Verification Account"
        },{status : 500})
    }
}