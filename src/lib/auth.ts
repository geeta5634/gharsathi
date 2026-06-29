import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "phone",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;

        const phone = credentials.phone as string;
        const otp = credentials.otp as string;
        const role = (credentials.role as string) || "CUSTOMER";

        if (otp !== "123456" && process.env.NODE_ENV !== "production") {
          return null;
        }

        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone,
              role: role as "CUSTOMER" | "WORKER" | "ADMIN",
            },
          });

          if (role === "CUSTOMER") {
            await prisma.customer.create({
              data: { userId: user.id },
            });
          } else if (role === "WORKER") {
            const category = (credentials.serviceCategory as string) || "PLUMBER";
            await prisma.worker.create({
              data: {
                userId: user.id,
                serviceCategory: category as any,
              },
            });
          }
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          email: user.email,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone as string;
        token.role = user.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
