import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import { verifyOtp } from "@/app/actions/auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            phone?: string | null;
            role: string;
        };
    }

    interface User {
        role?: string;
        phone?: string | null;
    }
}

const adminEmail = process.env.ADMIN_EMAIL;

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID || "common",
        }),
        CredentialsProvider({
            name: "phone",
            credentials: {
                phone: { label: "Phone", type: "text" },
                code: { label: "Code", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.code) return null;

                const result = await verifyOtp(credentials.phone, credentials.code);

                if (result.success && result.user) {
                    return {
                        id: result.user.id,
                        name: result.user.name,
                        phone: result.user.phone,
                        role: result.user.role,
                    } as any;
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Determine if user signing in is the designated admin
                const role = user.email === adminEmail ? "ADMIN" : "LEARNER";
                token.role = role;
                token.id = user.id;
                token.phone = user.phone;

                // Sync the role directly into the database on first login or if changed
                // Only update if email exists (OAuth users)
                if (user.email) {
                    await db.user.update({
                        where: { email: user.email },
                        data: { role },
                    });
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.phone = token.phone as string | null;
            }
            return session;
        },
    },
};
