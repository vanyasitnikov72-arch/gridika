/**
 * Ids of license keys that must no longer unlock badge-free code (leaked, refunded…).
 * Add the id (e.g. '7F3K2Q') and redeploy. Code that buyers already pasted keeps working;
 * the studio just stops issuing new code for these keys.
 */
export const REVOKED_KEY_IDS: string[] = [];
