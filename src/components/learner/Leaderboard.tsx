import { db } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export async function Leaderboard() {
    // Retrieve all learners and their exact quiz scores
    const users = await db.user.findMany({
        where: { role: "LEARNER" },
        include: {
            scores: true
        }
    });

    // Map through the users, calculate their cumulative point sums, and sort them highest-to-lowest
    const rankedUsers = users.map(user => {
        const totalScore = user.scores.reduce((sum, s) => sum + s.score, 0);
        return {
            id: user.id,
            name: user.name || user.email?.split('@')[0] || "Anonymous Learner",
            image: user.image,
            totalScore
        };
    })
        .filter(u => u.totalScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 5);

    // If no one has taken a quiz yet, elegantly hide the component
    if (rankedUsers.length === 0) return null;

    return (
        <Card className="bg-gradient-to-br from-black/80 to-primary/10 border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(100,60,255,0.05)]">
            <CardHeader className="pb-3 pt-6 text-center">
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-primary font-bold">
                    <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)] animate-pulse" />
                    Top Performers
                </CardTitle>
                <CardDescription className="uppercase tracking-widest text-[10px] font-bold mt-1">Global Leaderboard</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {rankedUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 shadow-sm hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 text-lg font-bold">
                                    {index === 0 ? <Medal className="text-yellow-400 w-7 h-7 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> :
                                        index === 1 ? <Medal className="text-slate-300 w-6 h-6 drop-shadow-[0_0_5px_rgba(203,213,225,0.5)]" /> :
                                            index === 2 ? <Medal className="text-amber-700 w-6 h-6 drop-shadow-[0_0_5px_rgba(180,83,9,0.5)]" /> :
                                                <span className="text-muted-foreground w-6 text-center text-sm font-mono">0{index + 1}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border-2 border-primary/20" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center text-primary font-bold text-xs">
                                            {user.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="font-semibold text-sm tracking-tight">{user.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-primary font-bold bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                                <span>{user.totalScore}</span>
                                <span className="text-[10px] text-primary/70 uppercase">pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
