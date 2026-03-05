"use client";

import { useUser } from "@/lib/UserContext";
import { Button } from "@/components/ui/button";

export function TopBar() {
    const { user, toggleRole } = useUser();

    return (
        <div className="flex h-14 items-center justify-between border-b bg-white px-6">
            <div className="text-sm font-medium">
                Welcome back, <span className="font-bold">{user.name}</span>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={toggleRole}>
                    Switch to {user.role === "ADMIN" ? "Learner" : "Admin"} View
                </Button>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.name.charAt(0)}
                </div>
            </div>
        </div>
    );
}
