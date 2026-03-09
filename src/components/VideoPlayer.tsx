"use client";

import { useEffect, useState, useRef } from "react";
import YouTube from "react-youtube";

export function VideoPlayer({ url, bannerUrl, onEnded }: { url: string; bannerUrl?: string | null; onEnded?: () => void }) {
    const [videoId, setVideoId] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const ytPlayerRef = useRef<any>(null);

    useEffect(() => {
        // Basic YouTube URL parsing
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let extractedId = "";
            if (url.includes("v=")) {
                extractedId = url.split("v=")[1]?.split("&")[0];
            } else if (url.includes("youtu.be/")) {
                extractedId = url.split("youtu.be/")[1]?.split("?")[0];
            }
            if (extractedId) setVideoId(extractedId);
        }
    }, [url]);

    // Handle direct MP4 or Vercel Blob URLs natively
    const isNativeVideo = url.endsWith(".mp4") || url.includes("blob.vercel-storage.com");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is currently typing inside an input field
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.code === "Space") {
                e.preventDefault(); // Prevent page scroll

                if (isNativeVideo && videoRef.current) {
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                } else if (!isNativeVideo && ytPlayerRef.current) {
                    const state = ytPlayerRef.current.getPlayerState();
                    // YouTube State 1 = Playing. If playing, pause. Else, play.
                    if (state === 1) ytPlayerRef.current.pauseVideo();
                    else ytPlayerRef.current.playVideo();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isNativeVideo]);

    if (isNativeVideo) {
        return (
            <div className="w-full aspect-video rounded-md overflow-hidden bg-black shadow-lg border border-white/10 ring-1 ring-white/5">
                <video
                    ref={videoRef}
                    src={url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                    onEnded={onEnded}
                    preload="metadata"
                    poster={bannerUrl || undefined}
                />
            </div>
        );
    }

    if (!videoId) {
        return (
            <div className="w-full aspect-video bg-black/40 border border-white/5 rounded-md flex items-center justify-center text-muted-foreground backdrop-blur-sm">
                <div className="text-center p-4">
                    <p className="font-medium text-white/70">Video Preview Unavailable</p>
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary/80 hover:text-primary transition-colors underline mt-2 flex items-center gap-1 justify-center break-all">
                        Open Original Source
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video rounded-md overflow-hidden bg-black">
            <YouTube
                videoId={videoId}
                opts={{ width: "100%", height: "100%", playerVars: { autoplay: 1 } }}
                onReady={(event) => { ytPlayerRef.current = event.target; }}
                onEnd={onEnded}
                className="w-full h-full"
                iframeClassName="w-full h-full object-cover"
            />
        </div>
    );
}
