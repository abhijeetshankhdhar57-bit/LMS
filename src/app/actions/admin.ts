"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import { CourseAssignmentEmail } from "@/components/emails/CourseAssignment";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }
}

export async function createVideo(formData: FormData) {
    await requireAdmin();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const driveUrl = formData.get("driveUrl") as string | null;
    const bannerUrl = formData.get("bannerUrl") as string | null;
    const isMandatory = formData.get("isMandatory") === "on";

    if (!title || !url) {
        throw new Error("Title and URL are required.");
    }

    const video = await db.video.create({
        data: {
            title,
            description,
            url,
            bannerUrl,
            driveUrl,
            isMandatory,
        },
    });

    // --- PHASE 9: AUTOMATED NOTIFICATIONS ---
    // If the Admin marks the course as Mandatory, notify all Learners!
    if (isMandatory && process.env.RESEND_API_KEY) {
        try {
            // Find all users with the "LEARNER" role
            const learners = await db.user.findMany({
                where: { role: "LEARNER" },
                select: { email: true }
            });

            const learnerEmails = learners.map(l => l.email).filter(Boolean) as string[];

            if (learnerEmails.length > 0) {
                // Determine the base URL for the email link
                const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

                // Lazy initialize Resend to avoid Next.js module evaluation crashes
                const resend = new Resend(process.env.RESEND_API_KEY);

                // Blast the beautifully formatted React Email to all learners
                await resend.emails.send({
                    from: "Juspay LMS <onboarding@resend.dev>", // "onboarding@resend.dev" works for free-tier testing. Upgrade domain in prod.
                    to: learnerEmails,
                    subject: "Action Required: New Mandatory Training Module",
                    react: CourseAssignmentEmail({
                        courseTitle: title,
                        courseUrl: `${baseUrl}/courses/${video.id}`,
                    }) as React.ReactElement,
                });
                console.log(`Successfully dispatched mandatory notification to ${learnerEmails.length} learners.`);
            }
        } catch (emailError) {
            console.error("Failed to trigger Resend assignment emails:", emailError);
            // We shouldn't throw here; the video was created successfully, so we just log the email failure.
        }
    }

    revalidatePath("/admin/videos");
    revalidatePath("/");
    return video;
}

export async function deleteVideo(id: string) {
    await requireAdmin();

    await db.video.delete({
        where: { id },
    });

    revalidatePath("/admin/videos");
    revalidatePath("/");
}

export async function createQuestion(formData: FormData) {
    await requireAdmin();

    const videoId = formData.get("videoId") as string;
    const text = formData.get("text") as string;
    const type = formData.get("type") as "MCQ" | "SHORT_ANSWER";
    const optionsRaw = formData.get("options") as string; // JSON string
    const pointsRaw = formData.get("points") as string;
    const points = parseInt(pointsRaw) || 1;

    await db.question.create({
        data: {
            videoId,
            text,
            type,
            points,
            options: optionsRaw || "[]",
        },
    });

    revalidatePath(`/admin/videos/${videoId}`);
}
