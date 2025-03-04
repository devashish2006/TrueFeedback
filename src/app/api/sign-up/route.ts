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

        // Case-insensitive check for existing verified username
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") }, // Case-insensitive search
            isVerified: true,
        });
        console.log("Existing verified user with username:", existingUserVerifiedByUsername);

        if (existingUserVerifiedByUsername) {
            console.log("Username already taken (case-insensitive):", username);
            return Response.json(
                {
                    success: false,
                    message: "Username is already taken. Please choose a different username.",
                },
                { status: 400 }
            );
        }

        // Case-insensitive check for existing unverified username
        const existingUnverifiedUserByUsername = await UserModel.findOne({
            username: { $regex: new RegExp(`^${username}$`, "i") }, // Case-insensitive search
            isVerified: false,
        });
        console.log("Existing unverified user with username:", existingUnverifiedUserByUsername);

        // Case-insensitive check for existing email
        const existingUserByEmail = await UserModel.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") }, // Case-insensitive search
        });
        console.log("Existing user with email:", existingUserByEmail);

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("Generated verification code:", verifyCode);

        if (existingUnverifiedUserByUsername) {
            console.log("Updating existing unverified user with same username");
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed password:", hashedPassword);

            existingUnverifiedUserByUsername.email = email;
            existingUnverifiedUserByUsername.password = hashedPassword;
            existingUnverifiedUserByUsername.verifyCode = verifyCode;
            existingUnverifiedUserByUsername.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await existingUnverifiedUserByUsername.save();
            console.log("Updated unverified user in database:", existingUnverifiedUserByUsername);

            // Send verification email to the updated email address
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

            return Response.json(
                {
                    success: true,
                    message: "User information updated. Please verify your email.",
                },
                { status: 200 }
            );
        } else if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log("User already exists and is verified:", email);
                return Response.json(
                    {
                        success: false,
                        message: "User already exists with this email.",
                    },
                    { status: 400 }
                );
            } else {
                console.log("Updating existing unverified user with new credentials");
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("Hashed password:", hashedPassword);

                existingUserByEmail.username = username;
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
                message: "Error in registering user.",
            },
            { status: 500 }
        );
    }
}