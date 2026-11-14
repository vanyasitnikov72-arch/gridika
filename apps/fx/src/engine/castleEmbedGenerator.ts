import { generateQrMorphEmbedCode } from './qrMorphEmbedGenerator';

export interface CastleEmbedOptions {
  text: string;
  height?: number;
  mode?: 'day' | 'night' | 'winter';
  license?: { id: string; domain: string };
}

export function generateCastleEmbedCode(o: CastleEmbedOptions): string {
  return generateQrMorphEmbedCode({
    text: o.text,
    shape: 'castle',
    themeId: 'velvet-emerald',
    height: o.height,
    castleMode: o.mode,
    license: o.license,
  });
}
