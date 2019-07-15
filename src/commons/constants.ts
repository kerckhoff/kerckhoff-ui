export const KERCKHOFF_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8000";

export const SITE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_SITE_URL
    : "http://localhost:3000";

export const OAUTH_URL = `${KERCKHOFF_URL}/api-oauth/google/auth`;
export const INTEGRATION_OAUTH_URL = `${KERCKHOFF_URL}/api/v1/integrations/`;
export const OAUTH_LOCAL_STORAGE_KEY = "$$oauth";
export const API_BASE = `${KERCKHOFF_URL}/api/v1`;
