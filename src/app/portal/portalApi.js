// API client and session storage for the customer portal. The portal keeps
// its own keys (portal_*) so a customer signed in here and a business user
// signed in to the main app in the same browser don't overwrite each other.
import axios from "axios";
import config from "../../services/config";

export const PORTAL_KEYS = {
  token: "portal_token",
  orgId: "portal_org_id",
  clientId: "portal_client_id",
  clientPersonId: "portal_client_person_id",
};

export const portalGet = (key) => (typeof window === "undefined" ? null : localStorage.getItem(PORTAL_KEYS[key]));

export const savePortalSession = ({ token, orgId, clientId, clientPersonId }) => {
  if (token) localStorage.setItem(PORTAL_KEYS.token, token);
  if (orgId) localStorage.setItem(PORTAL_KEYS.orgId, orgId);
  if (clientId) localStorage.setItem(PORTAL_KEYS.clientId, clientId);
  if (clientPersonId) localStorage.setItem(PORTAL_KEYS.clientPersonId, clientPersonId);
};

// Signs out of the portal only; the org is kept so the sign-in page knows
// which business to show.
export const clearPortalSession = () => {
  for (const key of ["token", "clientId", "clientPersonId"]) localStorage.removeItem(PORTAL_KEYS[key]);
};

export const portalLoginPath = () => {
  const org = portalGet("orgId");
  return org ? `/portal/${org}/login` : "/portal/login";
};

const instance = axios.create({ baseURL: config.apiBaseUrl });
instance.interceptors.request.use((cfg) => {
  const token = portalGet("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Same shape as services/axiosService: resolves { data, statusCode }, rejects
// with the server's JSON body.
const apiService = async ({ method, url, data, params, file, responseType = "json" }) => {
  try {
    const response = await instance({
      method,
      url,
      data,
      params,
      responseType,
      headers: { "Content-Type": file ? "multipart/form-data" : "application/json" },
    });
    return { data: response.data, statusCode: response.status };
  } catch (error) {
    const status = error.response?.status;
    if ((status === 401 || status === 403) && typeof window !== "undefined" && portalGet("token")) {
      const code = error.response?.data?.code;
      if (status === 401 || code === "PORTAL_DISABLED") {
        clearPortalSession();
        window.location.assign(portalLoginPath());
      }
    }
    throw error.response?.data || { message: "Can't reach the server. Check your connection and try again." };
  }
};

export default apiService;

// Reads a JWT's payload (no verification; the server checks it).
export const decodeJwt = (token) => {
  const part = String(token || "").split(".")[1];
  if (!part) throw new Error("Invalid token");
  const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(decodeURIComponent(escape(json)));
};
