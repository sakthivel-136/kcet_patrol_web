module.exports = [
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
];

//# sourceMappingURL=app_af386afe._.js.map