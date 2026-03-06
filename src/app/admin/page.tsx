import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, FileText, BarChart3 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }
    const [videoCount, learnerCount, questionCount, scoreCount, scores, learners] = await Promise.all([
        db.video.count(),
        db.user.count({ where: { role: "LEARNER" } }),
        db.question.count(),
        db.score.count(),
        db.score.findMany({ select: { score: true, total: true } }),
        db.user.findMany({
            where: { role: "LEARNER" },
            include: {
                scores: true
            },
            orderBy: { name: 'asc' }
        })
    ]);

    let averageScore = 0;
    if (scores.length > 0) {
        const totalPercentage = scores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0);
        averageScore = Math.round(totalPercentage / scores.length);
    }

    const stats = [
        {
            title: "Total Videos",
            value: videoCount,
            icon: Video,
            description: "Uploaded learning materials",
        },
        {
            title: "Total Learners",
            value: learnerCount,
            icon: Users,
            description: "Registered student accounts",
        },
        {
            title: "Total Questions",
            value: questionCount,
            icon: FileText,
            description: "Created quiz questions",
        },
        {
            title: "Average Score",
            value: `${averageScore}%`,
            icon: BarChart3,
            description: "Across all completed videos",
        },
    ];

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Employee Progress Report</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Learner Overview</CardTitle>
                        <p className="text-sm text-muted-foreground">Detailed progress for all registered learners.</p>
                    </CardHeader>
                    <CardContent>
                        {learners.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No learners found.
                                <br />
                                Users will appear here once they log in via Google.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-slate-100/50">
                                        <tr>
                                            <th className="px-6 py-3 font-medium">Employee Name</th>
                                            <th className="px-6 py-3 font-medium">Email</th>
                                            <th className="px-6 py-3 font-medium text-center">Modules Completed</th>
                                            <th className="px-6 py-3 font-medium text-center">Average Score</th>
                                            <th className="px-6 py-3 font-medium text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {learners.map((learner) => {
                                            const completedCount = learner.scores.length;
                                            const avgPercentage = completedCount > 0
                                                ? Math.round(learner.scores.reduce((acc, s) => acc + (s.score / s.total) * 100, 0) / completedCount)
                                                : 0;

                                            return (
                                                <tr key={learner.id} className="hover:bg-slate-50/50">
                                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                                        {learner.image ? (
                                                            <img src={learner.image} alt={learner.name || "User"} className="w-8 h-8 rounded-full" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                                {learner.name?.charAt(0) || learner.email?.charAt(0) || "U"}
                                                            </div>
                                                        )}
                                                        {learner.name || "Unnamed User"}
                                                    </td>
                                                    <td className="px-6 py-4 text-muted-foreground">
                                                        {learner.email}
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium">
                                                        {completedCount} / {videoCount}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {completedCount > 0 ? (
                                                            <span className={avgPercentage >= 80 ? "text-green-600 font-medium" : avgPercentage >= 50 ? "text-orange-600 font-medium" : "text-red-600 font-medium"}>
                                                                {avgPercentage}%
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {completedCount === videoCount && videoCount > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Fully Completed
                                                            </span>
                                                        ) : completedCount > 0 ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                In Progress
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                                Not Started
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
