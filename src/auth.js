import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "./models/user";
import bcrypt from "bcryptjs";

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

        const user = await User.findOne({
          email: credentials?.email,
        });

        if (user) {
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

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
        });
      } else {
        console.log("ISTNIEJEEEEEEEEEEEEEEEEEEEE");
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        // Zapisz ID użytkownika w tokenie
        token.id = user.id;
      } else {
        // Pobierz użytkownika z bazy danych, jeśli jest to żądanie sesji
        const dbUser = await User.findOne({ email: token.email });
        token.id = dbUser?._id;
      }
      return token;
    },

    async session({ session, token, user }) {
      session.user.id = token.id;
      return session;
    },
  },
});
