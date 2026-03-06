"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitAnswers } from "@/app/actions/learner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2 } from "lucide-react";

type Question = {
    id: string;
    text: string;
    type: "MCQ" | "SHORT_ANSWER";
    options: string;
};

export function QuizSection({
    videoId,
    questions,
    previousScore,
    isUnlocked = true, // default to true for backwards compatibility just in case
}: {
    videoId: string;
    questions: Question[];
    previousScore: { score: number, total: number } | null;
    isUnlocked?: boolean;
}) {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // If already completed and user hasn't clicked "retake"
    const [isReviewMode, setIsReviewMode] = useState(!!previousScore);

    const handleOptionChange = (questionId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const allAnswered = questions.every(q => !!answers[q.id]?.trim());

    async function handleSubmit() {
        if (!allAnswered) return;

        setIsSubmitting(true);
        try {
            const formattedAnswers = Object.entries(answers).map(([questionId, responseText]) => ({
                questionId,
                responseText,
            }));

            await submitAnswers(videoId, formattedAnswers);
            setIsSuccess(true);
            setIsReviewMode(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (questions.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                    No questions assigned to this module yet.
                </CardContent>
            </Card>
        );
    }

    if (isReviewMode && !isSuccess) {
        return (
            <Card className="border-green-200 bg-green-50/30">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Module Completed!</h3>
                    <p className="text-green-700">
                        You scored {previousScore?.score} out of {previousScore?.total}. Great job!
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => {
                        setIsReviewMode(false);
                        setAnswers({});
                    }}>
                        Retake Quiz
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (isSuccess) {
        return (
            <Card className="border-green-200 bg-green-50/30">
                <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">Answers Submitted!</h3>
                    <p className="text-green-700">
                        Your responses have been recorded successfully.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.href = '/'}>
                        Back to Dashboard
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="relative overflow-hidden">
            {!isUnlocked && (
                <div className="absolute inset-0 z-10 bg-slate-50/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center border border-dashed rounded-xl">
                    <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-4">
                        <Loader2 className="h-6 w-6 text-slate-500 animate-spin opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Quiz Locked</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Please watch the video to completion to unlock the knowledge check.
                    </p>
                </div>
            )}
            <CardHeader>
                <CardTitle>Knowledge Check</CardTitle>
                <CardDescription>Answer the following questions to complete this module.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {questions.map((q, idx) => (
                    <div key={q.id} className="space-y-4">
                        <h4 className="font-medium text-base">
                            {idx + 1}. {q.text}
                        </h4>

                        {q.type === "MCQ" ? (
                            <RadioGroup
                                value={answers[q.id] || ""}
                                onValueChange={(val) => handleOptionChange(q.id, val)}
                            >
                                {JSON.parse(q.options).map((opt: string, i: number) => (
                                    <div key={i} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-md border hover:bg-slate-100 transition-colors">
                                        <RadioGroupItem value={opt} id={`${q.id}-${i}`} />
                                        <Label htmlFor={`${q.id}-${i}`} className="flex-grow cursor-pointer">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <Textarea
                                placeholder="Type your answer here..."
                                value={answers[q.id] || ""}
                                onChange={(e) => handleOptionChange(q.id, e.target.value)}
                                className="min-h-[100px]"
                            />
                        )}
                    </div>
                ))}

                <div className="pt-6 border-t flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {Object.keys(answers).filter(k => !!answers[k].trim()).length} of {questions.length} answered
                    </p>
                    <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered || isSubmitting}
                        className="w-full sm:w-auto min-w-[150px]"
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Submit Answers
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
