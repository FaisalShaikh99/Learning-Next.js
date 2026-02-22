import dbConnect from "../../../lib/dbConnect";
import UserModel from "../../../model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail }
    from "../../../helpers/sendVerification";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json()

        // user username se exist karta hai aur verified bhi hai to
        const existingVerfiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerfiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        //  user email ke sath exist karta hai to use email se find kiya
        const existingUserByEmail = await UserModel.findOne({ email })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        // agar user email se milta hai to
        if (existingUserByEmail) {
            // agar user already verified ho email ke sath
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email"
                    },
                    {
                        status: 400
                    }
                )
            }
            else {
                //agar user email se exist karta hai lekin verified nahi hai to
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save();
            }
        } else {
            // user email se nhi milta hai to naya user create hoga
            const hasedPassword = await bcrypt.hash(password, 10) // hash mean password ko kisi special character se convert karna(secure karna)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error in sign-up", error)
        return Response.json(
            {
                success: false,
                message: "Error Registering User"
            },
            {
                status: 500
            }
        )

    }
}