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
                if (!credentials?.username || !credentials?.password) {
                    console.error("Invalid credentials provided:", credentials);
                    throw new Error("Both email/username and password are required.");
                }
            
                console.log("Authorize called with:", credentials);
                await dbConnect();
            
                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.username }, { username: credentials.username }],
                    });
            
                    if (!user) {
                        console.log("No user found for identifier:", credentials.username);
                        throw new Error("No User Found with this email/username");
                    }
            
                    if (!user.isVerified) {
                        console.log("User is not verified:", user);
                        throw new Error("Please verify your account before login.");
                    }
            
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    console.log("Password comparison result:", isPasswordCorrect);
                    if (!isPasswordCorrect) {
                        console.log("Incorrect password for user:", user.username);
                        throw new Error("Incorrect Password");
                    }
            
                    return user;
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Authorization failed.");
                }
            }
            
            
            
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
          if (user) {
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessage = user.isAcceptingMessages;
            token.username = user.username;
          }
          return token;
        },
        async session({ session, token }) {
          if (token) {
            session.user._id = token._id as string | undefined;
            session.user.isVerified = token.isVerified as boolean;
            session.user.isAcceptingMessages = token.isAcceptingMessages as boolean | undefined;
            session.user.username = token.username as string | undefined;
          }
          return session;
        },
        redirect({ url, baseUrl }) {
          return '/ask'; // <--- 👈 This line ensures the user is redirected to /ask after login
        }
      }
      
};
