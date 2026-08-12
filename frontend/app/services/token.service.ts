// app/services/token.service.ts

const TOKEN_KEY = "access_token";

export interface AuthUser {
  user_id: string;
  username: string;
  role: string;
}

// ---------------------------
// Token Service (Updated)
// ---------------------------
export const tokenService = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  set(token: string) {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_KEY, token);

    // 🔥 IMPORTANT: middleware can read cookies, not localStorage
    // Using the secure check from your original code for best practice
    const isSecure = window.location.protocol === "https:";
    
    document.cookie = `${TOKEN_KEY}=${token}; path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${
      isSecure ? "Secure;" : ""
    }`;
  },

  remove() {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("adminName");
    
    // Clear cookie
    document.cookie = `${TOKEN_KEY}=; path=/; Max-Age=0; SameSite=Lax;`;
  },
};

// ---------------------------
// User helpers (Preserved & Adjusted)
// ---------------------------
export const setUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("role", user.role);
  localStorage.setItem("adminName", user.username);
  localStorage.setItem("name", user.username);
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

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

// ---------------------------
// Auth check (Preserved)
// ---------------------------
export const isAuthenticated = (): boolean => {
  return !!tokenService.get() && !!getUser();
};

// ---------------------------
// Server-friendly token extractor (Preserved)
// ---------------------------
export const getTokenFromCookie = (cookieString?: string): string | null => {
  if (!cookieString) return null;
  const match = cookieString.match(new RegExp(`${TOKEN_KEY}=([^;]+)`));
  return match ? match[1] : null;
};

// ---------------------------
// BACKWARD COMPATIBILITY
// ---------------------------
// alias for Navbar imports that might still use removeToken
export const clearAuth = () => {
  tokenService.remove();
};