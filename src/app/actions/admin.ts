"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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
    const isMandatory = formData.get("isMandatory") === "on";

    if (!title || !url) {
        throw new Error("Title and URL are required.");
    }

    const video = await db.video.create({
        data: {
            title,
            description,
            url,
            isMandatory,
        },
    });

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
