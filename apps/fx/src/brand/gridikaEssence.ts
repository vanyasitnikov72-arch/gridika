/**
 * Gridika mark · "flat → volume" (the essence shared by every product).
 *  - left face:  QR — a rounded finder eye and QR modules extruded as voxels (product 01, 3D QR);
 *  - right face: a pixel letter G extruded as voxels (the brand initial, and product 04, 3D logo);
 *  - top face:   the principle itself — grid cells go from outlined (flat) at the back,
 *                to filled, to voxels rising towards the front corner;
 *  - front vertical edge: a column of dots (dots at both ends, even spacing), outline stops short of it.
 * No other dots on the faces.
 */
import { GRIDIKA_PALETTES } from './gridikaMark';

type P = [number, number];
type FaceId = 'left' | 'right' | 'top';

const C30 = Math.cos(Math.PI / 6);
const iso = (x: number, y: number, z: number): P => [(x - z) * C30, (x + z) * 0.5 - y];
const f = (v: number) => +v.toFixed(3);
const poly = (pts: P[]) => pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ');
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return s - Math.floor(s);
};
function shade(hex: string, k: number) {
  const v = parseInt(hex.slice(1, 7), 16);
  const ch = (x: number) => Math.max(0, Math.min(255, Math.round(k >= 1 ? x + (255 - x) * (k - 1) : x * k)));
  return `rgb(${ch((v >> 16) & 255)},${ch((v >> 8) & 255)},${ch(v & 255)})`;
}

// pixel G, 7×7, rows top → bottom
const G = ['.XXXXX.', 'X......', 'X......', 'X..XXXX', 'X.....X', 'X.....X', '.XXXXX.'];
const G_SMALL = ['XXX', 'X..', 'X.X', 'XXX'];

export type EssenceLevel = 'L' | 'M' | 'S';
export const essenceLevel = (px: number): EssenceLevel => (px >= 96 ? 'L' : px >= 28 ? 'M' : 'S');

export function gridikaEssence(px: number, palette: keyof typeof GRIDIKA_PALETTES = 'dark', extraAttrs = ''): string {
  const pal = GRIDIKA_PALETTES[palette].p;
  const level = essenceLevel(px);
  const n = level === 'S' ? 6 : 11;
  const ew = level === 'S' ? 0.5 : 0.36;
  const dotR = level === 'S' ? 0.42 : 0.28;
  const accent = pal.dot;
  const out: string[] = [];

  const map: Record<FaceId, (u: number, v: number, h?: number) => P> = {
    left: (u, v, h = 0) => iso(u, v, n + h),
    right: (u, v, h = 0) => iso(n + h, v, u),
    top: (u, v, h = 0) => iso(u, n + h, v),
  };

  // faces
  if (pal.faces) (['top', 'left', 'right'] as FaceId[]).forEach((id) => out.push(`<polygon points="${poly([map[id](0, 0), map[id](n, 0), map[id](n, n), map[id](0, n)])}" fill="${pal.faces![id]}"/>`));

  // outline, stopping short of the dotted front edge
  if (pal.edge) {
    type V3 = [number, number, number];
    const gap = level === 'S' ? 0.9 : 1.1;
    const toward = (a: V3, b: V3, d: number): V3 => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      return [a[0] + ((b[0] - a[0]) * d) / L, a[1] + ((b[1] - a[1]) * d) / L, a[2] + ((b[2] - a[2]) * d) / L];
    };
    const pr = (q: V3) => iso(q[0], q[1], q[2]);
    const bottom: V3 = [n, 0, n], topC: V3 = [n, n, n];
    const st = `fill="none" stroke="${pal.edge}" stroke-width="${ew}" stroke-linejoin="round" stroke-linecap="round"`;
    out.push(`<polyline points="${poly([toward(bottom, [0, 0, n], gap), [0, 0, n], [0, n, n], [0, n, 0], [n, n, 0], [n, 0, 0], toward(bottom, [n, 0, 0], gap)].map((q) => pr(q as V3)))}" ${st}/>`);
    out.push(`<polyline points="${poly([pr([0, n, n]), pr(toward(topC, [0, n, n], gap))])}" ${st}/>`);
    out.push(`<polyline points="${poly([pr([n, n, 0]), pr(toward(topC, [n, n, 0], gap))])}" ${st}/>`);
  }

  // --- helpers ---
  const roundRect = (m: (u: number, v: number) => P, u0: number, v0: number, u1: number, v1: number, rad: number) => {
    const pts: P[] = [];
    const corner = (cu: number, cv: number, a0: number) => {
      for (let i = 0; i <= 6; i++) {
        const a = a0 + (i / 6) * (Math.PI / 2);
        pts.push(m(cu + Math.cos(a) * rad, cv + Math.sin(a) * rad));
      }
    };
    corner(u1 - rad, v1 - rad, 0);
    corner(u0 + rad, v1 - rad, Math.PI / 2);
    corner(u0 + rad, v0 + rad, Math.PI);
    corner(u1 - rad, v0 + rad, (3 * Math.PI) / 2);
    return poly(pts);
  };
  /** a voxel standing on face cell (u, v), extruded by h along the face normal */
  const voxel = (id: FaceId, u: number, v: number, h: number, col: string, ins = 0.08) => {
    const m = map[id];
    const a = u + ins, b = u + 1 - ins, c = v + ins, d = v + 1 - ins;
    const cap = poly([m(a, c, h), m(b, c, h), m(b, d, h), m(a, d, h)]);
    // the two sides the camera sees
    const s1 = id === 'top' ? poly([m(b, c, 0), m(b, d, 0), m(b, d, h), m(b, c, h)]) : poly([m(b, c, 0), m(b, d, 0), m(b, d, h), m(b, c, h)]);
    const s2 = id === 'top' ? poly([m(a, d, 0), m(b, d, 0), m(b, d, h), m(a, d, h)]) : poly([m(a, d, 0), m(b, d, 0), m(b, d, h), m(a, d, h)]);
    const base = col.startsWith('#') ? col : '#19C37D';
    out.push(`<polygon points="${s1}" fill="${shade(base, id === 'top' ? 0.7 : 0.6)}"/>`);
    out.push(`<polygon points="${s2}" fill="${shade(base, id === 'top' ? 0.52 : 1.3)}"/>`);
    out.push(`<polygon points="${cap}" fill="${id === 'top' ? shade(base, 1.18) : base}"/>`);
  };
  const eyeAt = (id: FaceId, u0: number, v0: number, ring: number) => {
    const m = map[id], k = ring / 2;
    out.push(`<polygon points="${roundRect(m, u0 + k, v0 + k, u0 + 3 - k, v0 + 3 - k, 0.62)}" fill="none" stroke="${pal.eye}" stroke-width="${ring}" stroke-linejoin="round"/>`);
    out.push(`<polygon points="${roundRect(m, u0 + 1.02, v0 + 1.02, u0 + 1.98, v0 + 1.98, 0.28)}" fill="${pal.eyeCore}"/>`);
  };

  // ===== LEFT · QR: eye + extruded modules =====
  const e0 = 1;
  eyeAt('left', e0, e0, level === 'S' ? 0.75 : 0.62);
  if (level !== 'S') {
    const cells: [number, number][] = [];
    for (let u = e0; u < n - e0; u++)
      for (let v = e0; v < n - e0; v++) {
        if (u < e0 + 4 && v < e0 + 4) continue; // eye + separator
        if (hash(u, v, 11) < (level === 'L' ? 0.42 : 0.34)) cells.push([u, v]);
      }
    cells.sort((a, b) => a[0] - b[0] || a[1] - b[1]).forEach(([u, v]) => voxel('left', u, v, 0.55, accent));
  }

  // ===== RIGHT · pixel G extruded =====
  {
    const glyph = level === 'S' ? G_SMALL : G;
    const gw = glyph[0].length, gh = glyph.length;
    const u0 = Math.round((n - gw) / 2), v0 = Math.round((n - gh) / 2);
    const cells: [number, number][] = [];
    glyph.forEach((row, ri) => [...row].forEach((ch, ci) => ch === 'X' && cells.push([u0 + ci, v0 + (gh - 1 - ri)])));
    // the right face's u runs along z: mirror so the G reads left-to-right on screen
    const mirrored = cells.map(([u, v]) => [n - 1 - u, v] as [number, number]);
    mirrored.sort((a, b) => a[0] - b[0] || a[1] - b[1]).forEach(([u, v]) => voxel('right', u, v, level === 'S' ? 0.5 : 0.55, pal.eyeCore.startsWith('#') ? pal.eyeCore : accent));
  }

  // ===== TOP · flat → volume =====
  {
    const cells: { u: number; v: number; t: number }[] = [];
    for (let u = e0; u < n - e0; u++)
      for (let v = e0; v < n - e0; v++) {
        if ((u + v) % 2) continue; // checkerboard keeps it light
        const t = (u + v) / (2 * (n - e0 - 1)); // 0 at the back corner → 1 at the front corner
        cells.push({ u, v, t });
      }
    cells.sort((a, b) => a.u + a.v - (b.u + b.v));
    cells.forEach(({ u, v, t }) => {
      const m = map.top;
      if (level === 'S') {
        if (t > 0.55) voxel('top', u, v, 0.5 + (t - 0.55) * 1.6, accent, 0.1);
        return;
      }
      if (t < 0.36) out.push(`<polygon points="${roundRect(m, u + 0.16, v + 0.16, u + 0.84, v + 0.84, 0.12)}" fill="none" stroke="${accent}" stroke-width="0.12" opacity="0.85"/>`);
      else if (t < 0.6) out.push(`<polygon points="${roundRect(m, u + 0.12, v + 0.12, u + 0.88, v + 0.88, 0.12)}" fill="${accent}"/>`);
      else voxel('top', u, v, 0.35 + (t - 0.6) * 3.2, accent);
    });
  }

  // ===== front vertical edge: dots at both ends, even spacing =====
  const step = level === 'S' ? 1.7 : 1.1;
  const count = Math.max(2, Math.round(n / step) + 1);
  for (let i = 0; i < count; i++) {
    const p = iso(n, (i / (count - 1)) * n, n);
    out.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(dotR * 1.25)}" fill="${pal.frontDot}"/>`);
  }

  // viewBox: room for voxels standing out of the faces (top ones rise up to ~1.6 cells)
  const minX = iso(0, 0, n)[0] - 1.4, maxX = iso(n, 0, 0)[0] + 1.4;
  const minY = iso(0, n, 0)[1] - 2.2, maxY = iso(n, 0, n)[1] + 1.2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(minX)} ${f(minY)} ${f(maxX - minX)} ${f(maxY - minY)}" width="${px}" height="${px}" ${extraAttrs}>${out.join('')}</svg>`;
}
