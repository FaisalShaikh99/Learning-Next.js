import {z} from "zod"

export const signInSchema = z.object({
    email : z.string(),
    passoword : z.string().min(6, {message:"Password must be at least 6 characters"})
})