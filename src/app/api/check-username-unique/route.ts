import dbConnect from '@/lib/dbConnect'
import UserModel from '@/model/User'
import { z } from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'

const UsernameQuerySchema = z.object({
    username: usernameValidation,
})

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username'),
        }

        const result = UsernameQuerySchema.safeParse(queryParams)
        console.log(result) //TODO
        

        if(!result.success){
            const usernameError= result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message:
                        usernameError?.length > 0 
                            ?usernameError.join(', ')
                            : 'Invalid query parameters'
                },
                { status: 400 }
            )
        }

        const { username } = result.data

        const exisitingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        })

        if(exisitingVerifiedUser){
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                {status:200}
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is Unique",
            },
            {status:200}
        )

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: 'Error checking username',  
            },
            { status: 500 }
        );
    }
}
