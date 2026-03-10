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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, PlayCircle, BookOpen, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function TopBar() {
    const { data: session } = useSession();

    // Helper to capitalize names like "abhijeet shankhdhar" -> "Abhijeet Shankhdhar"
    const userName = session?.user?.name || "User";
    const capitalizedName = userName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    // @ts-ignore
    const userRole = session?.user?.role || "USER";
    const isAdmin = userRole === "ADMIN";

    const pathname = usePathname();
    const router = useRouter();
    const [viewMode, setViewMode] = useState<"ADMIN" | "LEARNER">("ADMIN");

    const activeRole = isAdmin ? viewMode : "LEARNER";

    const learnerLinks = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "My Courses", href: "/courses", icon: PlayCircle },
        { name: "Progress", href: "/progress", icon: BookOpen },
    ];

    const adminLinks = [
        { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "User Directory", href: "/admin/users", icon: Users },
        { name: "Manage Videos", href: "/admin/videos", icon: PlayCircle },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const links = activeRole === "ADMIN" ? adminLinks : learnerLinks;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-2xl px-4 md:px-8 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-3">
                {/* Mobile Hamburger Menu */}
                {session && (
                    <div className="md:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 bg-black/90 backdrop-blur-3xl border-r border-white/10 p-0 flex flex-col">
                                <div className="flex h-16 items-center border-b border-white/10 px-6 justify-between relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50 pointer-events-none" />
                                    <span className="text-xl font-bold tracking-tight text-white z-10">Juspay LMS</span>
                                </div>
                                <nav className="flex-1 space-y-2 p-4 pt-6 overflow-y-auto">
                                    {links.map((link) => {
                                        const Icon = link.icon;
                                        const isRoot = link.href === "/" || link.href === "/admin";
                                        const isActive = isRoot
                                            ? pathname === link.href
                                            : (pathname === link.href || pathname.startsWith(`${link.href}/`));

                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden ${isActive
                                                    ? "text-white bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(100,60,255,0.2)]"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                                    }`}
                                            >
                                                <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${isActive ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-white"}`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <span className="relative z-10 tracking-wide">{link.name}</span>
                                            </Link>
                                        );
                                    })}

                                    {isAdmin && (
                                        <div className="pt-4 mt-4 border-t border-white/10">
                                            <button
                                                onClick={() => {
                                                    const newMode = viewMode === "ADMIN" ? "LEARNER" : "ADMIN";
                                                    setViewMode(newMode);
                                                    setMobileOpen(false);
                                                    router.push(newMode === "ADMIN" ? "/admin" : "/courses");
                                                }}
                                                className="w-full relative group flex items-center justify-between gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/5"
                                            >
                                                <span className="relative z-10 tracking-wide">
                                                    {viewMode === "ADMIN" ? "Switch to Learner" : "Switch Admin"}
                                                </span>
                                                <div className="relative z-10 p-1 rounded bg-white/10 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <Settings className="h-3 w-3" />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </nav>
                                {activeRole === "ADMIN" && (
                                    <div className="p-4 border-t border-white/10 mt-auto">
                                        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 border border-white/10 relative overflow-hidden">
                                            <p className="text-xs font-medium text-white/80">Premium LMS Experience</p>
                                        </div>
                                    </div>
                                )}
                            </SheetContent>
                        </Sheet>
                    </div>
                )}

                <div className="hidden md:flex p-2 bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(100,60,255,0.3)]">
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
