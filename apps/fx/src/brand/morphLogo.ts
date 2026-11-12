import * as THREE from 'three';

/**
 * Gridika header morph: the name "Gridika" (real text at the top of the page) breaks into tiny
 * cubes that fly, turn and reassemble into the 3D "flat → volume" cube mark — and back.
 *
 * - start: a voxel copy of the text, laid flat in the screen plane exactly over the HTML text;
 * - end:   the cube mark built from voxels (QR on the left face, G on the right, rising cells on top,
 *          dots on the front edge), seen isometrically like the SVG mark;
 * - progress 0..1 (from scroll) is smoothed; every cube starts with its own delay (a wave),
 *   moves on an arc and turns from "screen-aligned" to "world-aligned".
 */

export interface MorphLogo {
  setProgress(p: number): void;
  snap(p: number): void;
  dispose(): void;
  readonly counts: { text: number; logo: number };
}

interface Options {
  /** where the finished mark sits in the host, CSS px (centre) */
  logoCenter: { x: number; y: number };
  /** finished mark height, CSS px */
  logoSize: number;
  green?: string;
  mint?: string;
  dark?: string;
  faces?: { top: string; left: string; right: string };
}

type V3 = [number, number, number];

// ---------- the cube mark as voxels (cell units, cube spans [0, n]^3) ----------
const G = ['.XXXXX.', 'X......', 'X......', 'X..XXXX', 'X.....X', 'X.....X', '.XXXXX.'];
const hash = (a: number, b: number, c: number) => {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
  return s - Math.floor(s);
};

interface LogoVoxel {
  p: V3; // centre
  s: V3; // size
  kind: 'edge' | 'dot' | 'eye' | 'qr' | 'g' | 'top';
}

function buildMark(n: number): LogoVoxel[] {
  const out: LogoVoxel[] = [];
  const e = 0.34; // edge thickness
  const edge = (a: V3, b: V3, skipEnd = 0, skipStart = 0) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    const steps = Math.round(len);
    for (let i = 0; i < steps; i++) {
      const t0 = i / steps;
      if (i < skipStart || i >= steps - skipEnd) continue;
      const t = t0 + 0.5 / steps;
      out.push({ p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], s: [b[0] !== a[0] ? 1 : e, b[1] !== a[1] ? 1 : e, b[2] !== a[2] ? 1 : e], kind: 'edge' });
    }
  };
  // visible outline; the lines stop one cell short of the dotted front edge
  edge([0, 0, n], [0, n, n]);
  edge([0, n, n], [0, n, 0]);
  edge([0, n, 0], [n, n, 0]);
  edge([n, n, 0], [n, 0, 0]);
  edge([n, 0, 0], [n, 0, n], 1);
  edge([0, 0, n], [n, 0, n], 1);
  edge([0, n, n], [n, n, n], 1);
  edge([n, n, 0], [n, n, n], 1);
  // front vertical edge: dots, one at each end, even spacing
  const count = Math.round(n / 1.1) + 1;
  for (let i = 0; i < count; i++) out.push({ p: [n, (i / (count - 1)) * n, n], s: [0.62, 0.62, 0.62], kind: 'dot' });

  // LEFT face (z = n): QR eye + extruded modules
  const L = (u: number, v: number, h: number): LogoVoxel['p'] => [u + 0.5, v + 0.5, n + h / 2];
  for (let u = 1; u < 4; u++) for (let v = 1; v < 4; v++) if (!(u === 2 && v === 2)) out.push({ p: L(u, v, 0.3), s: [0.9, 0.9, 0.3], kind: 'eye' });
  out.push({ p: L(2, 2, 0.4), s: [0.8, 0.8, 0.4], kind: 'dot' });
  for (let u = 1; u < n - 1; u++)
    for (let v = 1; v < n - 1; v++) {
      if (u < 5 && v < 5) continue;
      if (hash(u, v, 11) < 0.4) out.push({ p: L(u, v, 0.55), s: [0.84, 0.84, 0.55], kind: 'qr' });
    }
  // RIGHT face (x = n): pixel G, mirrored so it reads left to right
  const gu0 = Math.round((n - 7) / 2), gv0 = Math.round((n - 7) / 2);
  G.forEach((row, ri) =>
    [...row].forEach((ch, ci) => {
      if (ch !== 'X') return;
      const u = n - 1 - (gu0 + ci), v = gv0 + (6 - ri);
      out.push({ p: [n + 0.275, v + 0.5, u + 0.5], s: [0.55, 0.84, 0.84], kind: 'g' });
    }),
  );
  // TOP face (y = n): flat at the back → rising cubes at the front
  for (let u = 1; u < n - 1; u++)
    for (let v = 1; v < n - 1; v++) {
      if ((u + v) % 2) continue;
      const t = (u + v) / (2 * (n - 2));
      const h = t < 0.6 ? 0.12 : 0.35 + (t - 0.6) * 3.2;
      out.push({ p: [u + 0.5, n + h / 2, v + 0.5], s: [0.76, h, 0.76], kind: 'top' });
    }
  // centre the cube on the origin
  return out.map((vx) => ({ ...vx, p: [vx.p[0] - n / 2, vx.p[1] - n / 2, vx.p[2] - n / 2] as V3 }));
}

// ---------- the text as voxels, laid out where the HTML text is ----------
// Each letter is turned into cubes on its own and the letters are placed with at least one empty
// column between them, so neighbours never fuse (e.g. the arm of "r" touching "i").
function textCells(textEl: HTMLElement, host: HTMLElement, cell: number, green: string, dark: string) {
  const hr = host.getBoundingClientRect();
  const tr = textEl.getBoundingClientRect();
  const cs = getComputedStyle(textEl);
  const word = 'Gridika';
  const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.font = font;
  const m = ctx.measureText(word);
  const H = Math.ceil(tr.height) + 4;
  const by = (tr.height + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2 + 2; // shared baseline
  const rows = Math.ceil(H / cell);

  // cells of one glyph: [col, row] with columns trimmed to the ink
  const glyph = (ch: string) => {
    const w = Math.ceil(ctx.measureText(ch).width) + 6;
    c.width = w;
    c.height = H;
    ctx.font = font;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, w, H);
    ctx.fillText(ch, 3, by);
    const d = ctx.getImageData(0, 0, w, H).data;
    const cols = Math.ceil(w / cell);
    const on: [number, number][] = [];
    for (let r = 0; r < rows; r++)
      for (let k = 0; k < cols; k++) {
        const x = Math.min(w - 1, Math.floor(k * cell + cell / 2)), y = Math.min(H - 1, Math.floor(r * cell + cell / 2));
        if (d[(y * w + x) * 4 + 3] >= 120) on.push([k, r]);
      }
    if (!on.length) return { cells: [] as [number, number][], width: 1 };
    const k0 = Math.min(...on.map((o) => o[0])), k1 = Math.max(...on.map((o) => o[0]));
    return { cells: on.map(([k, r]) => [k - k0, r] as [number, number]), width: k1 - k0 + 1 };
  };

  const cells: { x: number; y: number; color: string }[] = [];
  let col = 0;
  [...word].forEach((ch, i) => {
    const g = glyph(ch);
    const color = i < 4 ? dark : green; // "Grid" dark, "ika" green
    g.cells.forEach(([k, r]) => cells.push({ x: tr.left - hr.left + (col + k) * cell + cell / 2, y: tr.top - hr.top + r * cell + cell / 2 - 2, color }));
    col += g.width + 1; // one empty column between letters
  });
  return cells;
}

export function createMorphLogo(host: HTMLElement, textEl: HTMLElement, o: Options): MorphLogo {
  const green = o.green ?? '#19C37D', mint = o.mint ?? '#8BF0C2', dark = o.dark ?? '#132A22';
  const faceCols = o.faces ?? { top: '#16382c', left: '#0f2a20', right: '#0a1f17' };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  const cv = renderer.domElement;
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible';
  host.appendChild(cv);

  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(-0.4, 1, 0.7);
  scene.add(key);
  // isometric orthographic camera, 1 world unit = 1 CSS px
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
  const isoDir = new THREE.Vector3(1, 1, 1).normalize();
  cam.position.copy(isoDir).multiplyScalar(500);
  cam.up.set(0, 1, 0);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld(true);
  const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
  const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
  const screenQ = cam.quaternion.clone(); // a cube with this orientation shows a flat square to the camera

  let W = 1, H = 1;
  /** CSS px in the host → world point in the camera's screen plane */
  const fromScreen = (x: number, y: number) => new THREE.Vector3().addScaledVector(right, x - W / 2).addScaledVector(up, H / 2 - y);

  const n = 11;
  const mark = buildMark(n);
  // cube projected height is ~1.63 × edge, plus the rising top cubes: scale cells to the wanted size
  const cellPx = o.logoSize / (n * 1.75);

  let text: ReturnType<typeof textCells> = [];
  let mesh: THREE.InstancedMesh | null = null;
  type Item = { from: THREE.Vector3; fromSize: number; to: V3; toSize: V3; delay: number; arc: number; colFrom: THREE.Color; colTo: THREE.Color };
  let items: Item[] = [];
  const faceGroup = new THREE.Group();
  scene.add(faceGroup);
  const faceMats: THREE.MeshBasicMaterial[] = [];

  const kindColor = (k: LogoVoxel['kind']) => (k === 'dot' || k === 'g' ? mint : green);

  function build() {
    const textCell = 2; // CSS px per text voxel
    text = textCells(textEl, host, textCell, green, dark);
    // pair text cells and mark voxels in left→right order so the motion reads as one flow
    const tSorted = text.map((t, i) => ({ ...t, i })).sort((a, b) => a.x - b.x || a.y - b.y);
    const center = fromScreen(o.logoCenter.x, o.logoCenter.y);
    const mSorted = mark
      .map((m) => {
        const w = new THREE.Vector3(m.p[0], m.p[1], m.p[2]).multiplyScalar(cellPx);
        return { m, sx: w.dot(right), sy: w.dot(up) };
      })
      .sort((a, b) => a.sx - b.sx || b.sy - a.sy);
    const N = Math.max(tSorted.length, mSorted.length);
    items = [];
    for (let i = 0; i < N; i++) {
      // stretch the shorter list over the longer one
      const ti = tSorted[Math.min(tSorted.length - 1, Math.floor((i * tSorted.length) / N))];
      const mi = mSorted[Math.min(mSorted.length - 1, Math.floor((i * mSorted.length) / N))];
      items.push({
        from: fromScreen(ti.x, ti.y),
        fromSize: textCell * 0.92,
        to: [center.x + mi.m.p[0] * cellPx, center.y + mi.m.p[1] * cellPx, center.z + mi.m.p[2] * cellPx],
        toSize: [mi.m.s[0] * cellPx * 0.94, mi.m.s[1] * cellPx * 0.94, mi.m.s[2] * cellPx * 0.94],
        delay: (ti.x / Math.max(1, W)) * 0.35 + hash(i, 3, 7) * 0.08,
        arc: 6 + hash(i, 9, 1) * 10,
        colFrom: new THREE.Color(ti.color),
        colTo: new THREE.Color(kindColor(mi.m.kind)),
      });
    }
    if (mesh) {
      scene.remove(mesh);
      mesh.geometry.dispose();
    }
    mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5 }), items.length);
    scene.add(mesh);

    // dark faces of the cube, fading in at the end
    faceGroup.clear();
    faceMats.length = 0;
    const s = n * cellPx, half = s / 2;
    const plate = (w: number, h: number, col: string, pos: V3, rot: V3) => {
      const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, depthWrite: false });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      pl.position.set(center.x + pos[0], center.y + pos[1], center.z + pos[2]);
      pl.rotation.set(rot[0], rot[1], rot[2]);
      pl.renderOrder = -1;
      faceGroup.add(pl);
      faceMats.push(mat);
    };
    plate(s, s, faceCols.left, [0, 0, half - 0.2], [0, 0, 0]);
    plate(s, s, faceCols.right, [half - 0.2, 0, 0], [0, Math.PI / 2, 0]);
    plate(s, s, faceCols.top, [0, half - 0.2, 0], [-Math.PI / 2, 0, 0]);
  }

  const resize = () => {
    W = host.clientWidth || 260;
    H = host.clientHeight || 64;
    renderer.setSize(W, H, false);
    cam.left = -W / 2; cam.right = W / 2; cam.top = H / 2; cam.bottom = -H / 2;
    cam.updateProjectionMatrix();
    build();
    render();
  };

  const smooth = (a: number, b: number, t: number) => {
    const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
    return k * k * (3 - 2 * k);
  };
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const m4 = new THREE.Matrix4(), pos = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), col = new THREE.Color();
  const qId = new THREE.Quaternion();
  const spin = new THREE.Quaternion();
  const yAxis = new THREE.Vector3(0, 1, 0);

  let target = 0, current = 0, raf = 0;
  function render() {
    if (!mesh) return;
    const p = current;
    const appear = 1; // the name is made of cubes from the very start
    // the finished mark swings in a quarter turn as it assembles
    const center = fromScreen(o.logoCenter.x, o.logoCenter.y);
    spin.setFromAxisAngle(yAxis, -(1 - easeInOut(smooth(0.25, 1, p))) * (Math.PI / 2));
    items.forEach((it, i) => {
      void i;
      const k = easeInOut(smooth(it.delay, it.delay + 0.62, p));
      // target, turned by the swing around the mark centre
      const to = new THREE.Vector3(it.to[0], it.to[1], it.to[2]).sub(center).applyQuaternion(spin).add(center);
      pos.copy(it.from).lerp(to, k);
      // arc towards the camera so cubes pass in front of each other instead of through
      pos.addScaledVector(isoDir, Math.sin(k * Math.PI) * it.arc);
      q.copy(screenQ).slerp(qId, k);
      q.premultiply(new THREE.Quaternion().slerpQuaternions(qId, spin, k));
      const fs = it.fromSize;
      let sx = fs + (it.toSize[0] - fs) * k, sy = fs + (it.toSize[1] - fs) * k, sz = fs + (it.toSize[2] - fs) * k; // eslint-disable-line prefer-const
      // the extra cubes (where one list is longer) simply merge: several share a start or an end
      sx *= appear; sy *= appear; sz *= appear;
      sc.set(Math.max(1e-4, sx), Math.max(1e-4, sy), Math.max(1e-4, sz));
      m4.compose(pos, q, sc);
      mesh!.setMatrixAt(i, m4);
      col.copy(it.colFrom).lerp(it.colTo, smooth(0.2, 0.8, k));
      mesh!.setColorAt(i, col);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    faceGroup.quaternion.copy(spin);
    faceGroup.position.copy(center).sub(center.clone().applyQuaternion(spin));
    const fo = smooth(0.78, 1, p);
    faceMats.forEach((m) => (m.opacity = fo));
    renderer.render(scene, cam);
  }
  function tick() {
    raf = 0;
    // slow, soft follow of the scroll position
    current += (target - current) * 0.055;
    if (Math.abs(target - current) < 0.0008) current = target;
    render();
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  return {
    get counts() {
      return { text: text.length, logo: mark.length };
    },
    setProgress(p: number) {
      target = Math.min(1, Math.max(0, p));
      if (!raf) raf = requestAnimationFrame(tick);
    },
    snap(p: number) {
      target = current = Math.min(1, Math.max(0, p));
      render();
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      cv.remove();
    },
  };
}
