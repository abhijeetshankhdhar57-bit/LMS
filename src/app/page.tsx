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
import { Leaderboard } from "@/components/learner/Leaderboard";

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
  const inProgressVideos = videos.filter(v => v.scores.length === 0 && v._count.questions > 0); // Simplified in-progress logic
  const lastActiveVideo = inProgressVideos[0] || videos.find(v => v.scores.length === 0) || videos[0];

  const averageScore = completedVideos.length > 0
    ? Math.round(completedVideos.reduce((acc, v) => acc + (v.scores[0].score / v.scores[0].total) * 100, 0) / completedVideos.length)
    : 0;

  const badges = [
    { id: 'starter', name: 'Quick Starter', icon: '🚀', earned: completedVideos.length > 0, desc: 'Completed your first module' },
    { id: 'scholar', name: 'Scholar', icon: '🎓', earned: averageScore >= 90, desc: 'Highest average score (90%+ )' },
    { id: 'diligent', name: 'Diligent', icon: '📚', earned: completedVideos.length >= 3, desc: 'Completed 3 or more modules' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your progress.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-primary text-primary-foreground shadow-[0_4px_20px_rgba(100,60,255,0.3)] border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold opacity-80 uppercase tracking-widest">Modules Left</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{videos.length - completedVideos.length}</div>
            <p className="text-xs opacity-70 mt-1 font-medium italic">Keep up the great work!</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{completedVideos.length}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Modules mastered</p>
          </CardContent>
        </Card>
        <Card className="bg-card/40 backdrop-blur-sm border-border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Score</CardTitle>
            <Award className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-foreground">{averageScore}%</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Academic performance</p>
          </CardContent>
        </Card>
      </div>

      {lastActiveVideo && (
        <div className="bg-gradient-to-r from-primary/10 via-background to-background rounded-3xl p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="h-20 w-32 rounded-xl bg-accent/20 overflow-hidden relative flex-shrink-0 border border-border/50">
              {lastActiveVideo.bannerUrl ? (
                <img src={lastActiveVideo.bannerUrl} alt="" className="w-full h-full object-cover opacity-60" />
              ) : <PlayCircle className="absolute inset-0 m-auto h-8 w-8 text-primary/40" />}
            </div>
            <div>
              <Badge variant="outline" className="mb-2 text-[10px] font-bold tracking-widest bg-primary/20 border-primary/30 text-primary">CONTINUE LEARNING</Badge>
              <h3 className="text-xl font-bold text-foreground leading-tight">{lastActiveVideo.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1 opacity-70">{lastActiveVideo.description || "Pick up where you left off."}</p>
            </div>
          </div>
          <Link href={`/courses/${lastActiveVideo.id}`}>
            <Button size="lg" className="rounded-full px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              RESUME COURSE
            </Button>
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Available Courses</h2>
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            {videos.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-border rounded-xl bg-accent/5 text-muted-foreground">
                No courses available yet. Check back later!
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {videos.map((video) => {
                  const score = video.scores[0];
                  const isCompleted = !!score;
                  const hasQuestions = video._count.questions > 0;

                  return (
                    <Card key={video.id} className="flex flex-col overflow-hidden hover:shadow-[0_0_25px_rgba(100,60,255,0.15)] transition-all duration-300 border-border bg-card/40 backdrop-blur-sm group hover:-translate-y-1">
                      <div className="aspect-video bg-accent/10 border-b border-border flex items-center justify-center relative overflow-hidden">
                        {video.bannerUrl ? (
                          <img src={video.bannerUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                          <PlayCircle className="h-12 w-12 text-muted-foreground/20" />
                        )}
                        {isCompleted && (
                          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                            <CheckCircle2 className="h-16 w-16 text-green-500 shadow-xl" />
                          </div>
                        )}
                      </div>
                      <CardHeader className="pb-2 flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <CardTitle className="text-base font-bold tracking-tight line-clamp-1">{video.title}</CardTitle>
                          {isCompleted ? (
                            <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-[10px] h-5 px-2 font-bold uppercase tracking-wider">Done</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] h-5 px-2 font-bold uppercase tracking-wider">New</Badge>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2 mt-1 min-h-[40px] text-xs opacity-70">
                          {video.description || "No description provided."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 mt-auto border-t border-border bg-accent/5 flex flex-col gap-4">
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <span>Progress</span>
                            <span>{isCompleted ? "100%" : "0%"}</span>
                          </div>
                          <div className="h-1.5 w-full bg-accent/20 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary/40'}`}
                              style={{ width: `${isCompleted ? 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-[10px] text-muted-foreground font-bold tracking-wider">
                            {video._count.questions} QUESTIONS
                          </div>
                          <Link href={`/courses/${video.id}`}>
                            <Button size="sm" variant={isCompleted ? "outline" : "default"} className="font-bold tracking-wider text-[11px] h-8 px-4">
                              {isCompleted ? "REVIEW" : "START"}
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card/40 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-4 border-b border-border/50 bg-accent/5">
                <CardTitle className="text-sm font-bold tracking-widest uppercase flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {badges.map(badge => (
                  <div key={badge.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${badge.earned ? 'bg-primary/5 border-primary/20 opacity-100 shadow-sm' : 'bg-accent/5 border-transparent opacity-40 grayscale'}`}>
                    <div className="text-2xl">{badge.icon}</div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{badge.name}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
