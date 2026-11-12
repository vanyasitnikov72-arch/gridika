import * as THREE from 'three';

/**
 * "QR Tree" — voxel tree that stays a QR code when seen from directly above.
 *
 * Idea (from the reference video):
 *  - every dark QR module inside the canopy footprint sits up in the crown, keeping its x/z,
 *    so the crown projected top-down is exactly the QR pattern;
 *  - dark modules outside the crown (and the three finder squares) are grass tiles on the ground;
 *  - light modules are pale floor tiles of a square base slab;
 *  - trunk, branches, pale bloom, grass blades and petals are detail that only exists in the side
 *    view: it grows in while the camera swings down and folds away on the way back to the top view,
 *    leaving only the coloured QR cubes.
 */

export type TreeSeason = 'spring' | 'summer' | 'autumn';

export interface DarkModule {
  r: number;
  c: number;
  isFinder: boolean;
}

export interface TreeVoxelTarget {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  kind: 'leaf' | 'grass';
}

interface SeasonPalette {
  /** QR cubes in the crown (luminance-normalised, they must scan). */
  leaves: string[];
  /** QR cubes on the ground (luminance-normalised). */
  grass: string[];
  /** Pale detail petals of the crown (side view only, so no luminance constraint). */
  bloom: string[];
  /** Grass blade colours (side view only). */
  blades: string[];
  trunk: [string, string];
}

/**
 * Re-scale a colour to a fixed perceived luminance (Rec.601, 0–255) while keeping its hue.
 * QR scanners (ZXing / jsQR hybrid binarizer) split a fully dark 8×8 px block into black/white
 * if its brightness spread exceeds ~24, so all dark tones must share nearly the same luminance.
 */
export function atLuminance(hex: string, target: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  const k = target / lum;
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v * k))).toString(16).padStart(2, '0');
  return '#' + ch(r) + ch(g) + ch(b);
}

const LEAF_LUM = 108;
const GRASS_LUM = 104;

function seasonPalette(p: SeasonPalette): SeasonPalette {
  return {
    ...p,
    leaves: p.leaves.map((c) => atLuminance(c, LEAF_LUM)),
    grass: p.grass.map((c) => atLuminance(c, GRASS_LUM)),
  };
}

const RAW_SEASONS: Record<TreeSeason, SeasonPalette> = {
  spring: {
    // Sakura
    leaves: ['#d0507f', '#c2386c', '#e0679a', '#b8416c', '#d95c8a', '#e0607a', '#c4508f', '#d46a8c', '#b84a86', '#e2708f'],
    grass: ['#4f8a24', '#5a9a2a', '#467d1f', '#3f7019', '#6a9a1f', '#2f7a3a', '#5f8f30', '#3d8a2e', '#78a02a'],
    bloom: ['#f9d3e2', '#f6c1d5', '#fce6ef', '#f2b3cb', '#fff2f7', '#eeaac4', '#f8cadb'],
    blades: ['#6fbf3a', '#8fd14f', '#5aa02e', '#a6dc6a', '#4c8f26', '#7cc444'],
    trunk: ['#8a4a2e', '#743b24'],
  },
  summer: {
    // Jacaranda lilac
    leaves: ['#8a5ccc', '#7646bd', '#9a6fd6', '#6538ab', '#a57fdc', '#9c5ac8', '#7f62d8', '#b06cc9', '#8e4fb8', '#6f5bd0'],
    grass: ['#4f8a24', '#5a9a2a', '#467d1f', '#3f7019', '#6a9a1f', '#2f7a3a', '#5f8f30', '#3d8a2e', '#78a02a'],
    bloom: ['#dcc8f5', '#cfb6f0', '#e9dcfa', '#c3a6ea', '#f3ecfd', '#d5bff3'],
    blades: ['#6fbf3a', '#8fd14f', '#5aa02e', '#a6dc6a', '#4c8f26', '#7cc444'],
    trunk: ['#7d4a32', '#683d28'],
  },
  autumn: {
    leaves: ['#d2701a', '#c2581a', '#e08f1f', '#b04a12', '#e8971c', '#c9402a', '#d9a21f', '#b86a1a', '#a8541f', '#cf5a2e'],
    grass: ['#8a6a1c', '#7a5c18', '#96741f', '#6e5215', '#9a7a1a', '#7f6a24', '#a0702a', '#86621a'],
    bloom: ['#f7cf5a', '#f2b83c', '#f9dc7e', '#eea12e', '#fbe6a4', '#f4c24a'],
    blades: ['#d9b44a', '#c9a13a', '#e6c868', '#b08a2e', '#efd27a'],
    trunk: ['#7a3f26', '#66331e'],
  },
};

export const TREE_SEASONS: Record<TreeSeason, SeasonPalette> = {
  spring: seasonPalette(RAW_SEASONS.spring),
  summer: seasonPalette(RAW_SEASONS.summer),
  autumn: seasonPalette(RAW_SEASONS.autumn),
};

/** Deterministic hash → [0, 1). */
export function rand(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export interface TreeGeometry {
  size: number;
  half: number;
  trunkH: number;
  canopyCenterY: number;
  canopyRy: number;
  canopyFloor: number;
  /** Canopy radius (in modules) for a given polar angle — organic lobed outline. */
  radiusAt(theta: number): number;
}

export function treeGeometry(size: number): TreeGeometry {
  const half = size / 2;
  const R = size * 0.47;
  const trunkH = size * 0.34;
  const canopyRy = size * 0.34;
  return {
    size,
    half,
    trunkH,
    canopyCenterY: trunkH + canopyRy * 0.78,
    canopyRy,
    canopyFloor: trunkH * 0.82,
    radiusAt: (theta: number) =>
      R * (1 + 0.1 * Math.sin(3 * theta + 0.6) + 0.06 * Math.sin(5 * theta + 2.1) + 0.04 * Math.cos(7 * theta)),
  };
}

function moduleXZ(m: DarkModule, half: number) {
  return { x: m.c - half + 0.5, z: m.r - half + 0.5 };
}

/** Normalized distance of a column from the trunk axis relative to the canopy outline (<1 = under crown). */
function canopyQ(g: TreeGeometry, x: number, z: number) {
  const d = Math.hypot(x, z);
  const theta = Math.atan2(z, x);
  return d / g.radiusAt(theta);
}

/** Vertical span of the crown above a column at normalized distance q. */
function canopySpan(g: TreeGeometry, q: number): [number, number] {
  const k = Math.sqrt(Math.max(0, 1 - q * q));
  const top = g.canopyCenterY + g.canopyRy * k;
  const bottom = Math.max(g.canopyFloor, g.canopyCenterY - g.canopyRy * 0.85 * k);
  return [bottom, top];
}

export function isUnderCanopy(g: TreeGeometry, m: DarkModule): boolean {
  if (m.isFinder) return false;
  const { x, z } = moduleXZ(m, g.half);
  return canopyQ(g, x, z) < 1;
}

/** Targets for the QR-module voxels. Index-aligned with `modules`. */
export function treeVoxelTargets(modules: DarkModule[], size: number): TreeVoxelTarget[] {
  const g = treeGeometry(size);
  return modules.map((m, i) => {
    const { x, z } = moduleXZ(m, g.half);
    if (isUnderCanopy(g, m)) {
      const [bottom, top] = canopySpan(g, canopyQ(g, x, z));
      const y = top - (top - bottom) * 0.35 * rand(i + 1);
      // voxel geometry is 0.88 → ~1.13 fills the whole module (no light seams between dark modules)
      const s = 1.13;
      return { x, y, z, scaleX: s, scaleY: s, scaleZ: s, kind: 'leaf' };
    }
    // Grass tile on top of the base slab
    return { x, y: 0.18, z, scaleX: 1.14, scaleY: 0.4, scaleZ: 1.14, kind: 'grass' };
  });
}

export function treeVoxelColor(m: DarkModule, i: number, size: number, season: TreeSeason): string {
  const pal = TREE_SEASONS[season];
  const g = treeGeometry(size);
  const under = isUnderCanopy(g, m);
  const list = under ? pal.leaves : pal.grass;
  const base = list[Math.floor(rand(i + 13) * list.length)];
  return atLuminance(base, (under ? LEAF_LUM : GRASS_LUM) + (rand(i + 71) - 0.5) * 14);
}

/** Look of a QR cube in the side view: crown cubes turn into pale bloom, ground cubes into bright grass. */
export function treeVoxelSideColor(
  m: DarkModule,
  i: number,
  size: number,
  season: TreeSeason
): { color: string; scale: number } {
  const pal = TREE_SEASONS[season];
  const g = treeGeometry(size);
  if (isUnderCanopy(g, m)) {
    // crown QR cubes shrink away completely: the side view shows only bloom, no blocks
    return { color: pal.bloom[Math.floor(rand(i + 31) * pal.bloom.length)], scale: 0 };
  }
  return { color: pal.blades[Math.floor(rand(i + 37) * pal.blades.length)], scale: 1 };
}

// ---------------------------------------------------------------------------
// Decor: base slab, floor tiles + detail that only exists in the side view
// (trunk, branches, bloom clusters, inner leaves, grass blades, petals).
// Detail grows in while the camera swings down and folds away when it swings back to the top,
// so the top view keeps nothing but the coloured QR cubes.
// ---------------------------------------------------------------------------

interface GrowItem {
  matrix: THREE.Matrix4;
  color: string;
  /** Growth start in [0, 0.9] of the view progress. */
  delay: number;
  /** Instances scale in/out around this point. */
  pivot: THREE.Vector3;
}

interface Grown {
  mesh: THREE.InstancedMesh;
  base: THREE.Matrix4[];
  delay: number[];
  pivot: THREE.Vector3[];
}

interface Petal {
  x: number;
  z: number;
  y0: number;
  speed: number;
  phase: number;
  spin: number;
  floor: number;
}

export class TreeDecor {
  public readonly group = new THREE.Group();
  private grown: Grown[] = [];
  private petals: Petal[] = [];
  private petalMesh!: THREE.InstancedMesh;
  private geometry: TreeGeometry;
  private disposables: { dispose(): void }[] = [];
  private lightModules: { x: number; z: number }[] = [];
  private lastGrowth = -1;
  private bloom: {
    mesh?: THREE.InstancedMesh;
    home: THREE.Vector3[];
    pos: THREE.Vector3[];
    quat: THREE.Quaternion[];
    size: THREE.Vector3[];
    qrColor: THREE.Color[];
    color: THREE.Color[];
    offset: number[];
  } = { home: [], pos: [], quat: [], size: [], qrColor: [], color: [], offset: [] };

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    private season: TreeSeason
  ) {
    this.geometry = treeGeometry(size);
    this.build();
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private build() {
    const g = this.geometry;
    const pal = TREE_SEASONS[this.season];
    const N = this.size;
    const color = new THREE.Color();

    // --- Base slab (always visible: doubles as the QR quiet zone) ---
    const slabW = N + 2.4;
    const slab = new THREE.Mesh(
      this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)),
      this.track(new THREE.MeshStandardMaterial({ color: '#f3f1ec', roughness: 0.85 }))
    );
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    slab.castShadow = true;
    this.group.add(slab);

    // Floor tiles on light modules: grey/white mosaic like the reference
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (!this.matrix[r][c]) this.lightModules.push({ x: c - g.half + 0.5, z: r - g.half + 0.5 });
      }
    }
    const tiles = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(0.98, 0.06, 0.98)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })),
      this.lightModules.length
    );
    tiles.receiveShadow = true;
    const m4 = new THREE.Matrix4();
    const greys = ['#ffffff', '#f6f5f2', '#eeece8', '#e6e4df', '#f9f8f6'];
    this.lightModules.forEach((p, i) => {
      m4.makeTranslation(p.x, 0.03, p.z);
      tiles.setMatrixAt(i, m4);
      tiles.setColorAt(i, color.set(greys[Math.floor(rand(i * 3 + 5) * greys.length)]));
    });
    this.group.add(tiles);

    this.buildTrunk(pal);
    this.buildBranches(pal);
    this.buildBloom(pal);
    this.buildGrassBlades(pal);
    this.buildGroundPetals(pal);
    this.buildFallingPetals(pal);
  }

  private addGrown(geo: THREE.BufferGeometry, mat: THREE.Material, items: GrowItem[], castShadow = true) {
    const mesh = new THREE.InstancedMesh(this.track(geo), this.track(mat), Math.max(1, items.length));
    mesh.count = items.length;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    const c = new THREE.Color();
    items.forEach((it, i) => mesh.setColorAt(i, c.set(it.color)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    this.group.add(mesh);
    this.grown.push({
      mesh,
      base: items.map((it) => it.matrix),
      delay: items.map((it) => it.delay),
      pivot: items.map((it) => it.pivot),
    });
  }

  private buildTrunk(pal: SeasonPalette) {
    const g = this.geometry;
    const items: GrowItem[] = [];
    // Smooth thick trunk with faint bark rings and a root flare
    const segH = 0.45;
    const top = g.canopyCenterY;
    const segs = Math.ceil(top / segH);
    for (let i = 0; i < segs; i++) {
      const y = i * segH + segH / 2;
      const t = y / top;
      const flare = t < 0.1 ? 1 + (0.1 - t) * 4.5 : 1;
      const r = (1.0 - t * 0.42) * flare;
      const lean = Math.sin(t * 2.2) * 0.3;
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3(lean, y, lean * 0.35),
        new THREE.Quaternion(),
        new THREE.Vector3(r, 1, r)
      );
      items.push({
        matrix: m,
        color: i % 3 === 0 ? pal.trunk[1] : pal.trunk[0],
        delay: t * 0.22,
        pivot: new THREE.Vector3(0, 0, 0),
      });
    }
    this.addGrown(
      new THREE.CylinderGeometry(0.98, 1.0, segH * 1.02, 18),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }),
      items
    );
  }

  private buildBranches(pal: SeasonPalette) {
    const g = this.geometry;
    const items: GrowItem[] = [];
    const up = new THREE.Vector3(0, 1, 0);

    const addLimb = (from: THREE.Vector3, to: THREE.Vector3, radius: number, delay: number, shade: number) => {
      const dir = to.clone().sub(from);
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
      const mid = from.clone().add(to).multiplyScalar(0.5);
      items.push({
        matrix: new THREE.Matrix4().compose(mid, q, new THREE.Vector3(radius, dir.length(), radius)),
        color: pal.trunk[shade],
        delay,
        pivot: from.clone(),
      });
    };

    const limbs = 8;
    for (let i = 0; i < limbs; i++) {
      const ang = (i / limbs) * Math.PI * 2 + rand(i + 40) * 0.6;
      const startY = g.trunkH * (0.6 + rand(i + 41) * 0.45);
      const reach = g.radiusAt(ang) * (0.6 + rand(i + 42) * 0.25);
      const from = new THREE.Vector3(0, startY, 0);
      const elbow = new THREE.Vector3(
        Math.cos(ang) * reach * 0.5,
        startY + g.canopyRy * (0.3 + rand(i + 43) * 0.2),
        Math.sin(ang) * reach * 0.5
      );
      const tip = new THREE.Vector3(
        Math.cos(ang) * reach,
        elbow.y + g.canopyRy * (0.2 + rand(i + 44) * 0.25),
        Math.sin(ang) * reach
      );
      addLimb(from, elbow, 0.38, 0.2, i % 2);
      addLimb(elbow, tip, 0.22, 0.3, (i + 1) % 2);
      for (let k = 0; k < 2; k++) {
        const twigAng = ang + (rand(i * 3 + k + 45) - 0.5) * 1.8;
        const base = k === 0 ? elbow : tip;
        const twig = new THREE.Vector3(
          base.x + Math.cos(twigAng) * reach * 0.3,
          base.y + g.canopyRy * (0.18 + rand(i + k + 46) * 0.15),
          base.z + Math.sin(twigAng) * reach * 0.3
        );
        addLimb(base, twig, 0.12, 0.38, 1);
      }
    }
    addLimb(new THREE.Vector3(0, g.trunkH, 0), new THREE.Vector3(0.4, g.canopyCenterY + g.canopyRy * 0.7, -0.3), 0.32, 0.25, 0);

    this.addGrown(
      new THREE.CylinderGeometry(1, 1, 1, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
      items
    );
  }

  /**
   * Bloom: clumps of small pale flat petals filling the whole crown volume. Every petal is bound
   * to its nearest crown QR cube: on the way to the top view the petals fly into that cube,
   * shrink and take its colour — the crown visibly condenses into the QR code instead of vanishing.
   */
  private buildBloom(pal: SeasonPalette) {
    const g = this.geometry;
    const N = this.size;

    // Crown QR cubes: grid lookup of their position and QR colour
    const targets = treeVoxelTargets(this.modules, N);
    const crown = new Map<number, { pos: THREE.Vector3; color: THREE.Color }>();
    const crownList: { pos: THREE.Vector3; color: THREE.Color }[] = [];
    this.modules.forEach((m, i) => {
      if (!isUnderCanopy(g, m)) return;
      const t = targets[i];
      const entry = {
        pos: new THREE.Vector3(t.x, t.y, t.z),
        color: new THREE.Color(treeVoxelColor(m, i, N, this.season)),
      };
      crown.set(m.r * N + m.c, entry);
      crownList.push(entry);
    });
    const nearestCube = (x: number, z: number, seed: number) => {
      const c0 = Math.round(x + g.half - 0.5);
      const r0 = Math.round(z + g.half - 0.5);
      for (let rad = 0; rad <= 3; rad++) {
        for (let dr = -rad; dr <= rad; dr++) {
          for (let dc = -rad; dc <= rad; dc++) {
            if (Math.max(Math.abs(dr), Math.abs(dc)) !== rad) continue;
            const r = r0 + dr, c = c0 + dc;
            if (r < 0 || c < 0 || r >= N || c >= N) continue;
            const hit = crown.get(r * N + c);
            if (hit) return hit;
          }
        }
      }
      return crownList[Math.floor(rand(seed) * crownList.length)];
    };

    const clusters = Math.round(N * N * 0.6);
    const euler = new THREE.Euler();
    const color = new THREE.Color();
    let seed = 1000;
    const b = this.bloom;

    for (let ci = 0; ci < clusters; ci++) {
      // cluster centre on/near the crown shell (shell-biased so the outside reads as dense)
      const theta = rand(seed++) * Math.PI * 2;
      const cosPhi = 1 - 2 * rand(seed++);
      const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
      const u = 0.55 + 0.45 * Math.sqrt(rand(seed++));
      const R = g.radiusAt(theta);
      const cx = Math.cos(theta) * sinPhi * R * u;
      const cz = Math.sin(theta) * sinPhi * R * u;
      let cy = g.canopyCenterY + cosPhi * g.canopyRy * u;
      cy = Math.max(cy, g.canopyFloor + 0.4 + rand(seed++) * 1.2);

      const per = 8 + Math.floor(rand(seed++) * 8);
      for (let k = 0; k < per; k++) {
        const pos = new THREE.Vector3(
          cx + (rand(seed++) - 0.5) * 2.2,
          cy + (rand(seed++) - 0.5) * 1.6,
          cz + (rand(seed++) - 0.5) * 2.2
        );
        if (pos.y < g.canopyFloor - 0.3) pos.y = g.canopyFloor - 0.3 + rand(seed++) * 0.6;
        euler.set((rand(seed++) - 0.5) * 2.2, rand(seed++) * Math.PI, (rand(seed++) - 0.5) * 2.2);
        const cube = nearestCube(pos.x, pos.z, seed++);
        if (!cube) continue;
        // inside the cube, a little jitter so petals don't all collapse onto one point
        const home = cube.pos.clone().add(
          new THREE.Vector3((rand(seed++) - 0.5) * 0.5, (rand(seed++) - 0.5) * 0.4, (rand(seed++) - 0.5) * 0.5)
        );
        b.home.push(home);
        b.pos.push(pos);
        b.quat.push(new THREE.Quaternion().setFromEuler(euler));
        b.size.push(new THREE.Vector3(0.36 + rand(seed++) * 0.34, 0.1 + rand(seed++) * 0.12, 0.36 + rand(seed++) * 0.34));
        b.qrColor.push(cube.color);
        b.color.push(color.set(pal.bloom[Math.floor(rand(seed++) * pal.bloom.length)]).clone());
        b.offset.push((rand(seed++) - 0.5) * 0.16);
      }
    }

    b.mesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 1, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 })),
      Math.max(1, b.pos.length)
    );
    b.mesh.count = b.pos.length;
    b.mesh.castShadow = true;
    b.mesh.receiveShadow = true;
    for (let i = 0; i < b.pos.length; i++) b.mesh.setColorAt(i, b.color[i]);
    this.group.add(b.mesh);
  }

  /** Petals fly between their QR cube (growth 0) and their place in the crown (growth 1). */
  private updateBloom(growth: number) {
    const b = this.bloom;
    if (!b.mesh) return;
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    const id = new THREE.Quaternion();
    let any = false;
    for (let i = 0; i < b.pos.length; i++) {
      const o = b.offset[i];
      const k = THREE.MathUtils.smoothstep(growth, 0.06 + o * 0.5, 0.92 + o * 0.5);
      if (k > 0) any = true;
      // travel: soft arc outwards from the cube to the crown slot
      p.copy(b.home[i]).lerp(b.pos[i], k);
      p.y += Math.sin(k * Math.PI) * 0.6;
      q.copy(id).slerp(b.quat[i], k);
      const sz = THREE.MathUtils.lerp(0.04, 1, k);
      s.copy(b.size[i]).multiplyScalar(sz || 1e-4);
      m.compose(p, q, s);
      b.mesh.setMatrixAt(i, m);
      // colour: the cube's QR shade near the top view → pale bloom in the side view
      c.copy(b.qrColor[i]).lerp(b.color[i], THREE.MathUtils.smoothstep(k, 0.15, 0.85));
      b.mesh.setColorAt(i, c);
    }
    b.mesh.visible = any;
    b.mesh.instanceMatrix.needsUpdate = true;
    if (b.mesh.instanceColor) b.mesh.instanceColor.needsUpdate = true;
  }

  /** Dense tufts of thin blades on every grass module (finders and dark modules outside the crown). */
  private buildGrassBlades(pal: SeasonPalette) {
    const g = this.geometry;
    const items: GrowItem[] = [];
    this.modules.forEach((m, i) => {
      if (isUnderCanopy(g, m)) return;
      const x = m.c - g.half + 0.5;
      const z = m.r - g.half + 0.5;
      const blades = m.isFinder ? 8 : 6;
      for (let k = 0; k < blades; k++) {
        const h = (m.isFinder ? 0.7 : 0.5) + rand(i * 7 + k * 31) * (m.isFinder ? 1.2 : 0.9);
        const bx = x + (rand(i * 3 + k * 5) - 0.5) * 0.85;
        const bz = z + (rand(i * 5 + k * 3) - 0.5) * 0.85;
        // lean outwards from the tuft centre
        const out = Math.atan2(bz - z, bx - x);
        const lean = 0.15 + rand(i + k * 9) * 0.4;
        const tilt = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.sin(out) * lean, rand(i + k) * Math.PI, -Math.cos(out) * lean)
        );
        const foot = new THREE.Vector3(bx, 0.34, bz);
        const pos = foot.clone().add(new THREE.Vector3(0, h / 2, 0).applyQuaternion(tilt));
        items.push({
          matrix: new THREE.Matrix4().compose(pos, tilt, new THREE.Vector3(0.09, h, 0.05)),
          color: pal.blades[Math.floor(rand(i * 29 + k) * pal.blades.length)],
          delay: 0.05 + rand(i + k * 17) * 0.3,
          pivot: foot,
        });
      }
    });
    this.addGrown(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
      items,
      false
    );
  }

  private buildGroundPetals(pal: SeasonPalette) {
    const g = this.geometry;
    const items: GrowItem[] = [];
    this.lightModules.forEach((p, i) => {
      const q = canopyQ(g, p.x, p.z);
      if (q > 1.25 || rand(i * 7 + 1) > 0.2 * (1.4 - q)) return;
      const s = 0.28 + rand(i + 2) * 0.2;
      const pos = new THREE.Vector3(p.x + (rand(i + 3) - 0.5) * 0.5, 0.08, p.z + (rand(i + 4) - 0.5) * 0.5);
      items.push({
        matrix: new THREE.Matrix4().compose(
          pos,
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i) * Math.PI, 0)),
          new THREE.Vector3(s, 0.05, s)
        ),
        color: pal.bloom[i % pal.bloom.length],
        delay: 0.65,
        pivot: pos.clone(),
      });
    });
    this.addGrown(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
      items,
      false
    );
  }

  private buildFallingPetals(pal: SeasonPalette) {
    const g = this.geometry;
    const count = 60;
    this.petalMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(0.34, 0.06, 0.34)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })),
      count
    );
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const ang = rand(i + 500) * Math.PI * 2;
      const d = Math.sqrt(rand(i + 600)) * g.radiusAt(ang) * 1.15;
      this.petals.push({
        x: Math.cos(ang) * d,
        z: Math.sin(ang) * d,
        y0: g.canopyFloor + rand(i + 700) * g.canopyRy,
        speed: 0.6 + rand(i + 800) * 0.8,
        phase: rand(i + 900) * 10,
        spin: 1 + rand(i + 950) * 2,
        floor: 0.1,
      });
      this.petalMesh.setColorAt(i, c.set(pal.bloom[i % pal.bloom.length]));
    }
    this.group.add(this.petalMesh);
  }

  /**
   * @param growth 0 = top-down QR view (no detail) … 1 = side view (fully grown tree)
   * @param time seconds, drives the falling petals
   */
  public update(growth: number, time: number) {
    if (growth !== this.lastGrowth) {
      this.lastGrowth = growth;
      this.updateBloom(growth);
      const m = new THREE.Matrix4();
      const s = new THREE.Matrix4();
      const tNeg = new THREE.Matrix4();
      const tPos = new THREE.Matrix4();
      for (const gr of this.grown) {
        let anyVisible = false;
        for (let i = 0; i < gr.base.length; i++) {
          const local = THREE.MathUtils.clamp((growth - gr.delay[i]) / (1 - gr.delay[i]), 0, 1);
          // ease-out with a tiny overshoot so things "pop" in softly
          const k = local <= 0 ? 0 : local >= 1 ? 1 : 1 - Math.pow(1 - local, 3) + Math.sin(local * Math.PI) * 0.08;
          if (k > 0) anyVisible = true;
          const p = gr.pivot[i];
          tNeg.makeTranslation(-p.x, -p.y, -p.z);
          tPos.makeTranslation(p.x, p.y, p.z);
          const ks = k || 1e-4;
          s.makeScale(ks, ks, ks);
          m.copy(tPos).multiply(s).multiply(tNeg).multiply(gr.base[i]);
          gr.mesh.setMatrixAt(i, m);
        }
        gr.mesh.visible = anyVisible;
        gr.mesh.instanceMatrix.needsUpdate = true;
      }
    }

    // Falling petals: only in the (almost) fully grown side view
    const vis = THREE.MathUtils.clamp((growth - 0.85) / 0.15, 0, 1);
    this.petalMesh.visible = vis > 0;
    if (!this.petalMesh.visible) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.petals.length; i++) {
      const p = this.petals[i];
      const fallLen = p.y0 - p.floor;
      const travel = (time * p.speed + p.phase) % (fallLen + 2);
      const y = p.y0 - Math.min(travel, fallLen);
      const sway = Math.sin(time * 1.3 + p.phase) * 0.6;
      dummy.position.set(p.x + sway, y, p.z + Math.cos(time * 1.1 + p.phase) * 0.4);
      dummy.rotation.set(Math.sin(time * p.spin + p.phase) * 1.2, time * p.spin, Math.cos(time + p.phase) * 0.8);
      const sc = vis * (travel > fallLen ? Math.max(0, 1 - (travel - fallLen) / 2) : 1);
      dummy.scale.setScalar(sc || 1e-4);
      dummy.updateMatrix();
      this.petalMesh.setMatrixAt(i, dummy.matrix);
    }
    this.petalMesh.instanceMatrix.needsUpdate = true;
  }

  public dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
