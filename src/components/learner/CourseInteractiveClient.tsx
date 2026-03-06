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
