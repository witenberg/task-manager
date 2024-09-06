import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "./app/data/users";
import User from "./app/models/user";
import bcrypt from "bcryptjs";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth({
        session: {
            strategy: 'jwt',
        },

        providers: [
            CredentialsProvider({
                credentials: {
                    email: {},
                    password: {},
                },
                async authorize(credentials) {
                    if (credentials === null) return null;
                    
                    try {
                        const user = await User.findOne({
                            email: credentials?.email
                        })
                        console.log(user);
                        if (user) {
                            const isMatch = await bcrypt.compare(
                                credentials.password,
                                user.password,
                            )
    
                            if (isMatch) {
                                return user;
                            } else {

                                throw new Error("Incorrect password");
                            }
                        } else {
                            throw new Error("User not found");
                        }
                    } catch (error) {
                        console.log(error.message);
                        throw new Error(error.message);
                    }
                },
            }),
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                authorization: {
                    params: {
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code",
                    },
                },
            }),

            GithubProvider({
                clientId: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                authorization: {
                    params: {
                        prompt: "consent",
                        access_type: "offline",
                        response_type: "code",
                    },
                },
            })
        ],
    });