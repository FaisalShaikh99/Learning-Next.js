import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

// ye functionality provide karta hai ki kis tarah se user login karega
export const authOption : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            // ye credentials ke through user login karega
            id: "credentials",
            name: "Credentials",
            // ye main credentials hai
            credentials : {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            // ye login ke liye important authorization function hai
            async authorize(credentials: any): Promise<any>{
                // jab user login form submit karega to ye function call hoga
                // sab se pehle db connect hoga
                await dbConnect()
                try { // find user by email or username in db
                  const user =  await UserModel.findOne({
                    $or : [
                        {email : credentials.identifier},
                        {username : credentials.identifier},
                    ]
                   }) 
                   if(!user){
                    throw new Error("User not found with this email")
                   }

                   if(!user.isVerified){
                    throw new Error("Please verify your account before login")
                   }

                   // comparing password 
                   const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                   if(isPasswordCorrect){
                    return user;
                   }else{
                       throw new Error("Incorrect Password")
                   }
                } catch (err : any) {
                    throw new Error(err)
                    
                }
            }
        })
    ],
    //Callbacks ka kaam User data → Token me store karna → Session me bhejna
    callbacks : {
        async jwt({ token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }

            return token
        },
         async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
            },
    },
    //Default NextAuth sign in page ki jagah custom page use hoga.
    pages :{
        signIn: '/sign-in'
    },
    // Browser me token store hoga (cookie me)
    session : {
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET,  
}

