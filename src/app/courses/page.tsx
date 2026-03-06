import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

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
            <div>
                <h1 className="text-3xl font-bold">Course Library</h1>
                <p className="text-muted-foreground mt-1">Browse all available learning modules.</p>
            </div>

            {videos.length === 0 ? (
                <div className="p-12 text-center border dashed rounded-xl bg-white text-muted-foreground">
                    No courses available yet.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {videos.map((video) => {
                        const isCompleted = video.scores.length > 0;

                        return (
                            <Card key={video.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                                    <PlayCircle className="h-10 w-10 text-slate-300" />
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-2 flex-grow">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-base line-clamp-1">{video.title}</CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-1 min-h-[40px] text-xs">
                                        {video.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2 mt-auto border-t bg-slate-50/50 flex flex-col gap-3">
                                    <div className="text-xs text-muted-foreground flex justify-between">
                                        <span>{video._count.questions} Questions</span>
                                        {isCompleted && <span className="text-green-600 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Done</span>}
                                    </div>
                                    <Link href={`/courses/${video.id}`} className="w-full">
                                        <Button size="sm" variant={isCompleted ? "outline" : "default"} className="w-full">
                                            {isCompleted ? "Review Material" : "Start Learning"}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
