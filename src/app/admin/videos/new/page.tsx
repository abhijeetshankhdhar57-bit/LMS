"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVideo } from "@/app/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function NewVideoPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            const video = await createVideo(formData);
            router.push(`/admin/videos/${video.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Add New Video</h1>
                <p className="text-muted-foreground mt-1">Create a new learning module</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Video Details</CardTitle>
                    <CardDescription>
                        Provide the basic information and link for the video.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                            <Input id="title" name="title" placeholder="e.g. Introduction to React" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Video Link (YouTube) <span className="text-red-500">*</span></Label>
                            <Input id="url" name="url" placeholder="https://www.youtube.com/watch?v=..." required />
                            <p className="text-xs text-muted-foreground">
                                Paste a valid YouTube URL. Ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What will learners learn in this video?"
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save and add questions
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
