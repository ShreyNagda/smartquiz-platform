import User from "@/models/User";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import dbConnect from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRECT,
  callbacks: {
    jwt: async function ({ token, user, account }) {
      await dbConnect();
      if (account && user) {
        const existingUser =
          (await User.findOne({ email: user.email })) ||
          (await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          }));

        token.id = existingUser._id.toString();
        console.log("Token from auth.ts", token);
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user, // preserve other fields (name, email, etc.)
          id: token.id as string,
        };
      }
      return session;
    },
  },
});
