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

    const handleVideoEnd = () => {
        setVideoCompleted(true);
        // Add a tiny delay to ensure React state updates and the locked overlay disappears gracefully before scrolling down
        setTimeout(() => {
            document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
    };

    return (
        <div className="flex flex-col gap-10">
            <div className="w-full space-y-8">
                <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black/50">
                    <VideoPlayer url={video.url} bannerUrl={video.bannerUrl} onEnded={handleVideoEnd} />
                </div>

                <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-xl">
                    <h3 className="text-xl font-semibold mb-3">About this module</h3>
                    <p className="text-muted-foreground leading-relaxed">{video.description || "Watch the video entirely to learn more about this topic. Once you have finished the video, complete the knowledge check below to earn your score."}</p>

                    {video.driveUrl && (
                        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="m-0 text-white font-medium">Supplementary Material</h4>
                                <p className="m-0 text-sm text-muted-foreground mt-1">Review the attached presentation or document.</p>
                            </div>
                            <a href={video.driveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 w-full sm:w-auto">
                                <button className="w-full sm:w-auto bg-primary/20 hover:bg-primary/30 text-primary px-6 py-2.5 rounded-lg text-sm font-medium border border-primary/30 transition-colors">
                                    Open Document
                                </button>
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full" id="quiz-section">
                <QuizSection
                    videoId={video.id}
                    questions={video.questions}
                    previousScore={previousScore}
                    isUnlocked={isUnlocked}
                />
            </div>
        </div>
    );
}
