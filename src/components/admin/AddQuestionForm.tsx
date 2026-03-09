"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuestion } from "@/app/actions/admin";
import { Plus, X, Loader2 } from "lucide-react";

export function AddQuestionForm({ videoId }: { videoId: string }) {
    const [text, setText] = useState("");
    const [points, setPoints] = useState("1");
    const [type, setType] = useState<"MCQ" | "SHORT_ANSWER">("MCQ");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [correctIndex, setCorrectIndex] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => setOptions(options.filter((_, i) => i !== index));
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("videoId", videoId);
        formData.append("text", text);
        formData.append("points", points);
        formData.append("type", type);

        if (type === "MCQ") {
            const finalOptions = options.filter(o => o.trim() !== "");
            formData.append("options", JSON.stringify(finalOptions));

            if (finalOptions[correctIndex]) {
                formData.append("correctOption", finalOptions[correctIndex]);
            }
        }

        try {
            await createQuestion(formData);
            setText("");
            setPoints("1");
            setType("MCQ");
            setOptions(["", ""]);
            setCorrectIndex(0);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="text">Question Text</Label>
                <Input id="text" name="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. What is the main topic?" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select value={type} onValueChange={(v: "MCQ" | "SHORT_ANSWER") => setType(v)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MCQ">Multiple Choice</SelectItem>
                            <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input id="points" name="points" value={points} onChange={(e) => setPoints(e.target.value)} type="number" min="1" required />
                </div>
            </div>

            {type === "MCQ" && (
                <div className="space-y-3 bg-black/20 p-4 rounded-md border border-white/5">
                    <div>
                        <Label>Options</Label>
                        <p className="text-xs text-muted-foreground mt-1">Select the radio button next to the correct answer.</p>
                    </div>
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input
                                type="radio"
                                name="correctOptionRadio"
                                checked={correctIndex === index}
                                onChange={() => setCorrectIndex(index)}
                                className="w-4 h-4 text-primary bg-black/50 border-white/20 focus:ring-primary cursor-pointer shrink-0"
                                required
                            />
                            <Input
                                value={option}
                                onChange={(e) => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                required
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeOption(index)} disabled={options.length <= 2}>
                                <X className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                    </Button>
                </div>
            )}

            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Question
                </Button>
            </div>
        </form>
    );
}
