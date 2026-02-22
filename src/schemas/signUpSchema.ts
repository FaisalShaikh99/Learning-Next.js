
export const usernameValidation = z
.string()
.min(3, "Username must be at least 3 characters long")
.max(25, "Username must not be more than 25 characters long")
.regex(/^[a-zA-Z0-9_]*$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: "Invalid email address"}),
    password : z.string().min(6, "Password must be at least 6 characters long")
})