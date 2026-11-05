import axios, { AxiosInstance } from "axios";
import config from "./config";

const SESSION_ENDING_CODES = ["ACCOUNT_INACTIVE", "ACCOUNT_PENDING", "IP_NOT_ALLOWED", "MEMBER_DISABLED"];

// Whether a failed response means this sign-in is over (as opposed to a
// temporary problem: 429 rate limit, 5xx, network, or a bad request).
export const isSessionEndingResponse = (status: number | undefined, data: any = {} as any): boolean =>
  status === 401 ||
  (status === 403 && SESSION_ENDING_CODES.includes(data?.code)) ||
  (status === 400 && data?.message === "Invalid or expired token.");

// Why a session ended, as the sign-in page and the signed-out notice say it.
export const SIGN_OUT_REASONS: Record<string, string> = {
  ACCOUNT_INACTIVE: "Your account has been deactivated. Contact your administrator.",
  ACCOUNT_PENDING: "Your account is waiting for administrator approval.",
  IP_NOT_ALLOWED: "This device is no longer approved for your account. Please sign in again.",
  MEMBER_DISABLED: "Your access to this organisation has been turned off. Contact your organisation's admin.",
  SESSION_EXPIRED: "Your session has ended. Please sign in again.",
  PASSWORD_CHANGED: "Your password was changed. Please sign in again with the new password.",
};
const SIGN_OUT_KEY = "signedOutReason";

// The reason the session ended, kept for the sign-in page even when the app
// redirects itself (the URL may not carry it).
export const signOutReason = (): string | null => {
  try {
    return sessionStorage.getItem(SIGN_OUT_KEY);
  } catch {
    return null;
  }
};

export const endSession = (reason?: string) => {
  ["token", "organization_id", "user_name"].forEach((k) => localStorage.removeItem(k));
  try {
    if (reason) sessionStorage.setItem(SIGN_OUT_KEY, reason);
  } catch {
    // Storage can be blocked; the reason then only shows in the URL.
  }
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/organisation/login")) {
    window.location.href = `/organisation/login${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`;
  }
};

// A random id this browser keeps, sent on every request. The server approves a
// device by this id rather than by IP address, which can change between
// requests and used to sign people out right after signing in.
export const deviceId = (): string => {
  try {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = (globalThis.crypto?.randomUUID?.() || `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`).replace(/[^A-Za-z0-9-]/g, "");
      localStorage.setItem("device_id", id);
    }
    return id;
  } catch {
    return "";
  }
};

// Function to create Axios instances dynamically
const createAxiosInstance = (baseURL: string, contentType = "application/json"): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": contentType },
  });

  instance.interceptors.request.use((config) => {
    config.headers["X-Device-Id"] = deviceId();
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // The server ends a session when the account is deactivated, the device's
  // IP is removed, or the token expires. Sign out and explain why.
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status: number | undefined = error.response?.status;
      const data: any = error.response?.data || {};
      const sessionEnded = isSessionEndingResponse(status, data);
      if (sessionEnded && localStorage.getItem("token")) {
        endSession(data.code || "SESSION_EXPIRED");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Predefined instances
const defaultAxiosInstance = createAxiosInstance(config.apiBaseUrl);
const imageAxiosInstance = createAxiosInstance(
  config.apiBaseUrl,
  "multipart/form-data"
);

// Universal API Service
export interface ApiRequest {
  method: string;
  url: string;
  data?: any;
  params?: any;
  file?: boolean | any;
  customBaseUrl?: string;
  responseType?: "json" | "blob" | "text" | "arraybuffer" | "document" | "stream";
  headers?: any;
  validateStatus?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  statusCode: number;
  // Callers read other fields off the result too; keep those untyped.
  [key: string]: any;
}

const apiService = async <T = any>({
  method,
  url,
  data,
  params,
  file,
  customBaseUrl,
  responseType = "json",
  headers,
  validateStatus,
}: ApiRequest): Promise<ApiResponse<T>> => {
  try {
    let instance: AxiosInstance;

    if (customBaseUrl) {
      instance = createAxiosInstance(
        customBaseUrl,
        file ? "multipart/form-data" : "application/json"
      );
    } else {
      instance = file ? imageAxiosInstance : defaultAxiosInstance;
    }

    const response = await instance({
      method,
      url,
      data,
      params,
      responseType, // Pass responseType to Axios (default is 'json')
      headers,
      // Only send validateStatus when a caller sets one. Axios 1.x treats an
      // explicit undefined (or null) as "accept every status", which resolved
      // every 4xx/5xx here and hid errors from callers' catch blocks.
      ...(validateStatus !== undefined ? { validateStatus } : {}),
    });

    return { data: response.data, statusCode: response.status };
  } catch (error: any) {
    const status: number | undefined = error.response?.status;
    // 4xx responses (wrong password, no permission, validation) are expected
    // and shown by the caller; only log server faults and network failures.
    // (console.error would also trigger Next.js's red error overlay in dev.)
    // (A 5xx that carries a "code" is a known, explained state such as
    // AI_NOT_CONFIGURED; the caller shows its message.)
    if (!status || (status >= 500 && !error.response?.data?.code)) {
      console.error(`API ${status || "network"} error on ${url}: ${error.message}`);
    }
    const data: any = error.response?.data;
    const thrown: any =
      data && typeof data === "object"
        ? data
        : {
            message:
              status === 429
                ? "Too many requests. Please wait a minute and try again."
                : status
                  ? (typeof data === "string" && data.trim() && data.length < 300 ? data : `The server returned an error (${status}).`)
                  : "Can't reach the server. Check your connection and try again.",
          };
    // The HTTP status, for callers that need it (not part of the JSON body).
    // `response` mirrors axios's error shape (response.status, response.data),
    // so callers written against axios errors keep reading error.response.data.message.
    try {
      Object.defineProperty(thrown, "httpStatus", { value: status || 0, enumerable: false, configurable: true });
      Object.defineProperty(thrown, "response", {
        value: { status: status || 0, data: thrown },
        enumerable: false,
        configurable: true,
      });
    } catch (e) {
      // frozen object: leave it as is
    }
    throw thrown;
  }
};

export default apiService;
