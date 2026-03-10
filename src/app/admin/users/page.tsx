import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SendRemindersButton } from "./SendRemindersButton";
import { ExportCSVButton } from "@/components/admin/ExportCSVButton";
import { BulkUploadDialog } from "@/components/admin/BulkUploadDialog";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    const users = await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            scores: true,
            _count: {
                select: { scores: true }
            }
        }
    });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">User Directory</h1>
                    <p className="text-muted-foreground mt-2">Manage learners and track their progress ({users.length} total)</p>
                </div>
                <div className="flex gap-4">
                    <BulkUploadDialog />
                    <ExportCSVButton />
                    <SendRemindersButton />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Registered Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-primary/20 text-white/80">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium text-center">Role</th>
                                    <th className="px-6 py-3 font-medium text-center">Modules Completed</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((u) => {
                                    return (
                                        <tr key={u.id} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium flex items-center gap-3">
                                                {u.image ? (
                                                    <img src={u.image} alt={u.name || "User"} className="w-8 h-8 rounded-full" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                        {u.name?.charAt(0) || u.email?.charAt(0) || "U"}
                                                    </div>
                                                )}
                                                {u.name || "Unnamed User"}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {u.email}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                                                    {u.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium">
                                                {u._count.scores}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/admin/users/${u.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        View Transcript
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
