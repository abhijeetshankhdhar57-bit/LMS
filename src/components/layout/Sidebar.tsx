"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, BookOpen, Settings } from "lucide-react";
import { useUser } from "@/lib/UserContext";

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();

    const isAdmin = user.role === "ADMIN";

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
        <div className="flex h-full w-64 flex-col border-r bg-white">
            <div className="flex h-14 items-center border-b px-4">
                <span className="font-bold text-lg text-primary">LMS Platform</span>
                <span className="ml-2 text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                    {user.role}
                </span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
