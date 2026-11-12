/**
 * Gridika mark: an isometric cube built on a grid.
 *  - the front vertical edge (where the left and right faces meet) is a column of dots,
 *    with a dot exactly at each end and even spacing in between; the outline stops short of it;
 *  - the faces carry rounded QR finder "eyes" drawn in each face's perspective;
 *  - optional: QR data modules (squares, dots or extruded voxels), timing-style traces.
 * Everything snaps to grid cells, so the mark stays crisp and is tuned with parameters.
 */

export interface MarkOptions {
  /** grid cells per cube edge */
  n?: number;
  /** cube face fills (null = no fill, wireframe) */
  faces?: { top: string; left: string; right: string } | null;
  /** cube outline colour (null = no outline) */
  edge?: string | null;
  edgeWidth?: number;
  /** finder eyes */
  eye?: string;
  eyeCore?: string;
  /** one eye per face (connected over the top) or three per face like a real QR */
  eyes?: 'single' | 'qr3';
  /** dots on the traces and on the front edge */
  dot?: string;
  frontDot?: string;
  /** dot radius in grid cells */
  dotR?: number;
  /** traces between the eyes: plain dots, QR timing (big/small alternating) or none */
  traces?: 'dots' | 'timing' | 'none';
  /** QR data modules on the faces */
  modules?: { kind: 'square' | 'dot' | 'voxel'; density: number; fade?: boolean; color?: string; seed?: number } | null;
  /** extra glow behind the front edge dots */
  glow?: boolean;
  /** gap between the outline and the dotted front edge, in cells */
  edgeGap?: number;
  /** target spacing of the front edge dots, in cells (the count is derived from it) */
  frontStep?: number;
  /** eye ring width in cells */
  eyeRing?: number;
}

type P = [number, number];
type FaceId = 'left' | 'right' | 'top';

const C30 = Math.cos(Math.PI / 6);
const S30 = 0.5;

/** world (x, y up, z) -> isometric screen (cube in [0, n]^3) */
function iso(x: number, y: number, z: number): P {
  return [(x - z) * C30, (x + z) * S30 - y];
}

const f = (v: number) => +v.toFixed(3);
const poly = (pts: P[]) => pts.map((p) => `${f(p[0])},${f(p[1])}`).join(' ');
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return s - Math.floor(s);
};
/** lighten / darken a #rrggbb colour */
function shade(hex: string, k: number) {
  const v = parseInt(hex.slice(1, 7), 16);
  const ch = (x: number) => Math.max(0, Math.min(255, Math.round(k >= 1 ? x + (255 - x) * (k - 1) : x * k)));
  return `rgb(${ch((v >> 16) & 255)},${ch((v >> 8) & 255)},${ch(v & 255)})`;
}

export function gridikaMarkSvg(o: MarkOptions = {}, size = 64, extraAttrs = ''): string {
  const n = o.n ?? 8;
  const faces = o.faces === undefined ? { top: '#16382c', left: '#0f2a20', right: '#0a1f17' } : o.faces;
  const edge = o.edge === undefined ? '#19C37D' : o.edge;
  const ew = o.edgeWidth ?? 0.32;
  const eye = o.eye ?? '#19C37D';
  const eyeCore = o.eyeCore ?? '#8BF0C2';
  const dot = o.dot ?? '#19C37D';
  const frontDot = o.frontDot ?? '#8BF0C2';
  const r = o.dotR ?? 0.24;
  const layout = o.eyes ?? 'single';
  const traces = o.traces ?? 'dots';
  const ring = o.eyeRing ?? 0.62;

  // face mappers: (u, v) in [0, n]^2 on the face; u = n is the edge shared with the front
  const map: Record<FaceId, (u: number, v: number, h?: number) => P> = {
    left: (u, v, h = 0) => iso(u, v, n + h), // z = n face, u along x, v up
    right: (u, v, h = 0) => iso(n + h, v, u), // x = n face, u along z, v up
    top: (u, v, h = 0) => iso(u, n + h, v), // y = n face, u along x, v along z
  };

  const out: string[] = [];

  // ---- cube faces ----
  if (faces) {
    (['top', 'left', 'right'] as FaceId[]).forEach((id) => {
      const m = map[id];
      out.push(`<polygon points="${poly([m(0, 0), m(n, 0), m(n, n), m(0, n)])}" fill="${faces[id]}"/>`);
    });
  }

  // ---- outline: stops short of the dotted front edge at both ends ----
  if (edge) {
    const gap = o.edgeGap ?? 0.9;
    type V3 = [number, number, number];
    const toward = (a: V3, b: V3, d: number): V3 => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      return [a[0] + ((b[0] - a[0]) * d) / L, a[1] + ((b[1] - a[1]) * d) / L, a[2] + ((b[2] - a[2]) * d) / L];
    };
    const pr = (q: V3) => iso(q[0], q[1], q[2]);
    const bottom: V3 = [n, 0, n], topC: V3 = [n, n, n];
    const stroke = `fill="none" stroke="${edge}" stroke-width="${ew}" stroke-linejoin="round" stroke-linecap="round"`;
    const loop: V3[] = [toward(bottom, [0, 0, n], gap), [0, 0, n], [0, n, n], [0, n, 0], [n, n, 0], [n, 0, 0], toward(bottom, [n, 0, 0], gap)];
    out.push(`<polyline points="${poly(loop.map(pr))}" ${stroke}/>`);
    out.push(`<polyline points="${poly([pr([0, n, n]), pr(toward(topC, [0, n, n], gap))])}" ${stroke}/>`);
    out.push(`<polyline points="${poly([pr([n, n, 0]), pr(toward(topC, [n, n, 0], gap))])}" ${stroke}/>`);
  }

  // ---- helpers ----
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
  const dotAt = (p: P, rr = r, c = dot) => out.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(rr)}" fill="${c}"/>`);

  // ---- eye positions (3×3 cells each) per face ----
  const e0 = 1;
  const far = e0, hi = n - e0 - 3, near = n - e0 - 3;
  const eyes: Record<FaceId, [number, number][]> =
    layout === 'qr3'
      ? {
          // like a real QR: three corners; the free corner is the one next to the front edge
          left: [[far, far], [far, hi], [near, hi]],
          right: [[far, far], [far, hi], [near, hi]],
          top: [[far, far], [near, far], [far, near]],
        }
      : { left: [[far, far]], right: [[far, far]], top: [[far, far]] };

  // cells taken by eyes (with a 1-cell separator, as in QR) and by traces: no data modules there
  const taken: Record<FaceId, Set<string>> = { left: new Set(), right: new Set(), top: new Set() };
  (Object.keys(eyes) as FaceId[]).forEach((id) =>
    eyes[id].forEach(([u0, v0]) => {
      for (let u = u0 - 1; u < u0 + 4; u++) for (let v = v0 - 1; v < v0 + 4; v++) taken[id].add(`${u},${v}`);
    }),
  );

  // ---- traces ----
  const traceDots: { id: FaceId; u: number; v: number; k: number }[] = [];
  const mid = e0 + 1.5;
  if (traces !== 'none') {
    if (layout === 'single') {
      // over the top: up each side face, then across the top face into the top eye
      let k = 0;
      for (let v = e0 + 3.5; v < n; v += 1, k++) {
        traceDots.push({ id: 'left', u: mid, v, k });
        traceDots.push({ id: 'right', u: mid, v, k });
      }
      for (let w = n - 0.5; w > e0 + 3; w -= 1, k++) {
        traceDots.push({ id: 'top', u: mid, v: w, k });
        traceDots.push({ id: 'top', u: w, v: mid, k });
      }
    } else {
      // QR timing lines between the eyes on every face
      (['left', 'right', 'top'] as FaceId[]).forEach((id) => {
        const line = e0 + 2.5; // just inside the eyes' inner edge, like row/column 6 in a QR
        if (id === 'top') {
          for (let w = e0 + 3.5, k = 0; w < near; w += 1, k++) {
            traceDots.push({ id, u: w, v: line, k });
            traceDots.push({ id, u: line, v: w, k });
          }
        } else {
          for (let w = e0 + 3.5, k = 0; w < hi; w += 1, k++) traceDots.push({ id, u: line, v: w, k }); // far eyes, up
          for (let w = e0 + 3.5, k = 0; w < near; w += 1, k++) traceDots.push({ id, u: w, v: hi + 0.5, k }); // across the top
        }
      });
    }
  }
  traceDots.forEach((t) => taken[t.id].add(`${Math.floor(t.u)},${Math.floor(t.v)}`));

  // ---- data modules ----
  const mods = o.modules;
  const voxels: { id: FaceId; u: number; v: number }[] = [];
  if (mods) {
    const col = mods.color ?? dot;
    const seed = mods.seed ?? 7;
    (['top', 'left', 'right'] as FaceId[]).forEach((id, fi) => {
      for (let u = e0; u < n - e0; u++)
        for (let v = e0; v < n - e0; v++) {
          if (taken[id].has(`${u},${v}`)) continue;
          // optional fade: fewer modules near the front edge (u -> n; on top also v -> n)
          const nearness = id === 'top' ? Math.max(u, v) / n : u / n;
          const p = mods.density * (mods.fade ? 1 - 0.75 * nearness : 1);
          if (hash(u, v, fi * 31 + seed) > p) continue;
          const m = map[id];
          if (mods.kind === 'dot') dotAt(m(u + 0.5, v + 0.5), r * 1.15, col);
          else if (mods.kind === 'voxel' && id !== 'top') voxels.push({ id, u, v });
          else out.push(`<polygon points="${roundRect(m, u + 0.12, v + 0.12, u + 0.88, v + 0.88, 0.16)}" fill="${col}"/>`);
        }
    });
  }

  // ---- eyes ----
  (Object.keys(eyes) as FaceId[]).forEach((id) =>
    eyes[id].forEach(([u0, v0]) => {
      const m = map[id], k = ring / 2;
      out.push(`<polygon points="${roundRect(m, u0 + k, v0 + k, u0 + 3 - k, v0 + 3 - k, 0.62)}" fill="none" stroke="${eye}" stroke-width="${ring}" stroke-linejoin="round"/>`);
      out.push(`<polygon points="${roundRect(m, u0 + 1.02, v0 + 1.02, u0 + 1.98, v0 + 1.98, 0.28)}" fill="${eyeCore}"/>`);
    }),
  );

  // ---- traces (drawn over modules) ----
  traceDots.forEach((t) => {
    const p = map[t.id](t.u, t.v);
    if (traces === 'timing') dotAt(p, t.k % 2 === 0 ? r * 1.15 : r * 0.55, t.k % 2 === 0 ? dot : shade(dot.startsWith('#') ? dot : '#19C37D', 0.7));
    else dotAt(p);
  });

  // ---- extruded voxels on the side faces (painter's order: back to front, bottom to top) ----
  if (voxels.length) {
    const base = mods?.color ?? dot;
    const h = 0.55;
    voxels.sort((a, b) => a.u - b.u || a.v - b.v);
    voxels.forEach(({ id, u, v }) => {
      const m = map[id];
      const front = poly([m(u + 0.08, v + 0.08, h), m(u + 0.92, v + 0.08, h), m(u + 0.92, v + 0.92, h), m(u + 0.08, v + 0.92, h)]);
      const topQ = poly([m(u + 0.08, v + 0.92, 0), m(u + 0.92, v + 0.92, 0), m(u + 0.92, v + 0.92, h), m(u + 0.08, v + 0.92, h)]);
      const sideQ = poly([m(u + 0.92, v + 0.08, 0), m(u + 0.92, v + 0.92, 0), m(u + 0.92, v + 0.92, h), m(u + 0.92, v + 0.08, h)]);
      out.push(`<polygon points="${sideQ}" fill="${shade(base.startsWith('#') ? base : '#19C37D', 0.62)}"/>`);
      out.push(`<polygon points="${topQ}" fill="${shade(base.startsWith('#') ? base : '#19C37D', 1.35)}"/>`);
      out.push(`<polygon points="${front}" fill="${base}"/>`);
    });
  }

  // ---- front vertical edge: dots exactly at both ends, evenly spaced in between ----
  const step = o.frontStep ?? 1;
  const count = Math.max(2, Math.round(n / step) + 1);
  for (let i = 0; i < count; i++) {
    const y = (i / (count - 1)) * n;
    if (o.glow) dotAt(iso(n, y, n), r * 2.2, `${frontDot}33`);
    dotAt(iso(n, y, n), r * 1.25, frontDot);
  }

  // ---- viewBox around the cube (plus room for extruded voxels) ----
  const pad = 0.8 + (voxels.length ? 0.6 : 0);
  const minX = iso(0, 0, n)[0] - pad, maxX = iso(n, 0, 0)[0] + pad;
  const minY = iso(0, n, 0)[1] - pad, maxY = iso(n, 0, n)[1] + pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(minX)} ${f(minY)} ${f(maxX - minX)} ${f(maxY - minY)}" width="${size}" height="${size}" ${extraAttrs}>${out.join('')}</svg>`;
}

/** ready-made looks to compare in the lab */
export const MARK_LOOKS: { id: string; title: string; opts: MarkOptions }[] = [
  { id: 'night', title: 'Ночной: тёмные грани, зелёный контур', opts: {} },
  { id: 'glow', title: 'С подсветкой ребра', opts: { glow: true } },
  { id: 'wire', title: 'Каркас: без заливки', opts: { faces: null } },
  { id: 'solid', title: 'Зелёный куб, тёмные глазки', opts: { faces: { top: '#3fe09a', left: '#19C37D', right: '#12a066' }, edge: null, eye: '#0b2a20', eyeCore: '#0b2a20', dot: '#0b2a20', frontDot: '#ffffff' } },
  { id: 'light', title: 'Светлый: для белого фона', opts: { faces: { top: '#ffffff', left: '#f3efe7', right: '#e8e2d4' }, edge: '#132A22', eye: '#132A22', eyeCore: '#19C37D', dot: '#132A22', frontDot: '#19C37D' } },
];

/** design directions for the faces */
export const MARK_CONCEPTS: { id: string; title: string; text: string; opts: MarkOptions }[] = [
  {
    id: 'qr3',
    title: 'A. QR на гранях',
    text: 'По три глазка на грани, как в настоящем QR; свободный угол — у переднего ребра. Модули данных — скруглённые квадратики, между глазками тайминг.',
    opts: { n: 13, eyes: 'qr3', traces: 'timing', modules: { kind: 'square', density: 0.42, color: '#19C37D' }, dotR: 0.26, edgeWidth: 0.42, edgeGap: 1.2, frontStep: 1.5 },
  },
  {
    id: 'dots',
    title: 'B. Точечный QR',
    text: 'Модули — кружочки, как в стилизованных QR; к переднему ребру их всё меньше, код «стекает» в ребро. Дорожки через верх — тайминг.',
    opts: { n: 11, traces: 'timing', modules: { kind: 'dot', density: 0.62, fade: true, color: '#19C37D' }, dotR: 0.27, edgeWidth: 0.38, edgeGap: 1.1, frontStep: 1.1 },
  },
  {
    id: 'voxel',
    title: 'C. Плоское → объём',
    text: 'Сверху модули плоские, как напечатанный QR; на боковых гранях те же модули выдавлены кубиками — QR превращается в 3D.',
    opts: { n: 11, traces: 'dots', modules: { kind: 'voxel', density: 0.4, color: '#19C37D' }, dotR: 0.26, edgeWidth: 0.38, edgeGap: 1.1, frontStep: 1.1 },
  },
];

/** size system: the same mark simplified for small sizes */
export const MARK_SIZES: { id: string; title: string; px: number; opts: MarkOptions }[] = [
  { id: 'L', title: 'L · сайт, презентации', px: 150, opts: MARK_CONCEPTS[1].opts },
  { id: 'M', title: 'M · шапка', px: 44, opts: {} },
  { id: 'S', title: 'S · значок вкладки', px: 20, opts: { n: 5, traces: 'none', dotR: 0.42, edgeWidth: 0.55, edgeGap: 0.9, frontStep: 1.7, eyeRing: 0.75 } },
];

// ---------------------------------------------------------------------------
// Chosen direction: B · dotted QR. One mark, three levels of detail picked by size.
// ---------------------------------------------------------------------------

export interface Palette {
  faces: MarkOptions['faces'];
  edge: string | null;
  eye: string;
  eyeCore: string;
  dot: string;
  frontDot: string;
  /** background it is designed for (used in the lab) */
  bg: string;
}

export const GRIDIKA_PALETTES: Record<string, { title: string; p: Palette }> = {
  dark: { title: 'Основной · для тёмного фона', p: { faces: { top: '#16382c', left: '#0f2a20', right: '#0a1f17' }, edge: '#19C37D', eye: '#19C37D', eyeCore: '#8BF0C2', dot: '#19C37D', frontDot: '#8BF0C2', bg: '#0c1a14' } },
  light: { title: 'Для светлого фона', p: { faces: { top: '#ffffff', left: '#f3efe7', right: '#e8e2d4' }, edge: '#132A22', eye: '#132A22', eyeCore: '#19C37D', dot: '#132A22', frontDot: '#19C37D', bg: '#f6f3ee' } },
  green: { title: 'Зелёная заливка', p: { faces: { top: '#3fe09a', left: '#19C37D', right: '#12a066' }, edge: null, eye: '#0b2a20', eyeCore: '#0b2a20', dot: '#0b2a20', frontDot: '#ffffff', bg: '#f6f3ee' } },
  mono: { title: 'Одноцветный · печать, штамп', p: { faces: null, edge: '#132A22', eye: '#132A22', eyeCore: '#132A22', dot: '#132A22', frontDot: '#132A22', bg: '#ffffff' } },
  monoWhite: { title: 'Белый · на фото и цвете', p: { faces: null, edge: '#ffffff', eye: '#ffffff', eyeCore: '#ffffff', dot: '#ffffff', frontDot: '#ffffff', bg: '#19C37D' } },
};

/** detail levels of the dotted-QR mark */
export function gridikaLevel(px: number): 'L' | 'M' | 'S' {
  return px >= 96 ? 'L' : px >= 28 ? 'M' : 'S';
}

/** The Gridika mark at a given pixel size: detail is chosen automatically. */
export function gridikaMark(px: number, palette: keyof typeof GRIDIKA_PALETTES = 'dark', extraAttrs = ''): string {
  const p = GRIDIKA_PALETTES[palette].p;
  const colours: MarkOptions = { faces: p.faces, edge: p.edge, eye: p.eye, eyeCore: p.eyeCore, dot: p.dot, frontDot: p.frontDot };
  const level = gridikaLevel(px);
  const opts: MarkOptions =
    level === 'L'
      ? { n: 11, traces: 'timing', modules: { kind: 'dot', density: 0.62, fade: true, color: p.dot }, dotR: 0.27, edgeWidth: 0.38, edgeGap: 1.1, frontStep: 1.1 }
      : level === 'M'
        ? { n: 8, traces: 'timing', modules: { kind: 'dot', density: 0.38, fade: true, color: p.dot, seed: 3 }, dotR: 0.3, edgeWidth: 0.42, edgeGap: 0.95, frontStep: 1.15 }
        : { n: 5, traces: 'none', dotR: 0.42, edgeWidth: 0.55, edgeGap: 0.9, frontStep: 1.7, eyeRing: 0.75 };
  return gridikaMarkSvg({ ...opts, ...colours }, px, extraAttrs);
}
