"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateVideoMetadata } from "@/app/actions/admin";
import { Loader2, Settings2 } from "lucide-react";

interface EditVideoDialogProps {
    video: {
        id: string;
        title: string;
        description: string | null;
        isMandatory: boolean;
        passingPercentage: number;
    };
}

export function EditVideoDialog({ video }: EditVideoDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData(e.currentTarget);
            await updateVideoMetadata(video.id, formData);
            setOpen(false);
        } catch (error) {
            console.error(error);
            alert("Failed to update module settings.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 hover:bg-white/10">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Edit Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-white/10 bg-black/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle>Edit Module Settings</DialogTitle>
                    <DialogDescription>
                        Update the administrative configuration for this course.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title</Label>
                            <Input id="title" name="title" defaultValue={video.title} required className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={video.description || ""}
                                className="min-h-[100px] bg-white/5 border-white/10"
                            />
                        </div>

                        <div className="space-y-4 p-4 rounded-xl border border-white/5 bg-white/5">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isMandatory"
                                    name="isMandatory"
                                    defaultChecked={video.isMandatory}
                                    className="w-5 h-5 rounded border-white/20 bg-black/50 accent-primary"
                                />
                                <div className="space-y-1">
                                    <Label htmlFor="isMandatory" className="font-medium leading-none cursor-pointer">Mandatory Module</Label>
                                    <p className="text-sm text-muted-foreground leading-snug">Requires learners to complete this course.</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10 space-y-2">
                                <Label htmlFor="passingPercentage">Passing Percentage Requirement</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        id="passingPercentage"
                                        name="passingPercentage"
                                        placeholder="e.g. 80"
                                        min="0"
                                        max="100"
                                        defaultValue={video.passingPercentage.toString()}
                                        className="bg-black/50 border-white/10 w-24"
                                    />
                                    <span className="text-muted-foreground text-sm font-medium">%</span>
                                </div>
                                <p className="text-xs text-muted-foreground">Set to 0 to remove passing score requirements.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
