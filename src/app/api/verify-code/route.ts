import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            console.error("User not found:", decodedUsername);
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // Check if the code is correct and not expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            // Update the user's verification status
            user.isVerified = true;
            await user.save();

            console.log("Account verified for user:", decodedUsername);
            return Response.json(
                { success: true, message: "Account verified successfully" },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            console.warn("Verification code expired for user:", decodedUsername);
            // Code has expired
            return Response.json(
                {   
                    success: false,
                    message: "Verification code has expired. Please request a new code.",
                },
                { status: 400 }
            );
        } else {
            console.warn("Invalid verification code for user:", decodedUsername);
            // Code is incorrect
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code. Please try again.",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            { success: false, message: "Error verifying user" },
            { status: 500 }
        );
    }
}
