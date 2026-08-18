import jsPDF from "jspdf";
import QRCode from "qrcode";
import { QRData as QRCodeType } from "@/app/api/qr.api";

export const generateSingleQrPdf = async (qr: QRCodeType) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await renderQrToPdf(doc, qr);
  
  doc.save(`QR_${qr.qr_name.replace(/\s+/g, "_")}_${qr.qr_id}.pdf`);
};

export const generateBulkQrPdf = async (qrs: QRCodeType[]) => {
  if (qrs.length === 0) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let i = 0; i < qrs.length; i++) {
    if (i > 0) doc.addPage();
    await renderQrToPdf(doc, qrs[i]);
  }

  doc.save("KCET_All_QR_Codes.pdf");
};

const renderQrToPdf = async (doc: jsPDF, qr: QRCodeType) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Title
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(qr.qr_name, pageWidth / 2, 40, { align: "center" });

  // Subtitle / ID
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Checkpoint ID: ${qr.qr_id}`, pageWidth / 2, 50, { align: "center" });

  // Generate QR Code Data URL
  const qrDataUrl = await QRCode.toDataURL(qr.secure_token || String(qr.qr_id), {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 400,
  });

  // Draw QR Image
  // 100x100 mm size, centered
  const qrSize = 100;
  const xPos = (pageWidth - qrSize) / 2;
  doc.addImage(qrDataUrl, "PNG", xPos, 70, qrSize, qrSize);

  // Footer instructions
  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text("Scan using the KCET Security Rounds App", pageWidth / 2, 190, { align: "center" });
  
  // Branding
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 280, { align: "center" });
};
