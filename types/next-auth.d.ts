import 'next-auth'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
    interface User{
        _id?: string,
        id?: string, // Optional, to prevent type errors
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }
    interface Session{
        user: {
            _id?: string;
            id?: string; // Optional, to prevent type errors
            isVerified: boolean;
            isAcceptingMessages?: boolean;
            username?: string,           
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface jwt{
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }
}