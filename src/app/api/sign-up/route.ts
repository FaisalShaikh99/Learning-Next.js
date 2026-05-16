import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerification";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // Check if another user already has this verified username
    const userExistVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (userExistVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Check if the email exists
    const existingByEmail = await UserModel.findOne({ email });
    // Generate a secure 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If user exists with the given email
    if (existingByEmail) {
      if (existingByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        // User exists but isn't verified. Update their info.
        const hashedPassword = await bcrypt.hash(password, 10);
        
        existingByEmail.password = hashedPassword;
        existingByEmail.username = username; // Update username in case it changed
        existingByEmail.verifyCode = verifyCode;
        // 1 hour expiry
        existingByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingByEmail.save();
      }
    } else {
      // Create a brand new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send email verification
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}