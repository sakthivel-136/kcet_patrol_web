(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/factory/FactoryForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FactoryForm",
    ()=>FactoryForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const FactoryForm = ({ onSubmit, initialData, onCancel })=>{
    _s();
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [code, setCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [location, setLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [address, setAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Pre-fill form for edit
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FactoryForm.useEffect": ()=>{
            if (initialData) {
                setName(initialData.name);
                setCode(initialData.code);
                setLocation(initialData.location || '');
                setAddress(initialData.address || '');
            }
        }
    }["FactoryForm.useEffect"], [
        initialData
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!name || !code) {
            alert('Please fill Name and Code');
            return;
        }
        onSubmit({
            name,
            code,
            location,
            address
        });
        if (!initialData) {
            setName('');
            setCode('');
            setLocation('');
            setAddress('');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-12 gap-4 items-start",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1",
                                children: "Campus Name"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. North Warehouse",
                                value: name,
                                onChange: (e)=>setName(e.target.value),
                                className: "w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1",
                                children: "Code"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. F-01",
                                value: code,
                                onChange: (e)=>setCode(e.target.value),
                                disabled: !!initialData,
                                className: "w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1",
                                children: "Location (Optional)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. Building A",
                                value: location,
                                onChange: (e)=>setLocation(e.target.value),
                                className: "w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 98,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "md:col-span-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1",
                                children: "Address (Optional)"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. 1/407, SIDCO Industrial Estate",
                                value: address,
                                onChange: (e)=>setAddress(e.target.value),
                                className: "w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-all placeholder:text-slate-400"
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 112,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 pt-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4",
                                fill: "none",
                                viewBox: "0 0 24 24",
                                stroke: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: "2",
                                    d: "M12 4v16m8-8H4"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                                lineNumber: 127,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            initialData ? 'Update Campus' : 'Add Campus'
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    initialData && onCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onCancel,
                        className: "px-6 py-2.5 bg-white border border-slate-300 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all duration-200",
                        children: "Cancel"
                    }, void 0, false, {
                        fileName: "[project]/app/components/factory/FactoryForm.tsx",
                        lineNumber: 134,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/factory/FactoryForm.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/factory/FactoryForm.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(FactoryForm, "YBtGu7pCP7vDMYfnCVJ2kLXddic=");
_c = FactoryForm;
var _c;
__turbopack_context__.k.register(_c, "FactoryForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utils/apiUrl.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApiUrl",
    ()=>getApiUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const getApiUrl = ()=>{
    const envUrl = ("TURBOPACK compile-time value", "http://localhost:8000");
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
"[project]/app/api/axiosClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/apiUrl.ts [app-client] (ecmascript)");
;
;
/* ================= CONFIG ================= */ const BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$apiUrl$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiUrl"])();
/* ================= CLIENT ================= */ const axiosClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});
/* ================= REQUEST INTERCEPTOR ================= */ axiosClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>Promise.reject(error));
/* ================= RESPONSE INTERCEPTOR ================= */ axiosClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        console.warn("Unauthorized - redirecting to login");
        localStorage.removeItem("access_token");
        if ("TURBOPACK compile-time truthy", 1) {
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = axiosClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/api/factories.api.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFactory",
    ()=>createFactory,
    "deleteFactory",
    ()=>deleteFactory,
    "getFactories",
    ()=>getFactories,
    "getFactoryById",
    ()=>getFactoryById,
    "updateFactory",
    ()=>updateFactory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/axiosClient.js [app-client] (ecmascript)");
;
const getFactories = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/factories");
const getFactoryById = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(`/factories/${id}`);
const createFactory = (data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/factories", data);
const updateFactory = (id, data)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(`/factories/${id}`, data);
const deleteFactory = (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$axiosClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(`/factories/${id}`);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/factory/FactoriesTable.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FactoriesTable",
    ()=>FactoriesTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$factory$2f$FactoryForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/factory/FactoryForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$factories$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/api/factories.api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const FactoriesTable = ()=>{
    _s();
    /* ================= STATE ================= */ const [factories, setFactories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editingId, setEditingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [editName, setEditName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editLocation, setEditLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editAddress, setEditAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    /* ================= LOAD ================= */ const loadFactories = async ()=>{
        setLoading(true);
        setError('');
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$factories$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFactories"])();
            const data = res.data || res;
            const normalized = data.map((f)=>({
                    id: f.factory_code,
                    name: f.factory_name,
                    location: f.location || '',
                    address: f.factory_address || ''
                }));
            setFactories(normalized);
        } catch (err) {
            console.error(err);
            setError('Failed to load factories');
        } finally{
            setLoading(false);
        }
    };
    /* ================= CREATE ================= */ const addFactory = async (payload)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$factories$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createFactory"])({
                factory_name: payload.name,
                factory_code: payload.code,
                location: payload.location || '',
                factory_address: payload.address || ''
            });
            await loadFactories();
        } catch (err) {
            const errMsg = err.response?.data?.detail || err.message || 'Create failed';
            alert(errMsg);
        }
    };
    /* ================= UPDATE ================= */ const saveEdit = async (id)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$factories$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateFactory"])(id, {
                factory_name: editName,
                factory_code: id,
                location: editLocation,
                factory_address: editAddress
            });
            setEditingId(null);
            await loadFactories();
        } catch (err) {
            const errMsg = err.response?.data?.detail || err.message || 'Update failed';
            alert(errMsg);
        }
    };
    /* ================= DELETE ================= */ const deleteFactory = async (id)=>{
        if (!confirm('Delete this factory?')) return;
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$api$2f$factories$2e$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteFactory"])(id);
            await loadFactories();
        } catch (err) {
            const errMsg = err.response?.data?.detail || err.message || 'Delete failed';
            alert(errMsg);
        }
    };
    /* ================= EDIT ================= */ const startEdit = (f)=>{
        setEditingId(f.id);
        setEditName(f.name);
        setEditLocation(f.location || '');
        setEditAddress(f.address || '');
    };
    /* ================= INIT ================= */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FactoriesTable.useEffect": ()=>{
            loadFactories();
        }
    }["FactoriesTable.useEffect"], []);
    /* ================= UI ================= */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-50 text-red-700 border border-red-200 p-4 rounded-xl text-sm font-medium shadow-sm",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl border border-slate-200 p-6 shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$factory$2f$FactoryForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FactoryForm"], {
                    onSubmit: addFactory
                }, void 0, false, {
                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center p-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-slate-500 font-medium",
                    children: "Loading factories..."
                }, void 0, false, {
                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                    lineNumber: 147,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                lineNumber: 146,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)) : /* Table */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full transition-shadow duration-300 hover:shadow-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "min-w-full divide-y divide-slate-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-slate-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider",
                                        children: "Code"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 155,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 158,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider",
                                        children: "Location"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 161,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider",
                                        children: "Address"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 164,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider",
                                        children: "Actions"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                lineNumber: 154,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                            lineNumber: 153,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "bg-white divide-y divide-slate-100",
                            children: factories.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                    colSpan: 5,
                                    className: "px-6 py-12 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col items-center justify-center space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-slate-50 p-3 rounded-full",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6 text-slate-400",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: "2",
                                                        d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 25
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 178,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-slate-500",
                                                children: "No factories found"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 183,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400",
                                                children: "Add a new factory location to get started."
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 184,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                        lineNumber: 177,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                    lineNumber: 176,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                lineNumber: 175,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : factories.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-slate-50 transition-colors duration-150 group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-800",
                                            children: f.id
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                            lineNumber: 195,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm font-medium text-slate-700",
                                            children: editingId === f.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: editName,
                                                onChange: (e)=>setEditName(e.target.value),
                                                className: "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                                autoFocus: true
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 202,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)) : f.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                            lineNumber: 200,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm text-slate-600",
                                            children: editingId === f.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: editLocation,
                                                onChange: (e)=>setEditLocation(e.target.value),
                                                className: "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 216,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)) : f.location || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                            lineNumber: 214,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-sm text-slate-500",
                                            children: editingId === f.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                value: editAddress,
                                                onChange: (e)=>setEditAddress(e.target.value),
                                                className: "w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 229,
                                                columnNumber: 25
                                            }, ("TURBOPACK compile-time value", void 0)) : f.address || '—'
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                            lineNumber: 227,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-end gap-3",
                                                children: editingId === f.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>saveEdit(f.id),
                                                            className: "text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium",
                                                            children: "Save"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setEditingId(null),
                                                            className: "text-slate-600 hover:text-slate-800 transition-colors duration-200 font-medium",
                                                            children: "Cancel"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>startEdit(f),
                                                            className: "text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium",
                                                            children: "Edit"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                            lineNumber: 259,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>deleteFactory(f.id),
                                                            className: "text-slate-600 hover:text-red-600 transition-colors duration-200 font-medium",
                                                            children: "Delete"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 29
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                                lineNumber: 241,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                            lineNumber: 240,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, f.id, true, {
                                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                                    lineNumber: 190,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                            lineNumber: 173,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                    lineNumber: 152,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/factory/FactoriesTable.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/factory/FactoriesTable.tsx",
        lineNumber: 131,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(FactoriesTable, "E34W77Nik+RGQF5BwuzDUq80eNA=");
_c = FactoriesTable;
var _c;
__turbopack_context__.k.register(_c, "FactoriesTable");
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
            if (options?.role) {
                const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$token$2e$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUser"])();
                // If user data missing or role mismatch → redirect to login
                if (!user || user.role !== options.role) {
                    setAuthorized(false);
                    router.replace("/login");
                    return;
                }
            }
            setAuthorized(true);
        }
    }["useAuthGuard.useCallback[checkAuth]"], [
        router,
        options?.role
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
"[project]/app/factory/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FactoryPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$factory$2f$FactoriesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/factory/FactoriesTable.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/auth.guard.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function FactoryPage() {
    _s();
    const { authorized } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthGuard"])();
    if (!authorized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-white min-h-screen bg-[#07071f] flex items-center justify-center",
            children: "Checking access..."
        }, void 0, false, {
            fileName: "[project]/app/factory/page.tsx",
            lineNumber: 10,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-slate-50 p-8 font-sans selection:bg-blue-100 selection:text-blue-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-extrabold text-slate-800 tracking-tight",
                            children: "Factories"
                        }, void 0, false, {
                            fileName: "[project]/app/factory/page.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-slate-500 mt-1 font-medium",
                            children: "Create, edit, and manage campus locations"
                        }, void 0, false, {
                            fileName: "[project]/app/factory/page.tsx",
                            lineNumber: 22,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/factory/page.tsx",
                    lineNumber: 20,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/factory/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$factory$2f$FactoriesTable$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FactoriesTable"], {}, void 0, false, {
                    fileName: "[project]/app/factory/page.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/factory/page.tsx",
                lineNumber: 26,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/factory/page.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_s(FactoryPage, "H2GxdPBhlPkT/lNGn7E91CCEQ1A=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$auth$2e$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthGuard"]
    ];
});
_c = FactoryPage;
var _c;
__turbopack_context__.k.register(_c, "FactoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_e1d589c0._.js.map