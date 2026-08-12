module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/app/utils/apiUrl.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiUrl",
    ()=>getApiUrl
]);
const getApiUrl = ()=>{
    const envUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envUrl) {
        return envUrl;
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return "http://10.10.3.2:8000";
};
}),
"[project]/app/api/report.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPatrolReport",
    ()=>getPatrolReport,
    "getPatrolReportPDF",
    ()=>getPatrolReportPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/apiUrl.ts [app-ssr] (ecmascript)");
;
;
/* =====================================================
   API CONFIG
===================================================== */ const BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])();
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    timeout: 15000
});
// Attach JWT on every request
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return config;
});
/* =====================================================
   CORE FETCH FUNCTION
===================================================== */ async function fetchPatrolReportData(factoryCode, reportDate, endDate) {
    try {
        const response = await api.get("/report/download", {
            params: {
                factory_code: factoryCode,
                report_date: reportDate,
                ...endDate ? {
                    end_date: endDate
                } : {}
            }
        });
        const result = response.data;
        if (Array.isArray(result)) {
            return result;
        }
        if (result?.data && Array.isArray(result.data)) {
            return result.data;
        }
        console.error("Unexpected patrol report response:", result);
        return [];
    } catch (err) {
        const error = err;
        console.error("Error fetching patrol report:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Unable to fetch patrol report");
    }
}
async function getPatrolReport(factoryCode, reportDate, endDate) {
    return fetchPatrolReportData(factoryCode, reportDate, endDate);
}
async function getPatrolReportPDF(factoryCode, reportDate, endDate) {
    const items = await fetchPatrolReportData(factoryCode, reportDate, endDate);
    return {
        factory_code: factoryCode,
        report_date: reportDate,
        items
    };
}
}),
"[externals]/worker_threads [external] (worker_threads, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("worker_threads", () => require("worker_threads"));

module.exports = mod;
}),
"[project]/app/components/reports/roundtime.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/components/reports/roundtime.ts
__turbopack_context__.s([
    "ROUND_TIMES",
    ()=>ROUND_TIMES
]);
const ROUND_TIMES = {
    1: {
        start: "12:00 AM",
        end: "12:30 AM"
    },
    2: {
        start: "12:30 AM",
        end: "1:00 AM"
    },
    3: {
        start: "1:00 AM",
        end: "1:30 AM"
    },
    4: {
        start: "1:30 AM",
        end: "2:00 AM"
    },
    5: {
        start: "2:00 AM",
        end: "2:30 AM"
    },
    6: {
        start: "2:30 AM",
        end: "3:00 AM"
    },
    7: {
        start: "3:00 AM",
        end: "3:30 AM"
    },
    8: {
        start: "3:30 AM",
        end: "4:00 AM"
    },
    9: {
        start: "4:00 AM",
        end: "4:30 AM"
    },
    10: {
        start: "4:30 AM",
        end: "5:00 AM"
    },
    11: {
        start: "5:00 AM",
        end: "5:30 AM"
    },
    12: {
        start: "5:30 AM",
        end: "6:00 AM"
    },
    13: {
        start: "6:00 AM",
        end: "7:00 AM"
    },
    14: {
        start: "7:00 AM",
        end: "8:00 AM"
    },
    15: {
        start: "8:00 AM",
        end: "9:00 AM"
    },
    16: {
        start: "9:00 AM",
        end: "10:00 AM"
    },
    17: {
        start: "10:00 AM",
        end: "11:00 AM"
    },
    18: {
        start: "11:00 AM",
        end: "12:00 PM"
    },
    19: {
        start: "12:00 PM",
        end: "1:00 PM"
    },
    20: {
        start: "1:00 PM",
        end: "2:00 PM"
    },
    21: {
        start: "2:00 PM",
        end: "3:00 PM"
    },
    22: {
        start: "3:00 PM",
        end: "4:00 PM"
    },
    23: {
        start: "4:00 PM",
        end: "5:00 PM"
    },
    24: {
        start: "5:00 PM",
        end: "6:00 PM"
    },
    25: {
        start: "6:00 PM",
        end: "7:00 PM"
    },
    26: {
        start: "7:00 PM",
        end: "8:00 PM"
    },
    27: {
        start: "8:00 PM",
        end: "9:00 PM"
    },
    28: {
        start: "9:00 PM",
        end: "9:30 PM"
    },
    29: {
        start: "9:30 PM",
        end: "10:00 PM"
    },
    30: {
        start: "10:00 PM",
        end: "10:30 PM"
    },
    31: {
        start: "10:30 PM",
        end: "11:00 PM"
    },
    32: {
        start: "11:00 PM",
        end: "11:30 PM"
    },
    33: {
        start: "11:30 PM",
        end: "12:00 AM"
    }
};
}),
"[project]/app/components/reports/PatrolReportPDF.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.node.min.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/roundtime.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// ================= Component =================
const PatrolReportPDF = ({ logs, factoryCode, factoryName, factoryAddress, reportDate, generatedBy })=>{
    // Prevent double generation (Strict Mode)
    const generatedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ================= Auto Generate =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Already generated
        if (generatedRef.current) return;
        // No data
        if (!logs || logs.length === 0) return;
        // No rounds
        if (!Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUND_TIMES"]).length) return;
        // ✅ WAIT FOR USER NAME
        if (!generatedBy || generatedBy.trim() === "") return;
        generatedRef.current = true;
        generatePDF();
    }, [
        logs,
        factoryCode,
        factoryName,
        factoryAddress,
        reportDate,
        generatedBy
    ]);
    // ================= Status Normalizer =================
    const normalizeStatus = (status)=>{
        if (!status) return "No Data";
        const s = status.toLowerCase().trim();
        if (s === "success" || s === "completed" || s === "done") {
            return "SUCCESS";
        }
        if (s === "missed") {
            return "MISSED";
        }
        if (s === "pending") {
            return "PENDING";
        }
        return "No Data";
    };
    // ================= Border =================
    const drawBorder = (doc)=>{
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();
        doc.setDrawColor(0, 0, 180);
        doc.setLineWidth(0.8);
        doc.rect(8, 8, w - 16, h - 16);
    };
    // ================= Generate =================
    const generatePDF = ()=>{
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        // Font
        doc.setFont("times", "bold");
        // Border
        drawBorder(doc);
        // ================= Header Drawer =================
        const drawHeader = (targetDoc, targetDate)=>{
            targetDoc.setTextColor(0, 0, 150);
            targetDoc.setFont("times", "bold");
            targetDoc.setFontSize(20);
            targetDoc.text("Security Patrol Report", width / 2, 20, {
                align: "center"
            });
            targetDoc.setFontSize(16);
            targetDoc.text(factoryName.toUpperCase(), width / 2, 30, {
                align: "center"
            });
            targetDoc.setFont("times", "normal");
            targetDoc.setFontSize(11);
            // Address
            targetDoc.text(factoryAddress, width / 2, 38, {
                align: "center"
            });
            // Meta
            targetDoc.setFont("times", "bold");
            targetDoc.setFontSize(13);
            targetDoc.setTextColor(0, 0, 150);
            targetDoc.text(`Date : ${targetDate}`, 14, 50);
            // ✅ REAL USER NAME ALWAYS
            targetDoc.setFont("times", "normal");
            targetDoc.setFontSize(11);
            targetDoc.setTextColor(40);
            targetDoc.text(`Generated By : ${generatedBy}`, 14, 57);
            targetDoc.text(`Generated At : ${new Date().toLocaleString()}`, 14, 63);
        };
        let y = 72;
        // ================= Group by Date first, then Round =================
        const dates = [
            ...new Set(logs.map((l)=>l.date || reportDate))
        ].sort();
        dates.forEach((d, dateIdx)=>{
            // Start each new date on a new page
            if (dateIdx > 0) {
                doc.addPage();
                drawBorder(doc);
            }
            // Draw the full header for this date!
            drawHeader(doc, d);
            y = 72;
            const dayLogs = logs.filter((l)=>(l.date || reportDate) === d);
            const byRound = {};
            Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUND_TIMES"]).forEach((r)=>{
                byRound[Number(r)] = [];
            });
            dayLogs.forEach((l)=>{
                if (!byRound[l.round]) {
                    byRound[l.round] = [];
                }
                byRound[l.round].push(l);
            });
            Object.keys(byRound).map(Number).sort((a, b)=>a - b).forEach((round)=>{
                // Omit rounds with no data
                if (byRound[round].length === 0) {
                    return;
                }
                if (y > height - 50) {
                    doc.addPage();
                    drawBorder(doc);
                    y = 20;
                }
                const time = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUND_TIMES"][round];
                // Round Header
                doc.setFont("times", "bold");
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 150);
                doc.text(`Round ${round} (${time?.start || "-"} - ${time?.end || "-"})`, 14, y);
                y += 6;
                // ================= Rows =================
                const rows = byRound[round].map((l)=>{
                    const status = normalizeStatus(l.status);
                    return [
                        l.scan_time ? new Date(l.scan_time).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit"
                        }) : "-",
                        l.guard_name || "-",
                        l.qr_name || "-",
                        l.lat || "-",
                        l.lon || "-",
                        status
                    ];
                });
                // ================= Table =================
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(doc, {
                    startY: y,
                    head: [
                        [
                            "Time",
                            "Guard",
                            "QR Point",
                            "Latitude",
                            "Longitude",
                            "Status"
                        ]
                    ],
                    body: rows,
                    theme: "grid",
                    styles: {
                        font: "times",
                        fontSize: 9,
                        cellPadding: 3
                    },
                    headStyles: {
                        fillColor: [
                            0,
                            70,
                            160
                        ],
                        textColor: 255,
                        fontStyle: "bold"
                    },
                    alternateRowStyles: {
                        fillColor: [
                            245,
                            248,
                            255
                        ]
                    },
                    didParseCell: (data)=>{
                        if (data.section === "body" && data.column.index === 5) {
                            if (data.cell.raw === "SUCCESS") {
                                data.cell.styles.textColor = [
                                    0,
                                    150,
                                    0
                                ];
                                data.cell.styles.fontStyle = "bold";
                            }
                            if (data.cell.raw === "MISSED") {
                                data.cell.styles.textColor = [
                                    200,
                                    0,
                                    0
                                ];
                                data.cell.styles.fontStyle = "bold";
                            }
                            if (data.cell.raw === "PENDING") {
                                data.cell.styles.textColor = [
                                    200,
                                    150,
                                    0
                                ];
                                data.cell.styles.fontStyle = "bold";
                            }
                            if (data.cell.raw === "No Data") {
                                data.cell.styles.textColor = [
                                    255,
                                    140,
                                    0
                                ];
                                data.cell.styles.fontStyle = "bold";
                            }
                        }
                    },
                    didDrawPage: ()=>{
                        drawBorder(doc);
                    }
                });
                y = doc.lastAutoTable.finalY + 12;
            });
            if (dateIdx < dates.length - 1) {
                y += 4;
            }
        });
        // ================= Footer =================
        // ================= Footer =================
        const pages = doc.getNumberOfPages();
        for(let i = 1; i <= pages; i++){
            doc.setPage(i);
            doc.setFont("times", "normal");
            doc.setFontSize(9);
            doc.setTextColor(120);
            // Page Number (Center)
            doc.text(`Page ${i} of ${pages} | KCET Security Rounds`, width / 2, height - 12, {
                align: "center"
            });
            // ✅ Generated By (Bottom Left)
            doc.text(`Generated By : ${generatedBy}`, 14, height - 12);
        }
        // ================= Save =================
        doc.save(`Patrol_Report_${factoryCode}_${reportDate}.pdf`);
    };
    return null;
};
const __TURBOPACK__default__export__ = PatrolReportPDF;
}),
"[project]/app/components/reports/ReportTable.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-ssr] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-ssr] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-ssr] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/roundtime.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
// ===============================
// Component
// ===============================
const ReportTable = ({ logs, loading })=>{
    console.log("REPORT LOGS:", logs);
    // ===============================
    // Status Normalizer (SAME AS PDF)
    // ===============================
    const normalizeStatus = (status, scanTime)=>{
        if (!status) return "No Data";
        const s = status.toLowerCase().trim();
        if (s === "success" || s === "completed" || s === "done") {
            return "SUCCESS";
        }
        if (s === "missed") {
            return "MISSED";
        }
        if (s === "pending") {
            return "PENDING";
        }
        // If no scan time and status is unrecognized
        if (!scanTime) return "No Data";
        return "No Data";
    };
    // -------------------------------
    // Sorting
    // -------------------------------
    const [sortConfig, setSortConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        key: "scan_time",
        direction: "desc"
    });
    // -------------------------------
    // Pagination Per Round
    // -------------------------------
    const [pages, setPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const rowsPerPage = 10;
    const getPage = (round)=>pages[round] || 1;
    const setPage = (round, page)=>{
        setPages((prev)=>({
                ...prev,
                [round]: page
            }));
    };
    // -------------------------------
    // Columns
    // -------------------------------
    const columns = [
        {
            key: "scan_time",
            label: "Scan Time"
        },
        {
            key: "guard_name",
            label: "Guard"
        },
        {
            key: "qr_name",
            label: "Scan Point"
        },
        {
            key: "lat",
            label: "Latitude"
        },
        {
            key: "lon",
            label: "Longitude"
        },
        {
            key: "status",
            label: "Status"
        }
    ];
    // -------------------------------
    // Sorting Handler
    // -------------------------------
    const handleSort = (key)=>{
        let direction = "asc";
        if (sortConfig.key === key) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        } else {
            direction = "desc";
        }
        setSortConfig({
            key,
            direction
        });
    };
    // -------------------------------
    // Filter Logs
    // -------------------------------
    const validLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return logs.filter((log)=>log.round >= 1 && log.round <= 33);
    }, [
        logs
    ]);
    // -------------------------------
    // Sort Data
    // -------------------------------
    const sortedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            ...validLogs
        ].sort((a, b)=>{
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (sortConfig.key === "scan_time") {
                const dateA = aValue ? new Date(aValue).getTime() : 0;
                const dateB = bValue ? new Date(bValue).getTime() : 0;
                return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
            }
            if (!aValue || !bValue) return 0;
            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [
        validLogs,
        sortConfig
    ]);
    // -------------------------------
    // Group By Round
    // -------------------------------
    const logsByRound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const grouped = {};
        sortedData.forEach((log)=>{
            const r = log.round || 1;
            if (!grouped[r]) grouped[r] = [];
            grouped[r].push(log);
        });
        return grouped;
    }, [
        sortedData
    ]);
    // -------------------------------
    // Render Cell
    // -------------------------------
    const renderCell = (row, key)=>{
        const value = row[key];
        // Date
        if (key === "scan_time") {
            if (!value) return "—";
            return new Date(value).toLocaleString();
        }
        // ================= Status (UPDATED) =================
        if (key === "status") {
            const finalStatus = normalizeStatus(row.status, row.scan_time);
            let color = "";
            if (finalStatus === "SUCCESS") {
                color = "bg-green-100 text-green-800";
            }
            if (finalStatus === "MISSED") {
                color = "bg-red-100 text-red-800";
            }
            if (finalStatus === "PENDING") {
                color = "bg-amber-100 text-amber-800";
            }
            if (finalStatus === "No Data") {
                color = "bg-orange-100 text-orange-800";
            }
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `px-2 py-1 rounded-full text-xs font-semibold ${color}`,
                children: finalStatus
            }, void 0, false, {
                fileName: "[project]/app/components/reports/ReportTable.tsx",
                lineNumber: 263,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return value ?? "—";
    };
    // -------------------------------
    // Loading / Empty
    // -------------------------------
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-6 text-slate-500",
            children: "Loading scan logs..."
        }, void 0, false, {
            fileName: "[project]/app/components/reports/ReportTable.tsx",
            lineNumber: 281,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (!validLogs.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-6 text-slate-500",
            children: "No scan records found"
        }, void 0, false, {
            fileName: "[project]/app/components/reports/ReportTable.tsx",
            lineNumber: 289,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // ===============================
    // UI
    // ===============================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: Object.keys(logsByRound).sort((a, b)=>Number(a) - Number(b)).map((roundKey)=>{
            const roundNumber = Number(roundKey);
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUND_TIMES"][roundNumber]) return null;
            const roundLogs = logsByRound[roundNumber];
            // Pagination
            const page = getPage(roundNumber);
            const totalPages = Math.ceil(roundLogs.length / rowsPerPage);
            const indexOfLastRow = page * rowsPerPage;
            const indexOfFirstRow = indexOfLastRow - rowsPerPage;
            const currentRows = roundLogs.slice(indexOfFirstRow, indexOfLastRow);
            // Round time
            const roundTime = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUND_TIMES"][roundNumber];
            const startTime = roundTime?.start ?? "-";
            const endTime = roundTime?.end ?? "-";
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto glass-panel rounded-2xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-3",
                        children: [
                            "Round ",
                            roundNumber,
                            " — Start: ",
                            startTime,
                            ", End: ",
                            endTime
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                        lineNumber: 344,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full divide-y divide-slate-200/50 bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-slate-50/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: columns.map((col)=>{
                                        const isActive = sortConfig.key === col.key;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            onClick: ()=>handleSort(col.key),
                                            className: `px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none
                            ${isActive ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    col.label,
                                                    isActive ? sortConfig.direction === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 381,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 383,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                        className: "w-3 h-3 opacity-30"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 388,
                                                        columnNumber: 31
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                lineNumber: 374,
                                                columnNumber: 27
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, String(col.key), false, {
                                            fileName: "[project]/app/components/reports/ReportTable.tsx",
                                            lineNumber: 363,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/components/reports/ReportTable.tsx",
                                    lineNumber: 355,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 353,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-slate-200/50",
                                children: currentRows.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-white/60 transition-colors",
                                        children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4 whitespace-nowrap text-sm text-slate-700",
                                                children: renderCell(row, col.key)
                                            }, String(col.key), false, {
                                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                lineNumber: 415,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, `${row.qr_name}-${roundNumber}-${index}`, false, {
                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                        lineNumber: 408,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 404,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                        lineNumber: 350,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex justify-between items-center px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage(roundNumber, Math.max(1, page - 1)),
                                disabled: page === 1,
                                className: "px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50",
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 438,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-slate-600",
                                children: [
                                    "Page ",
                                    page,
                                    " of ",
                                    totalPages
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 451,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage(roundNumber, Math.min(totalPages, page + 1)),
                                disabled: page === totalPages,
                                className: "px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 456,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                        lineNumber: 436,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, roundKey, true, {
                fileName: "[project]/app/components/reports/ReportTable.tsx",
                lineNumber: 338,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/app/components/reports/ReportTable.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = ReportTable;
}),
"[project]/app/services/token.service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/services/token.service.ts
__turbopack_context__.s([
    "clearAuth",
    ()=>clearAuth,
    "getTokenFromCookie",
    ()=>getTokenFromCookie,
    "getUser",
    ()=>getUser,
    "isAuthenticated",
    ()=>isAuthenticated,
    "setUser",
    ()=>setUser,
    "tokenService",
    ()=>tokenService
]);
const TOKEN_KEY = "access_token";
const tokenService = {
    get () {
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    },
    set (token) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // 🔥 IMPORTANT: middleware can read cookies, not localStorage
        // Using the secure check from your original code for best practice
        const isSecure = undefined;
    },
    remove () {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
};
const setUser = (user)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const getUser = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const role = undefined;
    const adminName = undefined;
    const token = undefined;
};
const isAuthenticated = ()=>{
    return !!tokenService.get() && !!getUser();
};
const getTokenFromCookie = (cookieString)=>{
    if (!cookieString) return null;
    const match = cookieString.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
    return match ? match[1] : null;
};
const clearAuth = ()=>{
    tokenService.remove();
};
}),
"[project]/app/services/auth.guard.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/services/auth.guard.ts
__turbopack_context__.s([
    "useAuthGuard",
    ()=>useAuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/token.service.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const useAuthGuard = (options)=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [authorized, setAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const checkAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const authenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAuthenticated"])();
        // 🔒 1. If not authenticated → redirect to login
        if (!authenticated) {
            setAuthorized(false);
            router.replace("/login");
            return;
        }
        // 🔐 2. If role-based access is required
        if (options?.allowedRoles) {
            const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUser"])();
            const userRole = user?.role?.toUpperCase() || "";
            if (!user || !options.allowedRoles.includes(userRole)) {
                setAuthorized(false);
                // Redirect to a safe default page if they have a session but wrong role
                if (userRole === "SUPERVISOR") {
                    router.replace("/report-download");
                } else {
                    router.replace("/login");
                }
                return;
            }
        }
        setAuthorized(true);
    }, [
        router,
        options
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        checkAuth();
    }, [
        checkAuth
    ]);
    return {
        authorized
    };
};
}),
"[project]/app/report-download/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ReportDownloadPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$report$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/report.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$PatrolReportPDF$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/PatrolReportPDF.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$ReportTable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/ReportTable.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/auth.guard.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// ================= ICONS (SVG) =================
const IconFactory = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 text-slate-400",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        }, void 0, false, {
            fileName: "[project]/app/report-download/page.tsx",
            lineNumber: 20,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/report-download/page.tsx",
        lineNumber: 19,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const IconCalendar = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4 text-slate-400",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        }, void 0, false, {
            fileName: "[project]/app/report-download/page.tsx",
            lineNumber: 27,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/report-download/page.tsx",
        lineNumber: 26,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const IconDownload = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        }, void 0, false, {
            fileName: "[project]/app/report-download/page.tsx",
            lineNumber: 34,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/report-download/page.tsx",
        lineNumber: 33,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
const IconSpinner = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "animate-spin h-5 w-5 text-white",
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/app/report-download/page.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/app/report-download/page.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/report-download/page.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
function ReportDownloadPage() {
    const { authorized } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthGuard"])({
        allowedRoles: [
            'ADMIN',
            'SUPERVISOR'
        ]
    });
    const [adminName, setAdminName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const FIXED_CAMPUS = "KCET01";
    const [reportDate, setReportDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().slice(0, 10));
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().slice(0, 10));
    const [selectedMonth, setSelectedMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [reportType, setReportType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("single");
    const [report, setReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pdfLoading, setPdfLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pdfTrigger, setPdfTrigger] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const printRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // ================= INITIAL LOAD =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (authorized) {
            fetchReport();
        }
    }, [
        reportDate,
        endDate,
        selectedMonth,
        reportType,
        authorized
    ]);
    // ================= LOAD ADMIN =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (authorized) {
            const name = localStorage.getItem("adminName");
            if (name && name.trim() !== "") {
                setAdminName(name);
            }
        }
    }, [
        authorized
    ]);
    // ================= FETCH =================
    const fetchReport = async ()=>{
        if (!authorized) return;
        setLoading(true);
        setError(null);
        setPdfTrigger(null);
        let start = reportDate;
        let end = reportDate;
        if (reportType === "range") {
            start = reportDate;
            end = endDate;
        } else if (reportType === "month") {
            const [year, month] = selectedMonth.split("-").map(Number);
            const lastDay = new Date(year, month, 0); // last day of current month
            const pad = (n)=>String(n).padStart(2, "0");
            start = `${year}-${pad(month)}-01`;
            end = `${year}-${pad(month)}-${pad(lastDay.getDate())}`;
        }
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$report$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPatrolReport"])(FIXED_CAMPUS, start, end);
            setReport(data);
            if (data.length === 0) setError("No patrol records found for this timeframe.");
        } catch (err) {
            setError("Failed to fetch report data. Please try again.");
            console.error(err);
        } finally{
            setLoading(false);
        }
    };
    // ================= PDF =================
    const handleDownloadPdf = ()=>{
        if (!report.length) return;
        setPdfLoading(true);
        setPdfTrigger(Date.now());
        setTimeout(()=>setPdfLoading(false), 800);
    };
    // ================= CLEAN =================
    const cleanLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return report.map((i)=>({
                ...i,
                lat: i.lat ?? undefined,
                lon: i.lon ?? undefined,
                guard_name: i.guard_name ?? undefined
            }));
    }, [
        report
    ]);
    if (!authorized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-slate-500 min-h-screen flex items-center justify-center",
            children: "Checking access..."
        }, void 0, false, {
            fileName: "[project]/app/report-download/page.tsx",
            lineNumber: 136,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen relative font-sans text-slate-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold tracking-tight text-slate-900",
                                    children: "Patrol Reports"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 text-slate-500",
                                    children: "View logs and generate official patrol documentation."
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/report-download/page.tsx",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3 px-4 py-2 glass-panel rounded-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 rounded-full bg-emerald-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium text-slate-600",
                                    children: [
                                        "Admin: ",
                                        adminName || "Loading..."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/report-download/page.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/report-download/page.tsx",
                    lineNumber: 144,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-panel rounded-3xl p-6 mb-6",
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/app/report-download/page.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 mb-6 border-b pb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setReportType("single"),
                                    className: `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${reportType === "single" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                    children: "One Day Report"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setReportType("range"),
                                    className: `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${reportType === "range" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                    children: "Date Range Report"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setReportType("month"),
                                    className: `px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${reportType === "month" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`,
                                    children: "Month-wise Report"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/report-download/page.tsx",
                            lineNumber: 169,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-12 gap-6 items-end",
                            children: [
                                reportType === "single" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                            children: "Patrol Date"
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "date",
                                            className: "w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg",
                                            value: reportDate,
                                            onChange: (e)=>setReportDate(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this),
                                reportType === "range" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                                    children: "From Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/report-download/page.tsx",
                                                    lineNumber: 222,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg",
                                                    value: reportDate,
                                                    onChange: (e)=>setReportDate(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/report-download/page.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 221,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "md:col-span-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                                    children: "To Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/report-download/page.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "date",
                                                    className: "w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg",
                                                    value: endDate,
                                                    onChange: (e)=>setEndDate(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/report-download/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true),
                                reportType === "month" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                            children: "Select Month"
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 248,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "month",
                                            className: "w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg",
                                            value: selectedMonth,
                                            onChange: (e)=>setSelectedMonth(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 251,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:col-span-3 flex gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: fetchReport,
                                            disabled: loading,
                                            className: "flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center",
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSpinner, {}, void 0, false, {
                                                fileName: "[project]/app/report-download/page.tsx",
                                                lineNumber: 267,
                                                columnNumber: 28
                                            }, this) : "View Report"
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 262,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleDownloadPdf,
                                            disabled: !report.length || pdfLoading || loading,
                                            className: "flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors",
                                            children: pdfLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconSpinner, {}, void 0, false, {
                                                fileName: "[project]/app/report-download/page.tsx",
                                                lineNumber: 275,
                                                columnNumber: 31
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(IconDownload, {}, void 0, false, {
                                                        fileName: "[project]/app/report-download/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 51
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Download PDF"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/report-download/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 67
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/app/report-download/page.tsx",
                                            lineNumber: 270,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 261,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/report-download/page.tsx",
                            lineNumber: 202,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/report-download/page.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-panel rounded-3xl overflow-hidden min-h-[400px]",
                    children: !loading && cleanLogs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: printRef,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-b border-slate-100 px-6 py-4 bg-slate-50/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-slate-800",
                                    children: "Report Data"
                                }, void 0, false, {
                                    fileName: "[project]/app/report-download/page.tsx",
                                    lineNumber: 286,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/report-download/page.tsx",
                                lineNumber: 285,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$ReportTable$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                logs: cleanLogs,
                                loading: loading
                            }, void 0, false, {
                                fileName: "[project]/app/report-download/page.tsx",
                                lineNumber: 288,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/report-download/page.tsx",
                        lineNumber: 284,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/report-download/page.tsx",
                    lineNumber: 282,
                    columnNumber: 9
                }, this),
                pdfTrigger && cleanLogs.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$PatrolReportPDF$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        logs: cleanLogs,
                        factoryCode: FIXED_CAMPUS,
                        factoryName: "KCET Main Campus",
                        factoryAddress: "Virudhunagar",
                        reportDate: reportType === "single" ? reportDate : reportType === "range" ? `${reportDate} to ${endDate}` : `${new Date(selectedMonth + "-02").toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric"
                        })}`,
                        generatedBy: adminName
                    }, pdfTrigger, false, {
                        fileName: "[project]/app/report-download/page.tsx",
                        lineNumber: 296,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/report-download/page.tsx",
                    lineNumber: 295,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/report-download/page.tsx",
            lineNumber: 141,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/report-download/page.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4135ec4f._.js.map