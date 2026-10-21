import axios from "axios";
import config from "./config";

const SESSION_ENDING_CODES = ["ACCOUNT_INACTIVE", "ACCOUNT_PENDING", "IP_NOT_ALLOWED"];

export const endSession = (reason) => {
  ["token", "organization_id", "user_name"].forEach((k) => localStorage.removeItem(k));
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/organisation/login")) {
    window.location.href = `/organisation/login${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`;
  }
};

// Function to create Axios instances dynamically
const createAxiosInstance = (baseURL, contentType = "application/json") => {
  const instance = axios.create({
    baseURL,
    headers: { "Content-Type": contentType },
  });

  instance.interceptors.request.use((config) => {
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
      const status = error.response?.status;
      const data = error.response?.data || {};
      const sessionEnded =
        status === 401 ||
        (status === 403 && SESSION_ENDING_CODES.includes(data.code)) ||
        (status === 400 && data.message === "Invalid or expired token.");
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
const apiService = async ({
  method,
  url,
  data,
  params,
  file,
  customBaseUrl,
  responseType = "json",
}) => {
  try {
    let instance;

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
    });

    return { data: response.data, statusCode: response.status };
  } catch (error) {
    const status = error.response?.status;
    // 4xx responses (wrong password, no permission, validation) are expected
    // and shown by the caller; only log server faults and network failures.
    // (console.error would also trigger Next.js's red error overlay in dev.)
    if (!status || status >= 500) {
      console.error(`API ${status || "network"} error on ${url}: ${error.message}`);
    }
    throw error.response?.data || { message: "Can't reach the server. Check your connection and try again." };
  }
};

export default apiService;
