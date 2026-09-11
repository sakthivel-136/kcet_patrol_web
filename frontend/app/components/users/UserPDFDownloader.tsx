import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SecurityUser } from "@/app/types/securityUser";
import { Download } from "lucide-react";

interface Props {
  users: SecurityUser[];
}

const LOGO_URL = "/logo.png"; // Same as report download, assuming it's there

// Ensure base64 loader
const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } else {
        reject(new Error("Failed to get context"));
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
};

const UserPDFDownloader: React.FC<Props> = ({ users }) => {
  const [selectedRole, setSelectedRole] = useState("Guard");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const filteredUsers = users.filter(
        (u) => (u.role || "").toUpperCase() === selectedRole.toUpperCase()
      );

      const doc = new jsPDF();
      let logoData = null;
      try {
        logoData = await getBase64ImageFromUrl(LOGO_URL);
      } catch (err) {
        console.warn("Logo could not be loaded", err);
      }

      // Royal Purple & Gold header
      doc.setFillColor(48, 14, 107); // Deep Purple bg
      doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");

      if (logoData) {
        doc.addImage(logoData, "PNG", 14, 5, 30, 30);
      }

      doc.setTextColor(255, 215, 0); // Gold text
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("KNOWLEDGE INSTITUTE OF TECHNOLOGY", 50, 20);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`${selectedRole} Management Report`, 50, 28);
      
      const tableData = filteredUsers.map((u) => [
        u.security_id || "-",
        u.security_name || "-",
        u.security_password || "-"
      ]);

      autoTable(doc, {
        startY: 50,
        head: [["Employee ID", "Employee Name", "Password / PIN"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [48, 14, 107], // Deep Purple
          textColor: [255, 215, 0], // Gold
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          textColor: [50, 50, 50],
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [248, 246, 255], // Light purple tint
        },
        styles: {
          font: "helvetica",
          fontSize: 11,
          cellPadding: 4,
          lineColor: [220, 220, 230],
          lineWidth: 0.1,
        },
      });

      doc.save(`${selectedRole}_Management_Report.pdf`);
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Failed to generate PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        className="px-4 py-2 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-sm outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-all font-medium text-slate-700"
      >
        <option value="Guard">Guards</option>
        <option value="Supervisor">Supervisors</option>
      </select>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="btn-secondary flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 px-4 py-2 rounded-xl shadow font-semibold disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {loading ? "Generating..." : "Download"}
      </button>
    </div>
  );
};

export default UserPDFDownloader;
