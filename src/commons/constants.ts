export const KERCKHOFF_URL =
  process.env.NODE_ENV === 'production' ?
    "TODO" :
    "https://kerckhoff-dev.herokuapp.com";

export const SITE_URL =
  process.env.NODE_ENV === 'production' ?
    KERCKHOFF_URL :
    "http://localhost:3000";

export const OAUTH_URL = `${KERCKHOFF_URL}/api-oauth/google/auth`;
export const OAUTH_LOCAL_STORAGE_KEY = "$$oauth";
