import { NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { dbConnect } from "@/lib/dbConnect"
import UserModel from "@/model/user.model"
import bcrypt from "bcryptjs"
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
    providers : [
       CredentialsProvider({
           id: "creadential",
           name: "Creadential",
           credentials :{
              email : {label : "Email", type : "text"},
              password : {label : "Password", type : "password"}
           },
           async authorize(creadentials: any):Promise<any>{
                await dbConnect();
                try {
                  const user =  await UserModel.findOne({
                        // user can find with email or username
                        $or:[
                            {email : creadentials.indetifier},
                            {password :creadentials.indetifier}
                        ]
                    })

                    if(!user){
                        throw new Error("User is not found with this email")             
                    }

                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }

                     const isPasswordCorrect = await bcrypt.compare(creadentials.password, user.password)
                     if(isPasswordCorrect){
                        return user // ye user ka callback me use hota hai
                     }else{
                        throw new Error("Incorrect Password")
                     }

                } catch (err: any) {
                    throw new Error(err)
                }
           } 
       }),
       
       GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],

    callbacks :{ // yaha user uper providers me jo user return karaya tha vo hai
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
        return token
    },
       async session({ session, token }) {
        if(token){
                session.user._id = token._id?.toString();
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username
            }
       return session
    },       
    },
    pages : {
        signIn : "/sign-In"
    },
    session :{
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET

}