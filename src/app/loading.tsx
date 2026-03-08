import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function LearnerDashboardLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Available Courses</h1>
                    <p className="text-muted-foreground mt-2">
                        Complete your assigned training modules below.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="flex flex-col h-full bg-card/50 border-white/5 overflow-hidden">
                        {/* Fake Video Thumbnail Area */}
                        <div className="relative aspect-video bg-muted/20">
                            <Skeleton className="absolute inset-0 rounded-none" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Skeleton className="h-12 w-12 rounded-full opacity-50" />
                            </div>
                        </div>

                        <CardHeader>
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-5 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full shrink-0" />
                            </div>
                        </CardHeader>

                        <CardContent className="flex-grow space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>

                        <CardFooter className="pt-4 border-t border-border/5">
                            <Skeleton className="h-4 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
