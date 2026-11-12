import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import { GrowSet, NEUTRAL_LIGHT, finderLocal, lerpStageLighting, type GrowItem, type StageScene } from './stageScene';

/**
 * "QR Cake" — a three-tier celebration cake whose decorations are the QR code seen from above.
 *
 *  - square tiers aligned to the QR grid: the bottom tier is the whole code, the middle tier sits
 *    between the finder squares, a small top tier in the middle;
 *  - every dark module is a decoration on its tier: chocolate cube, berry or macaron;
 *  - light modules are the cream frosting of the tier they belong to;
 *  - the finder squares are candle spots: a candle on the centre cell, cream rosettes around it,
 *    a chocolate border ring;
 *  - sponge layers, cream stripes, glaze drips, pearl piping, candle flames and confetti only exist
 *    in the side view. The cake assembles tier by tier while the camera swings down.
 *
 * Flavours: chocolate / strawberry / mint — applied only in the side view, the top view always scans.
 */

export type CakeFlavor = 'chocolate' | 'strawberry' | 'mint';

interface CakePalette {
  sponge: string;
  cream: string;
  glaze: string;
  choc: string;
  berry: string;
  leaf: string;
  macaron: string[];
  rosette: string;
  candle: [string, string];
  board: string;
  confetti: string[];
  mood: {
    ambient: { color: string; intensity: number };
    sun: { color: string; intensity: number; position: [number, number, number] };
  };
}

const WARM_MOOD = {
  ambient: { color: '#fff4ea', intensity: 1.2 },
  sun: { color: '#fff2e0', intensity: 2.5, position: [22, 48, 28] as [number, number, number] },
};

export const CAKE_FLAVORS: Record<CakeFlavor, CakePalette> = {
  chocolate: {
    sponge: '#7a4a2e',
    cream: '#f3e2c8',
    glaze: '#3e2216',
    choc: '#4a2a1a',
    berry: '#c8303a',
    leaf: '#4f9a3a',
    macaron: ['#e8a0b4', '#f0d080', '#a8d8b0'],
    rosette: '#8a5236',
    candle: ['#f4f1ea', '#d94a3a'],
    board: '#d8b45a',
    confetti: ['#f25c8a', '#ffd23f', '#4fb8e8', '#7cd67c', '#b07cf0'],
    mood: WARM_MOOD,
  },
  strawberry: {
    sponge: '#f2d4a8',
    cream: '#fff0f3',
    glaze: '#e8708e',
    choc: '#c9a07a',
    berry: '#d8243a',
    leaf: '#5aa648',
    macaron: ['#f4a8c0', '#ffd2dc', '#e86a8a'],
    rosette: '#f08aa8',
    candle: ['#ffffff', '#f4a8c0'],
    board: '#f4e6ea',
    confetti: ['#f25c8a', '#ffd2dc', '#ffffff', '#ff9ab8', '#ffd23f'],
    mood: { ambient: { color: '#fff0f4', intensity: 1.2 }, sun: { color: '#fff4f0', intensity: 2.5, position: [22, 48, 28] } },
  },
  mint: {
    sponge: '#5a3a28',
    cream: '#e2f5ea',
    glaze: '#7fd0b0',
    choc: '#3a2418',
    berry: '#3a5fb0',
    leaf: '#3f9a5a',
    macaron: ['#a8e0c8', '#d8f0e4', '#7fd0b0'],
    rosette: '#6cc7a2',
    candle: ['#ffffff', '#5fbf9a'],
    board: '#cfe8dc',
    confetti: ['#7fd0b0', '#ffffff', '#4fb8e8', '#ffd23f', '#a8e0c8'],
    mood: { ambient: { color: '#f0fff8', intensity: 1.2 }, sun: { color: '#f4fff8', intensity: 2.5, position: [22, 48, 28] } },
  },
};

const DECO_LUM = 82;
const TIER_H = [4.6, 4.0, 3.4];

type Kind = 'choc' | 'berry' | 'macaron' | 'rosette' | 'candle' | 'border';

export interface CakeLayout {
  size: number;
  half: number;
  /** tier index (0..2) of every cell r*N+c */
  tierOf: Uint8Array;
  /** top height of tier 0..2 */
  tierTop: number[];
  /** tier bounds in cell indices [lo, hi] (inclusive) */
  bounds: [number, number][];
  kind: Kind[];
}

export function cakeLayout(modules: DarkModule[], size: number): CakeLayout {
  const half = size / 2;
  const centre = (size - 1) / 2;
  const k2 = Math.max(2, Math.floor(centre - 7)); // middle tier: between the finder squares
  const k3 = Math.max(1, Math.round(k2 * 0.5));
  const bounds: [number, number][] = [
    [0, size - 1],
    [Math.round(centre - k2), Math.round(centre + k2)],
    [Math.round(centre - k3), Math.round(centre + k3)],
  ];
  const tierTop = [TIER_H[0], TIER_H[0] + TIER_H[1], TIER_H[0] + TIER_H[1] + TIER_H[2]];
  const tierOf = new Uint8Array(size * size);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let t = 0;
      if (r >= bounds[1][0] && r <= bounds[1][1] && c >= bounds[1][0] && c <= bounds[1][1]) t = 1;
      if (r >= bounds[2][0] && r <= bounds[2][1] && c >= bounds[2][0] && c <= bounds[2][1]) t = 2;
      tierOf[r * size + c] = t;
    }
  }
  const kind: Kind[] = modules.map((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc] = local;
      if (fr === 3 && fc === 3) return 'candle';
      if (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4) return 'rosette';
      return 'border';
    }
    const x = rand(i * 13 + 7);
    return x < 0.45 ? 'choc' : x < 0.75 ? 'berry' : 'macaron';
  });
  return { size, half, tierOf, tierTop, bounds, kind };
}

function cellTop(L: CakeLayout, r: number, c: number) {
  return L.tierTop[L.tierOf[r * L.size + c]];
}

export function cakeVoxelTargets(modules: DarkModule[], size: number) {
  const L = cakeLayout(modules, size);
  return modules.map((m) => {
    const top = cellTop(L, m.r, m.c);
    return { x: m.c - L.half + 0.5, y: top + 0.36, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: 0.82, scaleZ: 1.13 };
  });
}

export class CakeDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  public readonly targets: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  public readonly voxelSideWindow: [number, number] = [0.6, 0.92];
  private layout: CakeLayout;
  private pal: CakePalette;
  private disposables: { dispose(): void }[] = [];
  private grow: GrowSet;
  private tiles: { x: number; z: number; r: number; c: number }[] = [];
  private tileMesh!: THREE.InstancedMesh;
  private tileQr: THREE.Color[] = [];
  private tileSide: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private flames: THREE.Mesh[] = [];
  private flameMat!: THREE.MeshStandardMaterial;
  private confetti!: THREE.InstancedMesh;
  private lastGrowth = -1;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    flavor: CakeFlavor
  ) {
    this.layout = cakeLayout(modules, size);
    this.pal = CAKE_FLAVORS[flavor];
    this.voxelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 });
    this.targets = cakeVoxelTargets(modules, size);
    this.grow = new GrowSet(this.group, (o) => this.track(o));
    this.build();
  }

  get maxHeight() {
    return this.layout.tierTop[2] + 1.5;
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private decoColor(i: number) {
    const k = this.layout.kind[i];
    const p = this.pal;
    switch (k) {
      case 'choc':
      case 'border':
        return p.choc;
      case 'berry':
        return p.berry;
      case 'macaron':
        return p.macaron[Math.floor(rand(i * 3 + 1) * p.macaron.length)];
      case 'rosette':
        return p.rosette;
      case 'candle':
        return p.candle[1];
    }
  }

  voxelColor(i: number) {
    const hue = this.decoColor(i);
    return { qr: atLuminance(hue, DECO_LUM + (rand(i * 5 + 17) - 0.5) * 12), side: hue };
  }

  /** How far tier \`t\` has risen at view progress \`e\` (tiers rise one after another). */
  private rise(t: number, e: number) {
    return THREE.MathUtils.smoothstep(e, 0.06 + t * 0.13, 0.5 + t * 0.13);
  }

  /** Current height of the cake surface over cell (r, c): the highest risen tier covering it. */
  private surface(r: number, c: number, e: number) {
    const L = this.layout;
    const tier = L.tierOf[r * this.size + c];
    let h = 0;
    for (let t = 0; t <= tier; t++) h = Math.max(h, L.tierTop[t] * this.rise(t, e));
    return h;
  }

  /** Decorations sit exactly on the rising surface — never sunk into a tier, never floating. */
  voxelBase(i: number, e: number) {
    const m = this.modules[i];
    return this.surface(m.r, m.c, e);
  }

  /** Detail on tier t appears only once that tier has fully risen and the camera is tilted. */
  private detailDelay(t: number, seed: number) {
    return Math.min(0.9, 0.55 + t * 0.12 + rand(seed) * 0.04);
  }

  growDelay(i: number) {
    // decorations land once their tier is built
    const m = this.modules[i];
    const t = this.layout.tierOf[m.r * this.size + m.c];
    return 0.12 + t * 0.12 + rand(i * 7 + 3) * 0.08;
  }

  /** Chocolate pieces stay as (smaller) cubes; everything else hands over to its detailed model. */
  voxelSideScale(i: number): [number, number, number] {
    const k = this.layout.kind[i];
    return k === 'choc' || k === 'border' ? [0.62, 0.72, 0.62] : [0, 0, 0];
  }

  private cellTopOf(i: number) {
    const m = this.modules[i];
    return new THREE.Vector3(m.c - this.layout.half + 0.5, cellTop(this.layout, m.r, m.c), m.r - this.layout.half + 0.5);
  }

  private build() {
    const N = this.size;
    const half = N / 2;
    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL_LIGHT.slab, roughness: 0.4, metalness: 0.3 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    this.group.add(slab);

    // frosting on light modules (rides up onto its tier in the side view)
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!this.matrix[r][c]) this.tiles.push({ x: c - half + 0.5, z: r - half + 0.5, r, c });
    this.tileMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 0.06, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })),
      Math.max(1, this.tiles.length)
    );
    this.tileMesh.count = this.tiles.length;
    this.tileMesh.receiveShadow = true;
    const greys = ['#ffffff', '#f6f5f2', '#eeece8', '#e9e7e2', '#f9f8f6'];
    this.tiles.forEach((_, i) => {
      this.tileQr.push(new THREE.Color(greys[Math.floor(rand(i * 3 + 5) * greys.length)]));
      this.tileSide.push(new THREE.Color(this.pal.cream).multiplyScalar(0.97 + rand(i * 7 + 2) * 0.05));
    });
    this.group.add(this.tileMesh);

    this.buildTiers();
    this.buildDecorations();
    this.buildCandles();
    this.buildConfetti();
    this.update(0, 0);
  }

  /** Sponge tiers with cream stripes, a frosting top, pearl piping and glaze drips on the edges. */
  private buildTiers() {
    const L = this.layout;
    const half = L.half;
    const sponge: GrowItem[] = [];
    const spongeT: number[] = [];
    const creamT: number[] = [];
    const cream: GrowItem[] = [];
    const glaze: GrowItem[] = [];
    const pearls: GrowItem[] = [];
    const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
      new THREE.Matrix4().compose(new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), new THREE.Quaternion(), new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0));
    L.bounds.forEach(([lo, hi], t) => {
      const x0 = lo - half, x1 = hi + 1 - half;
      const y0 = t === 0 ? 0 : L.tierTop[t - 1];
      const y1 = L.tierTop[t];
      const h = y1 - y0;
      const delay = this.detailDelay(t, t * 7 + 1) + 0.04; // glaze, drips, pearls: late
      const pivot = new THREE.Vector3((x0 + x1) / 2, y0, (x0 + x1) / 2);
      // sponge body, slightly inset so the cream stripes and glaze read as layers
      spongeT.push(t);
      sponge.push({ matrix: box(x0 + 0.04, x1 - 0.04, y0, y1 - 0.12, x0 + 0.04, x1 - 0.04), color: this.pal.sponge, delay, pivot });
      for (const f of [0.33, 0.66]) {
        const ys = y0 + h * f;
        creamT.push(t);
        cream.push({ matrix: box(x0 + 0.02, x1 - 0.02, ys - 0.07, ys + 0.07, x0 + 0.02, x1 - 0.02), color: this.pal.cream, delay, pivot });
      }
      // frosting top under the decorations
      creamT.push(t);
      cream.push({ matrix: box(x0, x1, y1 - 0.14, y1 - 0.005, x0, x1), color: this.pal.cream, delay: delay + 0.03, pivot });
      // glaze collar + drips along all four edges
      const glazeY = y1 - 0.1;
      const edges: [number, number, number, number][] = [
        [x0, x1, x0, x0], // north
        [x0, x1, x1, x1], // south
        [x0, x0, x0, x1], // west
        [x1, x1, x0, x1], // east
      ];
      edges.forEach(([ax, bx, az, bz], ei) => {
        const len = Math.max(Math.abs(bx - ax), Math.abs(bz - az));
        const n = Math.round(len / 0.5);
        for (let k = 0; k <= n; k++) {
          const u = k / n;
          const px = ax + (bx - ax) * u;
          const pz = az + (bz - az) * u;
          const out = ei === 0 ? [0, -1] : ei === 1 ? [0, 1] : ei === 2 ? [-1, 0] : [1, 0];
          const seed = t * 1000 + ei * 100 + k;
          const dl = 0.15 + rand(seed) * 0.55;
          const p = new THREE.Vector3(px + out[0] * 0.03, glazeY - dl / 2, pz + out[1] * 0.03);
          glaze.push({
            matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(out[0] ? 0.08 : 0.26, dl, out[1] ? 0.08 : 0.26)),
            color: this.pal.glaze,
            delay: delay + 0.08,
            pivot: new THREE.Vector3(px, glazeY, pz),
          });
          // pearls piped along the top edge
          const q = new THREE.Vector3(px + out[0] * 0.02, y1 + 0.06, pz + out[1] * 0.02);
          pearls.push({ matrix: new THREE.Matrix4().compose(q, new THREE.Quaternion(), new THREE.Vector3(0.2, 0.2, 0.2)), color: this.pal.cream, delay: delay + 0.1, pivot: q.clone() });
        }
        // glaze collar band
        const s = 0.07;
        glaze.push({
          matrix: ei < 2 ? box(x0 - s, x1 + s, glazeY - 0.06, glazeY + 0.08, (ei ? x1 : x0) - s, (ei ? x1 : x0) + s) : box((ei === 3 ? x1 : x0) - s, (ei === 3 ? x1 : x0) + s, glazeY - 0.06, glazeY + 0.08, x0 - s, x1 + s),
          color: this.pal.glaze,
          delay: delay + 0.06,
          pivot: new THREE.Vector3((x0 + x1) / 2, glazeY, (x0 + x1) / 2),
        });
      });
    });
    this.addTierMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), sponge, spongeT);
    this.addTierMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), cream, creamT);
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.05 }), glaze, false);
    this.grow.add(new THREE.SphereGeometry(0.5, 10, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), pearls, false);
  }

  private tierSets: { mesh: THREE.InstancedMesh; base: THREE.Matrix4[]; tier: number[] }[] = [];

  /** Tier geometry that stretches up from the board with its tier (Y only — the footprint never grows). */
  private addTierMesh(geo: THREE.BufferGeometry, mat: THREE.Material, items: GrowItem[], tiers: number[]) {
    const mesh = new THREE.InstancedMesh(this.track(geo), this.track(mat), Math.max(1, items.length));
    mesh.count = items.length;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const c = new THREE.Color();
    items.forEach((it, i) => mesh.setColorAt(i, c.set(it.color)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    this.group.add(mesh);
    this.tierSets.push({ mesh, base: items.map((it) => it.matrix), tier: tiers });
  }

  private updateTiers(e: number) {
    const s = new THREE.Matrix4();
    const m = new THREE.Matrix4();
    for (const set of this.tierSets) {
      let any = false;
      for (let i = 0; i < set.base.length; i++) {
        const r = this.rise(set.tier[i], e);
        if (r > 0.001) any = true;
        s.makeScale(1, Math.max(1e-4, r), 1);
        m.copy(s).multiply(set.base[i]);
        set.mesh.setMatrixAt(i, m);
      }
      set.mesh.visible = any;
      set.mesh.instanceMatrix.needsUpdate = true;
    }
  }

  /** Berries with leaf caps, macarons, cream rosettes. Chocolate cubes are the (shrunk) QR cubes. */
  private buildDecorations() {
    const L = this.layout;
    const berries: GrowItem[] = [];
    const leaves: GrowItem[] = [];
    const shells: GrowItem[] = [];
    const fills: GrowItem[] = [];
    const rosettes: GrowItem[] = [];
    this.modules.forEach((_, i) => {
      const k = L.kind[i];
      const top = this.cellTopOf(i);
      const delay = this.detailDelay(L.tierOf[this.modules[i].r * this.size + this.modules[i].c], i * 3 + 2);
      const pivot = top.clone();
      if (k === 'berry') {
        const p = top.clone().setY(top.y + 0.26);
        berries.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0.3, rand(i) * 3, 0)), new THREE.Vector3(0.62, 0.56, 0.62)), color: this.pal.berry, delay, pivot });
        leaves.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(p.y + 0.27), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i + 1) * 3, 0)), new THREE.Vector3(0.36, 0.12, 0.36)), color: this.pal.leaf, delay: delay + 0.03, pivot });
      } else if (k === 'macaron') {
        const color = this.decoColor(i);
        const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand(i + 2) - 0.5) * 0.4, 0, (rand(i + 3) - 0.5) * 0.4));
        shells.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.1), tilt, new THREE.Vector3(0.74, 0.17, 0.74)), color, delay, pivot });
        fills.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.23), tilt, new THREE.Vector3(0.66, 0.09, 0.66)), color: this.pal.cream, delay, pivot });
        shells.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.35), tilt, new THREE.Vector3(0.74, 0.17, 0.74)), color, delay, pivot });
      } else if (k === 'rosette') {
        rosettes.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.2), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i) * 3, 0)), new THREE.Vector3(0.7, 0.4, 0.7)), color: this.pal.rosette, delay, pivot });
        rosettes.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.5), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i + 5) * 3, 0)), new THREE.Vector3(0.36, 0.3, 0.36)), color: this.pal.rosette, delay: delay + 0.03, pivot });
      }
    });
    this.grow.add(new THREE.SphereGeometry(0.5, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }), berries);
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.2, 1, 6), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), leaves, false);
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.5, 1, 18), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), shells);
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.5, 1, 18), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), fills, false);
    this.grow.add(new THREE.ConeGeometry(0.5, 1, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, flatShading: true }), rosettes);
  }

  /** Striped candle with a flickering flame on each finder centre cell. */
  private buildCandles() {
    const L = this.layout;
    const stripes: GrowItem[] = [];
    this.flameMat = this.track(new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#ff9a2a', emissiveIntensity: 0, transparent: true, opacity: 0.95 }));
    const flameGeo = this.track(new THREE.ConeGeometry(0.2, 0.62, 12));
    this.modules.forEach((_, i) => {
      if (L.kind[i] !== 'candle') return;
      const top = this.cellTopOf(i);
      const delay = this.detailDelay(0, i * 5 + 4);
      for (let k = 0; k < 8; k++) {
        stripes.push({
          matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.16 + k * 0.32), new THREE.Quaternion(), new THREE.Vector3(0.6, 0.32, 0.6)),
          color: this.pal.candle[k % 2],
          delay: delay + k * 0.01,
          pivot: top.clone(),
        });
      }
      const flame = new THREE.Mesh(flameGeo, this.flameMat);
      flame.position.set(top.x, top.y + 2.95, top.z);
      flame.visible = false;
      this.group.add(flame);
      this.flames.push(flame);
    });
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.5, 1, 14), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), stripes);
  }

  private buildConfetti() {
    const n = 80;
    this.confetti = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.22, 0.03, 0.14)), this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })), n);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) this.confetti.setColorAt(i, c.set(this.pal.confetti[i % this.pal.confetti.length]));
    this.confetti.visible = false;
    this.group.add(this.confetti);
  }

  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    lerpStageLighting(e, this.pal.mood, ambient, sun, point);
    this.slabMat.color.set(NEUTRAL_LIGHT.slab).lerp(new THREE.Color(this.pal.board), e);
  }

  update(growth: number, time: number) {
    if (growth !== this.lastGrowth) {
      this.lastGrowth = growth;
      this.grow.update(growth);
      this.updateTiers(growth);
      // frosting rises with its tier and turns from white mosaic to cream
      const m4 = new THREE.Matrix4();
      const c = new THREE.Color();
      const k = THREE.MathUtils.smoothstep(growth, 0.1, 0.65);
      this.tiles.forEach((t, i) => {
        m4.makeTranslation(t.x, this.surface(t.r, t.c, growth) + 0.03, t.z);
        this.tileMesh.setMatrixAt(i, m4);
        c.copy(this.tileQr[i]).lerp(this.tileSide[i], k);
        this.tileMesh.setColorAt(i, c);
      });
      this.tileMesh.instanceMatrix.needsUpdate = true;
      if (this.tileMesh.instanceColor) this.tileMesh.instanceColor.needsUpdate = true;
    }

    // candle flames flicker once lit
    const lit = THREE.MathUtils.smoothstep(growth, 0.75, 1);
    this.flameMat.emissiveIntensity = 2.2 * lit;
    this.flames.forEach((f, i) => {
      f.visible = lit > 0.01;
      const flick = 1 + Math.sin(time * 13 + i * 2) * 0.08 + Math.sin(time * 23 + i) * 0.05;
      f.scale.set(lit * (1 + Math.sin(time * 9 + i) * 0.06), lit * flick, lit * (1 + Math.cos(time * 9 + i) * 0.06));
      f.rotation.z = Math.sin(time * 4 + i) * 0.08;
    });

    // confetti drifting down around the cake
    const vis = THREE.MathUtils.clamp((growth - 0.85) / 0.15, 0, 1);
    this.confetti.visible = vis > 0;
    if (this.confetti.visible) {
      const d = new THREE.Object3D();
      const span = this.size + 2;
      const top = this.layout.tierTop[2] + 5;
      for (let i = 0; i < this.confetti.count; i++) {
        const y = top - ((time * (0.5 + rand(i) * 0.6) + rand(i + 50) * top) % top);
        d.position.set((rand(i + 1) - 0.5) * span + Math.sin(time + i) * 0.4, y, (rand(i + 2) - 0.5) * span + Math.cos(time * 0.8 + i) * 0.4);
        d.rotation.set(time * (1 + rand(i + 3)) + i, time * 0.7 + i, Math.sin(time + i));
        d.scale.setScalar(vis);
        d.updateMatrix();
        this.confetti.setMatrixAt(i, d.matrix);
      }
      this.confetti.instanceMatrix.needsUpdate = true;
    }
  }

  dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
