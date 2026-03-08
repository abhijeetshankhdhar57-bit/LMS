"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { updateVideoBanner } from "@/app/actions/admin";

export function UpdateBannerForm({ videoId, currentBanner }: { videoId: string, currentBanner?: string | null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        try {
            const bannerBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            await updateVideoBanner(videoId, bannerBlob.url);
        } catch (error) {
            console.error("Failed to upload new banner:", error);
            alert("Upload failed. Ensure you have the Vercel Blob token configured.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-muted-foreground">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                {currentBanner ? "Replace Thumbnail Banner" : "Add Thumbnail Banner"}
            </h4>

            <div
                className={`relative group rounded-lg overflow-hidden border border-dashed transition-all ${isHovering ? "border-pink-500 bg-pink-500/10" : "border-white/20 bg-black/20"
                    }`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelected}
                    disabled={isSubmitting}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />

                <div className="p-4 flex items-center justify-center text-sm gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                            <span className="text-pink-400 font-medium">Uploading & Synthesizing...</span>
                        </>
                    ) : (
                        <>
                            <UploadCloud className={`w-4 h-4 ${isHovering ? "text-pink-400" : "text-muted-foreground"}`} />
                            <span className={isHovering ? "text-pink-300 font-medium" : "text-muted-foreground"}>
                                Click to browse or drag image here
                            </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
