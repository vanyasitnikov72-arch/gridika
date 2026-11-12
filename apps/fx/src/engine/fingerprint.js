/* Gridika · content fingerprints for keys that are sold per item ("one key = one logo / one photo pair").
 * Plain JS without browser APIs: used by the studio, the thanks page and scripts/license.mjs.
 *
 * Logo  → "L1:<w>x<h>:<hex>"   its silhouette squeezed into 16×16 (colours, depth and detail don't matter)
 * Pair  → "M1:<hexA><hexB>"    brightness of each photo averaged into 8×6 cells, 4 bits each
 * Both are compared with a tolerance, so re-cropping, another grid size or other colours still match,
 * while a different logo or different photos do not.
 */
import { decodeLogoGrid } from '../embed/logoRuntime.js';
import { decodeMorphGrid } from '../embed/morphRuntime.js';

var FP = 16;

/** logo data ({ w, h, rle }) → fingerprint */
export function logoFingerprint(d) {
  var grid = decodeLogoGrid(d);
  // fit the logo into 16×16 keeping its proportions
  var s = FP / Math.max(d.w, d.h), fw = Math.max(1, Math.round(d.w * s)), fh = Math.max(1, Math.round(d.h * s));
  var bits = '';
  for (var y = 0; y < FP; y++) {
    for (var x = 0; x < FP; x++) {
      if (x >= fw || y >= fh) { bits += '0'; continue; }
      // share of filled cells under this fingerprint cell
      var x0 = Math.floor((x * d.w) / fw), x1 = Math.max(x0 + 1, Math.floor(((x + 1) * d.w) / fw));
      var y0 = Math.floor((y * d.h) / fh), y1 = Math.max(y0 + 1, Math.floor(((y + 1) * d.h) / fh));
      var n = 0, f = 0;
      for (var yy = y0; yy < y1; yy++) for (var xx = x0; xx < x1; xx++) { n++; if (grid[yy * d.w + xx] >= 0) f++; }
      bits += f * 2 >= n ? '1' : '0';
    }
  }
  var hex = '';
  for (var i = 0; i < bits.length; i += 4) hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  return 'L1:' + fw + 'x' + fh + ':' + hex;
}

function logoBits(fp) {
  var m = /^L1:(\d+)x(\d+):([0-9a-f]+)$/.exec(fp || '');
  if (!m) return null;
  var bits = [];
  for (var i = 0; i < m[3].length; i++) { var v = parseInt(m[3][i], 16); bits.push((v >> 3) & 1, (v >> 2) & 1, (v >> 1) & 1, v & 1); }
  return { w: +m[1], h: +m[2], bits: bits };
}

/** same logo? overlap of the two silhouettes (intersection / union) */
export function logoSimilarity(a, b) {
  var A = logoBits(a), B = logoBits(b);
  if (!A || !B) return 0;
  var inter = 0, union = 0;
  for (var i = 0; i < FP * FP; i++) { if (A.bits[i] && B.bits[i]) inter++; if (A.bits[i] || B.bits[i]) union++; }
  return union ? inter / union : 0;
}

/** morph data ({ w, h, a, b }) → fingerprint */
export function morphFingerprint(d) {
  var n = d.w * d.h, out = 'M1:';
  [d.a, d.b].forEach(function (grid) {
    var c = decodeMorphGrid(grid, n), GW = 8, GH = 6;
    for (var gy = 0; gy < GH; gy++) {
      for (var gx = 0; gx < GW; gx++) {
        var x0 = Math.floor((gx * d.w) / GW), x1 = Math.floor(((gx + 1) * d.w) / GW);
        var y0 = Math.floor((gy * d.h) / GH), y1 = Math.floor(((gy + 1) * d.h) / GH);
        var sum = 0, k = 0;
        for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) { var i = (y * d.w + x) * 3; sum += 0.2126 * c[i] + 0.7152 * c[i + 1] + 0.0722 * c[i + 2]; k++; }
        out += Math.min(15, Math.round((k ? sum / k : 0) * 15)).toString(16);
      }
    }
  });
  return out;
}

/** same photo pair? 1 = identical; both photos must be close */
export function morphSimilarity(a, b) {
  if (!/^M1:[0-9a-f]{96}$/.test(a || '') || !/^M1:[0-9a-f]{96}$/.test(b || '')) return 0;
  var worst = 1;
  for (var half = 0; half < 2; half++) {
    var diff = 0;
    for (var i = 0; i < 48; i++) diff += Math.abs(parseInt(a[3 + half * 48 + i], 16) - parseInt(b[3 + half * 48 + i], 16));
    worst = Math.min(worst, 1 - diff / 48 / 15);
  }
  return worst;
}

export var LOGO_MATCH = 0.75;
export var MORPH_MATCH = 0.9;

/** does this content belong to the key's fingerprint? (keys without one fit anything) */
export function contentMatches(keyFp, product, data) {
  if (!keyFp) return true;
  if (!data) return false;
  if (product === 'voxel-logo') return logoSimilarity(keyFp, logoFingerprint(data)) >= LOGO_MATCH;
  if (product === 'voxel-morph') return morphSimilarity(keyFp, morphFingerprint(data)) >= MORPH_MATCH;
  return true;
}
