"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVideo } from "@/app/actions/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UploadCloud, Link as LinkIcon } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewVideoPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toggle between Direct Upload or External Link
    const [videoMode, setVideoMode] = useState<"upload" | "link">("upload");
    const [docMode, setDocMode] = useState<"upload" | "link">("link");

    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [docFile, setDocFile] = useState<File | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // Handle Video Upload
            if (videoMode === "upload") {
                if (!videoFile) throw new Error("Please select a video file to upload.");
                const videoBlob = await upload(videoFile.name, videoFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                formData.set("url", videoBlob.url);
            }

            // Handle Document Upload
            if (docMode === "upload" && docFile) {
                const docBlob = await upload(docFile.name, docFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                formData.set("driveUrl", docBlob.url);
            }

            const video = await createVideo(formData);
            router.push(`/admin/videos/${video.id}`);
        } catch (error) {
            console.error("Upload error:", error);
            alert(error instanceof Error ? error.message : "Failed to create module");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold">Create New Module</h1>
                <p className="text-muted-foreground mt-1">Upload files securely to the Vercel Blob network.</p>
            </div>

            <Card className="border-white/5 bg-card/40 backdrop-blur-xl">
                <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                        Directly upload .mp4 video files or provide YouTube links.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-8">
                        {/* Title & Description */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Course Title <span className="text-red-500">*</span></Label>
                                <Input id="title" name="title" placeholder="e.g. Advanced System Architecture" required className="bg-white/5" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Outline the learning objectives..."
                                    className="min-h-[100px] bg-white/5"
                                />
                            </div>
                        </div>

                        {/* Primary Video Configuration */}
                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-black/20">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <VideoIcon className="w-5 h-5 text-primary" /> Primary Media
                            </h3>
                            <Tabs value={videoMode} onValueChange={(v: string) => setVideoMode(v as "upload" | "link")} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="upload"><UploadCloud className="w-4 h-4 mr-2" /> Direct File Upload</TabsTrigger>
                                    <TabsTrigger value="link"><LinkIcon className="w-4 h-4 mr-2" /> External Link</TabsTrigger>
                                </TabsList>

                                <TabsContent value="upload" className="space-y-4 mt-0">
                                    <div className="relative group border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-white/5">
                                        <input
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required={videoMode === "upload"}
                                        />
                                        <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                                        {videoFile ? (
                                            <p className="font-semibold text-primary">{videoFile.name}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Drag and drop an MP4 video, or click to browse</p>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="link" className="mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="url">Video Link</Label>
                                        <Input id="url" name="url" placeholder="https://www.youtube.com/watch?v=..." required={videoMode === "link"} className="bg-white/5" />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Supplementary Document Configuration */}
                        <div className="space-y-4 p-5 rounded-xl border border-white/5 bg-black/20">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <DocIcon className="w-5 h-5 text-purple-400" /> Supplementary Document <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
                            </h3>
                            <Tabs value={docMode} onValueChange={(v: string) => setDocMode(v as "upload" | "link")} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-4">
                                    <TabsTrigger value="upload"><UploadCloud className="w-4 h-4 mr-2" /> Upload PDF</TabsTrigger>
                                    <TabsTrigger value="link"><LinkIcon className="w-4 h-4 mr-2" /> Drive Link</TabsTrigger>
                                </TabsList>

                                <TabsContent value="upload" className="space-y-4 mt-0">
                                    <div className="relative group border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-purple-400/50 transition-colors bg-white/5">
                                        <input
                                            type="file"
                                            accept=".pdf,.ppt,.pptx"
                                            onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {docFile ? (
                                            <p className="font-semibold text-purple-400">{docFile.name}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">Click to upload a PDF presentation</p>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="link" className="mt-0">
                                    <div className="space-y-2">
                                        <Label htmlFor="driveUrl">Google Drive Link</Label>
                                        <Input id="driveUrl" name="driveUrl" placeholder="https://docs.google.com/presentation/..." className="bg-white/5" />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Settings */}
                        <div className="flex items-center space-x-3 p-4 border border-white/5 rounded-xl bg-white/5">
                            <input type="checkbox" id="isMandatory" name="isMandatory" className="w-5 h-5 rounded border-white/20 bg-black/50 text-primary accent-primary" />
                            <div className="space-y-1 leading-none cursor-pointer">
                                <Label htmlFor="isMandatory" className="font-medium cursor-pointer text-base">Mark as Mandatory</Label>
                                <p className="text-sm text-muted-foreground">Learners will be required to pass this module.</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                            <Button variant="ghost" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="min-w-[150px] shadow-[0_0_15px_rgba(100,60,255,0.4)]">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading to Edge...
                                    </>
                                ) : (
                                    "Save & Add Quiz"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// Quick helper icons since we can't do multiple named imports in the chunk elegantly sometimes
function VideoIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>;
}

function DocIcon(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
}
