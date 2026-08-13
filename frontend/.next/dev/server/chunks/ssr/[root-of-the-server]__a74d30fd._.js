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
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

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
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/app/utils/apiUrl.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiUrl",
    ()=>getApiUrl
]);
const getApiUrl = ()=>{
    const envUrl = ("TURBOPACK compile-time value", "http://127.0.0.1:8000");
    if ("TURBOPACK compile-time truthy", 1) {
        return envUrl;
    }
    //TURBOPACK unreachable
    ;
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
===================================================== */ async function fetchPatrolReportData(campusCode, reportDate, endDate) {
    try {
        const response = await api.get("/report/download", {
            params: {
                campus_code: campusCode,
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
        console.error("Error fetching patrol report full details:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        throw new Error(error.response?.data?.message || "Unable to fetch patrol report");
    }
}
async function getPatrolReport(campusCode, reportDate, endDate) {
    return fetchPatrolReportData(campusCode, reportDate, endDate);
}
async function getPatrolReportPDF(campusCode, reportDate, endDate) {
    const items = await fetchPatrolReportData(campusCode, reportDate, endDate);
    return {
        campus_code: campusCode,
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
}),
"[project]/app/components/reports/logoBase64.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOGO_BASE64",
    ()=>LOGO_BASE64
]);
const LOGO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QC+RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABgAAAAAQAAAGAAAAABAAaQAAAHAAAABDAyMTCRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAf//AACgAgADAAAAAQEsAACgAwADAAAAAQBkAAAAAAAAAAD/4Q8daHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+DQoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4NCgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIj4NCgkJCTxBdHRyaWI6QWRzPg0KCQkJCTxyZGY6U2VxPg0KCQkJCQk8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4NCgkJCQkJCTxBdHRyaWI6Q3JlYXRlZD4yMDI2LTAxLTI4PC9BdHRyaWI6Q3JlYXRlZD4NCgkJCQkJCTxBdHRyaWI6RGF0YT57ImRvYyI6IkRBR19zYXh6RzlzIiwidXNlciI6IlVBRjNVXzQ0akhnIiwiYnJhbmQiOiJrYW1hcmFqIGNvbGxlZ2Ugb2YgRW5naW5lZXJpbmcgYW5kIFRlY2hub2xvZ3kifTwvQXR0cmliOkRhdGE+DQoJCQkJCQk8QXR0cmliOkV4dElkPjY1OTBmMWVkLTc1MWUtNDAxMy05ZTI2LWJmNGYyZTk4YjM0NDwvQXR0cmliOkV4dElkPg0KCQkJCQkJPEF0dHJpYjpGYklkPjUyNTI2NTkxNDE3OTU4MDwvQXR0cmliOkZiSWQ+DQoJCQkJCQk8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPg0KCQkJCQk8L3JkZjpsaT4NCgkJCQk8L3JkZjpTZXE+DQoJCQk8L0F0dHJpYjpBZHM+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPg0KCQkJPGRjOnRpdGxlPg0KCQkJCTxyZGY6QWx0Pg0KCQkJCQk8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPktBTUFSQUogKDMwMCB4IDEwMCBweCkgLSAxPC9yZGY6bGk+DQoJCQkJPC9yZGY6QWx0Pg0KCQkJPC9kYzp0aXRsZT4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBkZj0iaHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyI+DQoJCQk8cGRmOkF1dGhvcj5ESEVFUEFLUkFKQS5TLlA8L3BkZjpBdXRob3I+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPg0KCQkJPHhtcDpDcmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpIGRvYz1EQUdfc2F4ekc5cyB1c2VyPVVBRjNVXzQ0akhnIGJyYW5kPWthbWFyYWogY29sbGVnZSBvZiBFbmdpbmVlcmluZyBhbmQgVGVjaG5vbG9neTwveG1wOkNyZWF0b3JUb29sPg0KCQk8L3JkZjpEZXNjcmlwdGlvbj4NCgk8L3JkZjpSREY+DQo8L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAWQEsAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQE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";
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/logoBase64.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
// ================= Component =================
const PatrolReportPDF = ({ logs, campusCode, campusName, campusAddress, reportDate, generatedBy })=>{
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
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$node$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        // Font
        doc.setFont("times", "bold");
        // Border
        drawBorder(doc);
        // ================= Header Drawer =================
        const drawHeader = (targetDoc, targetDate)=>{
            try {
                targetDoc.addImage(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOGO_BASE64"], "JPEG", 14, 12, 28, 28);
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
        doc.save(`Patrol_Report_${campusCode}_${reportDate}.pdf`);
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
        return logs.filter((log)=>log.round >= 1 && log.round <= 24);
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
                const dateA = aValue ? new Date(aValue.replace(' ', 'T')).getTime() : 0;
                const dateB = bValue ? new Date(bValue.replace(' ', 'T')).getTime() : 0;
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
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-6 text-slate-500",
            children: "Loading scan logs..."
        }, void 0, false, {
            fileName: "[project]/app/components/reports/ReportTable.tsx",
            lineNumber: 284,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (!validLogs.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        lineNumber: 347,
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
                                                        lineNumber: 384,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/reports/ReportTable.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 33
                                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-slate-200/50",
                                children: currentRows.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-white/60 transition-colors",
                                        children: columns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                                lineNumber: 441,
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
                                lineNumber: 454,
                                columnNumber: 19
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
const IconCampus = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
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
                        campusCode: FIXED_CAMPUS,
                        campusName: "KCET Main Campus",
                        campusAddress: "Virudhunagar",
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

//# sourceMappingURL=%5Broot-of-the-server%5D__a74d30fd._.js.map