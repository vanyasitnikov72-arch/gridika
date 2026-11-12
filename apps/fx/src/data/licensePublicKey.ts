/**
 * Public halves of the Gridika license signing keys. Safe to publish.
 *
 * LICENSE_PUBLIC_KEYS is append-only: every key that has ever signed licenses stays here forever,
 * otherwise buyers holding those licenses would lose access. A new signing key (scripts/license.mjs
 * rotate) is appended at the end; the studio accepts a license signed by any key in the list.
 * scripts/check-release.mjs refuses a release that drops or changes a key listed in release/keys.lock.json.
 */
export const LICENSE_PUBLIC_KEY: JsonWebKey = {
  "kty": "EC",
  "crv": "P-256",
  "x": "rlbJNKwFTmSPSkhsNzn797RKXMU5n1hzqg904h0-guU",
  "y": "Ec6lni9fxjcmdu5MHd06gmb69vpzP6WgrNQuIezLMec"
};

export const LICENSE_PUBLIC_KEYS: JsonWebKey[] = [
  LICENSE_PUBLIC_KEY,
];
