"use client";

import { useEffect, useState } from "react";
import YouTube from "react-youtube";

export function VideoPlayer({ url, onEnded }: { url: string; onEnded?: () => void }) {
    const [videoId, setVideoId] = useState<string | null>(null);

    useEffect(() => {
        // Basic YouTube URL parsing
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let extractedId = "";
            if (url.includes("v=")) {
                extractedId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                extractedId = url.split("youtu.be/")[1].split("?")[0];
            }
            if (extractedId) setVideoId(extractedId);
        }
    }, [url]);

    if (!videoId) {
        return (
            <div className="w-full aspect-video bg-slate-900 rounded-md flex items-center justify-center text-slate-400">
                <div className="text-center p-4">
                    <p>Video Preview Unavailable</p>
                    <a href={url} target="_blank" rel="noreferrer" className="text-xs text-primary underline mt-2 inline-block break-all">
                        {url}
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video rounded-md overflow-hidden bg-black">
            <YouTube
                videoId={videoId}
                opts={{ width: "100%", height: "100%", playerVars: { autoplay: 0 } }}
                onEnd={onEnded}
                className="w-full h-full"
                iframeClassName="w-full h-full object-cover"
            />
        </div>
    );
}
