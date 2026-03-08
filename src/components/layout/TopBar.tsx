"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, Sparkles, User as UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
    const { data: session } = useSession();

    // Helper to capitalize names like "abhijeet shankhdhar" -> "Abhijeet Shankhdhar"
    const userName = session?.user?.name || "User";
    const capitalizedName = userName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    // @ts-ignore
    const userRole = session?.user?.role || "USER";

    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-2xl px-8 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(100,60,255,0.3)]">
                    <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm tracking-wide text-foreground/70">
                    {session ? (
                        <>Welcome back, <span className="font-bold text-white tracking-widest">{capitalizedName}</span></>
                    ) : (
                        "Welcome to LMS Platform"
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {session ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="outline-none group relative">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(100,60,255,0.4)] ring-2 ring-white/10 group-hover:ring-primary/50 transition-all group-hover:scale-105">
                                    {capitalizedName.charAt(0)}
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none text-white">{capitalizedName}</p>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-primary/20 text-primary uppercase">
                                            {userRole}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem onClick={() => signOut()} className="text-red-400 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
