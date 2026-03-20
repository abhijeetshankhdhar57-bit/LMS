import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CourseLibrary } from "@/components/learner/CourseLibrary";

export default async function CoursesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    const userId = session.user.id;

    const videos = await db.video.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            scores: {
                where: { userId }
            },
            _count: {
                select: { questions: true }
            }
        }
    });

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col gap-1">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Course Library</h1>
                <p className="text-muted-foreground text-sm font-medium opacity-70 italic">Explore our curated collection of professional learning modules.</p>
            </div>

            <CourseLibrary initialVideos={videos} />
        </div>
    );
}
