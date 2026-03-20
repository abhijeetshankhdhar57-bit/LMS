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
        .slice(0, 3);

    // If no one has taken a quiz yet, elegantly hide the component
    if (rankedUsers.length === 0) return null;

    return (
        <Card className="bg-card/40 backdrop-blur-xl border-border shadow-[0_0_30px_rgba(100,60,255,0.05)] overflow-hidden">
            <CardHeader className="pb-4 pt-6 text-center border-b border-border/50 bg-accent/5">
                <CardTitle className="text-lg flex items-center justify-center gap-2 text-primary font-black tracking-tight">
                    <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] animate-pulse" />
                    Top Performers
                </CardTitle>
                <CardDescription className="uppercase tracking-[0.2em] text-[9px] font-black mt-1 opacity-60">Global Leaderboard</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {rankedUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center gap-3 p-3 rounded-2xl bg-accent/5 border border-border/50 shadow-sm hover:bg-accent/10 transition-all duration-300 transform hover:scale-[1.02] group">
                            <div className="flex items-center justify-center w-8 text-lg font-bold flex-shrink-0">
                                {index === 0 ? <Medal className="text-yellow-400 w-7 h-7 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" /> :
                                    index === 1 ? <Medal className="text-slate-400 w-6 h-6 drop-shadow-[0_0_5px_rgba(148,163,184,0.5)]" /> :
                                        index === 2 ? <Medal className="text-amber-600 w-6 h-6 drop-shadow-[0_0_5px_rgba(217,119,6,0.5)]" /> :
                                            <span className="text-muted-foreground w-6 text-center text-[10px] font-black opacity-30">0{index + 1}</span>}
                            </div>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full border-2 border-primary/20 shadow-sm flex-shrink-0" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary font-black text-xs shadow-sm flex-shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm tracking-tight text-foreground/90 truncate">{user.name}</span>
                                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-widest truncate">{index === 0 ? "Grandmaster" : index < 3 ? "Expert" : "Learner"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
