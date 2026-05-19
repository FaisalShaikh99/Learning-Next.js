import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerification";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json(
                { success: false, message: "Username is required" }, 
                { status: 400 }
            );
        }

        const user = await UserModel.findOne({ username, isVerified: false });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found or already verified" }, 
                { status: 400 }
            );
        }

        // Generate a new secure 6-digit verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.verifyCode = verifyCode;
        user.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await user.save();

        // Send email verification
        const emailResponse = await sendVerificationEmail(
            user.email,
            user.username,
            verifyCode
        );

        if (!emailResponse.success) {
            return NextResponse.json(
                { success: false, message: emailResponse.message }, 
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "New verification code sent successfully to your email" }, 
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resending verification code:", error);
        return NextResponse.json(
            { success: false, message: "Error resending verification code" }, 
            { status: 500 }
        );
    }
}
