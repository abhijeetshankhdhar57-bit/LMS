import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle2, Target } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProgressPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    const userId = session.user.id;

    const scores = await db.score.findMany({
        where: { userId },
        include: {
            video: true
        },
        orderBy: { completedAt: 'desc' }
    });

    const totalVideosCompleted = scores.length;
    const averageScore = totalVideosCompleted > 0
        ? Math.round(scores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / totalVideosCompleted)
        : 0;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">My Progress</h1>
                <p className="text-muted-foreground mt-1">Track your learning journey and quiz results.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
                        <BookOpen className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalVideosCompleted}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                        <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{averageScore}%</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 text-slate-50">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium opacity-80">Status</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-bold mt-1">
                            {averageScore >= 80 ? "Excellent!" : averageScore >= 50 ? "On Track" : "Keep Trying"}
                        </div>
                        <p className="text-xs opacity-70 mt-1">Based on quiz performance</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detailed History</CardTitle>
                    <CardDescription>A list of all modules you've completed.</CardDescription>
                </CardHeader>
                <CardContent>
                    {scores.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            You haven't completed any modules yet.
                            <br />
                            <Link href="/courses">
                                <Button className="mt-4" variant="outline">Browse Courses</Button>
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Date Completed</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {scores.map((scoreInfo) => {
                                    const percentage = Math.round((scoreInfo.score / scoreInfo.total) * 100);
                                    return (
                                        <TableRow key={scoreInfo.id}>
                                            <TableCell className="font-medium">
                                                {scoreInfo.video.title}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(scoreInfo.completedAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={percentage >= 80 ? "default" : percentage >= 50 ? "secondary" : "destructive"}>
                                                    {scoreInfo.score} / {scoreInfo.total} ({percentage}%)
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/courses/${scoreInfo.videoId}`}>
                                                    <Button variant="ghost" size="sm">Review</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
