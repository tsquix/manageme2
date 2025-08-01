import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import User from "../../../../models/User";
import connectMongoDB from "../../../../lib/mongoose";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await connectMongoDB();

          const user = await User.findOne({ email: credentials.email });
          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordValid) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
            };
          }
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          throw error; // This will help with debugging
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;

        if (account?.provider === "google") {
          token.role = "guest";
          token.provider = "google";
        }

        if (account?.provider === "credentials") {
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-up",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
