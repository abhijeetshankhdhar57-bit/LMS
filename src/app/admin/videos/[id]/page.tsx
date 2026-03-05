import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddQuestionForm } from "@/components/admin/AddQuestionForm";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteVideo } from "@/app/actions/admin";

export default async function AdminVideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const video = await db.video.findUnique({
        where: { id },
        include: {
            questions: {
                orderBy: { createdAt: 'asc' }
            }
        }
    });

    if (!video) {
        notFound();
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <Link href="/admin/videos" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 w-fit">
                <ArrowLeft className="h-4 w-4" />
                Back to Videos
            </Link>

            <div className="flex justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{video.title}</h1>
                    <p className="text-muted-foreground mt-2">{video.description}</p>
                </div>
                <form action={async () => {
                    "use server";
                    await deleteVideo(video.id);
                }}>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Video
                    </Button>
                </form>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Video Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <VideoPlayer url={video.url} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Questions ({video.questions.length})</CardTitle>
                            <CardDescription>Questions learners must answer after watching.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {video.questions.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No questions added yet.</p>
                            ) : (
                                video.questions.map((q, idx) => (
                                    <div key={q.id} className="p-4 border rounded-md">
                                        <div className="flex gap-2 items-start justify-between">
                                            <span className="font-medium text-sm">
                                                {idx + 1}. {q.text}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px]">{q.type === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}</Badge>
                                        </div>
                                        {q.type === "MCQ" && (
                                            <ul className="mt-2 text-sm text-muted-foreground space-y-1 list-disc list-inside ml-2">
                                                {JSON.parse(q.options).map((opt: string, i: number) => (
                                                    <li key={i}>{opt}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Add New Question</CardTitle>
                            <CardDescription>
                                Test your learners' understanding of this video.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AddQuestionForm videoId={video.id} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
