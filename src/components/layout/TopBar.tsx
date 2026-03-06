"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, Sparkles } from "lucide-react";

export function TopBar() {
    const { data: session } = useSession();

    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-2xl px-8 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(100,60,255,0.3)]">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm tracking-wide text-foreground/70">
                    {session ? (
                        <>Welcome back, <span className="font-bold text-white tracking-widest">{session.user?.name}</span></>
                    ) : (
                        "Welcome to LMS Platform"
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {session ? (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(100,60,255,0.4)] ring-2 ring-white/10">
                                {session.user?.name?.charAt(0) || "U"}
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/10"></div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut()}
                            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Button
                        size="sm"
                        onClick={() => signIn("google")}
                        className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_20px_rgba(100,60,255,0.4)] border border-primary/50 gap-2 transition-all hover:scale-105"
                    >
                        <LogIn className="w-4 h-4" />
                        Sign In with Google
                    </Button>
                )}
            </div>
        </div>
    );
}
