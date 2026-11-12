import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import { GrowSet, NEUTRAL_LIGHT, finderLocal, lerpStageLighting, type GrowItem, type StageScene } from './stageScene';

/**
 * "QR Garden Maze" — a hedge maze whose hedge tops are the QR code when seen from directly above.
 *
 *  - every dark QR module is a clipped hedge column; isolated dark modules become topiary balls;
 *  - light modules are gravel paths — the QR literally is a maze;
 *  - the three finder squares are pavilions: hedge ring, flower bed, gazebo on the centre cell
 *    (only that centre cell carries the gazebo colour in the QR);
 *  - flowers on hedges, a fountain, lanterns, fallen leaves and visitors walking the longest path
 *    only exist in the side view.
 *
 * Modes: day / evening / autumn — applied only in the side view, the top view always scans.
 */

export type GardenMode = 'day' | 'evening' | 'autumn';

interface GardenPalette {
  hedges: string[];
  flowers: string[];
  path: string;
  slab: string;
  gazebo: [string, string, string];
  leaves: string[];
  lanterns: number;
  /** QR (top view) mood: hedge hues are pulled towards this tint, so every mode has its own QR palette. */
  qrTint: string | null;
  qrTintAmount: number;
  mood: {
    ambient: { color: string; intensity: number };
    sun: { color: string; intensity: number; position: [number, number, number] };
  };
}

export const GARDEN_MODES: Record<GardenMode, GardenPalette> = {
  day: {
    hedges: ['#3f8f3a', '#4a9a40', '#357c33', '#5aa648', '#44923c'],
    flowers: ['#f25c8a', '#ffd23f', '#ffffff', '#b07cf0', '#ff7a4a'],
    path: '#e6d9bf',
    slab: '#d9ceb6',
    gazebo: ['#d94a3a', '#3a6fc0', '#8a4a32'],
    leaves: [],
    lanterns: 0,
    qrTint: null,
    qrTintAmount: 0,
    mood: {
      ambient: { color: '#ffffff', intensity: 1.2 },
      sun: { color: '#fff4dc', intensity: 2.6, position: [22, 48, 28] },
    },
  },
  evening: {
    hedges: ['#4f9a5a', '#58a464', '#4a8f55', '#5fae6a', '#529e5e'],
    flowers: ['#ff7aa8', '#ffd86a', '#fff4e0', '#c79bff', '#ff9a6a'],
    path: '#bfae90',
    slab: '#a8987e',
    gazebo: ['#c9423a', '#3a62b0', '#7a4230'],
    leaves: [],
    lanterns: 1,
    // dusk: teal-violet hedges, warm lantern cells
    qrTint: '#4a3fa8',
    qrTintAmount: 0.55,
    mood: {
      ambient: { color: '#b4a6e0', intensity: 1.35 },
      sun: { color: '#ffa070', intensity: 2.3, position: [44, 16, -10] },
    },
  },
  autumn: {
    hedges: ['#c9682a', '#d98a2a', '#b5532a', '#e0a83a', '#8f6a2a', '#a8452a'],
    flowers: ['#ffd23f', '#ff7a4a', '#c0392b'],
    path: '#dccbaa',
    slab: '#cbb894',
    gazebo: ['#8a2f2a', '#3a5a8a', '#6a3a22'],
    leaves: ['#e0892a', '#c9562a', '#f2b33a', '#a8452a'],
    lanterns: 0,
    qrTint: null,
    qrTintAmount: 0,
    mood: {
      ambient: { color: '#fff0dc', intensity: 1.15 },
      sun: { color: '#ffd8a0', intensity: 2.5, position: [30, 36, 22] },
    },
  },
};

const HEDGE_LUM = 100;
const HEDGE_H = 1.2;

export interface MazeLayout {
  size: number;
  half: number;
  height: number[];
  /** 'hedge' | 'topiary' | 'ring' | 'bed' | 'gazebo' */
  kind: string[];
  /** finder index for pavilion cells, -1 otherwise */
  pavilion: number[];
  maxH: number;
}

export function mazeLayout(modules: DarkModule[], size: number): MazeLayout {
  const half = size / 2;
  const dark = new Set(modules.map((m) => m.r * size + m.c));
  const isDark = (r: number, c: number) => r >= 0 && c >= 0 && r < size && c < size && dark.has(r * size + c);
  const height: number[] = [];
  const kind: string[] = [];
  const pavilion: number[] = [];
  modules.forEach((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      const core = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
      pavilion.push(fi);
      if (!core) {
        kind.push('ring');
        height.push(HEDGE_H + 0.3);
      } else if (fr === 3 && fc === 3) {
        kind.push('gazebo');
        height.push(0.3);
      } else {
        kind.push('bed');
        height.push(0.3);
      }
      return;
    }
    pavilion.push(-1);
    const lonely = !isDark(m.r - 1, m.c) && !isDark(m.r + 1, m.c) && !isDark(m.r, m.c - 1) && !isDark(m.r, m.c + 1);
    if (lonely) {
      kind.push('topiary');
      height.push(0.45);
      return;
    }
    kind.push('hedge');
    // hedges are clipped flat, with the odd taller section for rhythm
    height.push(HEDGE_H + (rand(i * 7 + 3) < 0.12 ? 0.3 : 0));
  });
  return { size, half, height, kind, pavilion, maxH: Math.max(...height) };
}

export function mazeVoxelTargets(modules: DarkModule[], size: number) {
  const L = mazeLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

/** Hedge material: leafy speckle on every face in the side view. */
function createHedgeMaterial() {
  const uniforms = { uSide: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'varying vec3 vHedgePos;\n' +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 hedgeWp = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          hedgeWp = instanceMatrix * hedgeWp;
        #endif
        vHedgePos = (modelMatrix * hedgeWp).xyz;`
      );
    shader.fragmentShader =
      'varying vec3 vHedgePos;\nuniform float uSide;\n' +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        vec3 hp = floor(vHedgePos * 6.0);
        float leaf = fract(sin(dot(hp, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        float leaf2 = fract(sin(dot(floor(vHedgePos * 2.5), vec3(39.3, 11.7, 91.1))) * 13758.5453);
        diffuseColor.rgb *= mix(1.0, 0.78 + 0.22 * leaf + 0.1 * (leaf2 - 0.5), uSide);`
      );
  };
  material.customProgramCacheKey = () => 'qr-maze-hedge';
  return { material, uniforms };
}

type PathTile = { x: number; z: number; r: number; c: number };

interface Walker {
  path: THREE.Vector3[];
  speed: number;
  phase: number;
  color: string;
}

export class MazeDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  public readonly targets: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  private hedgeUniforms: { uSide: { value: number } };
  private layout: MazeLayout;
  private pal: GardenPalette;
  private disposables: { dispose(): void }[] = [];
  private grow: GrowSet;
  private tiles: PathTile[] = [];
  private tileMesh!: THREE.InstancedMesh;
  private tileQr: THREE.Color[] = [];
  private tileSide: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private lanternMat!: THREE.MeshStandardMaterial;
  private qrHue = new Map<number, string>();
  private walkers: Walker[] = [];
  private walkerBody!: THREE.InstancedMesh;
  private walkerHead!: THREE.InstancedMesh;
  private fountain: { pos: THREE.Vector3 } | null = null;
  private jets!: THREE.InstancedMesh;
  private lastGrowth = -1;
  private growth = 0;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    private mode: GardenMode
  ) {
    this.layout = mazeLayout(modules, size);
    this.pal = GARDEN_MODES[mode];
    const hm = createHedgeMaterial();
    this.voxelMaterial = hm.material;
    this.hedgeUniforms = hm.uniforms;
    this.targets = modules.map((m, i) => {
      const h = this.layout.height[i];
      return { x: m.c - this.layout.half + 0.5, y: h / 2, z: m.r - this.layout.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
    });
    this.grow = new GrowSet(this.group, (o) => this.track(o));
    this.build();
  }

  get maxHeight() {
    return this.layout.maxH + 3.2; // gazebo roofs + fountain spray
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private isPath(r: number, c: number) {
    if (r < 0 || c < 0 || r >= this.size || c >= this.size) return false;
    return !this.matrix[r][c];
  }

  /** Hedge colour changes in patches (3×3 lots), not cube by cube — reads as planted sections. */
  private hedgeColor(i: number) {
    const m = this.modules[i];
    const lot = Math.floor(m.r / 3) * 97 + Math.floor(m.c / 3) * 31;
    const pick = rand(lot + 7) * 0.85 + rand(i * 3 + 7) * 0.15;
    return this.pal.hedges[Math.min(this.pal.hedges.length - 1, Math.floor(pick * this.pal.hedges.length))];
  }

  voxelColor(i: number) {
    const L = this.layout;
    const k = L.kind[i];
    let side = this.hedgeColor(i);
    if (k === 'bed' || k === 'gazebo') side = '#6b4a32'; // soil of the flower bed
    if (k === 'topiary') side = '#b5653f'; // terracotta pot
    let hue = this.qrHue.get(i) ?? (k === 'bed' ? '#5a9a3a' : this.hedgeColor(i));
    if (this.pal.qrTint && !this.qrHue.has(i)) {
      hue = '#' + new THREE.Color(hue).lerp(new THREE.Color(this.pal.qrTint), this.pal.qrTintAmount).getHexString();
    }
    return { qr: atLuminance(hue, HEDGE_LUM + (rand(i * 5 + 17) - 0.5) * 14), side };
  }

  /** Side view: the hedge box shrinks inside its leafy clumps, a topiary cell becomes a slim pot. */
  readonly voxelSideWindow: [number, number] = [0.3, 0.72];
  voxelSideScale(i: number): [number, number, number] {
    const k = this.layout.kind[i];
    if (k === 'hedge' || k === 'ring') return [0.8, 0.88, 0.8];
    if (k === 'topiary') return [0.5, 1, 0.5];
    return [1, 1, 1];
  }

  growDelay(i: number) {
    // hedges sprout from the ground in a wave from the entrance corner (top-left) inwards
    const m = this.modules[i];
    return 0.04 + ((m.r + m.c) / (2 * this.size)) * 0.3 + rand(i * 7 + 3) * 0.06;
  }

  private top(i: number) {
    const m = this.modules[i];
    return new THREE.Vector3(m.c - this.layout.half + 0.5, this.layout.height[i], m.r - this.layout.half + 0.5);
  }

  private build() {
    const N = this.size;
    const half = N / 2;

    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL_LIGHT.slab, roughness: 0.9 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    slab.castShadow = true;
    this.group.add(slab);

    // gravel paths on light modules
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!this.matrix[r][c]) this.tiles.push({ x: c - half + 0.5, z: r - half + 0.5, r, c });
    this.tileMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 0.06, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 })),
      Math.max(1, this.tiles.length)
    );
    this.tileMesh.count = this.tiles.length;
    this.tileMesh.receiveShadow = true;
    const greys = ['#ffffff', '#f6f5f2', '#eeece8', '#e9e7e2', '#f9f8f6'];
    const m4 = new THREE.Matrix4();
    this.tiles.forEach((t, i) => {
      m4.makeTranslation(t.x, 0.03, t.z);
      this.tileMesh.setMatrixAt(i, m4);
      this.tileQr.push(new THREE.Color(greys[Math.floor(rand(i * 3 + 5) * greys.length)]));
      this.tileSide.push(new THREE.Color(this.pal.path).multiplyScalar(0.93 + rand(i * 11 + 9) * 0.1));
      this.tileMesh.setColorAt(i, this.tileQr[i]);
    });
    this.group.add(this.tileMesh);

    this.buildLeafClumps();
    this.buildFlowers();
    this.buildTopiary();
    this.buildPavilions();
    this.buildFountain();
    this.buildLanterns();
    this.buildLeaves();
    this.buildWalkers();
    this.update(0, 0);
  }

  /**
   * Leafy clumps: low-poly blobs over the top and the outer faces of every hedge cell, so the hedge
   * reads as a soft, bushy wall instead of a box. They grow over the QR cube while it shrinks inside.
   */
  private buildLeafClumps() {
    const L = this.layout;
    const N = this.size;
    const dark = new Set(this.modules.map((m) => m.r * N + m.c));
    const height = new Map<number, number>();
    this.modules.forEach((m, i) => height.set(m.r * N + m.c, L.height[i]));
    const clumps: GrowItem[] = [];
    const c = new THREE.Color();
    this.modules.forEach((m, i) => {
      const k = L.kind[i];
      if (k !== 'hedge' && k !== 'ring') return;
      const top = this.top(i);
      const h = L.height[i];
      const base = this.hedgeColor(i);
      const delay = Math.min(0.8, this.growDelay(i) + 0.18);
      const add = (p: THREE.Vector3, s: number, seed: number) => {
        c.set(base).multiplyScalar(0.86 + rand(seed) * 0.26);
        clumps.push({
          matrix: new THREE.Matrix4().compose(
            p,
            new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(seed + 1) * 3, rand(seed + 2) * 3, rand(seed + 3) * 3)),
            new THREE.Vector3(s, s * (0.8 + rand(seed + 4) * 0.3), s)
          ),
          color: '#' + c.getHexString(),
          delay: delay + rand(seed + 5) * 0.08,
          pivot: new THREE.Vector3(top.x, h / 2, top.z),
        });
      };
      // bumpy top
      for (let q = 0; q < 4; q++) {
        add(
          top.clone().add(new THREE.Vector3((q % 2 ? 0.22 : -0.22) + (rand(i * 9 + q) - 0.5) * 0.12, -0.08 + rand(i + q * 3) * 0.1, (q < 2 ? -0.22 : 0.22) + (rand(i * 7 + q) - 0.5) * 0.12)),
          0.5 + rand(i * 11 + q) * 0.16,
          i * 31 + q
        );
      }
      // outer faces: where the neighbour is path (or a lower hedge), cover the wall with clumps
      const sides: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      sides.forEach(([dr, dc], si) => {
        const nk = (m.r + dr) * N + (m.c + dc);
        const nh = dark.has(nk) ? height.get(nk) ?? 0 : 0;
        if (nh >= h) return;
        const rows = Math.max(1, Math.round((h - nh) / 0.45));
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < 2; col++) {
            const along = (col ? 0.24 : -0.24) + (rand(i * 13 + si * 5 + row + col) - 0.5) * 0.1;
            const y = nh + 0.25 + row * 0.45 + (rand(i + si + row * 7 + col) - 0.5) * 0.1;
            const p = new THREE.Vector3(
              top.x + (dc !== 0 ? dc * 0.43 : along),
              Math.min(h - 0.15, y),
              top.z + (dr !== 0 ? dr * 0.43 : along)
            );
            add(p, 0.4 + rand(i * 17 + si + row + col) * 0.14, i * 53 + si * 11 + row * 3 + col);
          }
        }
      });
    });
    this.grow.add(
      new THREE.IcosahedronGeometry(0.5, 0),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, flatShading: true }),
      clumps
    );
  }

  /** Flowers dotted on hedge tops and faces; the hedge cell takes the flower tint in the QR. */
  private buildFlowers() {
    const L = this.layout;
    const blooms: GrowItem[] = [];
    this.modules.forEach((_, i) => {
      if (L.kind[i] !== 'hedge' && L.kind[i] !== 'ring') return;
      if (rand(i * 13 + 5) > (this.mode === 'autumn' ? 0.12 : 0.24)) return;
      const color = this.pal.flowers[Math.floor(rand(i * 17 + 2) * this.pal.flowers.length)];
      this.qrHue.set(i, color === '#ffffff' || color === '#fff4e0' ? '#c9b8e8' : color);
      const top = this.top(i);
      const delay = Math.min(0.88, this.growDelay(i) + 0.35);
      for (let k = 0; k < 6; k++) {
        const onTop = k < 3;
        const p = top.clone().add(
          new THREE.Vector3((rand(i * 3 + k) - 0.5) * 0.85, onTop ? 0.26 : -0.2 - rand(i + k * 5) * 0.7, (rand(i * 5 + k) - 0.5) * 0.85)
        );
        if (!onTop) {
          // pin side flowers to a face
          const face = Math.floor(rand(i + k * 7) * 4);
          if (face === 0) p.x = top.x + 0.68;
          if (face === 1) p.x = top.x - 0.68;
          if (face === 2) p.z = top.z + 0.68;
          if (face === 3) p.z = top.z - 0.68;
        }
        const s = 0.14 + rand(i * 7 + k) * 0.08;
        blooms.push({
          matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i + k) * 3, 0)), new THREE.Vector3(s, s * 0.7, s)),
          color,
          delay,
          pivot: p.clone(),
        });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), blooms, false);
  }

  /** Lonely dark modules: a clipped ball on a short trunk standing in a pot. */
  private buildTopiary() {
    const L = this.layout;
    const balls: GrowItem[] = [];
    const stems: GrowItem[] = [];
    this.modules.forEach((_, i) => {
      if (L.kind[i] !== 'topiary') return;
      const top = this.top(i);
      const delay = Math.min(0.85, this.growDelay(i) + 0.25);
      stems.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.25), new THREE.Quaternion(), new THREE.Vector3(0.08, 0.5, 0.08)), color: '#6b4a32', delay, pivot: top.clone() });
      const s = 0.75 + rand(i + 1) * 0.15;
      balls.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.5 + s * 0.42), new THREE.Quaternion(), new THREE.Vector3(s, s, s)), color: this.hedgeColor(i), delay: delay + 0.05, pivot: top.clone() });
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), stems);
    this.grow.add(new THREE.SphereGeometry(0.5, 12, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }), balls);
  }

  /** Finder squares: flower bed on the 3×3 core, white gazebo on the centre cell. */
  private buildPavilions() {
    const L = this.layout;
    const flowers: GrowItem[] = [];
    const columns: GrowItem[] = [];
    const roofs: GrowItem[] = [];
    const floors: GrowItem[] = [];
    this.modules.forEach((_, i) => {
      const fi = L.pavilion[i];
      if (fi < 0) return;
      const top = this.top(i);
      const delay = Math.min(0.85, this.growDelay(i) + 0.3);
      if (L.kind[i] === 'bed') {
        for (let k = 0; k < 5; k++) {
          const p = top.clone().add(new THREE.Vector3((rand(i * 3 + k) - 0.5) * 0.8, 0.12, (rand(i * 5 + k) - 0.5) * 0.8));
          const color = this.pal.flowers[Math.floor(rand(i * 11 + k) * this.pal.flowers.length)];
          flowers.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(0.18, 0.24, 0.18)), color, delay, pivot: p.clone().setY(top.y) });
        }
      }
      if (L.kind[i] === 'gazebo') {
        const roofColor = this.pal.gazebo[fi];
        this.qrHue.set(i, roofColor);
        floors.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.05), new THREE.Quaternion(), new THREE.Vector3(0.95, 0.1, 0.95)), color: '#f2eee6', delay, pivot: top.clone() });
        for (const [dx, dz] of [[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]]) {
          columns.push({ matrix: new THREE.Matrix4().compose(top.clone().add(new THREE.Vector3(dx, 0.75, dz)), new THREE.Quaternion(), new THREE.Vector3(0.08, 1.3, 0.08)), color: '#ffffff', delay: delay + 0.04, pivot: top.clone() });
        }
        roofs.push({
          matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 1.75), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 8, 0)), new THREE.Vector3(0.62, 0.6, 0.62)),
          color: roofColor,
          delay: delay + 0.08,
          pivot: top.clone(),
        });
        roofs.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 2.15), new THREE.Quaternion(), new THREE.Vector3(0.08, 0.25, 0.08)), color: '#d8b44a', delay: delay + 0.1, pivot: top.clone() });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), flowers, false);
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), floors);
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 }), columns);
    this.grow.add(new THREE.CylinderGeometry(0, 1, 1, 8), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), roofs);
  }

  /** Fountain on the open patch of path closest to the centre. */
  private buildFountain() {
    let best: PathTile | null = null;
    let bestD = Infinity;
    for (const t of this.tiles) {
      const open = this.isPath(t.r - 1, t.c) && this.isPath(t.r + 1, t.c) && this.isPath(t.r, t.c - 1) && this.isPath(t.r, t.c + 1);
      if (!open) continue;
      const d = Math.hypot(t.x, t.z);
      if (d < bestD) {
        bestD = d;
        best = t;
      }
    }
    const parts: GrowItem[] = [];
    const water: GrowItem[] = [];
    if (best) {
      const p = new THREE.Vector3(best.x, 0.06, best.z);
      this.fountain = { pos: p };
      parts.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.16), new THREE.Quaternion(), new THREE.Vector3(1.5, 0.22, 1.5)), color: '#dcd6cc', delay: 0.45, pivot: p.clone() });
      parts.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.55), new THREE.Quaternion(), new THREE.Vector3(0.16, 0.7, 0.16)), color: '#dcd6cc', delay: 0.5, pivot: p.clone() });
      parts.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.92), new THREE.Quaternion(), new THREE.Vector3(0.6, 0.1, 0.6)), color: '#dcd6cc', delay: 0.55, pivot: p.clone() });
      water.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.25), new THREE.Quaternion(), new THREE.Vector3(1.3, 0.05, 1.3)), color: '#6fc7dc', delay: 0.55, pivot: p.clone() });
      water.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.96), new THREE.Quaternion(), new THREE.Vector3(0.5, 0.04, 0.5)), color: '#6fc7dc', delay: 0.6, pivot: p.clone() });
    }
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), parts);
    this.grow.add(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.85 }), water, false);
    this.jets = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.07, 0.07, 0.07)), this.track(new THREE.MeshStandardMaterial({ color: '#cfefff', roughness: 0.2 })), 36);
    this.jets.count = this.fountain ? 36 : 0;
    this.group.add(this.jets);
  }

  /** Lanterns along the paths (they glow in the evening). */
  private buildLanterns() {
    const posts: GrowItem[] = [];
    const heads: GrowItem[] = [];
    this.tiles.forEach((t, i) => {
      if (rand(i * 19 + 4) > 0.09) return;
      const p = new THREE.Vector3(t.x + (rand(i + 1) - 0.5) * 0.5, 0.06, t.z + (rand(i + 2) - 0.5) * 0.5);
      posts.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.48), new THREE.Quaternion(), new THREE.Vector3(0.05, 0.85, 0.05)), color: '#3a3f46', delay: 0.6, pivot: p.clone() });
      heads.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(0.98), new THREE.Quaternion(), new THREE.Vector3(0.2, 0.22, 0.2)), color: '#ffffff', delay: 0.65, pivot: p.clone() });
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), posts, false);
    this.lanternMat = new THREE.MeshStandardMaterial({ color: '#fff2cc', emissive: '#ffcf6a', emissiveIntensity: 0 });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), this.lanternMat, heads, false);
  }

  /** Autumn: fallen leaves scattered over the paths. */
  private buildLeaves() {
    if (!this.pal.leaves.length) return;
    const leaves: GrowItem[] = [];
    this.tiles.forEach((t, i) => {
      const n = rand(i * 23 + 1) < 0.5 ? 2 : 0;
      for (let k = 0; k < n; k++) {
        const p = new THREE.Vector3(t.x + (rand(i * 3 + k) - 0.5) * 0.8, 0.075, t.z + (rand(i * 5 + k) - 0.5) * 0.8);
        leaves.push({
          matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i + k) * Math.PI, 0)), new THREE.Vector3(0.2, 0.02, 0.13)),
          color: this.pal.leaves[Math.floor(rand(i * 7 + k) * this.pal.leaves.length)],
          delay: 0.65 + rand(i + k) * 0.15,
          pivot: p.clone(),
        });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), leaves, false);
  }

  /** Visitors strolling along the longest path through the maze (BFS from far corner to far corner). */
  private buildWalkers() {
    const N = this.size;
    const key = (r: number, c: number) => r * N + c;
    const bfs = (sr: number, sc: number) => {
      const prev = new Map<number, number>();
      const dist = new Map<number, number>([[key(sr, sc), 0]]);
      const q = [key(sr, sc)];
      let far = key(sr, sc);
      while (q.length) {
        const k = q.shift()!;
        const r = Math.floor(k / N), c = k % N;
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const rr = r + dr, cc = c + dc;
          if (!this.isPath(rr, cc)) continue;
          const nk = key(rr, cc);
          if (dist.has(nk)) continue;
          dist.set(nk, dist.get(k)! + 1);
          prev.set(nk, k);
          if (dist.get(nk)! > dist.get(far)!) far = nk;
          q.push(nk);
        }
      }
      return { far, prev };
    };
    const half = N / 2;
    const starts: [number, number][] = [];
    for (const t of this.tiles) if (t.r > 7 && t.c > 7) { starts.push([t.r, t.c]); break; }
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      const t = this.tiles[i];
      if (t.r < N - 8 || t.c < 8) continue;
      starts.push([t.r, t.c]);
      break;
    }
    const colors = ['#e94f4f', '#3a6fc0', '#f2c14e'];
    starts.forEach(([sr, sc], wi) => {
      const a = bfs(sr, sc);
      const b = bfs(Math.floor(a.far / N), a.far % N);
      const cells: number[] = [];
      let k: number | undefined = b.far;
      while (k !== undefined) {
        cells.push(k);
        k = b.prev.get(k);
      }
      if (cells.length < 6) return;
      this.walkers.push({
        path: cells.map((cell) => new THREE.Vector3((cell % N) - half + 0.5, 0.06, Math.floor(cell / N) - half + 0.5)),
        speed: 0.9 + wi * 0.25,
        phase: rand(wi + 3) * 2,
        color: colors[wi % colors.length],
      });
    });
    const n = Math.max(1, this.walkers.length);
    this.walkerBody = new THREE.InstancedMesh(this.track(new THREE.CylinderGeometry(0.12, 0.16, 0.42, 8)), this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 })), n);
    this.walkerHead = new THREE.InstancedMesh(this.track(new THREE.SphereGeometry(0.11, 10, 8)), this.track(new THREE.MeshStandardMaterial({ color: '#f1c9a5', roughness: 0.7 })), n);
    [this.walkerBody, this.walkerHead].forEach((m) => {
      m.count = this.walkers.length;
      m.castShadow = true;
      this.group.add(m);
    });
    const c = new THREE.Color();
    this.walkers.forEach((w, i) => this.walkerBody.setColorAt(i, c.set(w.color)));
  }

  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    lerpStageLighting(e, this.pal.mood, ambient, sun, point);
    this.slabMat.color.set(NEUTRAL_LIGHT.slab).lerp(new THREE.Color(this.pal.slab), e);
    this.hedgeUniforms.uSide.value = e;
    this.lanternMat.emissiveIntensity = 3.0 * this.pal.lanterns * THREE.MathUtils.smoothstep(e, 0.5, 1);
  }

  update(growth: number, time: number) {
    this.growth = growth;
    if (growth !== this.lastGrowth) {
      this.lastGrowth = growth;
      this.grow.update(growth);
      const k = THREE.MathUtils.smoothstep(growth, 0.1, 0.65);
      const c = new THREE.Color();
      for (let i = 0; i < this.tiles.length; i++) {
        c.copy(this.tileQr[i]).lerp(this.tileSide[i], k);
        this.tileMesh.setColorAt(i, c);
      }
      if (this.tileMesh.instanceColor) this.tileMesh.instanceColor.needsUpdate = true;
    }
    this.updateWalkers(time);
    this.updateFountain(time);
  }

  private updateWalkers(time: number) {
    const vis = THREE.MathUtils.clamp((this.growth - 0.8) / 0.2, 0, 1);
    this.walkerBody.visible = this.walkerHead.visible = vis > 0 && this.walkers.length > 0;
    if (vis <= 0) return;
    const d = new THREE.Object3D();
    this.walkers.forEach((w, i) => {
      const n = w.path.length - 1;
      const s = ((time * w.speed) / n + w.phase) % 2;
      const t = (s < 1 ? s : 2 - s) * n;
      const a = Math.floor(Math.min(t, n - 1e-4));
      const f = t - a;
      const p = w.path[a].clone().lerp(w.path[a + 1], f);
      const bob = Math.abs(Math.sin(time * w.speed * 6 + i)) * 0.04;
      d.position.set(p.x, 0.06 + 0.21 + bob, p.z);
      d.rotation.set(0, 0, 0);
      d.scale.setScalar(vis);
      d.updateMatrix();
      this.walkerBody.setMatrixAt(i, d.matrix);
      d.position.y += 0.32 * vis;
      d.updateMatrix();
      this.walkerHead.setMatrixAt(i, d.matrix);
    });
    this.walkerBody.instanceMatrix.needsUpdate = true;
    this.walkerHead.instanceMatrix.needsUpdate = true;
    if (this.walkerBody.instanceColor) this.walkerBody.instanceColor.needsUpdate = true;
  }

  private updateFountain(time: number) {
    if (!this.fountain) return;
    const vis = THREE.MathUtils.clamp((this.growth - 0.75) / 0.25, 0, 1);
    this.jets.visible = vis > 0;
    if (!this.jets.visible) return;
    const d = new THREE.Object3D();
    const p = this.fountain.pos;
    for (let i = 0; i < 36; i++) {
      // droplets arc out of the top bowl and fall into the basin
      const life = (time * 0.9 + i / 36) % 1;
      const ang = (i / 36) * Math.PI * 2 * 3;
      const r = life * 0.6;
      d.position.set(p.x + Math.cos(ang) * r, 1.0 + life * 1.6 - life * life * 2.2, p.z + Math.sin(ang) * r);
      d.scale.setScalar(vis);
      d.updateMatrix();
      this.jets.setMatrixAt(i, d.matrix);
    }
    this.jets.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
