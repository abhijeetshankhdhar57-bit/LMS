"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Role = "ADMIN" | "LEARNER";

interface User {
    id: string;
    name: string;
    role: Role;
}

interface UserContextType {
    user: User;
    setUser: (user: User) => void;
    toggleRole: () => void;
}

// Default mock users
export const mockAdmin: User = { id: "admin-1", name: "Admin User", role: "ADMIN" };
export const mockLearner: User = { id: "learner-1", name: "Student User", role: "LEARNER" };

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(mockLearner);

    const toggleRole = () => {
        setUser(user.role === "ADMIN" ? mockLearner : mockAdmin);
    };

    return (
        <UserContext.Provider value={{ user, setUser, toggleRole }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
