import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password");
        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Always fetch the latest user data from the database for instant updates
      await connectToDatabase();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser && session.user) {
        (session.user as unknown as { id?: string }).id = dbUser._id;
        session.user.name = dbUser.name;
        session.user.email = dbUser.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
