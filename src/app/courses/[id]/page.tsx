import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CourseInteractiveClient } from "@/components/learner/CourseInteractiveClient";

export default async function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    const userId = session.user.id;
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

            <CourseInteractiveClient
                video={video}
                previousScore={previousScore}
                learnerName={session.user.name || session.user.email?.split('@')[0] || "Learner"}
            />
        </div>
    );
}
