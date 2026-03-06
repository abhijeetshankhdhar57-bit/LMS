"use client";

import { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { QuizSection } from "@/components/learner/QuizSection";

export function CourseInteractiveClient({
    video,
    previousScore
}: {
    video: any;
    previousScore: any
}) {
    const [videoCompleted, setVideoCompleted] = useState(false);

    // Bypass mandate if video isn't mandatory, if previously scored, or if they just finished it.
    const isUnlocked = !video.isMandatory || videoCompleted || !!previousScore;

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="rounded-xl overflow-hidden border shadow-sm">
                    <VideoPlayer url={video.url} onEnded={() => setVideoCompleted(true)} />
                </div>

                <div className="prose max-w-none">
                    <h3>About this module</h3>
                    <p>{video.description || "Watch the video above to learn more about this topic. Once you have finished the video, complete the knowledge check to earn your score."}</p>

                    {video.driveUrl && (
                        <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="m-0 text-white font-medium">Supplementary Material</h4>
                                <p className="m-0 text-sm text-muted-foreground mt-1">Review the attached presentation or document.</p>
                            </div>
                            <a href={video.driveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
                                <button className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-medium border border-primary/30 transition-colors">
                                    Open Document
                                </button>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-6">
                    <QuizSection
                        videoId={video.id}
                        questions={video.questions}
                        previousScore={previousScore}
                        isUnlocked={isUnlocked}
                    />
                </div>
            </div>
        </div>
    );
}
