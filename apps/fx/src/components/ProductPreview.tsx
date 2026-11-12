import type { ProductId } from '../data/products';

/**
 * Small isometric voxel illustrations for the planned products (studio stage + catalog cards).
 * Pure SVG: each preview is a list of cubes [x, y, z, colour] drawn back-to-front.
 */

type Cube = [number, number, number, string];

const S = 10; // cube edge in px (before the viewBox scale)

function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  const r = ch((n >> 16) & 255), g = ch((n >> 8) & 255), b = ch(n & 255);
  return `rgb(${r},${g},${b})`;
}

function iso(x: number, y: number, z: number): [number, number] {
  // x → right-down, z → left-down, y → up
  return [(x - z) * S * 0.866, (x + z) * S * 0.5 - y * S];
}

function cubePolys(c: Cube) {
  const [x, y, z, col] = c;
  const p = (dx: number, dy: number, dz: number) => iso(x + dx, y + dy, z + dz).join(',');
  const top = [p(0, 1, 0), p(1, 1, 0), p(1, 1, 1), p(0, 1, 1)].join(' ');
  const left = [p(0, 1, 1), p(1, 1, 1), p(1, 0, 1), p(0, 0, 1)].join(' ');
  const right = [p(1, 1, 0), p(1, 1, 1), p(1, 0, 1), p(1, 0, 0)].join(' ');
  return { top, left, right, col };
}

const R = '#e5484d', Y = '#f2c14e', P = '#e0568a';
// product colours (match theme.accent in data/products.ts)
const SLATE = '#3a4352', PAPER = '#e9edf3', VIO = '#8b5cf6', VIO_L = '#c4b0fb', AMB = '#f5a524', AMB_D = '#4a2a06', G = '#19C37D';

function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, col: string): Cube[] {
  const out: Cube[] = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) out.push([x, y, z, col]);
  return out;
}

/** tiny 3×5 digit font for the timer */
const DIGITS: Record<string, string[]> = {
  '0': ['111', '101', '101', '101', '111'],
  '7': ['111', '001', '010', '010', '010'],
  '2': ['111', '001', '111', '100', '111'],
  '9': ['111', '101', '111', '001', '111'],
};

function digit(ch: string, x0: number, col: string): Cube[] {
  const rows = DIGITS[ch];
  const out: Cube[] = [];
  rows.forEach((row, i) => [...row].forEach((v, j) => v === '1' && out.push([x0 + j, 4 - i, 0, col])));
  return out;
}

export type QrVariant = 'tree' | 'city' | 'castle';

function qrSlab(): Cube[] {
  const cubes: Cube[] = [];
  const qr = ['1110111', '1010100', '1110101', '0001010', '1101110', '0100101', '1011011'];
  qr.forEach((row, x) => [...row].forEach((v, z) => cubes.push([x, 0, z, v === '1' ? '#1b2b24' : '#f3efe7'])));
  return cubes;
}

function scene(id: ProductId, variant: QrVariant = 'tree'): Cube[] {
  if (id === 'qr-morph' && variant === 'city') {
    const cubes = qrSlab();
    const towers: [number, number, number, string][] = [
      [1, 1, 4, '#3b4a8a'], [3, 1, 3, '#5b6b9a'], [5, 1, 2, '#f2c14e'], [1, 4, 2, '#e8e2d4'], [4, 4, 5, '#2f3d73'], [2, 3, 1, '#19C37D'], [5, 5, 3, '#8a96c8'],
    ];
    towers.forEach(([x, z, hgt, col]) => cubes.push(...box(x, x, 1, hgt, z, z, col)));
    return cubes;
  }
  if (id === 'qr-morph' && variant === 'castle') {
    const cubes = qrSlab();
    const stone = '#b8b0a2', dark = '#8f8778', roof = '#d0507f';
    cubes.push(...box(1, 5, 1, 1, 1, 1, stone), ...box(1, 1, 1, 1, 1, 5, stone), ...box(1, 5, 1, 1, 5, 5, stone), ...box(5, 5, 1, 1, 1, 5, stone));
    [[1, 1], [5, 1], [1, 5], [5, 5]].forEach(([x, z]) => cubes.push(...box(x, x, 2, 3, z, z, dark), [x, 4, z, roof]));
    cubes.push(...box(3, 3, 1, 4, 3, 3, stone), [3, 5, 3, roof], [3, 6, 3, '#f2c14e']);
    return cubes;
  }
  switch (id) {
    case 'qr-morph': {
      // QR slab with a voxel tree growing out of it
      const cubes: Cube[] = [];
      const qr = ['1110111', '1010100', '1110101', '0001010', '1101110', '0100101', '1011011'];
      qr.forEach((row, x) => [...row].forEach((v, z) => cubes.push([x, 0, z, v === '1' ? '#1b2b24' : '#f3efe7'])));
      for (let y = 1; y <= 3; y++) cubes.push([3, y, 3, '#7a4a2e']);
      cubes.push(...box(2, 4, 4, 5, 2, 4, G), ...box(3, 3, 6, 6, 3, 3, '#8BF0C2'));
      return cubes;
    }
    case 'qr-card': {
      // slab card with a QR pattern on top
      const cubes: Cube[] = box(0, 6, 0, 0, 0, 3, SLATE);
      const qr = ['1101', '0110', '1011', '1100', '0111', '1010', '1101'];
      qr.forEach((row, x) => [...row].forEach((v, z) => v === '1' && cubes.push([x, 1, z, PAPER])));
      return cubes;
    }
    case 'gift-box': {
      const cubes: Cube[] = [...box(0, 3, 0, 2, 0, 3, R)];
      // ribbon
      for (let y = 0; y <= 3; y++) cubes.push([1, y, 3, Y], [3, y, 1, Y]);
      cubes.push(...box(0, 3, 3, 3, 0, 3, R));
      cubes.push([1, 4, 1, Y], [2, 4, 2, Y], [1, 4, 2, Y], [2, 4, 1, Y]);
      return cubes;
    }
    case 'voxel-logo': {
      // a chunky "V"
      const v = ['1001', '1001', '1001', '0110', '0110'];
      const cubes: Cube[] = [];
      v.forEach((row, i) => [...row].forEach((c, j) => c === '1' && cubes.push([j, 4 - i, 0, VIO], [j, 4 - i, 1, VIO_L])));
      return cubes;
    }
    case 'voxel-morph': {
      // left half "before" (grey), right half "after" (colour), a few cubes flying between
      const cubes: Cube[] = [...box(0, 2, 0, 2, 0, 0, '#a8a29e'), ...box(4, 6, 0, 2, 0, 0, P)];
      cubes.push([3, 3, 0, P], [3, 1, 0, '#a8a29e'], [2, 4, 0, P]);
      return cubes;
    }
    case 'sale-timer':
      return [...digit('0', 0, AMB_D), ...digit('7', 4, AMB), [8, 3, 0, AMB_D], [8, 1, 0, AMB_D], ...digit('2', 10, AMB_D), ...digit('9', 14, AMB)];
    default:
      return box(0, 2, 0, 2, 0, 2, G);
  }
}

export function ProductPreview({ id, variant, className = '', float = true }: { id: ProductId; variant?: QrVariant; className?: string; float?: boolean }) {
  const cubes = scene(id, variant)
    .slice()
    .sort((a, b) => a[0] + a[2] - (b[0] + b[2]) || a[1] - b[1]);
  const pts = cubes.flatMap(([x, y, z]) => [iso(x, y, z), iso(x + 1, y + 1, z + 1), iso(x + 1, y, z), iso(x, y, z + 1), iso(x, y + 1, z)]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const pad = 6;
  const minX = Math.min(...xs) - pad, minY = Math.min(...ys) - pad;
  const w = Math.max(...xs) - minX + pad, h = Math.max(...ys) - minY + pad;
  return (
    <svg viewBox={`${minX} ${minY} ${w} ${h}`} className={className} aria-hidden="true" style={float ? { animation: 'vxfloat 4.5s ease-in-out infinite' } : undefined}>
      <style>{'@keyframes vxfloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}'}</style>
      {cubes.map((c, i) => {
        const q = cubePolys(c);
        return (
          <g key={i}>
            <polygon points={q.top} fill={shade(q.col, 1.12)} />
            <polygon points={q.left} fill={shade(q.col, 0.82)} />
            <polygon points={q.right} fill={shade(q.col, 0.66)} />
          </g>
        );
      })}
    </svg>
  );
}
