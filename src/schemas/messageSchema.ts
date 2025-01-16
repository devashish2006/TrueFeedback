import { z } from "zod"

export const messageSchema = z.object({
   content: z
   .string()
   .min(10, {message: "content must be of atleat 10 characters"})
   .max(300, {message: "content must be no longer then 300 characters"})
})