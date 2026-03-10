import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Papa from "papaparse";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        // Security check
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch all learners and their exact progress
        const learners = await db.user.findMany({
            where: { role: "LEARNER" },
            include: {
                scores: {
                    include: {
                        video: true
                    }
                }
            }
        });

        // Flatten the relational data into a 2D matrix format that Excel understands
        const exportData: any[] = [];

        for (const learner of learners) {
            // Include baseline info for users even if they haven't taken any courses
            if (learner.scores.length === 0) {
                exportData.push({
                    "Learner Name": learner.name || "N/A",
                    "Learner Email": learner.email || "N/A",
                    "Joined Date": new Date(learner.createdAt).toLocaleDateString(),
                    "Course Name": "No courses started",
                    "Score Target": "N/A",
                    "Score Achieved": "N/A",
                    "Status": "Pending",
                    "Completion Date": "N/A",
                });
            } else {
                for (const score of learner.scores) {
                    const passReq = score.video.passingPercentage;
                    const achieved = score.total > 0 ? (score.score / score.total) * 100 : 100;
                    const status = passReq === 0 ? "Completed" : (achieved >= passReq ? "Passed" : "Failed");

                    exportData.push({
                        "Learner Name": learner.name || "N/A",
                        "Learner Email": learner.email || "N/A",
                        "Joined Date": new Date(learner.createdAt).toLocaleDateString(),
                        "Course Name": score.video.title,
                        "Score Target": passReq > 0 ? `${passReq}%` : "None",
                        "Score Achieved": `${Math.round(achieved)}%`,
                        "Status": status,
                        "Completion Date": new Date(score.completedAt).toLocaleDateString(),
                    });
                }
            }
        }

        // Convert the JSON array sequence into a raw CSV string
        const csv = Papa.unparse(exportData);

        // Force browser to download as file rather than displaying as text
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="lms_analytics_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("CSV Export Failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
