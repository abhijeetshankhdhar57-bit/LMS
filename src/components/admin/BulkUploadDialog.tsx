"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, AlertCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { bulkUploadUsers } from "@/app/actions/admin";
import Papa from "papaparse";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export function BulkUploadDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<{ successful: number; failed: number; errors: string[] } | null>(null);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setResults(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (parsedOutput) => {
                try {
                    // Extract fields mapping them nicely to the User schema requirements
                    const usersToImport = parsedOutput.data.map((row: any) => ({
                        name: row.Name || row.name || "",
                        email: row.Email || row.email || "",
                        role: (row.Role || row.role || "LEARNER").toUpperCase() as "LEARNER" | "ADMIN"
                    })).filter(u => u.name && u.email);

                    if (usersToImport.length === 0) {
                        setResults({ successful: 0, failed: parsedOutput.data.length, errors: ["No valid rows found. Ensure CSV has 'name' and 'email' headers."] });
                        return;
                    }

                    const response = await bulkUploadUsers(usersToImport);
                    setResults(response);

                    if (response.successful > 0 && response.failed === 0) {
                        setTimeout(() => {
                            setIsOpen(false);
                            setFile(null);
                            setResults(null);
                            router.refresh();
                        }, 2000);
                    } else if (response.successful > 0) {
                        router.refresh(); // Refresh background UI even if some failed
                    }
                } catch (error: any) {
                    setResults({ successful: 0, failed: 1, errors: [error.message || "An unexpected error occurred."] });
                } finally {
                    setIsUploading(false);
                }
            },
            error: (err) => {
                setResults({ successful: 0, failed: 1, errors: [`CSV Parsing Error: ${err.message}`] });
                setIsUploading(false);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) { setFile(null); setResults(null); }
        }}>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-[#6366f1] hover:bg-[#4f46e5]">
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Bulk Import
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Bulk Employee Onboarding</DialogTitle>
                    <DialogDescription>
                        Upload a standard CSV file directly containing employee names and corporate email addresses. The system will automatically generate secure temporary passwords and dispatch onboarding emails.
                        <br /><br />
                        <span className="font-semibold text-primary">Required Columns:</span> <code>name</code>, <code>email</code>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="csv-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-primary/20 border-dashed rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-primary" />
                                <p className="mb-2 text-sm text-foreground">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-muted-foreground">{file ? file.name : "CSV files only"}</p>
                            </div>
                            <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    {results && (
                        <div className="mt-2 space-y-2">
                            {results.successful > 0 && (
                                <Alert className="bg-green-500/10 border-green-500/50 text-green-500">
                                    <AlertTitle>Success</AlertTitle>
                                    <AlertDescription>Successfully onboarded {results.successful} employees.</AlertDescription>
                                </Alert>
                            )}

                            {results.failed > 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Errors Occurred ({results.failed})</AlertTitle>
                                    <AlertDescription>
                                        <ul className="list-disc pl-4 text-xs mt-2 max-h-[100px] overflow-y-auto">
                                            {results.errors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full">
                        {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Process Import Data"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
