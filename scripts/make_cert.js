const { jsPDF } = require("jspdf");
const fs = require("fs");

try {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, width, height, "F");

    doc.setDrawColor(100, 60, 255);
    doc.setLineWidth(4);
    doc.rect(10, 10, width - 20, height - 20, "D");

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(14, 14, width - 28, height - 28, "D");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text("Certificate of Completion", width / 2, 60, { align: "center" });

    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("This is to certify that", width / 2, 85, { align: "center" });

    doc.setTextColor(100, 150, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    const safeName = "ABHIJEET SHANKHDHAR";
    doc.text(safeName, width / 2, 105, { align: "center" });

    const textWidth = doc.getTextWidth(safeName);
    doc.setDrawColor(100, 150, 255);
    doc.setLineWidth(1);
    doc.line((width / 2) - (textWidth / 2) - 10, 110, (width / 2) + (textWidth / 2) + 10, 110);

    doc.setTextColor(200, 200, 200);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("has successfully completed the enterprise training module:", width / 2, 125, { align: "center" });

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(22);
    doc.text('"Advanced Corporate Leadership 101"', width / 2, 140, { align: "center" });

    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Awarded on ${dateStr}`, width / 2, 180, { align: "center" });

    doc.setTextColor(100, 60, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("JUSPAY LEARNING MANAGEMENT SYSTEM", width / 2, height - 25, { align: "center" });

    const buffer = Buffer.from(doc.output('arraybuffer'));
    fs.writeFileSync("/Users/abhijeet.shankhdhar/.gemini/antigravity/brain/1e1319bb-0399-4a7d-b22d-373c2ac6aa60/Sample_Certificate.pdf", buffer);
    console.log("PDF successfully generated");
} catch (e) {
    console.error(e);
}
