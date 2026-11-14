import type { TargetShapeType } from './shapes';
import { generateCastleEmbedCode } from './castleEmbedGenerator';
import { generateQrMorphEmbedCode } from './qrMorphEmbedGenerator';
import { generateCardEmbedCode } from './cardEmbedGenerator';
import { generateGiftEmbedCode } from './giftEmbedGenerator';
import { generateLogoEmbedCode } from './logoEmbedGenerator';
import { generateMorphEmbedCode } from './morphEmbedGenerator';
import { generateTimerEmbedCode } from './timerEmbedGenerator';
import { buildTimerData, type TimerMode } from './timerScene';
import type { LogoMode } from './logoScene';
import type { CardMode, CardStyle } from './cardScene';
import type { GiftMode } from './giftScene';
import type { CardContact } from './vcard';
import type { PurchaseConfig } from './purchase';

/** The site code for a purchase, built from the saved studio settings (null if not supported). */
export function buildPurchaseCode(c: PurchaseConfig, license: { id: string; domain: string }): string | null {
  if (c.p === 'qr-morph' && c.qr) {
    const shape = c.qr.shape || 'tree';
    return generateQrMorphEmbedCode({
      text: c.qr.text,
      shape: shape as TargetShapeType,
      themeId: c.qr.themeId,
      height: 480,
      season: (c.qr.modes?.season || c.qr.modes?.tree) as any,
      timeOfDay: (c.qr.modes?.timeOfDay || c.qr.modes?.city) as any,
      islandMode: (c.qr.modes?.islandMode || c.qr.modes?.island) as any,
      gardenMode: (c.qr.modes?.gardenMode || c.qr.modes?.maze) as any,
      eqMode: (c.qr.modes?.eqMode || c.qr.modes?.equalizer) as any,
      cakeFlavor: (c.qr.modes?.cakeFlavor || c.qr.modes?.cake) as any,
      castleMode: (c.qr.modes?.castleMode || c.qr.modes?.castle) as any,
      license,
    });
  }
  if (c.p === 'qr-card' && c.card) {
    const hidden = new Set(c.card.hidden);
    const contact = Object.fromEntries(Object.entries(c.card.contact).map(([k, v]) => [k, hidden.has(k as keyof CardContact) ? '' : v])) as unknown as CardContact;
    // the logo is not carried in the link (too big): the card falls back to the monogram
    return generateCardEmbedCode({ contact, mode: c.card.mode as CardMode, style: c.card.style as CardStyle, logo: null, license });
  }
  if (c.p === 'gift-box' && c.gift) {
    return generateGiftEmbedCode({ settings: c.gift.settings, mode: c.gift.mode as GiftMode, license });
  }
  if (c.p === 'sale-timer' && c.timer) {
    const data = buildTimerData(c.timer.settings, c.timer.mode as TimerMode);
    return data ? generateTimerEmbedCode({ data, license }) : null;
  }
  if (c.p === 'voxel-morph' && c.morph) {
    return generateMorphEmbedCode({ data: c.morph.data, license });
  }
  if (c.p === 'voxel-logo' && c.logo) {
    return generateLogoEmbedCode({ data: c.logo.data, mode: c.logo.mode as LogoMode, license });
  }
  return null;
}
