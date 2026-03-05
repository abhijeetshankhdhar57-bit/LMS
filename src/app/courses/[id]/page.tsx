import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/VideoPlayer";
import { QuizSection } from "@/components/learner/QuizSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mockLearner } from "@/lib/UserContext";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = mockLearner.id;
    const video = await db.video.findUnique({
        where: { id },
        include: {
            questions: {
                orderBy: { createdAt: 'asc' }
            },
            scores: {
                where: { userId }
            }
        }
    });

    if (!video) {
        notFound();
    }

    const previousScore = video.scores.length > 0 ? video.scores[0] : null;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Courses
            </Link>

            <div>
                <h1 className="text-3xl font-bold">{video.title}</h1>
                <p className="text-muted-foreground mt-2">{video.description}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-xl overflow-hidden border shadow-sm">
                        <VideoPlayer url={video.url} />
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
                            questions={video.questions as any}
                            previousScore={previousScore}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
