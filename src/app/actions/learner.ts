"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function submitAnswers(
    videoId: string,
    answers: { questionId: string; responseText: string }[]
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    const userId = session.user.id;
    // First get the video questions to check answers (simple check for MCQ)
    const video = await db.video.findUnique({
        where: { id: videoId },
        include: { questions: true }
    });

    if (!video) throw new Error("Video not found");

    const maxScore = video.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    let totalScore = 0;

    // Pre-calculate score computationally before hitting the database
    for (const answer of answers) {
        const question = video.questions.find(q => q.id === answer.questionId);
        if (question && question.type === "MCQ" && question.correctOption) {
            if (answer.responseText === question.correctOption) {
                totalScore += (question.points || 1);
            }
        }
    }

    // Enforce passing threshold cut-off
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 100;
    if (percentage < video.passingPercentage) {
        return {
            success: false,
            message: `You scored ${Math.round(percentage)}%. You need at least ${video.passingPercentage}% to pass this training module. Please review the material and try again.`,
            score: totalScore,
            total: maxScore,
        };
    }

    // Save answers sequentially since the user beat the cut-off
    for (const answer of answers) {
        const question = video.questions.find(q => q.id === answer.questionId);
        let isCorrect: boolean | null = null;

        if (question && question.type === "MCQ" && question.correctOption) {
            isCorrect = answer.responseText === question.correctOption;
            if (isCorrect) {
                totalScore += (question.points || 1);
            }
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
            score: totalScore,
            total: maxScore,
            completedAt: new Date()
        },
        create: {
            userId,
            videoId,
            score: totalScore,
            total: maxScore,
        }
    });

    revalidatePath("/");
    revalidatePath(`/courses/${videoId}`);
    revalidatePath("/progress");

    return { success: true };
}
