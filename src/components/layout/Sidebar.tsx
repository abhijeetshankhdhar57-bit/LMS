"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, PlayCircle, BookOpen, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    // @ts-ignore - custom token role
    const isAdmin = session?.user?.role === "ADMIN";

    const learnerLinks = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "My Courses", href: "/courses", icon: PlayCircle },
        { name: "Progress", href: "/progress", icon: BookOpen },
    ];

    const adminLinks = [
        { name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Manage Videos", href: "/admin/videos", icon: PlayCircle },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const links = isAdmin ? adminLinks : learnerLinks;

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col h-full w-64 border-r border-white/10 bg-black/60 backdrop-blur-3xl shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-20"
        >
            <div className="flex h-16 items-center border-b border-white/10 px-6 justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50 pointer-events-none" />
                <Image
                    src="/juspay-logo.jpg"
                    alt="Juspay"
                    width={100}
                    height={26}
                    className="z-10 invert grayscale brightness-200 contrast-200 mix-blend-screen drop-shadow-md"
                />
                {session?.user && (
                    <span className="z-10 text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(100,60,255,0.2)] border border-primary/30">
                        {/* @ts-ignore */}
                        {session.user.role || "LEARNER"}
                    </span>
                )}
            </div>
            <nav className="flex-1 space-y-2 p-4 pt-6">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden ${isActive
                                ? "text-white bg-white/5"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-bg"
                                    className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent border border-primary/30 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                />
                            )}
                            <div className={`relative z-10 p-1.5 rounded-lg transition-colors ${isActive ? "bg-primary text-white shadow-[0_0_15px_rgba(100,60,255,0.5)]" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-white"}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                            <span className="relative z-10 tracking-wide">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-white/10">
                <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 border border-white/10 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/40 blur-2xl rounded-full pointer-events-none" />
                    <p className="text-xs font-medium text-white/80">Premium LMS Experience</p>
                    <p className="text-[10px] text-white/50 mt-1">Design V2</p>
                </div>
            </div>
        </motion.div>
    );
}
