"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check } from "lucide-react";
import { sendReminders } from "@/app/actions/admin";

export function SendRemindersButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSend = async () => {
        if (!confirm("Are you sure you want to email all learners who have not completed their mandatory modules?")) return;

        setStatus("loading");
        try {
            const res = await sendReminders();
            if (res.success) {
                setStatus("success");
                alert(`Successfully sent ${res.count} reminder email(s)!`);
                setTimeout(() => setStatus("idle"), 4000);
            } else {
                setStatus("error");
                alert("Failed to send reminders.");
                setTimeout(() => setStatus("idle"), 4000);
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            alert("An error occurred while sending reminders.");
            setTimeout(() => setStatus("idle"), 4000);
        }
    };

    return (
        <Button
            onClick={handleSend}
            disabled={status === "loading" || status === "success"}
            className="flex items-center gap-2"
        >
            {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === "success" && <Check className="w-4 h-4 text-white" />}
            {status === "idle" && <Mail className="w-4 h-4" />}
            {status === "error" && <Mail className="w-4 h-4 text-red-500" />}

            {status === "loading" ? "Scanning & Sending..." : status === "success" ? "Reminders Sent!" : status === "error" ? "Failed" : "Send Reminders"}
        </Button>
    );
}
