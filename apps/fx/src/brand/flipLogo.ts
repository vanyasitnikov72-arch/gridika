import * as THREE from 'three';

/**
 * Gridika flip logo — one voxel object that reads as the cube mark from the front
 * and as the word GRIDIKA from the side ("two-shadow sculpture", like the GEB book cover).
 *
 * front silhouette A(x, y): the isometric cube mark, pixel art
 * side  silhouette B(z, y): the word, rasterised from the site font
 * object = every voxel (x, y, z) with A(x, y) && B(z, y)
 *
 * Seen straight on (orthographic camera) the object shows exactly A; turned 90° it shows exactly B.
 * In between it is an abstract cloud of cubes — that is the moment of the trick.
 */

export interface FlipLogo {
  /** 0 = mark, 1 = word (eased and smoothed internally) */
  setProgress(p: number): void;
  /** jump without smoothing */
  snap(p: number): void;
  dispose(): void;
  readonly voxels: number;
}

const H = 21; // rows shared by both silhouettes

/** Bresenham line into a pixel set */
function line(set: Set<string>, x0: number, y0: number, x1: number, y1: number) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    set.add(`${x},${y}`);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

/** front view: the Gridika cube mark as 21×21 pixel art. Returns pixels and which are "eyes". */
export function markPixels(): { w: number; px: Set<string>; eyes: Set<string> } {
  const px = new Set<string>(), eyes = new Set<string>();
  // isometric hexagon: top (10,0), upper-right (19,5), lower-right (19,15), bottom (10,20), lower-left (1,15), upper-left (1,5)
  const T: [number, number] = [10, 0], UR: [number, number] = [19, 5], LR: [number, number] = [19, 15], B: [number, number] = [10, 20], LL: [number, number] = [1, 15], UL: [number, number] = [1, 5], C: [number, number] = [10, 10];
  // outline, leaving gaps where it meets the dotted front edge (at the bottom and at the centre)
  line(px, T[0], T[1], UR[0], UR[1]);
  line(px, UR[0], UR[1], LR[0], LR[1]);
  line(px, LR[0], LR[1], 12, 19);
  line(px, 8, 19, LL[0], LL[1]);
  line(px, LL[0], LL[1], UL[0], UL[1]);
  line(px, UL[0], UL[1], T[0], T[1]);
  line(px, UL[0], UL[1], 8, 9);
  line(px, 12, 9, UR[0], UR[1]);
  // front edge: dots at both ends, even spacing
  for (let y = 10; y <= 20; y += 2) px.add(`10,${y}`);
  // eyes: 3×3 rings with a core gap, on the left, right and top faces
  const eye = (cx: number, cy: number) => {
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (dx || dy) { px.add(`${cx + dx},${cy + dy}`); eyes.add(`${cx + dx},${cy + dy}`); }
    px.add(`${cx},${cy}`); eyes.add(`${cx},${cy}`);
  };
  eye(5, 13);
  eye(15, 13);
  eye(10, 5);
  return { w: 21, px, eyes };
}

/** side view: the word rasterised with the page font, exactly H rows tall */
export function wordPixels(word = 'GRIDIKA'): { w: number; rows: boolean[][] } {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  // find a font size whose capital height fills H rows
  let size = 28;
  ctx.font = `900 ${size}px Nunito, system-ui, sans-serif`;
  const m = ctx.measureText(word);
  const cap = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || size * 0.72;
  size = Math.round((size * H) / cap);
  ctx.font = `900 ${size}px Nunito, system-ui, sans-serif`;
  const m2 = ctx.measureText(word);
  const w = Math.ceil(m2.width) + 4, h = Math.ceil(m2.actualBoundingBoxAscent + m2.actualBoundingBoxDescent) + 4;
  c.width = w;
  c.height = h;
  ctx.font = `900 ${size}px Nunito, system-ui, sans-serif`;
  ctx.letterSpacing = '1px';
  ctx.fillStyle = '#000';
  ctx.fillText(word, 2, 2 + m2.actualBoundingBoxAscent);
  const d = ctx.getImageData(0, 0, w, h).data;
  // rows with ink, then resample to exactly H rows
  let y0 = h, y1 = 0, x1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 110) { y0 = Math.min(y0, y); y1 = Math.max(y1, y); x1 = Math.max(x1, x); }
  const rows: boolean[][] = [];
  for (let r = 0; r < H; r++) {
    const y = Math.min(y1, Math.round(y0 + (r / (H - 1)) * (y1 - y0)));
    const row: boolean[] = [];
    for (let x = 0; x <= x1; x++) row.push(d[(y * w + x) * 4 + 3] > 110);
    rows.push(row);
  }
  return { w: x1 + 1, rows };
}

export function createFlipLogo(container: HTMLElement, opts: { color?: string; eye?: string; word?: string } = {}): FlipLogo {
  const colour = new THREE.Color(opts.color ?? '#19C37D');
  const eyeColour = new THREE.Color(opts.eye ?? '#8BF0C2');
  const A = markPixels();
  const B = wordPixels(opts.word ?? 'GRIDIKA');

  // voxels: (x, y, z) with A(x, y) && B(z, y); x centred on the mark, z from 0 to the word length
  const cells: { x: number; y: number; z: number; eye: boolean }[] = [];
  for (let y = 0; y < H; y++) {
    const xs: number[] = [];
    for (let x = 0; x < A.w; x++) if (A.px.has(`${x},${y}`)) xs.push(x);
    const zs: number[] = [];
    B.rows[y].forEach((on, z) => on && zs.push(z));
    for (const x of xs) for (const z of zs) cells.push({ x: x - (A.w - 1) / 2, y: H - 1 - y, z, eye: A.eyes.has(`${x},${y}`) });
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  const cv = renderer.domElement;
  cv.style.display = 'block';
  cv.style.width = '100%';
  cv.style.height = '100%';

  const scene = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
  cam.position.set(0, 0, 100);
  cam.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-0.6, 1, 0.9);
  scene.add(key);

  const pivot = new THREE.Group();
  scene.add(pivot);
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.94, 0.94, 0.94), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 }), cells.length);
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  // the word's first column sits at the mark's centre, so turning left lays the word to the right
  cells.forEach((c, i) => {
    m.makeTranslation(c.x, c.y - (H - 1) / 2, -c.z);
    mesh.setMatrixAt(i, m);
    col.copy(c.eye ? eyeColour : colour);
    mesh.setColorAt(i, col);
  });
  pivot.add(mesh);

  // camera frame: height = H voxels with a margin; the mark sits at the left of the canvas
  let unit = 1;
  const resize = () => {
    const w = container.clientWidth || 300, h = container.clientHeight || 64;
    renderer.setSize(w, h, false);
    // pixels per voxel: fit the height, and the whole word (which starts at the mark's centre) in the width
    unit = Math.min(h / (H + 3), w / (B.w + A.w / 2 + 3));
    const halfW = w / unit / 2, halfH = h / unit / 2;
    cam.left = -halfW; cam.right = halfW; cam.top = halfH; cam.bottom = -halfH;
    cam.updateProjectionMatrix();
    // pivot (mark centre) at the left: half the mark width + a little margin from the edge
    pivot.position.x = -halfW + (A.w / 2 + 1);
    render();
  };

  let target = 0, current = 0, raf = 0;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const render = () => {
    const e = ease(Math.min(1, Math.max(0, current)));
    // turn left by 90°: z (the word) comes round to run left → right
    pivot.rotation.set(Math.sin(e * Math.PI) * 0.22, -e * (Math.PI / 2), 0);
    renderer.render(scene, cam);
  };
  const tick = () => {
    raf = 0;
    current += (target - current) * 0.14;
    if (Math.abs(target - current) < 0.001) current = target;
    render();
    if (current !== target) raf = requestAnimationFrame(tick);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  return {
    voxels: cells.length,
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
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      renderer.dispose();
      cv.remove();
    },
  };
}
