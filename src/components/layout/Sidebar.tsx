"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LayoutDashboard, PlayCircle, BookOpen, Settings } from "lucide-react";
import { useSession } from "next-auth/react";

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
        <div className="flex h-full w-64 flex-col border-r border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="flex h-14 items-center border-b border-white/5 px-4 justify-between">
                <Image src="/juspay-logo.png" alt="Juspay" width={90} height={24} className="opacity-90 grayscale brightness-200 contrast-200" />
                {session?.user && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary/80 bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        {/* @ts-ignore */}
                        {session.user.role || "LEARNER"}
                    </span>
                )}
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${isActive
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(100,60,255,0.1)]"
                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
