import User from "@/models/User";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    jwt: async function ({ token, user, account }) {
      if (account && user) {
        const existingUser =
          (await User.findOne({ email: user.email })) ||
          (await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          }));

        token.id = existingUser._id.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
    // signIn: async function ({ account, user }) {
    //   if (account?.provider === "google") {
    //     try {
    //       let existingUser = await User.findOne({ email: user.email });
    //       let id = null;
    //       if (!existingUser) {
    //         existingUser = await User.create({
    //           email: user.email,
    //           name: user.name,
    //           image: user.image,
    //         });
    //       }
    //       id = existingUser._id.toString();
    //       const cookieStore = await cookies();
    //       cookieStore.set("id", id);
    //       return true;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //     return true;
    //   }
    //   return true;
    // },
    // redirect: async function ({ baseUrl }) {
    //   return `${baseUrl}/dashboard`;
    // },
  },
});
