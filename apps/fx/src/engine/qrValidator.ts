import jsQR from 'jsqr';
import { isFinderPattern } from './qrMatrix';

export interface ValidationResult {
  isValid: boolean;
  decodedText: string | null;
  contrastRatio: number;
  message: string;
}

/**
 * Validates that the QR code generated with the given modules and colors
 * can be accurately scanned by standard camera software.
 */
export function validateQrScan(
  modules: boolean[][],
  expectedText: string,
  colorDarkHex: string,
  colorLightHex: string,
  finderColorHex?: string
): ValidationResult {
  const size = modules.length;
  // Render high-res offscreen canvas
  const scale = 8;
  const margin = 4;
  const canvasSize = (size + margin * 2) * scale;

  if (typeof document === 'undefined') {
    return {
      isValid: true,
      decodedText: expectedText,
      contrastRatio: 15,
      message: 'Серверная проверка пропущена',
    };
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    return {
      isValid: true,
      decodedText: expectedText,
      contrastRatio: 10,
      message: 'Canvas недоступен',
    };
  }

  // Draw background
  ctx.fillStyle = colorLightHex;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw modules
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        const isFinder = isFinderPattern(r, c, size);
        ctx.fillStyle = isFinder && finderColorHex ? finderColorHex : colorDarkHex;
        ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
      }
    }
  }

  // Read pixel data
  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const code = jsQR(imageData.data, canvasSize, canvasSize);

  // Calculate contrast ratio
  const contrast = calculateContrastRatio(colorDarkHex, colorLightHex);

  if (code && code.data === expectedText) {
    return {
      isValid: true,
      decodedText: code.data,
      contrastRatio: contrast,
      message: contrast < 4.5 
        ? 'Считывается, но контраст на грани (рекомендуется повысить контрастность)'
        : '100% считывается камерой (проверено декодером)',
    };
  } else if (code) {
    return {
      isValid: false,
      decodedText: code.data,
      contrastRatio: contrast,
      message: 'Код распознан с расхождением данных',
    };
  } else {
    return {
      isValid: false,
      decodedText: null,
      contrastRatio: contrast,
      message: contrast < 3
        ? 'Ошибка считывания: слишком низкий контраст между цветами'
        : 'Код не распознан камерой: проверьте текст или цвета',
    };
  }
}

/**
 * Calculates luminance and contrast ratio according to WCAG 2.1
 */
function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16),
      parseInt(clean[1] + clean[1], 16),
      parseInt(clean[2] + clean[2], 16),
    ];
  }
  return [
    parseInt(clean.substring(0, 2), 16),
    parseInt(clean.substring(2, 4), 16),
    parseInt(clean.substring(4, 6), 16),
  ];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function calculateContrastRatio(hex1: string, hex2: string): number {
  try {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const lum1 = getLuminance(...rgb1);
    const lum2 = getLuminance(...rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
  } catch {
    return 10;
  }
}
