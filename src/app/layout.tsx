import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS Platform",
  description: "A simple Learning Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {!session ? (
            <main className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-[#142340]">
              {/* Extremely subtle ambient glows */}
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_rgba(255,255,255,0.03)_0%,_transparent_50%)] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_rgba(255,255,255,0.03)_0%,_transparent_50%)] pointer-events-none" />
              <div className="relative z-10 w-full max-w-[420px]">
                {children}
              </div>
            </main>
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden relative">
                <TopBar />
                <main className="flex-1 overflow-y-auto w-full max-w-7xl mx-auto p-4 md:p-8">
                  {children}
                </main>
              </div>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
