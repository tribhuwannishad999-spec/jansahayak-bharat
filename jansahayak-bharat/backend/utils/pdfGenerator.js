// Generates a PDF receipt for a filed complaint using pdfkit (pure Node, no external
// binary dependency — works fine on Render's free tier).
import PDFDocument from "pdfkit";

export function generateComplaintPDF(complaint, res) {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=complaint-${complaint.trackingId}.pdf`
  );
  doc.pipe(res);

  doc.fontSize(20).text("JanSahayak Bharat - Complaint Receipt", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Tracking ID: ${complaint.trackingId}`);
  doc.text(`Category: ${complaint.category}`);
  doc.text(`Subject: ${complaint.subject}`);
  doc.text(`Description: ${complaint.description}`);
  doc.text(`District: ${complaint.district || "-"}`);
  doc.text(`Village: ${complaint.village || "-"}`);
  doc.text(`Status: ${complaint.status}`);
  doc.text(`Filed on: ${new Date(complaint.createdAt).toLocaleString("en-IN")}`);
  doc.moveDown();
  doc.fontSize(10).fillColor("gray").text(
    "Note: Hindi text rendering in PDFs requires an embedded Unicode Devanagari font " +
    "(e.g. Noto Sans Devanagari .ttf, bundled in /backend/fonts) registered via " +
    "doc.registerFont() before use — plain pdfkit ships only Latin-script fonts by default."
  );

  doc.end();
}
