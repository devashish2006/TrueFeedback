import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "../../types/ApiResponse";
import { promises } from "dns";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {success: true, message: 'Verification email Send Successfully'}
    } catch (emailError) {
        console.log("Error sending verification email", emailError);
        return {success: false, message: 'Failed to send Verification Email'}
    }
}