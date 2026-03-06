import { db } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlayCircle, Award, CheckCircle2 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/LoginCard";

export default async function LearnerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <LoginCard />;
  }

  const userId = session.user.id;

  // Fetch all videos and the user's scores for them
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

  const completedVideos = videos.filter(v => v.scores.length > 0);
  const averageScore = completedVideos.length > 0
    ? Math.round(completedVideos.reduce((acc, v) => acc + (v.scores[0].score / v.scores[0].total) * 100, 0) / completedVideos.length)
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your progress.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Course Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{videos.length} Modules</div>
            <p className="text-sm opacity-80 mt-1">Available to learn</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedVideos.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Modules finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            <Award className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">Across all quizzes</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>
        {videos.length === 0 ? (
          <div className="p-12 text-center border dashed rounded-xl bg-white text-muted-foreground">
            No courses available yet. Check back later!
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => {
              const score = video.scores[0];
              const isCompleted = !!score;
              const hasQuestions = video._count.questions > 0;

              return (
                <Card key={video.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                    <PlayCircle className="h-12 w-12 text-slate-300" />
                    {isCompleted && (
                      <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2 flex-grow">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                      {isCompleted ? (
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Done</Badge>
                      ) : (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">
                      {video.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 mt-auto border-t bg-slate-50/50 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground flex flex-col">
                      <span>{video._count.questions} Questions</span>
                      {isCompleted && score.total > 0 && (
                        <span className="font-medium text-primary">Score: {score.score}/{score.total}</span>
                      )}
                    </div>
                    <Link href={`/courses/${video.id}`}>
                      <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                        {isCompleted ? "Review" : "Start Course"}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
