import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./models/user";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./queries/users";
import { dbConnect } from "./lib/mongo";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
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

        await dbConnect();

        const user = await findUserByEmail(credentials?.email);

        if (user) {
          if (user.provider !== 'credentials') {
            throw new Error(`This email is registered with ${user.provider}. Please use ${user.provider} to log in.`);
          }

          const isMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (isMatch) {
            return user;
          } else {
            throw new Error("Invalid email address");
          }
        } else {
          throw new Error("Invalid password");
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
          scope: "read:user user:email",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {

      const existingUser = await User.findOne({ email: user?.email });

      if (existingUser && existingUser.provider !== account.provider) {
        throw new Error(`This email is already registered with ${existingUser.provider}. Please use ${existingUser.provider} to log in.`);
    }

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          provider: account.provider,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else {
        const dbUser = await User.findOne({ email: token.email });
        token.id = dbUser?._id;
        token.role = dbUser?.role;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
