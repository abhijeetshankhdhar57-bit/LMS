import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }
    const [videoCount, learnerCount, questionCount, scoreCount, scores, learners, videos] = await Promise.all([
        db.video.count(),
        db.user.count({ where: { role: "LEARNER" } }),
        db.question.count(),
        db.score.count(),
        db.score.findMany({ select: { score: true, total: true } }),
        db.user.findMany({
            where: { role: "LEARNER" },
            include: { scores: true },
            orderBy: { name: 'asc' }
        }),
        db.video.findMany({
            include: {
                _count: { select: { scores: true } }
            },
            orderBy: { scores: { _count: 'desc' } }
        })
    ]);

    let averageScore = 0;
    if (scores.length > 0) {
        const totalPercentage = scores.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0);
        averageScore = Math.round(totalPercentage / scores.length);
    }

    // Format date statically for "Welcome back!"
    const currentDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

    return (
        <div className="font-['Inter'] selection:bg-primary/30 w-full rounded-2xl bg-background text-on-surface">
            {/* We omit <aside> and <header> from the original HTML to nest cleanly in the existing layout, 
                and replace <main className="ml-64 pt-24 mb-12 ..."> with a clean <div> filling the space */}

            <div className="py-6 min-h-[calc(100vh-80px)] w-full">

                {/* Welcome Header */}
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Welcome back, Admin</h2>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        <span className="text-sm font-medium">{currentDate}</span>
                    </div>
                </header>

                {/* Stats Overview Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* KPI Card 1 */}
                    <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-primary-container/10 rounded-lg text-primary">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <span className="text-[10px] font-bold text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span> Active
                            </span>
                        </div>
                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Total Active Students</p>
                        <h3 className="text-2xl font-bold text-on-surface mb-3">{learnerCount.toLocaleString()}</h3>
                        <div className="h-8 w-full flex items-end gap-[2px]">
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-1/2 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-2/3 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-1/3 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-3/4 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-1/2 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-5/6 group-hover:bg-primary/40 transition-all"></div>
                            <div className="flex-1 bg-primary/20 rounded-t-sm h-full group-hover:bg-primary/40 transition-all"></div>
                        </div>
                    </div>

                    {/* KPI Card 2 */}
                    <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-secondary/10 rounded-lg text-secondary">
                                <span className="material-symbols-outlined">task_alt</span>
                            </div>
                            <span className="text-[10px] font-bold text-secondary flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span> Scores
                            </span>
                        </div>
                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Average Score</p>
                        <h3 className="text-2xl font-bold text-on-surface mb-3">{averageScore}%</h3>
                        <div className="h-8 w-full flex items-end gap-[2px]">
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-3/4 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-1/2 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-2/3 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-5/6 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-4/5 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-1/3 group-hover:bg-secondary/40 transition-all"></div>
                            <div className="flex-1 bg-secondary/20 rounded-t-sm h-3/4 group-hover:bg-secondary/40 transition-all"></div>
                        </div>
                    </div>

                    {/* KPI Card 3 */}
                    <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-tertiary-container/10 rounded-lg text-tertiary">
                                <span className="material-symbols-outlined">dns</span>
                            </div>
                            <span className="text-[10px] font-bold text-on-surface-variant bg-outline-variant/20 px-2 py-1 rounded-full">Stable</span>
                        </div>
                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Platform Uptime</p>
                        <h3 className="text-2xl font-bold text-on-surface mb-3">99.9%</h3>
                        <div className="h-8 w-full flex items-end gap-[2px]">
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                            <div className="flex-1 bg-tertiary/20 h-full rounded-t-sm"></div>
                        </div>
                    </div>

                    {/* KPI Card 4 */}
                    <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/5 hover:bg-surface-container transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-error/10 rounded-lg text-error">
                                <span className="material-symbols-outlined">add_circle</span>
                            </div>
                            <span className="text-[10px] font-bold text-error flex items-center gap-1 bg-error/10 px-2 py-1 rounded-full">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span> Content
                            </span>
                        </div>
                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Total Videos & Quizzes</p>
                        <h3 className="text-2xl font-bold text-on-surface mb-3">{videoCount + questionCount}</h3>
                        <div className="h-8 w-full flex items-end gap-[2px]">
                            <div className="flex-1 bg-error/20 rounded-t-sm h-1/2 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-5/6 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-1/2 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-2/3 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-1/2 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-1/4 group-hover:bg-error/40 transition-all"></div>
                            <div className="flex-1 bg-error/20 rounded-t-sm h-1/3 group-hover:bg-error/40 transition-all"></div>
                        </div>
                    </div>
                </section>

                {/* Analytics & Activity Row */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* Usage Area Chart Placeholder */}
                    <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h4 className="text-lg font-bold text-on-surface">System Usage</h4>
                                <p className="text-sm text-on-surface-variant">Active sessions over the last 30 days</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs font-bold rounded-full bg-surface-container-highest text-on-surface border border-outline-variant/20">Monthly</button>
                                <button className="px-3 py-1 text-xs font-bold rounded-full text-outline hover:text-on-surface transition-colors">Weekly</button>
                            </div>
                        </div>
                        <div className="h-64 w-full relative">
                            {/* Faux Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2">
                                <div className="border-b border-outline-variant/5 w-full"></div>
                                <div className="border-b border-outline-variant/5 w-full"></div>
                                <div className="border-b border-outline-variant/5 w-full"></div>
                                <div className="border-b border-outline-variant/5 w-full"></div>
                            </div>
                            {/* Faux Area Chart SVG */}
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3"></stop>
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path d="M0 200 Q 100 150, 200 180 T 400 100 T 600 140 T 800 60 T 1000 120 V 256 H 0 Z" fill="url(#chartGradient)"></path>
                                <path d="M0 200 Q 100 150, 200 180 T 400 100 T 600 140 T 800 60 T 1000 120" fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="3"></path>
                            </svg>
                            {/* Tooltip Marker */}
                            <div className="absolute top-[80px] right-[20%] group">
                                <div className="w-3 h-3 bg-white border-2 border-primary rounded-full relative z-10 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-3 py-2 rounded-lg text-xs whitespace-nowrap shadow-xl border border-outline-variant/20">
                                    <span className="font-bold text-white">4.2k Sessions</span>
                                    <span className="text-outline block text-[10px]">Today</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between text-[10px] font-bold text-outline uppercase tracking-widest px-2">
                            <span>Wk 1</span>
                            <span>Wk 2</span>
                            <span>Wk 3</span>
                            <span>Wk 4</span>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="bg-surface-container-low rounded-2xl p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-lg font-bold text-on-surface">Recent Activity</h4>
                            <button className="text-primary text-xs font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-6">

                            {scores.length > 0 && (
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-secondary flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            <span className="font-bold text-on-surface">Learner</span> successfully completed <span className="text-secondary">a Quiz Module</span>
                                        </p>
                                        <span className="text-[10px] font-bold text-outline uppercase mt-1 block">Recently</span>
                                    </div>
                                </div>
                            )}

                            {videos.length > 0 && (
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            <span className="font-bold text-on-surface">New course published:</span> {videos[0]?.title || "Course"}
                                        </p>
                                        <span className="text-[10px] font-bold text-outline uppercase mt-1 block">Recently</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-4">
                                <div className="mt-1 w-2 h-2 rounded-full bg-tertiary flex-shrink-0"></div>
                                <div>
                                    <p className="text-sm text-on-surface-variant leading-relaxed">
                                        <span className="font-bold text-on-surface">System Update:</span> Core infrastructure latency optimized by 15%
                                    </p>
                                    <span className="text-[10px] font-bold text-outline uppercase mt-1 block">Yesterday</span>
                                </div>
                            </div>

                            {learners.length > 0 && (
                                <div className="flex gap-4">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-error flex-shrink-0"></div>
                                    <div>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">
                                            <span className="font-bold text-on-surface">New Enrollment:</span> {learners[0]?.name || learners[0]?.email || "Student"} joined the platform
                                        </p>
                                        <span className="text-[10px] font-bold text-outline uppercase mt-1 block">Earlier</span>
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="mt-auto pt-6 border-t border-outline-variant/5">
                            <div className="bg-surface-container-highest/40 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary">cloud_sync</span>
                                    <span className="text-xs font-bold">Auto-sync Active</span>
                                </div>
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Enrollment by Course Row */}
                <section className="bg-surface-container-low rounded-2xl p-8 mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h4 className="text-lg font-bold text-on-surface">Popular Courses</h4>
                            <p className="text-sm text-on-surface-variant">Top courses by completion volume this month</p>
                        </div>
                        <button className="bg-surface-container-highest px-4 py-2 rounded-lg text-xs font-bold border border-outline-variant/20 hover:bg-surface-variant transition-colors">Export Report</button>
                    </div>

                    {videos.length === 0 ? (
                        <div className="text-center py-8 text-on-surface-variant">No courses found</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {videos.slice(0, 4).map((video, idx) => {
                                const colors = ["secondary", "tertiary", "primary", "error"];
                                const themeColor = colors[idx % colors.length];

                                // Calculate percentage width relative to the most popular course
                                const maxScores = Math.max(1, videos[0]._count.scores);
                                const widthPercent = Math.max(5, Math.round((video._count.scores / maxScores) * 100));

                                return (
                                    <div key={video.id} className="space-y-3">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className={`px-2 py-0.5 rounded bg-${themeColor}-container text-on-${themeColor}-container text-[10px] font-bold uppercase mb-1 inline-block`}>Module</span>
                                                <h5 className="text-sm font-bold text-on-surface">{video.title}</h5>
                                            </div>
                                            <span className={`text-sm font-mono text-${themeColor}`}>
                                                {video._count.scores} <span className="text-[10px] text-outline">Completions</span>
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                                            <div
                                                style={{ width: `${widthPercent}%` }}
                                                className={`h-full bg-${themeColor} glow-bar rounded-full bg-${themeColor}`}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

            </div>
        </div>
    );
}

