import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmails";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    console.log("Incoming POST request for user registration");
    await dbConnect();
    console.log("Database connected successfully");

    try {
        const { username, email, password } = await request.json();
        console.log("Received data:", { username, email });

        // Check if a verified user with the same username already exists
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        console.log("Existing verified user with username:", existingUserVerifiedByUsername);

        if (existingUserVerifiedByUsername) {
            console.log("Username already taken:", username);
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 400 }
            );
        }

        // Check if a user with the same email exists
        const existingUserByEmail = await UserModel.findOne({ email });
        console.log("Existing user with email:", existingUserByEmail);

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generated verification code:", verifyCode);

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log("User already exists and is verified:", email);
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email",
                    },
                    { status: 400 }
                );
            } else {
                console.log("Updating existing unverified user with new credentials");
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("Hashed password:", hashedPassword);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
                console.log("Updated unverified user in database:", existingUserByEmail);
            }
        } else {
            console.log("Creating a new user entry");
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed password for new user:", hashedPassword);

            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            console.log("Verification code expiry set to:", expiryDate);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                messages: [],
            });
            await newUser.save();
            console.log("New user saved successfully:", newUser);
        }

        // Send verification email
        console.log("Attempting to send verification email to:", email);
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        console.log("Email sending response:", emailResponse);

        if (!emailResponse.success) {
            console.error("Failed to send verification email:", emailResponse.message);
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        console.log("User registration successful. Verification email sent.");
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email.",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            {
                success: false,
                message: "Error in registering user",
            },
            { status: 500 }
        );
    }
}
