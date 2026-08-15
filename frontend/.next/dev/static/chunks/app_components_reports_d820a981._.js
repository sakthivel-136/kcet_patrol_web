(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/reports/roundtime.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/components/reports/roundtime.ts
__turbopack_context__.s([
    "ROUND_TIMES",
    ()=>ROUND_TIMES
]);
const ROUND_TIMES = {
    1: {
        start: "12:00 AM",
        end: "1:00 AM"
    },
    2: {
        start: "1:00 AM",
        end: "2:00 AM"
    },
    3: {
        start: "2:00 AM",
        end: "3:00 AM"
    },
    4: {
        start: "3:00 AM",
        end: "4:00 AM"
    },
    5: {
        start: "4:00 AM",
        end: "5:00 AM"
    },
    6: {
        start: "5:00 AM",
        end: "6:00 AM"
    },
    7: {
        start: "6:00 AM",
        end: "7:00 AM"
    },
    8: {
        start: "7:00 AM",
        end: "8:00 AM"
    },
    9: {
        start: "8:00 AM",
        end: "9:00 AM"
    },
    10: {
        start: "9:00 AM",
        end: "10:00 AM"
    },
    11: {
        start: "10:00 AM",
        end: "11:00 AM"
    },
    12: {
        start: "11:00 AM",
        end: "12:00 PM"
    },
    13: {
        start: "12:00 PM",
        end: "1:00 PM"
    },
    14: {
        start: "1:00 PM",
        end: "2:00 PM"
    },
    15: {
        start: "2:00 PM",
        end: "3:00 PM"
    },
    16: {
        start: "3:00 PM",
        end: "4:00 PM"
    },
    17: {
        start: "4:00 PM",
        end: "5:00 PM"
    },
    18: {
        start: "5:00 PM",
        end: "6:00 PM"
    },
    19: {
        start: "6:00 PM",
        end: "7:00 PM"
    },
    20: {
        start: "7:00 PM",
        end: "8:00 PM"
    },
    21: {
        start: "8:00 PM",
        end: "9:00 PM"
    },
    22: {
        start: "9:00 PM",
        end: "10:00 PM"
    },
    23: {
        start: "10:00 PM",
        end: "11:00 PM"
    },
    24: {
        start: "11:00 PM",
        end: "12:00 AM"
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/reports/PatrolReportPDF.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/roundtime.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/logoBase64.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
// ================= Component =================
const PatrolReportPDF = ({ logs, campusCode, campusName, campusAddress, reportDate, generatedBy })=>{
    _s();
    // Prevent double generation (Strict Mode)
    const generatedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // ================= Auto Generate =================
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatrolReportPDF.useEffect": ()=>{
            // Already generated
            if (generatedRef.current) return;
            // No data
            if (!logs || logs.length === 0) return;
            // No rounds
            if (!Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUND_TIMES"]).length) return;
            // ✅ WAIT FOR USER NAME
            if (!generatedBy || generatedBy.trim() === "") return;
            generatedRef.current = true;
            generatePDF();
        }
    }["PatrolReportPDF.useEffect"], [
        logs,
        campusCode,
        campusName,
        campusAddress,
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
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        // Font
        doc.setFont("times", "bold");
        // Border
        drawBorder(doc);
        // ================= Header Drawer =================
        const drawHeader = (targetDoc, targetDate)=>{
            try {
                targetDoc.addImage(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_BASE64"], "JPEG", 14, 12, 28, 28);
            } catch (e) {
                console.warn("Could not load logo to PDF", e);
            }
            targetDoc.setTextColor(0, 0, 150);
            targetDoc.setFont("times", "bold");
            targetDoc.setFontSize(20);
            targetDoc.text("Security Patrol Report", width / 2, 20, {
                align: "center"
            });
            targetDoc.setFontSize(16);
            targetDoc.text(campusName.toUpperCase(), width / 2, 30, {
                align: "center"
            });
            targetDoc.setFont("times", "normal");
            targetDoc.setFontSize(11);
            // Address
            targetDoc.text(campusAddress, width / 2, 38, {
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
            Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUND_TIMES"]).forEach((r)=>{
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
                const time = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUND_TIMES"][round];
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
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
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
            // ================= Daily Guard Summary =================
            const dailyGuardMap = {};
            dayLogs.forEach((r)=>{
                const status = normalizeStatus(r.status);
                if (status === 'SUCCESS') {
                    const g = r.guard_name || 'Unknown';
                    if (!dailyGuardMap[g]) dailyGuardMap[g] = {
                        scanned: 0,
                        missed: 0
                    };
                    dailyGuardMap[g].scanned++;
                } else if (status === 'MISSED') {
                    const g = r.guard_name || 'Unknown';
                    if (!dailyGuardMap[g]) dailyGuardMap[g] = {
                        scanned: 0,
                        missed: 0
                    };
                    dailyGuardMap[g].missed++;
                }
            });
            const dailySummaryRows = Object.entries(dailyGuardMap).filter(([name, stats])=>name !== 'Unknown' || stats.scanned > 0 || stats.missed > 0).map(([name, stats])=>{
                const total = stats.scanned + stats.missed;
                const pct = total > 0 ? Math.round(stats.scanned / total * 100) : 0;
                return [
                    name,
                    String(stats.scanned),
                    String(stats.missed),
                    String(total),
                    `${pct}%`
                ];
            });
            if (dailySummaryRows.length > 0) {
                if (y > height - 60) {
                    doc.addPage();
                    drawBorder(doc);
                    y = 20;
                } else {
                    y += 8; // add a little extra padding before the summary
                }
                doc.setFont("times", "bold");
                doc.setFontSize(13);
                doc.setTextColor(0, 0, 150);
                doc.text(`Daily Performance Summary (${d})`, 14, y);
                y += 6;
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
                    startY: y,
                    head: [
                        [
                            "Guard Name",
                            "Successful Scans",
                            "Missed Scans",
                            "Total Assigned",
                            "Success Rate"
                        ]
                    ],
                    body: dailySummaryRows,
                    theme: "grid",
                    styles: {
                        font: "times",
                        fontSize: 10,
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
                    columnStyles: {
                        1: {
                            halign: 'center'
                        },
                        2: {
                            halign: 'center'
                        },
                        3: {
                            halign: 'center'
                        },
                        4: {
                            halign: 'center'
                        }
                    },
                    didParseCell: (data)=>{
                        if (data.section === "body") {
                            if (data.column.index === 4) {
                                const pct = parseInt(String(data.cell.raw));
                                if (pct >= 90) {
                                    data.cell.styles.textColor = [
                                        0,
                                        150,
                                        0
                                    ];
                                    data.cell.styles.fontStyle = "bold";
                                } else if (pct >= 70) {
                                    data.cell.styles.textColor = [
                                        200,
                                        150,
                                        0
                                    ];
                                    data.cell.styles.fontStyle = "bold";
                                } else {
                                    data.cell.styles.textColor = [
                                        200,
                                        0,
                                        0
                                    ];
                                    data.cell.styles.fontStyle = "bold";
                                }
                            }
                        }
                    },
                    didDrawPage: ()=>drawBorder(doc)
                });
                y = doc.lastAutoTable.finalY + 12;
            }
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
        doc.save(`Patrol_Report_${campusCode}_${reportDate}.pdf`);
    };
    return null;
};
_s(PatrolReportPDF, "PvjwT8AiJnH7WnUwLhRUhvCpFq0=");
_c = PatrolReportPDF;
const __TURBOPACK__default__export__ = PatrolReportPDF;
var _c;
__turbopack_context__.k.register(_c, "PatrolReportPDF");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/reports/ReportTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-client] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/roundtime.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
// ===============================
// Component
// ===============================
const ReportTable = ({ logs, loading })=>{
    _s();
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
    const [sortConfig, setSortConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        key: "scan_time",
        direction: "desc"
    });
    // -------------------------------
    // Pagination Per Round
    // -------------------------------
    const [pages, setPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
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
    const validLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportTable.useMemo[validLogs]": ()=>{
            return logs.filter({
                "ReportTable.useMemo[validLogs]": (log)=>log.round >= 1 && log.round <= 24
            }["ReportTable.useMemo[validLogs]"]);
        }
    }["ReportTable.useMemo[validLogs]"], [
        logs
    ]);
    // -------------------------------
    // Sort Data
    // -------------------------------
    const sortedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportTable.useMemo[sortedData]": ()=>{
            return [
                ...validLogs
            ].sort({
                "ReportTable.useMemo[sortedData]": (a, b)=>{
                    const aValue = a[sortConfig.key];
                    const bValue = b[sortConfig.key];
                    if (sortConfig.key === "scan_time") {
                        const dateA = aValue ? new Date(aValue.replace(' ', 'T')).getTime() : 0;
                        const dateB = bValue ? new Date(bValue.replace(' ', 'T')).getTime() : 0;
                        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
                    }
                    if (!aValue || !bValue) return 0;
                    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                    return 0;
                }
            }["ReportTable.useMemo[sortedData]"]);
        }
    }["ReportTable.useMemo[sortedData]"], [
        validLogs,
        sortConfig
    ]);
    // -------------------------------
    // Group By Round
    // -------------------------------
    const logsByRound = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ReportTable.useMemo[logsByRound]": ()=>{
            const grouped = {};
            sortedData.forEach({
                "ReportTable.useMemo[logsByRound]": (log)=>{
                    const r = log.round || 1;
                    if (!grouped[r]) grouped[r] = [];
                    grouped[r].push(log);
                }
            }["ReportTable.useMemo[logsByRound]"]);
            return grouped;
        }
    }["ReportTable.useMemo[logsByRound]"], [
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
            // Safari requires strict ISO8601 (replace space with T)
            const safeValue = value.replace(' ', 'T');
            const d = new Date(safeValue);
            return isNaN(d.getTime()) ? String(value) : d.toLocaleString();
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `px-2 py-1 rounded-full text-xs font-semibold ${color}`,
                children: finalStatus
            }, void 0, false, {
                fileName: "[project]/app/components/reports/ReportTable.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0));
        }
        return value ?? "—";
    };
    // -------------------------------
    // Loading / Empty
    // -------------------------------
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-6 text-slate-500",
            children: "Loading scan logs..."
        }, void 0, false, {
            fileName: "[project]/app/components/reports/ReportTable.tsx",
            lineNumber: 284,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (!validLogs.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-6 text-slate-500",
            children: "No scan records found"
        }, void 0, false, {
            fileName: "[project]/app/components/reports/ReportTable.tsx",
            lineNumber: 292,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // ===============================
    // UI
    // ===============================
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: Object.keys(logsByRound).sort((a, b)=>Number(a) - Number(b)).map((roundKey)=>{
            const roundNumber = Number(roundKey);
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUND_TIMES"][roundNumber]) return null;
            const roundLogs = logsByRound[roundNumber];
            // Pagination
            const page = getPage(roundNumber);
            const totalPages = Math.ceil(roundLogs.length / rowsPerPage);
            const indexOfLastRow = page * rowsPerPage;
            const indexOfFirstRow = indexOfLastRow - rowsPerPage;
            const currentRows = roundLogs.slice(indexOfFirstRow, indexOfLastRow);
            // Round time
            const roundTime = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$roundtime$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUND_TIMES"][roundNumber];
            const startTime = roundTime?.start ?? "-";
            const endTime = roundTime?.end ?? "-";
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto glass-panel rounded-2xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
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
                        lineNumber: 347,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full divide-y divide-slate-200/50 bg-white/50 backdrop-blur-sm rounded-xl overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-slate-50/50",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: columns.map((col)=>{
                                        const isActive = sortConfig.key === col.key;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            onClick: ()=>handleSort(col.key),
                                            className: `px-6 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none
                            ${isActive ? "bg-blue-100 text-blue-700" : "text-slate-500 hover:bg-slate-100"}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    col.label,
                                                    isActive ? sortConfig.direction === "asc" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 384,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
                                                        className: "w-3 h-3 opacity-30"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 391,
                                                        columnNumber: 31
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                lineNumber: 377,
                                                columnNumber: 27
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, String(col.key), false, {
                                            fileName: "[project]/app/components/reports/ReportTable.tsx",
                                            lineNumber: 366,
                                            columnNumber: 25
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/app/components/reports/ReportTable.tsx",
                                    lineNumber: 358,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 356,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-slate-200/50",
                                children: currentRows.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-white/60 transition-colors",
                                        children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-6 py-4 whitespace-nowrap text-sm text-slate-700",
                                                children: renderCell(row, col.key)
                                            }, String(col.key), false, {
                                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                lineNumber: 418,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, `${row.qr_name}-${roundNumber}-${index}`, false, {
                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                        lineNumber: 411,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 407,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                        lineNumber: 353,
                        columnNumber: 15
                    }, ("TURBOPACK compile-time value", void 0)),
                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3 flex justify-between items-center px-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage(roundNumber, Math.max(1, page - 1)),
                                disabled: page === 1,
                                className: "px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50",
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 441,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-slate-600",
                                children: [
                                    "Page ",
                                    page,
                                    " of ",
                                    totalPages
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 454,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setPage(roundNumber, Math.min(totalPages, page + 1)),
                                disabled: page === totalPages,
                                className: "px-4 py-1 border rounded shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50",
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/app/components/reports/ReportTable.tsx",
                                lineNumber: 459,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                        lineNumber: 439,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, roundKey, true, {
                fileName: "[project]/app/components/reports/ReportTable.tsx",
                lineNumber: 341,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/app/components/reports/ReportTable.tsx",
        lineNumber: 303,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ReportTable, "QdygKN4TUWBJuUBdIazf8IKwmzo=");
_c = ReportTable;
const __TURBOPACK__default__export__ = ReportTable;
var _c;
__turbopack_context__.k.register(_c, "ReportTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_components_reports_d820a981._.js.map