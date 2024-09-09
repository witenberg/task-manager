import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
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
              
                  //try {
                    const user = await User.findOne({
                      email: credentials?.email
                    });
                    
                    if (user) {
                      const isMatch = await bcrypt.compare(
                        credentials.password,
                        user.password,
                      );
              
                      if (isMatch) {
                        return user;
                      } else {
                        throw new CredentialsSignin("Invalid email address");
                      }
                    } else {
    
                        throw new CredentialsSignin("Invalid password");
                    };
                  /*} catch (e) {
                    throw e;
                  }*/
                }
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