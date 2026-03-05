"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createVideo(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;

    if (!title || !url) {
        throw new Error("Title and URL are required.");
    }

    const video = await db.video.create({
        data: {
            title,
            description,
            url,
        },
    });

    revalidatePath("/admin/videos");
    revalidatePath("/");
    return video;
}

export async function deleteVideo(id: string) {
    await db.video.delete({
        where: { id },
    });

    revalidatePath("/admin/videos");
    revalidatePath("/");
}

export async function createQuestion(formData: FormData) {
    const videoId = formData.get("videoId") as string;
    const text = formData.get("text") as string;
    const type = formData.get("type") as "MCQ" | "SHORT_ANSWER";
    const optionsRaw = formData.get("options") as string; // JSON string

    await db.question.create({
        data: {
            videoId,
            text,
            type,
            options: optionsRaw || "[]",
        },
    });

    revalidatePath(`/admin/videos/${videoId}`);
}
