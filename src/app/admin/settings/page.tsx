import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Copy, CheckCircle2, XCircle, Shield, Webhook, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);

    // Securely check if environment variables exist without exposing their actual string values to the client
    const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
    const hasResend = !!process.env.RESEND_API_KEY;

    // Capitalize name
    const userName = session?.user?.name || "Unknown";
    const capitalizedName = userName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold">Admin Settings</h1>
                <p className="text-muted-foreground mt-1">Manage platform integrations and your administrative profile.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card */}
                <Card className="border-white/5 bg-card/40 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" /> Profile configuration
                        </CardTitle>
                        <CardDescription>
                            Your active session details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1 p-3 bg-black/20 rounded-lg border border-white/5">
                            <p className="text-sm font-medium text-muted-foreground">Admin Name</p>
                            <p className="font-medium">{capitalizedName}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-black/20 rounded-lg border border-white/5">
                            <p className="text-sm font-medium text-muted-foreground">Registered Email</p>
                            <p className="font-mono text-sm break-all text-primary">{session?.user?.email || "Unknown"}</p>
                        </div>
                        <div className="space-y-1 p-3 bg-black/20 rounded-lg border border-white/5">
                            <p className="text-sm font-medium text-muted-foreground">Permission Level</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary uppercase font-bold tracking-wide">
                                    {/* @ts-ignore */}
                                    {session?.user?.role || "ADMIN"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API Integrations Card */}
                <Card className="border-white/5 bg-card/40 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Webhook className="w-5 h-5 text-purple-400" /> Platform Integrations
                        </CardTitle>
                        <CardDescription>
                            Status of your third-party API connections.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Vercel Blob Status */}
                        <div className="flex items-start justify-between p-4 rounded-xl border border-white/5 bg-black/20 transition-all hover:bg-black/30">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm">Vercel Blob Storage</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">Handles direct physical .mp4 uploads.</p>
                            </div>
                            {hasBlob ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-400/20">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-400/20">
                                    <XCircle className="w-3.5 h-3.5" /> Missing Token
                                </div>
                            )}
                        </div>

                        {/* Resend Status */}
                        <div className="flex items-start justify-between p-4 rounded-xl border border-white/5 bg-black/20 transition-all hover:bg-black/30">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Webhook className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="font-semibold text-sm">Resend Email API</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">Dispatches mandatory course alerts.</p>
                            </div>
                            {hasResend ? (
                                <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-400/20">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full text-xs font-medium border border-red-400/20">
                                    <XCircle className="w-3.5 h-3.5" /> Missing API Key
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>
            </div>

            <div className="text-center pt-8 border-t border-white/5">
                <p className="text-xs text-muted-foreground">Juspay LMS Version 1.0.0 • Production Build</p>
            </div>
        </div>
    );
}
