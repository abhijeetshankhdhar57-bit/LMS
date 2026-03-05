"use client";

import { useEffect, useState } from "react";

export function VideoPlayer({ url }: { url: string }) {
    const [embedUrl, setEmbedUrl] = useState<string | null>(null);

    useEffect(() => {
        // Basic YouTube URL parsing
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            let videoId = "";
            if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
            }
            if (videoId) {
                setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
            }
        }
    }, [url]);

    if (!embedUrl) {
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
            <iframe
                width="100%"
                height="100%"
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
}
