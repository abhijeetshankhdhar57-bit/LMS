"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function TopBar() {
    const { data: session } = useSession();

    return (
        <div className="flex h-14 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-xl px-6">
            <div className="text-sm font-medium text-foreground/80">
                {session ? (
                    <>Welcome back, <span className="font-bold text-white">{session.user?.name}</span></>
                ) : (
                    "Welcome to LMS Platform"
                )}
            </div>
            <div className="flex items-center gap-4">
                {session ? (
                    <>
                        <Button variant="outline" size="sm" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                    </>
                ) : (
                    <Button variant="default" size="sm" onClick={() => signIn("google")}>
                        Sign In with Google
                    </Button>
                )}
            </div>
        </div>
    );
}
