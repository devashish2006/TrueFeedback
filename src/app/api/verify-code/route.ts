import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {success: false, message: 'User not found' },
                {status: 404 }
            )
        }

        //check if the code is correct and  not expired
        const isCodeVaild = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeVaild && isCodeNotExpired) {
            //Update the users Verification status
            user.isVerified = true
            await user.save()

            return Response.json(
                { success: true, message: "Account Verified Successfully" },
                {status: 200}
            )
        } else if(!isCodeNotExpired) {
            //Code has expired
            return Response.json(
                {
                    success: false, message: 'Incorrect verification Code'
                },
                {
                    status: 400
                }
            )
        } else{
            //code is incorrect
            return Response.json(
                {
                    success: false, message: 'Incorrect verification code'
                },
                {
                    status: 400
                }
            )
        } 
    } catch (error) {
        console.log("Error verifying User", error)
        return Response.json(
                { success: false, message: 'Error verifying user' },
                { status: 500 }
        )
    }
}