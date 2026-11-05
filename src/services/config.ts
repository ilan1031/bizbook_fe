// Backend base URL, from NEXT_PUBLIC_API_URL (set in .env.local locally and
// in the Vercel project settings for deployments), with a trailing slash.
// Falls back to the local backend when unset.
const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "") + "/";

// Uploaded attachments are served by the backend at /uploads (see bizbook_be app.js).
const FILE_BASE_URL = apiBaseUrl + "uploads";

const config = {
  apiBaseUrl,
  PO_Base_url: apiBaseUrl,
  SO_Base_url: apiBaseUrl,
  FILE_BASE_URL,
};

export default config;
