"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import { CourseAssignmentEmail } from "@/components/emails/CourseAssignment";
import ReminderEmail from "@/components/emails/ReminderEmail";
import React from "react";

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

    redirect("/admin/videos");
}

export async function createQuestion(formData: FormData) {
    await requireAdmin();

    const videoId = formData.get("videoId") as string;
    const text = formData.get("text") as string;
    const type = formData.get("type") as "MCQ" | "SHORT_ANSWER";
    const optionsRaw = formData.get("options") as string; // JSON string
    const correctOption = formData.get("correctOption") as string | null;
    const pointsRaw = formData.get("points") as string;
    const points = parseInt(pointsRaw) || 1;

    await db.question.create({
        data: {
            videoId,
            text,
            type,
            points,
            options: optionsRaw || "[]",
            correctOption,
        },
    });

    revalidatePath(`/admin/videos/${videoId}`);
}

export async function updateVideoBanner(videoId: string, bannerUrl: string) {
    await requireAdmin();

    await db.video.update({
        where: { id: videoId },
        data: { bannerUrl },
    });

    revalidatePath(`/admin/videos/${videoId}`);
    revalidatePath(`/admin/videos`);
    revalidatePath(`/courses`);
    revalidatePath(`/courses/${videoId}`);
}

export async function deleteQuestion(questionId: string, videoId: string) {
    await requireAdmin();

    await db.question.delete({
        where: { id: questionId },
    });

    revalidatePath(`/admin/videos/${videoId}`);
}

export async function updateQuestion(questionId: string, videoId: string, formData: FormData) {
    await requireAdmin();

    const text = formData.get("text") as string;
    const type = formData.get("type") as "MCQ" | "SHORT_ANSWER";
    const optionsRaw = formData.get("options") as string; // JSON string
    const correctOption = formData.get("correctOption") as string | null;
    const pointsRaw = formData.get("points") as string;
    const points = parseInt(pointsRaw) || 1;

    await db.question.update({
        where: { id: questionId },
        data: {
            text,
            type,
            points,
            options: optionsRaw || "[]",
            correctOption,
        },
    });

    revalidatePath(`/admin/videos/${videoId}`);
}

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendReminders() {
    await requireAdmin();

    const mandatoryVideos = await db.video.findMany({
        where: { isMandatory: true },
        select: { id: true, title: true }
    });

    if (mandatoryVideos.length === 0) return { success: true, count: 0 };

    // Find all users (can filter by LEARNER if roles are strict)
    const users = await db.user.findMany({
        include: {
            scores: {
                select: { videoId: true }
            }
        }
    });

    let emailsSent = 0;

    for (const user of users) {
        if (!user.email) continue;

        const completedVideoIds = new Set(user.scores.map(s => s.videoId));
        const missingModules = mandatoryVideos
            .filter(v => !completedVideoIds.has(v.id))
            .map(v => v.title);

        if (missingModules.length > 0) {
            try {
                // @ts-ignore
                await resend.emails.send({
                    from: "Juspay LMS <onboarding@resend.dev>", // Warning: resend.dev only allows sending to the verified dev email address. To send to real users, a custom domain must be verified on Resend.
                    to: user.email,
                    subject: "Action Required: Complete your Mandatory Training Modules",
                    react: ReminderEmail({ userName: user.name || "Team", missingModules }) as React.ReactElement,
                });
                emailsSent++;
            } catch (e) {
                console.error("Failed to send email to", user.email, e);
            }
        }
    }

    return { success: true, count: emailsSent };
}
