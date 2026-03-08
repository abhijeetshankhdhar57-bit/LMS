import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, LayoutDashboard, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminUserProfile({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const { id } = await params;

    const user = await db.user.findUnique({
        where: { id },
        include: {
            scores: {
                include: {
                    video: true
                },
                orderBy: { completedAt: 'desc' }
            }
        }
    });

    if (!user) {
        return <div className="p-8">User not found.</div>;
    }

    const completedCount = user.scores.length;
    const avgPercentage = completedCount > 0
        ? Math.round(user.scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / completedCount)
        : 0;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Directory
                </Button>
            </Link>

            <div className="flex items-center gap-6 pb-6 border-b">
                {user.image ? (
                    <img src={user.image} alt={user.name || "User"} className="w-20 h-20 rounded-full shadow-lg" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shadow-lg">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold">{user.name || "Unnamed User"}</h1>
                    <p className="text-muted-foreground text-lg">{user.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                        <span className="text-xs text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Modules Completed</CardTitle>
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{completedCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            <span className={avgPercentage >= 80 ? "text-green-600" : avgPercentage >= 50 ? "text-orange-600" : "text-muted-foreground"}>
                                {avgPercentage}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Learning Transcript</h2>
                {user.scores.length === 0 ? (
                    <div className="p-12 text-center border dashed rounded-xl text-muted-foreground">
                        This user hasn't completed any modules yet.
                    </div>
                ) : (
                    <Card>
                        <ul className="divide-y">
                            {user.scores.map((score) => {
                                const percentage = Math.round((score.score / score.total) * 100);
                                return (
                                    <li key={score.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-lg">{score.video.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Completed on {new Date(score.completedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold">
                                                {percentage}%
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {score.score} / {score.total} correct
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Card>
                )}
            </div>
        </div>
    );
}
