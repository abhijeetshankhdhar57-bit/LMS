"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitAnswers(
    videoId: string,
    userId: string,
    answers: { questionId: string; responseText: string }[]
) {
    // First get the video questions to check answers (simple check for MCQ)
    const video = await db.video.findUnique({
        where: { id: videoId },
        include: { questions: true }
    });

    if (!video) throw new Error("Video not found");

    let correctCount = 0;

    // Save answers and calculate score if possible (only simple exact match for now)
    for (const answer of answers) {
        const question = video.questions.find(q => q.id === answer.questionId);
        let isCorrect = null;

        if (question && question.type === "MCQ") {
            // Very basic match for MCQ: Assuming responseText is exactly one of the options.
            // In a real app, you'd mark which option was correct in the DB. For this simple LMS,
            // we'll just store the answer. If you want auto-grading, the schema needs `correctOption`.
            // Given the schema doesn't have correctOption, isCorrect will remain null for manual review.
        }

        // Upsert answer to allow re-submission
        await db.answer.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId: answer.questionId,
                }
            },
            update: {
                responseText: answer.responseText,
                isCorrect,
            },
            create: {
                userId,
                questionId: answer.questionId,
                responseText: answer.responseText,
                isCorrect,
            }
        });

        // Dummy point logic: every answered question gives 1 point for simplicity since no correct answer is defined.
        correctCount++;
    }

    // Update Score
    await db.score.upsert({
        where: {
            userId_videoId: {
                userId,
                videoId,
            }
        },
        update: {
            score: correctCount,
            total: video.questions.length,
            completedAt: new Date()
        },
        create: {
            userId,
            videoId,
            score: correctCount,
            total: video.questions.length,
        }
    });

    revalidatePath("/");
    revalidatePath(`/courses/${videoId}`);
    revalidatePath("/progress");
}
