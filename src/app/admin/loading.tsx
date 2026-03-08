import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, FileText, BarChart3 } from "lucide-react";

export default function AdminDashboardLoading() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Top Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                <Skeleton className="h-4 w-24" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                {/* Course Popularity Chart Skeleton */}
                <Card>
                    <CardHeader>
                        <CardTitle>Course Popularity</CardTitle>
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[350px] w-full rounded-xl" />
                    </CardContent>
                </Card>

                {/* Placeholder for future 2nd column card to maintain layout */}
                <Card className="opacity-0 hidden lg:block">
                    <CardContent className="h-full" />
                </Card>
            </div>

            {/* User Table Skeleton */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Employee Progress Report</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Learner Overview</CardTitle>
                        <Skeleton className="h-4 w-64 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4 pb-4 border-b last:border-0 last:pb-0">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-3 w-[150px]" />
                                    </div>
                                    <Skeleton className="h-8 w-[100px] rounded-full hidden md:block" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
