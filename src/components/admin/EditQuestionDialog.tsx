"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditQuestionForm } from "./EditQuestionForm";
import { Question } from "@prisma/client";

export function EditQuestionDialog({ question }: { question: Question }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10">
                    <Pencil className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                </DialogHeader>
                <EditQuestionForm question={question} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
