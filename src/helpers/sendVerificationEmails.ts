import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  console.log(`Attempting to send verification email to ${email} with OTP: ${verifyCode}`);
  
  try {
    const response = await resend.emails.send({
      from: 'noreply@truefeedback.xyz',
      to: email,
      subject: 'TrueFeedback | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    
    console.log("Email sent successfully, response:", response);
    return { success: true, message: 'Verification email sent successfully' };
    
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: 'Failed to send verification email' };
  }
}
