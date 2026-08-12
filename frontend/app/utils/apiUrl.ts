export const getApiUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }
  
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname.includes("trycloudflare.com")) {
      return `https://${hostname}`;
    }
    // Dynamically connect to the backend running on the same host IP
    return `http://${hostname}:8000`;
  }
  return "http://10.10.3.2:8000";
};

