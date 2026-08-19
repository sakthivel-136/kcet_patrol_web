import jsPDF from "jspdf";
import QRCode from "qrcode";
import { QRData as QRCodeType } from "@/app/api/qr.api";

export const generateSingleQrPdf = async (qr: QRCodeType) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  await renderQrToPdf(doc, qr);
  doc.save(`QR_${qr.qr_name.replace(/\s+/g, "_")}.pdf`);
};

export const generateBulkQrPdf = async (qrs: QRCodeType[]) => {
  if (qrs.length === 0) return;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  for (let i = 0; i < qrs.length; i++) {
    if (i > 0) doc.addPage();
    await renderQrToPdf(doc, qrs[i]);
  }
  doc.save("KCET_All_QR_Codes.pdf");
};

const renderQrToPdf = async (doc: jsPDF, qr: QRCodeType) => {
  const pageWidth  = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight();  // 297 mm

  // ── Outer purple border ────────────────────────────────
  doc.setDrawColor(109, 40, 217);
  doc.setLineWidth(1.5);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // ── Inner gold border ──────────────────────────────────
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // ── Purple header band ─────────────────────────────────
  doc.setFillColor(109, 40, 217);
  doc.roundedRect(14, 14, pageWidth - 28, 30, 4, 4, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("KCET SECURITY ROUNDS", pageWidth / 2, 24, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(210, 190, 255);
  doc.text("OFFICIAL PATROL CHECKPOINT", pageWidth / 2, 32, { align: "center" });

  // ── QR Name (big, bold, dark purple) ──────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(30, 10, 60);
  doc.text(qr.qr_name.toUpperCase(), pageWidth / 2, 70, { align: "center" });

  // Thin purple divider under name
  doc.setDrawColor(180, 150, 230);
  doc.setLineWidth(0.4);
  doc.line(30, 75, pageWidth - 30, 75);

  // ── QR Code (large, centered, purple dots) ─────────────
  const qrDataUrl = await QRCode.toDataURL(String(qr.qr_id), {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 600,
    color: { dark: "#3b0764", light: "#ffffff" },
  });

  const qrSize = 130;
  const xPos   = (pageWidth - qrSize) / 2;
  doc.addImage(qrDataUrl, "PNG", xPos, 84, qrSize, qrSize);

  // ── Gold "SCAN USING" instruction box ─────────────────
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(20, 224, pageWidth - 40, 22, 5, 5, "F");
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.7);
  doc.roundedRect(20, 224, pageWidth - 40, 22, 5, 5, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(120, 53, 15);
  doc.text("SCAN USING KCET SECURITY APP", pageWidth / 2, 238, { align: "center" });

  // ── Footer ────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(170, 150, 210);
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}`,
    pageWidth / 2,
    282,
    { align: "center" }
  );
};
