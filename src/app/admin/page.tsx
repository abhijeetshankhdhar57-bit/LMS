import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, FileText, BarChart3 } from "lucide-react";

export default async function AdminDashboard() {
    const [videoCount, learnerCount, questionCount, scoreCount, scores] = await Promise.all([
        db.video.count(),
        db.user.count({ where: { role: "LEARNER" } }),
        db.question.count(),
        db.score.count(),
        db.score.findMany({ select: { score: true, total: true } })
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
        </div>
    );
}
