"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileBadge, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";

interface CertificateProps {
    learnerName: string;
    courseTitle: string;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export function CertificateGenerator({ learnerName, courseTitle, className, variant = "default" }: CertificateProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePdf = async () => {
        setIsGenerating(true);
        try {
            // Wait slightly so the React UI can safely trigger the loading spinner state
            await new Promise(resolve => setTimeout(resolve, 50));

            // Initialize a Landscape Document
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();

            // Background Color (Juspay Dark Theme)
            doc.setFillColor(15, 23, 42); // slate-900 equivalent
            doc.rect(0, 0, width, height, "F");

            // Outer Frame
            doc.setDrawColor(100, 60, 255); // primary purple
            doc.setLineWidth(4);
            doc.rect(10, 10, width - 20, height - 20, "D");

            // Inner Frame
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(0.5);
            doc.rect(14, 14, width - 28, height - 28, "D");

            // Header Ribbon
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(40);
            doc.text("Certificate of Completion", width / 2, 60, { align: "center" });

            // Subtitle
            doc.setTextColor(200, 200, 200);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.text("This is to certify that", width / 2, 85, { align: "center" });

            // Name Formatting
            doc.setTextColor(100, 150, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(36);
            const safeName = learnerName.toUpperCase();
            doc.text(safeName, width / 2, 105, { align: "center" });

            // Golden Underline for the Name
            const textWidth = doc.getTextWidth(safeName);
            doc.setDrawColor(100, 150, 255);
            doc.setLineWidth(1);
            doc.line((width / 2) - (textWidth / 2) - 10, 110, (width / 2) + (textWidth / 2) + 10, 110);

            // Context Ribbon
            doc.setTextColor(200, 200, 200);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(16);
            doc.text("has successfully completed the enterprise training module:", width / 2, 125, { align: "center" });

            // Course Title (Multi-line safe)
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(22);
            const splitTitle = doc.splitTextToSize(`"${courseTitle}"`, width - 60);
            doc.text(splitTitle, width / 2, 140, { align: "center" });

            // Official Date Stamp
            const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.setTextColor(150, 150, 150);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`Awarded on ${dateStr}`, width / 2, 180, { align: "center" });

            // Footer Branding Logotype
            doc.setTextColor(100, 60, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("JUSPAY LEARNING MANAGEMENT SYSTEM", width / 2, height - 25, { align: "center" });

            // Render and Force Download
            doc.save(`Certificate_${learnerName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}.pdf`);

        } catch (error) {
            console.error("PDF engine failure:", error);
            alert("Failed to render the document. Check console for logs.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button onClick={generatePdf} disabled={isGenerating} className={className} variant={variant}>
            {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <FileBadge className="w-5 h-5 mr-2" />}
            Download Certificate
        </Button>
    );
}
