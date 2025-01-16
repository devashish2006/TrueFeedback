import {z} from 'zod'

export const usernameValidation = z 
    .string()
    .min(2, "Username Must be atleast 2 characters")
    .max(20, "Username must be No more than 20 characters")
    .regex(/^[a-zA-Z0-9_]{3,16}$/, "Username ,must not contains special Characters")


export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: "Password Must be atleast 6 chararacters"})
})