export function logoFingerprint(d: { w: number; h: number; rle: string }): string;
export function logoSimilarity(a: string, b: string): number;
export function morphFingerprint(d: { w: number; h: number; a: string; b: string }): string;
export function morphSimilarity(a: string, b: string): number;
export const LOGO_MATCH: number;
export const MORPH_MATCH: number;
export function contentMatches(keyFp: string | undefined, product: string, data: unknown): boolean;
