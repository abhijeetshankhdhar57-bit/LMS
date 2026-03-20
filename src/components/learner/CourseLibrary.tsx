"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, CheckCircle2, Search, Filter } from "lucide-react";
import Link from "next/link";

interface CourseLibraryProps {
    initialVideos: any[];
}

export function CourseLibrary({ initialVideos }: CourseLibraryProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredVideos = initialVideos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-accent/5 p-4 rounded-2xl border border-border/50">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search for modules..."
                        className="pl-10 bg-background/50 border-border/50 focus:ring-primary/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-border/50 bg-background/50">
                        <Filter className="h-4 w-4" />
                        Sort by Newest
                    </Button>
                </div>
            </div>

            {filteredVideos.length === 0 ? (
                <div className="p-24 text-center border border-dashed border-border rounded-xl bg-accent/5 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-10" />
                    <p className="text-lg font-medium">No matches found for "{searchQuery}"</p>
                    <p className="text-sm">Try using different keywords or browse all courses.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredVideos.map((video) => {
                        const score = video.scores[0];
                        const isCompleted = !!score;
                        const progressPercent = isCompleted && score.total > 0
                            ? Math.round((score.score / score.total) * 100)
                            : 0;

                        return (
                            <Card key={video.id} className="flex flex-col overflow-hidden hover:shadow-[0_0_25px_rgba(100,60,255,0.15)] transition-all duration-300 border-border bg-card/40 backdrop-blur-sm group hover:-translate-y-1">
                                <div className="aspect-video bg-accent/10 border-b border-border flex items-center justify-center relative overflow-hidden">
                                    {video.bannerUrl ? (
                                        <img src={video.bannerUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    ) : (
                                        <PlayCircle className="h-10 w-10 text-muted-foreground/20" />
                                    )}
                                    {isCompleted && (
                                        <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center backdrop-blur-[1px]">
                                            <div className="bg-green-500 text-white p-2 rounded-full shadow-lg transform scale-100 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <CardHeader className="pb-2 flex-grow">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-sm font-bold tracking-tight line-clamp-1">{video.title}</CardTitle>
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-1 min-h-[32px] text-[11px] leading-relaxed opacity-70">
                                        {video.description || "No description provided."}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2 mt-auto border-t border-border bg-accent/5 flex flex-col gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{isCompleted ? `${progressPercent}%` : "Not Started"}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-accent/20 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary/40'}`}
                                                style={{ width: `${isCompleted ? (progressPercent || 100) : 0}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-4">
                                        <div className="text-[10px] text-muted-foreground font-medium">
                                            {video._count.questions} QUESTIONS
                                        </div>
                                        <Link href={`/courses/${video.id}`} className="flex-1">
                                            <Button size="sm" variant={isCompleted ? "outline" : "default"} className="w-full text-[11px] h-8 font-bold tracking-wider">
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
    );
}
