import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Video } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminVideosPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }
    const videos = await db.video.findMany({
        include: {
            _count: {
                select: { questions: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Videos</h1>
                    <p className="text-muted-foreground mt-1">Upload and manage course content</p>
                </div>
                <Link href="/admin/videos/new">
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Add New Video
                    </Button>
                </Link>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/20 rounded-lg bg-black/20">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Video className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No videos uploaded</h3>
                    <p className="text-muted-foreground text-sm max-w-sm text-center mb-4">
                        Get started by uploading your first video and creating quiz questions for learners.
                    </p>
                    <Link href="/admin/videos/new">
                        <Button variant="outline">Upload Video</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                        <Card key={video.id} className="flex flex-col overflow-hidden hover:shadow-[0_0_25px_rgba(100,60,255,0.15)] transition-shadow border-white/10 bg-card/40 backdrop-blur-sm group">
                            <div className="aspect-video bg-black/40 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                                {video.bannerUrl ? (
                                    <img src={video.bannerUrl} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <Video className="h-10 w-10 text-white/20" />
                                )}
                            </div>
                            <CardHeader className="pb-2 flex-grow">
                                <CardTitle className="text-lg line-clamp-1">{video.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">
                                    {video.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-3 pb-3 text-sm text-muted-foreground flex justify-between items-center border-t border-white/5 bg-black/20 mt-auto">
                                <span>{video._count.questions} questions</span>
                                <Link href={`/admin/videos/${video.id}`}>
                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                                        Manage
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
