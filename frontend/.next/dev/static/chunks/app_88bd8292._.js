(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/utils/apiUrl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiUrl",
    ()=>getApiUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const getApiUrl = ()=>{
    const envUrl = ("TURBOPACK compile-time value", "http://127.0.0.1:8000");
    if ("TURBOPACK compile-time truthy", 1) {
        return envUrl;
    }
    //TURBOPACK unreachable
    ;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/api/report.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPatrolReport",
    ()=>getPatrolReport,
    "getPatrolReportPDF",
    ()=>getPatrolReportPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/apiUrl.ts [app-client] (ecmascript)");
;
;
/* =====================================================
   API CONFIG
===================================================== */ const BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])();
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    timeout: 15000
});
// Attach JWT on every request
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem("access_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/services/token.service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return localStorage.getItem(TOKEN_KEY);
    },
    set (token) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.setItem(TOKEN_KEY, token);
        // 🔥 IMPORTANT: middleware can read cookies, not localStorage
        // Using the secure check from your original code for best practice
        const isSecure = window.location.protocol === "https:";
        document.cookie = `${TOKEN_KEY}=${token}; path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${isSecure ? "Secure;" : ""}`;
    },
    remove () {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("role");
        localStorage.removeItem("name");
        localStorage.removeItem("adminName");
        // Clear cookie
        document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Lax;`;
    }
};
const setUser = (user)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    localStorage.setItem("role", user.role);
    localStorage.setItem("adminName", user.username);
    localStorage.setItem("name", user.username);
};
const getUser = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const role = localStorage.getItem("role");
    const adminName = localStorage.getItem("adminName") || localStorage.getItem("name");
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !role || !adminName) return null;
    return {
        user_id: "",
        username: adminName,
        role: role
    };
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/services/auth.guard.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// app/services/auth.guard.ts
__turbopack_context__.s([
    "useAuthGuard",
    ()=>useAuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/token.service.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const useAuthGuard = (options)=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [authorized, setAuthorized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const checkAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAuthGuard.useCallback[checkAuth]": ()=>{
            const authenticated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAuthenticated"])();
            // 🔒 1. If not authenticated → redirect to login
            if (!authenticated) {
                setAuthorized(false);
                router.replace("/login");
                return;
            }
            // 🔐 2. If role-based access is required
            if (options?.allowedRoles) {
                const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUser"])();
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
        }
    }["useAuthGuard.useCallback[checkAuth]"], [
        router,
        options
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthGuard.useEffect": ()=>{
            checkAuth();
        }
    }["useAuthGuard.useEffect"], [
        checkAuth
    ]);
    return {
        authorized
    };
};
_s(useAuthGuard, "gCyWVxUCYTTGvzbvLIOxcERgcdU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/reports/logoBase64.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LOGO_BASE64",
    ()=>LOGO_BASE64
]);
const LOGO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QC+RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAITAAMAAAABAAEAAIdpAAQAAAABAAAAZgAAAAAAAABgAAAAAQAAAGAAAAABAAaQAAAHAAAABDAyMTCRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAf//AACgAgADAAAAAQEsAACgAwADAAAAAQBkAAAAAAAAAAD/4Q8daHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49J++7vycgaWQ9J1c1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCc/Pg0KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+DQoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4NCgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6QXR0cmliPSJodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvIj4NCgkJCTxBdHRyaWI6QWRzPg0KCQkJCTxyZGY6U2VxPg0KCQkJCQk8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4NCgkJCQkJCTxBdHRyaWI6Q3JlYXRlZD4yMDI2LTAxLTI4PC9BdHRyaWI6Q3JlYXRlZD4NCgkJCQkJCTxBdHRyaWI6RGF0YT57ImRvYyI6IkRBR19zYXh6RzlzIiwidXNlciI6IlVBRjNVXzQ0akhnIiwiYnJhbmQiOiJrYW1hcmFqIGNvbGxlZ2Ugb2YgRW5naW5lZXJpbmcgYW5kIFRlY2hub2xvZ3kifTwvQXR0cmliOkRhdGE+DQoJCQkJCQk8QXR0cmliOkV4dElkPjY1OTBmMWVkLTc1MWUtNDAxMy05ZTI2LWJmNGYyZTk4YjM0NDwvQXR0cmliOkV4dElkPg0KCQkJCQkJPEF0dHJpYjpGYklkPjUyNTI2NTkxNDE3OTU4MDwvQXR0cmliOkZiSWQ+DQoJCQkJCQk8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPg0KCQkJCQk8L3JkZjpsaT4NCgkJCQk8L3JkZjpTZXE+DQoJCQk8L0F0dHJpYjpBZHM+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPg0KCQkJPGRjOnRpdGxlPg0KCQkJCTxyZGY6QWx0Pg0KCQkJCQk8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPktBTUFSQUogKDMwMCB4IDEwMCBweCkgLSAxPC9yZGY6bGk+DQoJCQkJPC9yZGY6QWx0Pg0KCQkJPC9kYzp0aXRsZT4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBkZj0iaHR0cDovL25zLmFkb2JlLmNvbS9wZGYvMS4zLyI+DQoJCQk8cGRmOkF1dGhvcj5ESEVFUEFLUkFKQS5TLlA8L3BkZjpBdXRob3I+DQoJCTwvcmRmOkRlc2NyaXB0aW9uPg0KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPg0KCQkJPHhtcDpDcmVhdG9yVG9vbD5DYW52YSAoUmVuZGVyZXIpIGRvYz1EQUdfc2F4ekc5cyB1c2VyPVVBRjNVXzQ0akhnIGJyYW5kPWthbWFyYWogY29sbGVnZSBvZiBFbmdpbmVlcmluZyBhbmQgVGVjaG5vbG9neTwveG1wOkNyZWF0b3JUb29sPg0KCQk8L3JkZjpEZXNjcmlwdGlvbj4NCgk8L3JkZjpSREY+DQo8L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAWQEsAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQE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";
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$report$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/report.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf/dist/jspdf.es.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jspdf-autotable/dist/jspdf.plugin.autotable.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/auth.guard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/reports/logoBase64.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
/* ================================================================
   HELPERS
================================================================ */ function fmtTime(t) {
    if (!t) return '—';
    try {
        const safeT = t.replace(' ', 'T');
        const d = new Date(safeT);
        return isNaN(d.getTime()) ? t : d.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch  {
        return t;
    }
}
function exportDashboardPDF(statsData, campus, campusName, date, adminName) {
    const btn = document.getElementById('pdf-export-btn');
    if (btn) {
        btn.textContent = '⏳ Generating…';
        btn.setAttribute('disabled', 'true');
    }
    try {
        const doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2f$dist$2f$jspdf$2e$es$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]();
        const w = doc.internal.pageSize.getWidth();
        const h = doc.internal.pageSize.getHeight();
        const drawBorder = ()=>{
            doc.setDrawColor(0, 0, 180);
            doc.setLineWidth(0.8);
            doc.rect(8, 8, w - 16, h - 16);
        };
        drawBorder();
        // ========== HEADER ==========
        try {
            doc.addImage(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$reports$2f$logoBase64$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LOGO_BASE64"], "JPEG", 14, 12, 28, 28);
        } catch (e) {
            console.warn("Could not load logo", e);
        }
        doc.setFont('times', 'bold');
        doc.setTextColor(0, 0, 150);
        doc.setFontSize(20);
        doc.text('Security Patrol Analytics Report', w / 2, 22, {
            align: 'center'
        });
        doc.setFontSize(14);
        doc.text(campusName.toUpperCase(), w / 2, 32, {
            align: 'center'
        });
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 150);
        doc.text(`Date : ${date}`, 14, 44);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.text(`Generated By : ${adminName}`, 14, 51);
        doc.text(`Generated At : ${new Date().toLocaleString()}`, 14, 57);
        let y = 68;
        // ========== SUMMARY STATS ==========
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(0, 0, 150);
        doc.text('Summary Statistics', 14, y);
        y += 6;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
            startY: y,
            head: [
                [
                    'Metric',
                    'Value'
                ]
            ],
            body: [
                [
                    'Total Effective Scans',
                    String(statsData.total)
                ],
                [
                    'Completed',
                    `${statsData.completed} (${statsData.rate}%)`
                ],
                [
                    'Missed',
                    String(statsData.missed)
                ],
                [
                    'Pending (Not Due)',
                    String(statsData.pending)
                ],
                [
                    'Last Scan Time',
                    statsData.lastScan ? new Date(statsData.lastScan).toLocaleTimeString('en-IN') : '—'
                ]
            ],
            theme: 'grid',
            styles: {
                font: 'times',
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
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [
                    245,
                    248,
                    255
                ]
            },
            columnStyles: {
                0: {
                    fontStyle: 'bold',
                    cellWidth: 80
                }
            },
            didParseCell: (data)=>{
                if (data.section === 'body' && data.column.index === 1) {
                    if (data.row.index === 1) data.cell.styles.textColor = [
                        0,
                        150,
                        0
                    ];
                    if (data.row.index === 2) data.cell.styles.textColor = [
                        200,
                        0,
                        0
                    ];
                    if (data.row.index === 3) data.cell.styles.textColor = [
                        150,
                        120,
                        0
                    ];
                }
            },
            didDrawPage: ()=>drawBorder()
        });
        y = doc.lastAutoTable.finalY + 12;
        // ========== ROUND-BY-ROUND ==========
        if (statsData.roundSummary.length > 0) {
            if (y > h - 60) {
                doc.addPage();
                drawBorder();
                y = 20;
            }
            doc.setFont('times', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 150);
            doc.text('Round-by-Round Breakdown', 14, y);
            y += 6;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
                startY: y,
                head: [
                    [
                        'Round',
                        'Completed',
                        'Missed',
                        'Total',
                        'Rate'
                    ]
                ],
                body: statsData.roundSummary.map((r)=>[
                        r.round,
                        String(r.completed),
                        String(r.missed),
                        String(r.completed + r.missed),
                        `${r.completed + r.missed > 0 ? Math.round(r.completed / (r.completed + r.missed) * 100) : 0}%`
                    ]),
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 9,
                    cellPadding: 2.5,
                    halign: 'center'
                },
                headStyles: {
                    fillColor: [
                        0,
                        70,
                        160
                    ],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [
                        245,
                        248,
                        255
                    ]
                },
                didParseCell: (data)=>{
                    if (data.section === 'body') {
                        if (data.column.index === 1) data.cell.styles.textColor = [
                            0,
                            150,
                            0
                        ];
                        if (data.column.index === 2 && Number(data.cell.raw) > 0) data.cell.styles.textColor = [
                            200,
                            0,
                            0
                        ];
                    }
                },
                didDrawPage: ()=>drawBorder()
            });
            y = doc.lastAutoTable.finalY + 12;
        }
        // ========== SCAN POINT COVERAGE ==========
        if (statsData.coverageByPoint.length > 0) {
            if (y > h - 60) {
                doc.addPage();
                drawBorder();
                y = 20;
            }
            doc.setFont('times', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 150);
            doc.text('Scan Point Coverage', 14, y);
            y += 6;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
                startY: y,
                head: [
                    [
                        'Scan Point',
                        'Completed',
                        'Missed',
                        'Coverage %'
                    ]
                ],
                body: statsData.coverageByPoint.map((p)=>{
                    const pct = p.total ? Math.round(p.done / p.total * 100) : 0;
                    return [
                        p.name,
                        String(p.done),
                        String(p.total - p.done),
                        `${pct}%`
                    ];
                }),
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 9,
                    cellPadding: 2.5
                },
                headStyles: {
                    fillColor: [
                        0,
                        70,
                        160
                    ],
                    textColor: 255,
                    fontStyle: 'bold'
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
                    }
                },
                didParseCell: (data)=>{
                    if (data.section === 'body' && data.column.index === 3) {
                        const pct = parseInt(String(data.cell.raw));
                        if (pct >= 80) data.cell.styles.textColor = [
                            0,
                            150,
                            0
                        ];
                        else if (pct >= 50) data.cell.styles.textColor = [
                            200,
                            150,
                            0
                        ];
                        else data.cell.styles.textColor = [
                            200,
                            0,
                            0
                        ];
                        data.cell.styles.fontStyle = 'bold';
                    }
                },
                didDrawPage: ()=>drawBorder()
            });
            y = doc.lastAutoTable.finalY + 12;
        }
        // ========== GUARD LEADERBOARD ==========
        if (statsData.guardLeaderboard.length > 0) {
            if (y > h - 60) {
                doc.addPage();
                drawBorder();
                y = 20;
            }
            doc.setFont('times', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 150);
            doc.text('Guard Performance', 14, y);
            y += 6;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
                startY: y,
                head: [
                    [
                        'Rank',
                        'Guard Name',
                        'Scanned',
                        'Missed',
                        'Total',
                        'Rate'
                    ]
                ],
                body: statsData.guardLeaderboard.map((g, i)=>[
                        `#${i + 1}`,
                        g.name,
                        String(g.scanned),
                        String(g.missed),
                        String(g.total),
                        `${g.total ? Math.round(g.scanned / g.total * 100) : 0}%`
                    ]),
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 9,
                    cellPadding: 2.5
                },
                headStyles: {
                    fillColor: [
                        0,
                        70,
                        160
                    ],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [
                        245,
                        248,
                        255
                    ]
                },
                columnStyles: {
                    0: {
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
                    },
                    5: {
                        halign: 'center'
                    }
                },
                didParseCell: (data)=>{
                    if (data.section === 'body' && data.column.index === 5) {
                        const pct = parseInt(String(data.cell.raw));
                        if (pct >= 90) data.cell.styles.textColor = [
                            0,
                            150,
                            0
                        ];
                        else if (pct >= 70) data.cell.styles.textColor = [
                            200,
                            150,
                            0
                        ];
                        else data.cell.styles.textColor = [
                            200,
                            0,
                            0
                        ];
                        data.cell.styles.fontStyle = 'bold';
                    }
                },
                didDrawPage: ()=>drawBorder()
            });
            y = doc.lastAutoTable.finalY + 12;
        }
        // ========== RECENT ACTIVITY ==========
        if (statsData.recentActivity.length > 0) {
            if (y > h - 60) {
                doc.addPage();
                drawBorder();
                y = 20;
            }
            doc.setFont('times', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(0, 0, 150);
            doc.text('Recent Scan Activity (Last 10)', 14, y);
            y += 6;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jspdf$2d$autotable$2f$dist$2f$jspdf$2e$plugin$2e$autotable$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(doc, {
                startY: y,
                head: [
                    [
                        'Time',
                        'Guard',
                        'QR Point',
                        'Round',
                        'Status'
                    ]
                ],
                body: statsData.recentActivity.map((r)=>[
                        r.scan_time ? new Date(r.scan_time).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : '—',
                        r.guard_name || '—',
                        r.qr_name,
                        `Round ${r.round}`,
                        r.status
                    ]),
                theme: 'grid',
                styles: {
                    font: 'times',
                    fontSize: 9,
                    cellPadding: 2.5
                },
                headStyles: {
                    fillColor: [
                        0,
                        70,
                        160
                    ],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [
                        245,
                        248,
                        255
                    ]
                },
                didParseCell: (data)=>{
                    if (data.section === 'body' && data.column.index === 4) {
                        if (data.cell.raw === 'SUCCESS') {
                            data.cell.styles.textColor = [
                                0,
                                150,
                                0
                            ];
                            data.cell.styles.fontStyle = 'bold';
                        }
                        if (data.cell.raw === 'MISSED') {
                            data.cell.styles.textColor = [
                                200,
                                0,
                                0
                            ];
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                },
                didDrawPage: ()=>drawBorder()
            });
        }
        // ========== FOOTER ON ALL PAGES ==========
        const pages = doc.getNumberOfPages();
        for(let i = 1; i <= pages; i++){
            doc.setPage(i);
            doc.setFont('times', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(`Page ${i} of ${pages} | KCET Security Rounds`, w / 2, h - 12, {
                align: 'center'
            });
        }
        doc.save(`Analytics_Report_${campus}_${date}.pdf`);
    } catch (err) {
        console.error('PDF export error:', err);
        alert('Failed to generate PDF. Please try again.');
    } finally{
        if (btn) {
            btn.textContent = '📊 Export PDF';
            btn.removeAttribute('disabled');
        }
    }
}
/* ================================================================
   STAT CARD
================================================================ */ function StatCard({ label, value, sub, color, bg, icon }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "glass-panel rounded-3xl p-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute left-0 top-0 h-full w-1.5 ${bg}`
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pl-3 relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-semibold uppercase tracking-widest text-slate-500",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 294,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `mt-1.5 text-2xl font-bold ${color}`,
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 295,
                        columnNumber: 9
                    }, this),
                    sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-0.5 text-xs font-medium text-slate-400",
                        children: sub
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 296,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this),
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-[-10%] top-[-10%] opacity-[0.03] text-8xl group-hover:scale-110 transition-transform duration-500 pointer-events-none select-none",
                children: icon
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 298,
                columnNumber: 16
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 291,
        columnNumber: 5
    }, this);
}
_c = StatCard;
/* ================================================================
   PROGRESS BAR (for scan point coverage)
================================================================ */ function CoverageBar({ name, done, total }) {
    const pct = total ? Math.round(done / total * 100) : 0;
    const color = pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-rose-500';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mb-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-medium text-slate-600 truncate max-w-[180px]",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 312,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-xs font-bold ${pct === 100 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-rose-600'}`,
                        children: [
                            pct,
                            "%"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 313,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 311,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-2 w-full bg-slate-100 rounded-full overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `h-full rounded-full ${color} transition-all duration-700`,
                    style: {
                        width: `${pct}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 316,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 315,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 310,
        columnNumber: 5
    }, this);
}
_c1 = CoverageBar;
/* ================================================================
   GUARD LEADERBOARD ROW
================================================================ */ function LeaderRow({ rank, name, scanned, missed, total }) {
    const pct = total ? Math.round(scanned / total * 100) : 0;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
    const color = pct >= 90 ? 'text-emerald-600 bg-emerald-50' : pct >= 70 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-8 text-center text-lg",
                children: medal
            }, void 0, false, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 333,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-semibold text-slate-700 truncate",
                                children: name
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 336,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs font-bold px-2 py-0.5 rounded-full ${color}`,
                                children: [
                                    pct,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 bg-slate-100 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-full rounded-full transition-all duration-700 ${pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-400' : 'bg-rose-500'}`,
                            style: {
                                width: `${pct}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-400 mt-0.5",
                        children: [
                            scanned,
                            " scanned · ",
                            missed,
                            " missed"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/dashboard/page.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 332,
        columnNumber: 5
    }, this);
}
_c2 = LeaderRow;
function DashboardPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { authorized } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthGuard"])({
        allowedRoles: [
            'ADMIN'
        ]
    });
    // Fix today to use local time properly instead of UTC
    const today = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardPage.useMemo[today]": ()=>{
            const d = new Date();
            const offset = d.getTimezoneOffset() * 60000;
            return new Date(d.getTime() - offset).toISOString().slice(0, 10);
        }
    }["DashboardPage.useMemo[today]"], []);
    const dashboardContentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [adminName, setAdminName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const FIXED_CAMPUS = 'KCET01';
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(today);
    const [report, setReport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    /* auth check */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            if (authorized) {
                const name = localStorage.getItem('adminName') || '';
                setAdminName(name);
            }
        }
    }["DashboardPage.useEffect"], [
        authorized
    ]);
    const fetchReport = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "DashboardPage.useCallback[fetchReport]": ()=>{
            if (!authorized || !selectedDate) return;
            setLoading(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$report$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPatrolReport"])(FIXED_CAMPUS, selectedDate).then({
                "DashboardPage.useCallback[fetchReport]": (data)=>{
                    setReport(data);
                    setLastUpdated(new Date().toLocaleTimeString());
                }
            }["DashboardPage.useCallback[fetchReport]"]).catch({
                "DashboardPage.useCallback[fetchReport]": ()=>setReport([])
            }["DashboardPage.useCallback[fetchReport]"]).finally({
                "DashboardPage.useCallback[fetchReport]": ()=>setLoading(false)
            }["DashboardPage.useCallback[fetchReport]"]);
        }
    }["DashboardPage.useCallback[fetchReport]"], [
        selectedDate,
        authorized
    ]);
    /* auto-fetch when campus/date changes */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardPage.useEffect": ()=>{
            fetchReport();
        }
    }["DashboardPage.useEffect"], [
        fetchReport
    ]);
    /* ================================================================
     COMPUTED STATS (time-aware)
  ================================================================ */ const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DashboardPage.useMemo[stats]": ()=>{
            const empty = {
                total: 0,
                completed: 0,
                missed: 0,
                pending: 0,
                rate: 0,
                lastScan: null,
                pie: [],
                roundSummary: [],
                guardLeaderboard: [],
                coverageByPoint: [],
                hourlyActivity: [],
                recentActivity: [],
                isPartialDay: false,
                nothingScannedToday: false
            };
            if (!report.length) return empty;
            const isToday = selectedDate === today;
            const ROUND_TIMES = [
                "00:00",
                "01:00",
                "02:00",
                "03:00",
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
                "18:00",
                "19:00",
                "20:00",
                "21:00",
                "22:00",
                "23:00"
            ];
            let dueRoundsCount = ROUND_TIMES.length;
            if (isToday) {
                const now = new Date();
                const currentHour = now.getHours();
                const currentMinute = now.getMinutes();
                dueRoundsCount = 0;
                for(let i = 0; i < ROUND_TIMES.length; i++){
                    const [h, m] = ROUND_TIMES[i].split(':').map(Number);
                    if (currentHour > h || currentHour === h && currentMinute >= m) {
                        dueRoundsCount = i + 1;
                    } else {
                        break;
                    }
                }
            }
            const scannedRounds = report.filter({
                "DashboardPage.useMemo[stats].scannedRounds": (r)=>r.scan_time !== null
            }["DashboardPage.useMemo[stats].scannedRounds"]).map({
                "DashboardPage.useMemo[stats].scannedRounds": (r)=>r.round
            }["DashboardPage.useMemo[stats].scannedRounds"]);
            const maxScannedRound = scannedRounds.length ? Math.max(...scannedRounds) : 0;
            const nothingScannedToday = isToday && maxScannedRound === 0;
            const isPartialDay = isToday && dueRoundsCount < ROUND_TIMES.length;
            const effective = isToday ? report.filter({
                "DashboardPage.useMemo[stats]": (r)=>r.round <= dueRoundsCount || r.status === 'SUCCESS'
            }["DashboardPage.useMemo[stats]"]) : report;
            const pending = report.length - effective.length;
            /* ── base stats ── */ const completed = effective.filter({
                "DashboardPage.useMemo[stats]": (r)=>r.status === 'SUCCESS'
            }["DashboardPage.useMemo[stats]"]).length;
            const missed = nothingScannedToday ? 0 : effective.filter({
                "DashboardPage.useMemo[stats]": (r)=>r.status === 'MISSED'
            }["DashboardPage.useMemo[stats]"]).length;
            const total = completed + missed;
            const rate = total ? Math.round(completed / total * 100) : 0;
            /* ── last scan time ── */ const scanTimes = effective.filter({
                "DashboardPage.useMemo[stats].scanTimes": (r)=>r.scan_time
            }["DashboardPage.useMemo[stats].scanTimes"]).map({
                "DashboardPage.useMemo[stats].scanTimes": (r)=>r.scan_time
            }["DashboardPage.useMemo[stats].scanTimes"]).sort();
            const lastScan = scanTimes.length ? scanTimes[scanTimes.length - 1] : null;
            /* ── pie ── */ const pie = [
                {
                    name: 'Completed',
                    value: completed,
                    color: '#6366f1'
                },
                {
                    name: 'Missed',
                    value: missed,
                    color: '#f43f5e'
                },
                ...pending > 0 ? [
                    {
                        name: 'Not Due Yet',
                        value: pending,
                        color: '#94a3b8'
                    }
                ] : []
            ];
            /* ── rounds summary ── */ const roundNums = [
                ...new Set(effective.map({
                    "DashboardPage.useMemo[stats].roundNums": (r)=>r.round
                }["DashboardPage.useMemo[stats].roundNums"]))
            ].sort({
                "DashboardPage.useMemo[stats].roundNums": (a, b)=>a - b
            }["DashboardPage.useMemo[stats].roundNums"]);
            const roundSummary = nothingScannedToday ? [] : roundNums.map({
                "DashboardPage.useMemo[stats]": (rnd)=>{
                    const items = effective.filter({
                        "DashboardPage.useMemo[stats].items": (r)=>r.round === rnd
                    }["DashboardPage.useMemo[stats].items"]);
                    return {
                        round: `R${rnd}`,
                        completed: items.filter({
                            "DashboardPage.useMemo[stats]": (i)=>i.status === 'SUCCESS'
                        }["DashboardPage.useMemo[stats]"]).length,
                        missed: items.filter({
                            "DashboardPage.useMemo[stats]": (i)=>i.status !== 'SUCCESS'
                        }["DashboardPage.useMemo[stats]"]).length
                    };
                }
            }["DashboardPage.useMemo[stats]"]);
            /* ── guard leaderboard with smart missed-scan assignment ── */ const guardMap = {};
            roundNums.forEach({
                "DashboardPage.useMemo[stats]": (rnd)=>{
                    const roundScans = effective.filter({
                        "DashboardPage.useMemo[stats].roundScans": (r)=>r.round === rnd
                    }["DashboardPage.useMemo[stats].roundScans"]);
                    const guardsInRound = [
                        ...new Set(roundScans.filter({
                            "DashboardPage.useMemo[stats]": (r)=>r.status === 'SUCCESS' && r.guard_name
                        }["DashboardPage.useMemo[stats]"]).map({
                            "DashboardPage.useMemo[stats]": (r)=>r.guard_name
                        }["DashboardPage.useMemo[stats]"]))
                    ];
                    const assignedGuard = guardsInRound.length > 0 ? guardsInRound[0] : null;
                    roundScans.forEach({
                        "DashboardPage.useMemo[stats]": (r)=>{
                            if (r.status === 'SUCCESS') {
                                const g = r.guard_name || 'Unknown';
                                if (!guardMap[g]) guardMap[g] = {
                                    scanned: 0,
                                    missed: 0
                                };
                                guardMap[g].scanned++;
                            } else if (!nothingScannedToday) {
                                const g = assignedGuard || 'Unknown';
                                if (!guardMap[g]) guardMap[g] = {
                                    scanned: 0,
                                    missed: 0
                                };
                                guardMap[g].missed++;
                            }
                        }
                    }["DashboardPage.useMemo[stats]"]);
                }
            }["DashboardPage.useMemo[stats]"]);
            const guardLeaderboard = Object.entries(guardMap).filter({
                "DashboardPage.useMemo[stats].guardLeaderboard": ([n, d])=>n !== 'Unknown' || d.scanned > 0
            }["DashboardPage.useMemo[stats].guardLeaderboard"]).map({
                "DashboardPage.useMemo[stats].guardLeaderboard": ([name, d])=>({
                        name,
                        ...d,
                        total: d.scanned + d.missed
                    })
            }["DashboardPage.useMemo[stats].guardLeaderboard"]).sort({
                "DashboardPage.useMemo[stats].guardLeaderboard": (a, b)=>b.scanned / (b.total || 1) - a.scanned / (a.total || 1)
            }["DashboardPage.useMemo[stats].guardLeaderboard"]);
            /* ── scan point coverage (progress bars) ── */ const pointMap = {};
            effective.forEach({
                "DashboardPage.useMemo[stats]": (r)=>{
                    if (!pointMap[r.qr_name]) pointMap[r.qr_name] = {
                        done: 0,
                        total: 0
                    };
                    pointMap[r.qr_name].total++;
                    if (r.status === 'SUCCESS') pointMap[r.qr_name].done++;
                }
            }["DashboardPage.useMemo[stats]"]);
            const coverageByPoint = Object.entries(pointMap).map({
                "DashboardPage.useMemo[stats].coverageByPoint": ([name, v])=>({
                        name,
                        ...v
                    })
            }["DashboardPage.useMemo[stats].coverageByPoint"]).sort({
                "DashboardPage.useMemo[stats].coverageByPoint": (a, b)=>a.done / a.total - b.done / b.total
            }["DashboardPage.useMemo[stats].coverageByPoint"]) // worst first
            ;
            /* ── hourly activity (group by round start hour, not raw scan time) ── */ const hourMap = {};
            effective.filter({
                "DashboardPage.useMemo[stats]": (r)=>r.scan_time && r.status === 'SUCCESS'
            }["DashboardPage.useMemo[stats]"]).forEach({
                "DashboardPage.useMemo[stats]": (r)=>{
                    // Use the round's start hour instead of raw scan_time hour
                    const roundIdx = r.round - 1;
                    if (roundIdx >= 0 && roundIdx < ROUND_TIMES.length) {
                        const h = parseInt(ROUND_TIMES[roundIdx].split(':')[0]);
                        hourMap[h] = (hourMap[h] || 0) + 1;
                    } else {
                        const h = new Date(r.scan_time).getHours();
                        hourMap[h] = (hourMap[h] || 0) + 1;
                    }
                }
            }["DashboardPage.useMemo[stats]"]);
            const hourlyActivity = Array.from({
                length: 24
            }, {
                "DashboardPage.useMemo[stats].hourlyActivity": (_, h)=>({
                        hour: `${String(h).padStart(2, '0')}:00`,
                        scans: hourMap[h] || 0
                    })
            }["DashboardPage.useMemo[stats].hourlyActivity"]).filter({
                "DashboardPage.useMemo[stats].hourlyActivity": (h)=>h.scans > 0 || Object.keys(hourMap).length === 0
            }["DashboardPage.useMemo[stats].hourlyActivity"]);
            /* ── recent activity feed (last 10 successful scans) ── */ const recentActivity = effective.filter({
                "DashboardPage.useMemo[stats].recentActivity": (r)=>r.status === 'SUCCESS' && r.scan_time
            }["DashboardPage.useMemo[stats].recentActivity"]).sort({
                "DashboardPage.useMemo[stats].recentActivity": (a, b)=>(b.scan_time || '').localeCompare(a.scan_time || '')
            }["DashboardPage.useMemo[stats].recentActivity"]).slice(0, 10);
            return {
                total,
                completed,
                missed,
                pending,
                rate,
                lastScan,
                pie,
                roundSummary,
                guardLeaderboard,
                coverageByPoint,
                hourlyActivity,
                recentActivity,
                isPartialDay,
                nothingScannedToday
            };
        }
    }["DashboardPage.useMemo[stats]"], [
        report,
        selectedDate,
        today
    ]);
    const selectedCampusName = "KCET Main Campus";
    if (!authorized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-white min-h-screen bg-[#07071f] flex items-center justify-center",
            children: "Checking access..."
        }, void 0, false, {
            fileName: "[project]/app/dashboard/page.tsx",
            lineNumber: 539,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen relative font-sans text-slate-900",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-3xl font-bold tracking-tight text-slate-900",
                                    children: "Analytics Dashboard"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 549,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-1 text-slate-500 text-sm",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-indigo-600",
                                            children: selectedCampusName
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 551,
                                            columnNumber: 15
                                        }, this),
                                        ' · ',
                                        "Patrol performance overview",
                                        lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 text-emerald-600 font-medium",
                                            children: [
                                                "· Updated ",
                                                lastUpdated
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 554,
                                            columnNumber: 31
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 550,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 548,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-sm text-slate-500",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 rounded-full bg-emerald-500"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 558,
                                    columnNumber: 13
                                }, this),
                                adminName
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 557,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 547,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "glass-panel rounded-3xl p-5 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-end gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-[140px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-semibold text-slate-500 uppercase tracking-wider",
                                        children: "Date"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 570,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: selectedDate,
                                        onChange: (e)=>setSelectedDate(e.target.value),
                                        className: "w-full mt-2 pl-3 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 571,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 569,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchReport,
                                disabled: loading,
                                className: "bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors",
                                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 583,
                                            columnNumber: 21
                                        }, this),
                                        "Loading…"
                                    ]
                                }, void 0, true) : '📊 Load'
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 578,
                                columnNumber: 13
                            }, this),
                            report.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                id: "pdf-export-btn",
                                onClick: ()=>exportDashboardPDF(stats, FIXED_CAMPUS, selectedCampusName, selectedDate, adminName),
                                className: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors",
                                children: "📊 Export PDF"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 591,
                                columnNumber: 15
                            }, this),
                            report.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push('/report-download'),
                                className: "border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm transition-colors",
                                children: "📄 Full Report"
                            }, void 0, false, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 602,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/dashboard/page.tsx",
                        lineNumber: 565,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 564,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: dashboardContentRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 xl:grid-cols-5 gap-4 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    label: "Effective Scans",
                                    value: stats.total,
                                    sub: "Rounds due so far",
                                    color: "text-indigo-600",
                                    bg: "bg-indigo-500",
                                    icon: "📋"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 617,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    label: "Completed",
                                    value: stats.completed,
                                    sub: `${stats.rate}% rate`,
                                    color: "text-emerald-600",
                                    bg: "bg-emerald-500",
                                    icon: "✅"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 618,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    label: "Missed",
                                    value: stats.missed,
                                    sub: "Truly skipped",
                                    color: "text-rose-600",
                                    bg: "bg-rose-500",
                                    icon: "⚠️"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 619,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    label: "Not Due Yet",
                                    value: stats.pending ?? 0,
                                    sub: "Future rounds",
                                    color: "text-slate-500",
                                    bg: "bg-slate-400",
                                    icon: "🕐"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 620,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatCard, {
                                    label: "Last Scan",
                                    value: stats.lastScan ? fmtTime(stats.lastScan) : '—',
                                    sub: "Most recent activity",
                                    color: "text-violet-600",
                                    bg: "bg-violet-500",
                                    icon: "🔍"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 621,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 616,
                            columnNumber: 9
                        }, this),
                        report.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-panel rounded-3xl p-6 mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-700",
                                                    children: "Day Completion Progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 634,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400",
                                                    children: [
                                                        stats.completed,
                                                        " of ",
                                                        stats.total + (stats.pending ?? 0),
                                                        " total expected scans completed"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 633,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `text-2xl font-extrabold ${stats.rate >= 90 ? 'text-emerald-600' : stats.rate >= 60 ? 'text-amber-500' : 'text-rose-600'}`,
                                            children: [
                                                stats.rate,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 639,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 632,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 bg-slate-100 rounded-full overflow-hidden flex",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-indigo-500 transition-all duration-700 flex items-center justify-center",
                                            style: {
                                                width: `${stats.completed / (report.length || 1) * 100}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 645,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-rose-400 transition-all duration-700",
                                            style: {
                                                width: `${stats.missed / (report.length || 1) * 100}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 650,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-full bg-slate-200 transition-all duration-700",
                                            style: {
                                                width: `${(stats.pending ?? 0) / (report.length || 1) * 100}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 655,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-5 mt-2 text-xs text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 rounded-full bg-indigo-500 inline-block"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 661,
                                                    columnNumber: 57
                                                }, this),
                                                "Completed"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 661,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 rounded-full bg-rose-400 inline-block"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 57
                                                }, this),
                                                "Missed"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 662,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-2 rounded-full bg-slate-200 inline-block"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 663,
                                                    columnNumber: 57
                                                }, this),
                                                "Not due yet"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 663,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 660,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 631,
                            columnNumber: 11
                        }, this),
                        stats.nothingScannedToday && report.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xl",
                                    children: "⏳"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 671,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold text-amber-800",
                                            children: "Patrol not started yet today"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 673,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-amber-600",
                                            children: [
                                                report.length,
                                                " rounds scheduled — no scans recorded yet. 0 marked as missed."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 674,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 672,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 670,
                            columnNumber: 11
                        }, this),
                        stats.isPartialDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex items-center gap-4 rounded-2xl border border-indigo-200 bg-indigo-50/80 backdrop-blur-md px-6 py-5 shadow-sm transition-all hover:shadow-md",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex h-4 w-4 shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 681,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative inline-flex rounded-full h-4 w-4 bg-indigo-500 border-2 border-indigo-200"
                                        }, void 0, false, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 682,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 680,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-indigo-900 text-base tracking-tight",
                                                    children: "Active Patrol in Progress"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 686,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider",
                                                    children: "Live System Health: Online"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 685,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-indigo-700/80 mt-0.5 font-medium",
                                            children: [
                                                "Live monitoring rounds due so far. ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                    className: "text-indigo-900",
                                                    children: stats.pending ?? 0
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 52
                                                }, this),
                                                " future rounds excluded from missed count."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 689,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 684,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 679,
                            columnNumber: 11
                        }, this),
                        report.length > 0 && !stats.nothingScannedToday ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "Completion Overview"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 704,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Completed · Missed · Not Due"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 705,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                    width: "100%",
                                                    height: 240,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Pie"], {
                                                                data: stats.pie,
                                                                cx: "50%",
                                                                cy: "50%",
                                                                innerRadius: 65,
                                                                outerRadius: 105,
                                                                paddingAngle: 4,
                                                                dataKey: "value",
                                                                children: stats.pie.map((e, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                        fill: e.color,
                                                                        stroke: "transparent"
                                                                    }, i, false, {
                                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                                        lineNumber: 709,
                                                                        columnNumber: 48
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 708,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                contentStyle: {
                                                                    borderRadius: 10,
                                                                    fontSize: 12,
                                                                    border: 'none',
                                                                    boxShadow: '0 4px 16px rgba(0,0,0,.1)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 711,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {
                                                                iconType: "circle",
                                                                wrapperStyle: {
                                                                    fontSize: 12
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 712,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 707,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 706,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 703,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "🏆 Guard Leaderboard"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 719,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Ranked by completion rate"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-y-auto max-h-64 pr-1",
                                                    children: stats.guardLeaderboard.length > 0 ? stats.guardLeaderboard.map((g, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeaderRow, {
                                                            rank: i + 1,
                                                            name: g.name,
                                                            scanned: g.scanned,
                                                            missed: g.missed,
                                                            total: g.total
                                                        }, g.name, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 23
                                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-slate-400 text-center mt-10",
                                                        children: "No guard data"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 718,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 700,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "Round-by-Round"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 738,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Completed vs Missed per patrol round"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                    width: "100%",
                                                    height: 240,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                                        data: stats.roundSummary,
                                                        barSize: 10,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                                strokeDasharray: "3 3",
                                                                stroke: "#f1f5f9",
                                                                vertical: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 742,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                                dataKey: "round",
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 10
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 11
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 744,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                contentStyle: {
                                                                    borderRadius: 10,
                                                                    fontSize: 12,
                                                                    border: 'none',
                                                                    boxShadow: '0 4px 16px rgba(0,0,0,.1)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 745,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {
                                                                iconType: "circle",
                                                                wrapperStyle: {
                                                                    fontSize: 12
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 746,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                                dataKey: "completed",
                                                                fill: "#6366f1",
                                                                radius: [
                                                                    4,
                                                                    4,
                                                                    0,
                                                                    0
                                                                ],
                                                                name: "Completed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 747,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                                dataKey: "missed",
                                                                fill: "#f43f5e",
                                                                radius: [
                                                                    4,
                                                                    4,
                                                                    0,
                                                                    0
                                                                ],
                                                                name: "Missed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 748,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 741,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 740,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 737,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "📈 Hourly Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 755,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Successful scans by hour of day"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 756,
                                                    columnNumber: 17
                                                }, this),
                                                stats.hourlyActivity.some((h)=>h.scans > 0) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                    width: "100%",
                                                    height: 240,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                                                        data: stats.hourlyActivity,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                                    id: "hGrad",
                                                                    x1: "0",
                                                                    y1: "0",
                                                                    x2: "0",
                                                                    y2: "1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                            offset: "5%",
                                                                            stopColor: "#6366f1",
                                                                            stopOpacity: 0.3
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 762,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                            offset: "95%",
                                                                            stopColor: "#6366f1",
                                                                            stopOpacity: 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 763,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 761,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                                strokeDasharray: "3 3",
                                                                stroke: "#f1f5f9",
                                                                vertical: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 766,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                                dataKey: "hour",
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 10
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 767,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 11
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 768,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                contentStyle: {
                                                                    borderRadius: 10,
                                                                    fontSize: 12,
                                                                    border: 'none',
                                                                    boxShadow: '0 4px 16px rgba(0,0,0,.1)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 769,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Area"], {
                                                                type: "monotone",
                                                                dataKey: "scans",
                                                                stroke: "#6366f1",
                                                                strokeWidth: 2,
                                                                fill: "url(#hGrad)",
                                                                dot: false,
                                                                name: "Scans"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 770,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 759,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 758,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-60 flex items-center justify-center text-slate-400 text-sm",
                                                    children: "No scan activity recorded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 774,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 754,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 734,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "Guard Scans vs Missed"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 784,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Side-by-side comparison"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 785,
                                                    columnNumber: 17
                                                }, this),
                                                stats.guardLeaderboard.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                    width: "100%",
                                                    height: 240,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                                        data: stats.guardLeaderboard.slice(0, 8).map((g)=>({
                                                                name: g.name.split(' ')[0],
                                                                scanned: g.scanned,
                                                                missed: g.missed
                                                            })),
                                                        barSize: 14,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                                strokeDasharray: "3 3",
                                                                stroke: "#f1f5f9",
                                                                vertical: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 794,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                                dataKey: "name",
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 11
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 795,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                                tick: {
                                                                    fill: '#94a3b8',
                                                                    fontSize: 11
                                                                },
                                                                axisLine: false,
                                                                tickLine: false
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 796,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                                contentStyle: {
                                                                    borderRadius: 10,
                                                                    fontSize: 12,
                                                                    border: 'none',
                                                                    boxShadow: '0 4px 16px rgba(0,0,0,.1)'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 797,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Legend"], {
                                                                iconType: "circle",
                                                                wrapperStyle: {
                                                                    fontSize: 12
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 798,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                                dataKey: "scanned",
                                                                fill: "#6366f1",
                                                                radius: [
                                                                    6,
                                                                    6,
                                                                    0,
                                                                    0
                                                                ],
                                                                name: "Scanned"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 799,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                                dataKey: "missed",
                                                                fill: "#f43f5e",
                                                                radius: [
                                                                    6,
                                                                    6,
                                                                    0,
                                                                    0
                                                                ],
                                                                name: "Missed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 800,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 788,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 787,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-60 flex items-center justify-center text-slate-400 text-sm",
                                                    children: "No guard data"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 803,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 783,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "📍 Scan Point Coverage"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 808,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "% of rounds scanned per checkpoint"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 809,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-y-auto max-h-64 pr-1",
                                                    children: stats.coverageByPoint.map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CoverageBar, {
                                                            name: p.name,
                                                            done: p.done,
                                                            total: p.total
                                                        }, i, false, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 812,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 810,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 807,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 780,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "🕐 Recent Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Last 10 successful scans"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 17
                                                }, this),
                                                stats.recentActivity.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: stats.recentActivity.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 py-2 border-b border-slate-50 last:border-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 829,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-sm font-medium text-slate-700 truncate",
                                                                                    children: r.qr_name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                                    lineNumber: 832,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs text-slate-400 ml-2 flex-shrink-0",
                                                                                    children: fmtTime(r.scan_time)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                                    lineNumber: 833,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 831,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-slate-400",
                                                                            children: [
                                                                                r.guard_name || 'Unknown',
                                                                                " · Round ",
                                                                                r.round
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 835,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 830,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                            lineNumber: 828,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 826,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-48 flex items-center justify-center text-slate-400 text-sm",
                                                    children: "No recent activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 843,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 822,
                                            columnNumber: 15
                                        }, this),
                                        stats.coverageByPoint.filter((p)=>p.done < p.total).length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1",
                                                    children: "⚠️ Problem Checkpoints"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 850,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-slate-400 mb-4",
                                                    children: "Scan points with incomplete coverage"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 851,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "overflow-x-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                        className: "min-w-full text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                    className: "border-b border-slate-100",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "text-left py-2 px-2 text-xs font-semibold text-slate-500 uppercase",
                                                                            children: "Point"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 856,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "text-center py-2 px-2 text-xs font-semibold text-emerald-600 uppercase",
                                                                            children: "Done"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 857,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "text-center py-2 px-2 text-xs font-semibold text-rose-600 uppercase",
                                                                            children: "Missed"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 858,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                            className: "text-center py-2 px-2 text-xs font-semibold text-slate-400 uppercase",
                                                                            children: "Rate"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/dashboard/page.tsx",
                                                                            lineNumber: 859,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                    lineNumber: 855,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 854,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                children: stats.coverageByPoint.filter((p)=>p.done < p.total).map((p, i)=>{
                                                                    const pct = Math.round(p.done / p.total * 100);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                        className: "border-b border-slate-50 hover:bg-slate-50 transition-colors",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "py-2 px-2 font-medium text-slate-700 text-xs",
                                                                                children: p.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                                lineNumber: 869,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "py-2 px-2 text-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-bold text-emerald-600",
                                                                                    children: [
                                                                                        "✓ ",
                                                                                        p.done
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                                    lineNumber: 871,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                                lineNumber: 870,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "py-2 px-2 text-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-bold text-rose-600",
                                                                                    children: [
                                                                                        "✗ ",
                                                                                        p.total - p.done
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                                    lineNumber: 874,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                                lineNumber: 873,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                className: "py-2 px-2 text-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: `text-xs font-bold px-1.5 py-0.5 rounded-full ${pct >= 80 ? 'bg-emerald-50 text-emerald-600' : pct >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`,
                                                                                    children: [
                                                                                        pct,
                                                                                        "%"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                                                    lineNumber: 877,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                                lineNumber: 876,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, i, true, {
                                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                                        lineNumber: 868,
                                                                        columnNumber: 31
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/dashboard/page.tsx",
                                                                lineNumber: 862,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/dashboard/page.tsx",
                                                        lineNumber: 853,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 852,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 849,
                                            columnNumber: 17
                                        }, this) : stats.completed > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "glass-panel rounded-3xl p-6 flex flex-col items-center justify-center gap-3 text-emerald-600",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-5xl",
                                                    children: "🎉"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 890,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-bold text-lg",
                                                    children: "All checkpoints covered!"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 891,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-slate-400",
                                                    children: "Every scan point has 100% coverage"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/dashboard/page.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/dashboard/page.tsx",
                                            lineNumber: 889,
                                            columnNumber: 17
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 819,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true) : report.length === 0 && !loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-panel rounded-3xl min-h-[300px] flex flex-col items-center justify-center gap-3 text-slate-400",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-5xl",
                                    children: "📊"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 899,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-lg font-semibold text-slate-500",
                                    children: "No data found"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 900,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm",
                                    children: "Select a campus and date, then click Load"
                                }, void 0, false, {
                                    fileName: "[project]/app/dashboard/page.tsx",
                                    lineNumber: 901,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 898,
                            columnNumber: 11
                        }, this) : loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "glass-panel rounded-3xl min-h-[300px] flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-3 text-slate-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 906,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm",
                                        children: "Loading report data…"
                                    }, void 0, false, {
                                        fileName: "[project]/app/dashboard/page.tsx",
                                        lineNumber: 907,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/dashboard/page.tsx",
                                lineNumber: 905,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/dashboard/page.tsx",
                            lineNumber: 904,
                            columnNumber: 11
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 613,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-8 text-center text-xs text-slate-400",
                    children: [
                        "© ",
                        new Date().getFullYear(),
                        " KCET Security Rounds — Dashboard"
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/dashboard/page.tsx",
                    lineNumber: 914,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/dashboard/page.tsx",
            lineNumber: 544,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/dashboard/page.tsx",
        lineNumber: 543,
        columnNumber: 5
    }, this);
}
_s(DashboardPage, "Ag5QvzRU23dYgRQckIB+m4QpjsY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthGuard"]
    ];
});
_c3 = DashboardPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "StatCard");
__turbopack_context__.k.register(_c1, "CoverageBar");
__turbopack_context__.k.register(_c2, "LeaderRow");
__turbopack_context__.k.register(_c3, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_88bd8292._.js.map