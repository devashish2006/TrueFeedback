import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { log } from "console";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: { // Changed from "Credentials" to "credentials"
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                if (!credentials?.identifier || !credentials?.password) {
                    console.error("Invalid credentials provided:", credentials);
                    throw new Error("Both email/username and password are required.");
                }
            
                console.log("Authorize called with:", credentials);
                await dbConnect();
            
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
                    });
            
                    if (!user) {
                        console.log("No user found for identifier:", credentials.identifier);
                        throw new Error("No User Found with this email/username");
                    }
            
                    if (!user.isVerified) {
                        console.log("User is not verified:", user);
                        throw new Error("Please verify your account before login.");
                    }
            
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        console.log("Incorrect password for user:", user.username);
                        throw new Error("Incorrect Password");
                    }
            
                    return user;
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Authorization error:", error.message);
                        throw new Error(error.message);
                    } else {
                        console.error("Unknown error occurred:", error);
                        throw new Error("Authorization failed due to an unknown error.");
                    }
                }
            }
            
            
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log("JWT callback - Token before modification:", token); // Debug token
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessages;
                token.username = user.username;
                console.log("JWT callback - Token after modification:", token); // Log updated token
            }
            return token;
        },
        async session({ session, token }) {
            console.log("Session callback - Session before modification:", session); // Debug session
            console.log("Session callback - Token:", token); // Debug token data
            if (token) {
                session.user._id = token._id as string | undefined; // Explicitly cast _id to string or undefined
                session.user.isVerified = token.isVerified as boolean; // Cast isVerified as boolean
                session.user.isAcceptingMessages = token.isAcceptingMessages as boolean | undefined; // Cast isAcceptingMessages as boolean or undefined
                session.user.username = token.username as string | undefined; // Cast username as string or undefined
            }
            console.log("Session callback - Session after modification:", session); // Log updated session
            return session;
        }
    }
};
