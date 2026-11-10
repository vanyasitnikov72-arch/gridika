import QRCode from 'qrcode';

export interface QrMatrixData {
  modules: boolean[][];
  size: number;
}

/**
 * Generates binary 2D matrix of QR code for a given text/URL.
 * Uses QRCode.create with appropriate error correction level.
 */
export function generateQrMatrix(text: string, errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M'): QrMatrixData {
  const qr = QRCode.create(text, {
    errorCorrectionLevel,
  });

  const size = qr.modules.size;
  const modules: boolean[][] = [];

  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(Boolean(qr.modules.get(r, c)));
    }
    modules.push(row);
  }

  return { modules, size };
}

/**
 * Checks if a specific module coordinate is part of the 3 corner position finder patterns
 * (7x7 modules at top-left, top-right, and bottom-left).
 */
export function isFinderPattern(r: number, c: number, size: number): boolean {
  // Top-left
  if (r < 7 && c < 7) return true;
  // Top-right
  if (r < 7 && c >= size - 7) return true;
  // Bottom-left
  if (r >= size - 7 && c < 7) return true;
  return false;
}
