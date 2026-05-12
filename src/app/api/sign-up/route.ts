import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerification";

export async function POST(request : Request){
    await dbConnect();
    try {
        const {username, email, password} = await request.json()

        // check by username
        const userExistVerfiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(userExistVerfiedByUsername){
            return Response.json({
            success : false,
            message : "Username is already exist"
          }, {status : 400} )
        }

        // check by email
         const existingByEmail = await UserModel.findOne({email})
         const verifyCode = Math.floor(10000 + Math.random() * 90000).toString()

         // if user exist with email and verified
         if(existingByEmail){
             if(existingByEmail.isVerified)
                return Response.json({
                success : false,
                message : "This email exist and verified already"
            },
           {status : 400} ) 
           else{
                 const hashedPassword = await bcrypt.hash(password, 10)
                 existingByEmail.password = hashedPassword,
                 existingByEmail.verifyCode = verifyCode,
                 existingByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)

                 await existingByEmail.save()
            }
         }else{
            // create new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

           const newUser = new UserModel({
                  username,
                  email,
                  password : hashedPassword,
                  verifyCode,
                  verifyCodeExpiry : expiryDate,
                  isVerified : false,
                  isAcceptingMessage : true, 
                  messages : []
            })

            await newUser.save()
         }

         // send email verification and pass props
         const emailResponse = await sendVerificationEmail(email, username, verifyCode)

         if(!emailResponse.success){
           return Response.json({
            success : false,
            message : emailResponse.message
          }, {status : 400} )
         }

         return Response.json({
            success : true,
            message : "User registered successfully, please verify your email"
          }, {status : 201} )
    } catch (error) {
        console.error("Error registring user", error)
        return Response.json({
            success : false,
            message : "Error Registring User"
        }, {status : 500} )
    }
}