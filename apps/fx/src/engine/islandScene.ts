import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import {
  GrowSet,
  NEUTRAL_LIGHT,
  finderLocal,
  lerpStageLighting,
  straightRuns,
  type GrowItem,
  type StageScene,
} from './stageScene';

/**
 * "QR Island" — a voxel island whose cliff tops are the QR code when seen from directly above.
 *
 *  - every dark QR module is a terrain column: mountains in the middle, low rocks and islets
 *    towards the edge (an archipelago), terraced like voxel landscapes;
 *  - light modules are the sea: shallow turquoise next to land, deeper blue further out;
 *  - the three finder squares are landmarks: a lighthouse, a palm hill and a hut with a pier,
 *    each on a cliff ring around a little lagoon;
 *  - trees, waterfalls, boats, snow, lava and smoke only exist in the side view.
 *
 * Modes: summer / winter / volcano — applied only in the side view, the top view always scans.
 */

export type IslandMode = 'summer' | 'winter' | 'volcano';

interface IslandPalette {
  /** elevation bands: shore rocks, grass, forest, rock, peak */
  bands: [string, string, string, string, string];
  /** QR (top view) hue per band — luminance gets normalised, so these only set the tint */
  qrBands: [string, string, string, string, string];
  waterDeep: string;
  waterShallow: string;
  slab: string;
  foliage: string[];
  trunk: string;
  waterfall: string;
  mood: {
    ambient: { color: string; intensity: number };
    sun: { color: string; intensity: number; position: [number, number, number] };
  };
}

export const ISLAND_MODES: Record<IslandMode, IslandPalette> = {
  summer: {
    bands: ['#d9c27e', '#7fb54a', '#5a9a3a', '#8a8378', '#f2f4f6'],
    qrBands: ['#c9a25a', '#5fa83a', '#3f8f3a', '#8a7058', '#7fa6c8'],
    waterDeep: '#2f9fc7',
    waterShallow: '#6fd6dc',
    slab: '#1f6f8f',
    foliage: ['#3f8f3a', '#4fa043', '#357c33', '#5aaa48'],
    trunk: '#7a5634',
    waterfall: '#bfeefa',
    mood: {
      ambient: { color: '#ffffff', intensity: 1.2 },
      sun: { color: '#fff4dc', intensity: 2.6, position: [22, 48, 28] },
    },
  },
  winter: {
    bands: ['#cfd8de', '#eef3f7', '#dfe7ee', '#aab3bc', '#ffffff'],
    qrBands: ['#8fa8bc', '#9db8cc', '#7f9fb8', '#7a8796', '#a9c2d8'],
    waterDeep: '#3d6f8f',
    waterShallow: '#a9c9da',
    slab: '#2c4f66',
    foliage: ['#2f5a3c', '#36654a', '#2a5036'],
    trunk: '#5e4632',
    waterfall: '#e4f6ff',
    mood: {
      ambient: { color: '#dfe9ff', intensity: 1.25 },
      sun: { color: '#e8f0ff', intensity: 2.2, position: [30, 30, 20] },
    },
  },
  volcano: {
    bands: ['#2b2b2b', '#5f8a34', '#476f2c', '#3d3733', '#2a2523'],
    qrBands: ['#5a4a40', '#5f8a34', '#476f2c', '#6a4a3a', '#5a3530'],
    waterDeep: '#246f8f',
    waterShallow: '#4fb3c0',
    slab: '#1a4f66',
    foliage: ['#3f7a2a', '#4b8a30', '#356a24'],
    trunk: '#5a3d28',
    waterfall: '#9fdcef',
    mood: {
      ambient: { color: '#ffd9c4', intensity: 0.85 },
      sun: { color: '#ffb27a', intensity: 2.3, position: [-30, 35, 20] },
    },
  },
};

const ROCK_LUM = 100;
/** Palm-hill core cells (finder-local row, col) that carry a palm each. */
const PALM_CELLS: [number, number][] = [
  [2, 2],
  [3, 4],
  [4, 2],
];
const STEP = 0.5; // terrace height

/** Smooth value noise on a coarse grid (deterministic). */
function valueNoise(x: number, z: number, cell: number, seed: number) {
  const gx = x / cell, gz = z / cell;
  const ix = Math.floor(gx), iz = Math.floor(gz);
  const fx = gx - ix, fz = gz - iz;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const v = (a: number, b: number) => rand(a * 57.1 + b * 131.7 + seed);
  const top = v(ix, iz) * (1 - sx) + v(ix + 1, iz) * sx;
  const bot = v(ix, iz + 1) * (1 - sx) + v(ix + 1, iz + 1) * sx;
  return top * (1 - sz) + bot * sz;
}

export interface IslandLayout {
  size: number;
  half: number;
  height: number[];
  band: number[];
  /** landmark index 0..2 for the finder cores, -1 otherwise */
  core: number[];
  maxH: number;
  /** crater columns (volcano) */
  crater: boolean[];
}

export function islandLayout(modules: DarkModule[], size: number, mode: IslandMode): IslandLayout {
  const half = size / 2;
  const maxH = size * 0.6;
  const height: number[] = [];
  const band: number[] = [];
  const core: number[] = [];
  const crater: boolean[] = [];

  modules.forEach((m) => {
    const x = m.c - half + 0.5;
    const z = m.r - half + 0.5;
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      const isCore = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
      // cliff ring around a lagoon, with a raised core for the landmark
      const h = isCore ? [2.5, 2.0, 1.5][fi] : 1.0;
      height.push(h);
      band.push(isCore ? 1 : 0);
      core.push(isCore ? fi : -1);
      crater.push(false);
      return;
    }
    const d = Math.hypot(x, z) / (half * 1.05);
    const profile = Math.max(0, 1 - d);
    const n = valueNoise(x + half, z + half, 5, 11) * 0.7 + valueNoise(x + half, z + half, 2.5, 23) * 0.3;
    // one dominant mountain with ridges: steep in the middle, gentle shores
    // low rolling hills everywhere + one sharp central mountain
    const hills = 0.4 + 2.2 * n * Math.pow(profile, 0.7);
    const cone = Math.max(0, 1 - Math.hypot(x, z) / (half * 0.78));
    const mountain = maxH * Math.pow(cone, 1.15) * (0.72 + 0.28 * n);
    let h = Math.max(hills, mountain);
    let isCrater = false;
    if (mode === 'volcano') {
      // cone with a crater: steeper profile, bowl in the middle
      h = 0.4 + maxH * 1.1 * Math.pow(profile, 1.6) * (0.75 + 0.25 * n);
      const rc = Math.hypot(x, z);
      if (rc < size * 0.09) {
        h = maxH * 0.72;
        isCrater = true;
      }
    }
    h = Math.max(STEP, Math.round(h / STEP) * STEP);
    height.push(h);
    const t = h / maxH;
    band.push(t < 0.07 ? 0 : t < 0.2 ? 1 : t < 0.38 ? 2 : t < 0.62 ? 3 : 4);
    core.push(-1);
    crater.push(isCrater);
  });
  return { size, half, height, band, core, maxH: Math.max(...height), crater };
}

export function islandVoxelTargets(modules: DarkModule[], size: number, mode: IslandMode = 'summer') {
  const L = islandLayout(modules, size, mode);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

/** Rock material: darker strata on cliff faces in the side view. */
function createRockMaterial() {
  const uniforms = { uSide: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'varying vec3 vRockPos;\nvarying vec3 vRockN;\n' +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 rockWp = vec4(transformed, 1.0);
        vec3 rockN = objectNormal;
        #ifdef USE_INSTANCING
          rockWp = instanceMatrix * rockWp;
          rockN = mat3(instanceMatrix) * rockN;
        #endif
        vRockPos = (modelMatrix * rockWp).xyz;
        vRockN = normalize(mat3(modelMatrix) * rockN);`
      );
    shader.fragmentShader =
      'varying vec3 vRockPos;\nvarying vec3 vRockN;\nuniform float uSide;\n' +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float rockSide = 1.0 - step(0.5, abs(vRockN.y));
        float strata = 0.86 + 0.14 * step(0.5, fract(vRockPos.y * 2.0));
        float grain = 0.95 + 0.05 * fract(sin(dot(floor(vRockPos * 4.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);
        diffuseColor.rgb *= mix(1.0, strata * grain * 0.9, rockSide * uSide);`
      );
  };
  material.customProgramCacheKey = () => 'qr-island-rock';
  return { material, uniforms };
}

type WaterTile = { x: number; z: number; r: number; c: number; shallow: boolean };

interface Boat {
  horizontal: boolean;
  line: number;
  from: number;
  to: number;
  speed: number;
  phase: number;
}

export class IslandDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  public readonly targets: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  private rockUniforms: { uSide: { value: number } };
  private layout: IslandLayout;
  private pal: IslandPalette;
  private disposables: { dispose(): void }[] = [];
  private grow: GrowSet;
  private water: WaterTile[] = [];
  private waterMesh!: THREE.InstancedMesh;
  private waterQr: THREE.Color[] = [];
  private waterSide: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private boats: Boat[] = [];
  private boatHull!: THREE.InstancedMesh;
  private boatSail!: THREE.InstancedMesh;
  private particles!: THREE.InstancedMesh;
  private particleKind: 'snow' | 'smoke' | 'none' = 'none';
  private lavaMat: THREE.MeshStandardMaterial | null = null;
  private lampMat!: THREE.MeshStandardMaterial;
  private lastGrowth = -1;
  private terrainTop = 0;
  private growth = 0;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    private mode: IslandMode
  ) {
    this.layout = islandLayout(modules, size, mode);
    this.pal = ISLAND_MODES[mode];
    const rm = createRockMaterial();
    this.voxelMaterial = rm.material;
    this.rockUniforms = rm.uniforms;
    this.targets = modules.map((m, i) => {
      const h = this.layout.height[i];
      return { x: m.c - this.layout.half + 0.5, y: h / 2, z: m.r - this.layout.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
    });
    this.grow = new GrowSet(this.group, (o) => this.track(o));
    this.build();
  }

  get maxHeight() {
    return this.layout.maxH + 3;
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private isWater(r: number, c: number) {
    if (r < 0 || c < 0 || r >= this.size || c >= this.size) return true;
    return !this.matrix[r][c];
  }

  private moduleIndex = new Map<number, number>();
  /** Top-view hue of a voxel taken from what stands on it in the side view (tree, hut, lava, …). */
  private qrHue = new Map<number, string>();

  voxelColor(i: number) {
    const L = this.layout;
    let side = this.pal.bands[L.band[i]];
    if (L.crater[i]) side = '#3a2a22';
    const hue = L.crater[i] ? '#ff5a1f' : this.qrHue.get(i) ?? this.pal.qrBands[L.band[i]];
    return { qr: atLuminance(hue, ROCK_LUM + (rand(i * 5 + 17) - 0.5) * 14), side };
  }

  growDelay(i: number) {
    // the island rises from the sea: shore rocks first, peaks last
    return 0.04 + (this.layout.height[i] / this.layout.maxH) * 0.34 + rand(i * 7 + 3) * 0.06;
  }

  private build() {
    const N = this.size;
    const half = N / 2;
    this.modules.forEach((m, i) => this.moduleIndex.set(m.r * N + m.c, i));

    // --- slab: the sea "box" (cross-section turns deep blue in the side view) ---
    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL_LIGHT.slab, roughness: 0.6 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    this.group.add(slab);
    this.slab = slab;

    // --- sea surface on light modules ---
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (this.matrix[r][c]) continue;
        const shallow = !this.isWater(r - 1, c) || !this.isWater(r + 1, c) || !this.isWater(r, c - 1) || !this.isWater(r, c + 1);
        this.water.push({ x: c - half + 0.5, z: r - half + 0.5, r, c, shallow });
      }
    }
    this.waterMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 0.06, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.05 })),
      Math.max(1, this.water.length)
    );
    this.waterMesh.count = this.water.length;
    this.waterMesh.receiveShadow = true;
    const greys = ['#ffffff', '#f6f5f2', '#eeece8', '#e9e7e2', '#f9f8f6'];
    this.water.forEach((w, i) => {
      this.waterQr.push(new THREE.Color(greys[Math.floor(rand(i * 3 + 5) * greys.length)]));
      const base = new THREE.Color(w.shallow ? this.pal.waterShallow : this.pal.waterDeep);
      this.waterSide.push(base.multiplyScalar(0.95 + rand(i * 11 + 1) * 0.08));
      this.waterMesh.setColorAt(i, this.waterQr[i]);
    });
    this.group.add(this.waterMesh);

    this.computeHeightField();
    this.buildTerrain();
    this.buildTrees();
    this.buildLandmarks();
    this.buildFoam();
    if (this.mode === 'volcano') this.buildLava();
    this.buildRiver();
    this.buildBoats();
    this.buildParticles();
    this.update(0, 0);
  }

  private top(i: number) {
    const m = this.modules[i];
    const x = m.c - this.layout.half + 0.5;
    const z = m.r - this.layout.half + 0.5;
    return new THREE.Vector3(x, this.surfaceAt(x, z), z);
  }

  /** Side view: the stepped QR column sinks away under the smooth terrain growing over it. */
  readonly voxelSideWindow: [number, number] = [0.3, 0.72];
  voxelSideScale(): [number, number, number] {
    return [0, 0, 0];
  }

  // ------------------------------------------------------------------------------------------------
  // Smooth low-poly terrain (side view). Built from the column heights, blurred, so hills and the
  // mountain flow down into the sea instead of standing as stepped boxes. Land cells stay above the
  // water line and sea cells below it, so the coastline still follows the QR.
  // ------------------------------------------------------------------------------------------------

  private H!: Float32Array;
  private terrain!: THREE.Mesh;
  private craterCentre: THREE.Vector3 | null = null;
  private slab!: THREE.Mesh;
  private seaLevel = 0;
  private sea!: THREE.Mesh;
  private seaMat!: THREE.MeshStandardMaterial;

  private computeHeightField() {
    const N = this.size;
    const L = this.layout;
    let H = new Float32Array(N * N).fill(-0.4);
    this.modules.forEach((m, i) => (H[m.r * N + m.c] = L.height[i]));
    const land = new Uint8Array(N * N);
    this.modules.forEach((m) => (land[m.r * N + m.c] = 1));
    for (let pass = 0; pass < 2; pass++) {
      const out = new Float32Array(N * N);
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          let sum = 0, w = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const rr = Math.min(N - 1, Math.max(0, r + dr)), cc = Math.min(N - 1, Math.max(0, c + dc));
              const wt = dr === 0 && dc === 0 ? 4 : dr === 0 || dc === 0 ? 2 : 1;
              sum += H[rr * N + cc] * wt;
              w += wt;
            }
          }
          out[r * N + c] = sum / w;
        }
      }
      H = out;
    }
    // keep the coastline where the QR says: land above, sea below
    for (let k = 0; k < N * N; k++) {
      H[k] = land[k] ? Math.max(0.22, H[k] * 1.12) : Math.min(-0.06, H[k]);
    }
    this.H = H;
    if (this.mode === 'volcano') this.computeCrater();
    this.terrainTop = H.reduce((m, v) => Math.max(m, v), 0);
    if (this.crater) this.terrainTop = this.crater.rim;
  }

  /** Bilinear terrain height at world (x, z). */
  /** Crater of the volcano: centre, bowl radius, rim crest height and lava level. */
  private crater: { x: number; z: number; r: number; rim: number; lake: number } | null = null;

  private computeCrater() {
    const L = this.layout;
    let cx = 0, cz = 0, n = 0;
    this.modules.forEach((m, i) => {
      if (!L.crater[i]) return;
      cx += m.c - L.half + 0.5;
      cz += m.r - L.half + 0.5;
      n++;
    });
    if (!n) return;
    cx /= n;
    cz /= n;
    const r = Math.max(1.0, Math.sqrt(n / Math.PI) * 0.95);
    // the rim stands a bit above the highest flank, the lava sits well below the rim
    let top = 0;
    for (const v of this.H) top = Math.max(top, v);
    const rim = top + 0.45;
    this.crater = { x: cx, z: cz, r, rim, lake: rim - 0.95 };
  }

  /**
   * Terrain surface height: the smoothed field, with the volcano crater carved in —
   * flat bowl under the lava, steep inner wall, raised rim, outer slope blending into the cone.
   */
  private surfaceAt(x: number, z: number) {
    const h = this.hAt(x, z);
    const c = this.crater;
    if (!c) return h;
    const d = Math.hypot(x - c.x, z - c.z);
    const wall = 0.8;
    const outer = 2.2;
    if (d < c.r) return c.lake - 0.25;
    if (d < c.r + wall) return THREE.MathUtils.lerp(c.lake - 0.25, c.rim, THREE.MathUtils.smoothstep(d, c.r, c.r + wall));
    if (d < c.r + wall + outer) {
      const t = THREE.MathUtils.smoothstep(d, c.r + wall, c.r + wall + outer);
      return Math.max(h, THREE.MathUtils.lerp(c.rim, h, t));
    }
    return h;
  }

  private hAt(x: number, z: number) {
    const N = this.size;
    const fx = Math.min(N - 1, Math.max(0, x + N / 2 - 0.5));
    const fz = Math.min(N - 1, Math.max(0, z + N / 2 - 0.5));
    const x0 = Math.floor(fx), z0 = Math.floor(fz);
    const x1 = Math.min(N - 1, x0 + 1), z1 = Math.min(N - 1, z0 + 1);
    const tx = fx - x0, tz = fz - z0;
    const H = this.H;
    const a = H[z0 * N + x0] * (1 - tx) + H[z0 * N + x1] * tx;
    const b = H[z1 * N + x0] * (1 - tx) + H[z1 * N + x1] * tx;
    return a * (1 - tz) + b * tz;
  }

  private buildTerrain() {
    const N = this.size;
    const seg = N * 2;
    const geo = new THREE.PlaneGeometry(N, N, seg, seg);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pos.count; k++) {
      const x = pos.getX(k), z = pos.getZ(k);
      // a little noise breaks the blur into rocky facets
      const n = (rand(Math.round((x + 100) * 2) * 131 + Math.round((z + 100) * 2) * 17) - 0.5) * 0.18;
      const h = this.surfaceAt(x, z);
      const inCrater = this.crater && Math.hypot(x - this.crater.x, z - this.crater.z) < this.crater.r + 0.9;
      pos.setY(k, h + (h > 0.4 && !inCrater ? n : 0));
    }
    const flat = geo.toNonIndexed();
    geo.dispose();
    flat.computeVertexNormals();
    // colour per face: beach, grass, forest, rock (steep), snow — by height and slope
    const p = flat.attributes.position as THREE.BufferAttribute;
    const nrm = flat.attributes.normal as THREE.BufferAttribute;
    const colors = new Float32Array(p.count * 3);
    const col = new THREE.Color();
    const maxH = this.layout.maxH;
    const bands = this.pal.bands;
    for (let f = 0; f < p.count; f += 3) {
      const y = (p.getY(f) + p.getY(f + 1) + p.getY(f + 2)) / 3;
      const ny = nrm.getY(f);
      const t = y / maxH;
      let hex = bands[1];
      if (y < 0.27) hex = bands[0];
      else if (ny < 0.62 && t > 0.12) hex = bands[3];
      else if (t > 0.62) hex = bands[4];
      else if (t > 0.38) hex = bands[3];
      else if (t > 0.2) hex = bands[2];
      col.set(hex).multiplyScalar(0.92 + rand(f * 0.37 + 3) * 0.14);
      if (y < 0) col.multiplyScalar(0.8);
      for (let v = 0; v < 3; v++) colors.set([col.r, col.g, col.b], (f + v) * 3);
    }
    flat.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.terrain = new THREE.Mesh(
      this.track(flat),
      this.track(new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }))
    );
    this.terrain.castShadow = true;
    this.terrain.receiveShadow = true;
    this.terrain.visible = false;
    this.group.add(this.terrain);

    // the sea: one translucent sheet, so sandy shallows show through around the coast
    this.seaMat = this.track(
      new THREE.MeshStandardMaterial({ color: this.pal.waterDeep, roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0 })
    );
    this.sea = new THREE.Mesh(this.track(new THREE.BoxGeometry(N + 2.38, 0.05, N + 2.38)), this.seaMat);
    this.sea.position.y = 0.05;
    this.sea.receiveShadow = true;
    this.sea.visible = false;
    this.group.add(this.sea);
  }

  /** Crater: a round glowing lava lake with dark crust plates and bright bubbles — no tiles. */
  private buildLava() {
    this.lavaMat = new THREE.MeshStandardMaterial({ color: '#ff6a1f', emissive: '#ff4a10', emissiveIntensity: 0, flatShading: true });
    const c = this.crater;
    if (!c) return;
    // lake fills the bowl up to the foot of the inner wall
    const radius = c.r + 0.25;
    const centre = new THREE.Vector3(c.x, c.lake, c.z);
    this.craterCentre = centre.clone();
    const lake: GrowItem[] = [
      {
        matrix: new THREE.Matrix4().compose(centre, new THREE.Quaternion(), new THREE.Vector3(radius, 0.14, radius)),
        color: '#ff6a1f',
        delay: 0.6,
        pivot: centre.clone(),
      },
    ];
    const blobs: GrowItem[] = [];
    const crust: GrowItem[] = [];
    for (let k = 0; k < 14; k++) {
      const a = rand(k * 7 + 1) * Math.PI * 2;
      const d = Math.sqrt(rand(k * 7 + 2)) * radius * 0.8;
      const p = centre.clone().add(new THREE.Vector3(Math.cos(a) * d, 0.08, Math.sin(a) * d));
      const s = 0.16 + rand(k * 7 + 3) * 0.22;
      const target = k % 2 ? blobs : crust;
      target.push({
        matrix: new THREE.Matrix4().compose(
          p,
          new THREE.Quaternion().setFromEuler(new THREE.Euler(rand(k) * 3, rand(k + 1) * 3, 0)),
          k % 2 ? new THREE.Vector3(s, s * 0.7, s) : new THREE.Vector3(s * 1.8, s * 0.35, s * 1.4)
        ),
        color: k % 2 ? '#ffb340' : '#3a2620',
        delay: 0.68,
        pivot: centre.clone(),
      });
    }
    this.grow.add(new THREE.CylinderGeometry(1, 0.94, 1, 22), this.lavaMat, lake, false);
    this.grow.add(new THREE.IcosahedronGeometry(0.5, 0), this.lavaMat, blobs, false);
    this.grow.add(new THREE.IcosahedronGeometry(0.5, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true }), crust, false);
  }

  /** Steepest-descent path over the height field from a cell down to the sea. */
  private traceFlow(start: number) {
    const N = this.size;
    const H = this.H;
    const pts: { p: THREE.Vector3; k: number }[] = [];
    const seen = new Set<number>();
    let k = start;
    for (let step = 0; step < N * 2; step++) {
      const r = Math.floor(k / N), c = k % N;
      const x = c - N / 2 + 0.5, z = r - N / 2 + 0.5;
      pts.push({ p: new THREE.Vector3(x, this.surfaceAt(x, z) + 0.06, z), k });
      seen.add(k);
      if (H[k] < 0) break;
      let next = -1, nh = Infinity;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const rr = r + dr, cc = c + dc;
        if ((!dr && !dc) || rr < 0 || cc < 0 || rr >= N || cc >= N) continue;
        const nk = rr * N + cc;
        if (!seen.has(nk) && H[nk] < nh) {
          nh = H[nk];
          next = nk;
        }
      }
      if (next < 0) break;
      k = next;
    }
    return pts;
  }

  /**
   * Rivers: a water river from the high ground in summer/winter (frozen), three lava flows from the
   * crater rim in volcano mode. Drawn as a ribbon with round joints, so it bends smoothly.
   */
  private buildRiver() {
    const N = this.size;
    const H = this.H;
    const L = this.layout;
    const starts: number[] = [];
    if (this.mode === 'volcano' && this.craterCentre) {
      // crater rim cells in three directions
      for (let f = 0; f < 3; f++) {
        const a = f * ((Math.PI * 2) / 3) + 0.5;
        const c0 = this.craterCentre;
        const rr = (this.crater?.r ?? 1) + 1.0;
        const x = c0.x + Math.cos(a) * rr;
        const z = c0.z + Math.sin(a) * rr;
        const c = Math.round(x + N / 2 - 0.5), r = Math.round(z + N / 2 - 0.5);
        if (r >= 0 && c >= 0 && r < N && c < N) starts.push(r * N + c);
      }
    } else {
      let start = -1, best = -Infinity;
      this.modules.forEach((m, i) => {
        if (L.core[i] >= 0 || L.crater[i]) return;
        const k = m.r * N + m.c;
        const score = H[k] - Math.hypot(m.c - N / 2, m.r - N / 2) * 0.15 + rand(i) * 0.3;
        if (score > best) {
          best = score;
          start = k;
        }
      });
      if (start >= 0) starts.push(start);
    }
    const lava = this.mode === 'volcano';
    const color = lava ? '#ff6a1f' : this.mode === 'winter' ? '#dff1fb' : '#5fc8e6';
    const segs: GrowItem[] = [];
    const joints: GrowItem[] = [];
    const xAxis = new THREE.Vector3(1, 0, 0);
    const cellIndex = new Map<number, number>();
    this.modules.forEach((m, i) => cellIndex.set(m.r * N + m.c, i));
    starts.forEach((start, fi) => {
      const pts = this.traceFlow(start);
      pts.forEach(({ k }) => {
        const i = cellIndex.get(k);
        if (i !== undefined && L.core[i] < 0) this.qrHue.set(i, lava ? '#ff7a24' : '#2f8fc7');
      });
      for (let s = 0; s < pts.length; s++) {
        const a = pts[s].p;
        const w = (lava ? 0.3 : 0.34) + s * 0.018;
        const delay = Math.min(0.9, (lava ? 0.62 : 0.55) + (s / pts.length) * 0.28 + fi * 0.02);
        joints.push({ matrix: new THREE.Matrix4().compose(a, new THREE.Quaternion(), new THREE.Vector3(w / 2, 0.05, w / 2)), color, delay, pivot: a.clone() });
        if (s === pts.length - 1) break;
        const b = pts[s + 1].p;
        const dir = b.clone().sub(a);
        const q = new THREE.Quaternion().setFromUnitVectors(xAxis, dir.clone().normalize());
        segs.push({
          matrix: new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, new THREE.Vector3(dir.length(), 0.05, w)),
          color,
          delay,
          pivot: a.clone(),
        });
      }
    });
    const mat = lava
      ? this.lavaMat!
      : new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.9 });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), mat, segs, false);
    this.grow.add(new THREE.CylinderGeometry(1, 1, 1, 14), lava ? this.lavaMat! : mat.clone(), joints, false);
  }


  private buildTrees() {
    const L = this.layout;
    const trunks: GrowItem[] = [];
    const crowns: GrowItem[] = [];
    const palmLeaves: GrowItem[] = [];
    const winter = this.mode === 'winter';
    const tropical = this.mode === 'volcano';
    this.modules.forEach((_, i) => {
      if (L.core[i] >= 0 || L.crater[i]) return;
      const b = L.band[i];
      const isPalmSpot = (b === 0 || b === 1) && !winter && rand(i * 3 + 9) < 0.18;
      const isPineSpot = (b === 1 || b === 2) && rand(i * 13 + 2) < (b === 2 ? 0.32 : 0.14);
      if (!isPalmSpot && !isPineSpot) return;
      this.qrHue.set(i, this.pal.foliage[Math.floor(rand(i + 30) * this.pal.foliage.length)]);
      const top = this.top(i);
      top.x += (rand(i + 31) - 0.5) * 0.3;
      top.z += (rand(i + 32) - 0.5) * 0.3;
      const delay = Math.min(0.85, this.growDelay(i) + 0.3 + rand(i + 33) * 0.12);
      if (isPalmSpot || tropical) {
        const h = 0.9 + rand(i + 34) * 0.5;
        const lean = new THREE.Quaternion().setFromEuler(new THREE.Euler((rand(i + 35) - 0.5) * 0.4, 0, (rand(i + 36) - 0.5) * 0.4));
        const mid = new THREE.Vector3(0, h / 2, 0).applyQuaternion(lean).add(top);
        trunks.push({ matrix: new THREE.Matrix4().compose(mid, lean, new THREE.Vector3(0.09, h, 0.09)), color: this.pal.trunk, delay, pivot: top.clone() });
        const crownAt = new THREE.Vector3(0, h, 0).applyQuaternion(lean).add(top);
        for (let k = 0; k < 5; k++) {
          const yaw = (k / 5) * Math.PI * 2 + rand(i + k) * 0.5;
          const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, yaw, -0.45));
          const off = new THREE.Vector3(0.28, -0.05, 0).applyQuaternion(q);
          palmLeaves.push({
            matrix: new THREE.Matrix4().compose(crownAt.clone().add(off), q, new THREE.Vector3(0.6, 0.05, 0.16)),
            color: this.pal.foliage[k % this.pal.foliage.length],
            delay: Math.min(0.9, delay + 0.05),
            pivot: crownAt.clone(),
          });
        }
        return;
      }
      // pine: trunk + two stacked cones
      const s = 0.8 + rand(i + 37) * 0.5;
      trunks.push({
        matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + 0.15 * s), new THREE.Quaternion(), new THREE.Vector3(0.1, 0.3 * s, 0.1)),
        color: this.pal.trunk,
        delay,
        pivot: top.clone(),
      });
      for (let k = 0; k < 2; k++) {
        const ch = (0.55 - k * 0.12) * s;
        const cr = (0.42 - k * 0.12) * s;
        const green = this.pal.foliage[Math.floor(rand(i * 5 + k) * this.pal.foliage.length)];
        crowns.push({
          matrix: new THREE.Matrix4().compose(top.clone().setY(top.y + (0.3 + k * 0.32 + ch / 2) * s), new THREE.Quaternion(), new THREE.Vector3(cr, ch, cr)),
          color: winter && k === 1 ? '#f4f8fb' : green,
          delay: Math.min(0.9, delay + 0.04 * k),
          pivot: top.clone(),
        });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), trunks);
    this.grow.add(new THREE.CylinderGeometry(0, 1, 1, 7), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), crowns);
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), palmLeaves, false);
  }

  /** Lighthouse, palm hill, hut with a pier — one on each finder core. */
  private buildLandmarks() {
    const L = this.layout;
    const coreCentre: (THREE.Vector3 | null)[] = [null, null, null];
    const counts = [0, 0, 0];
    this.modules.forEach((m, i) => {
      const fi = L.core[i];
      if (fi < 0) return;
      // only the cells that actually carry a landmark get its colour in the QR
      const [fr, fc] = finderLocal(m.r, m.c, this.size)!;
      const centre = fr === 3 && fc === 3;
      if (fi === 0 && centre) this.qrHue.set(i, '#d94a3a'); // lighthouse
      if (fi === 2 && centre) this.qrHue.set(i, '#8a4a32'); // hut
      if (fi === 1 && PALM_CELLS.some(([pr, pc]) => pr === fr && pc === fc)) this.qrHue.set(i, '#8a4a32'); // palm trunks
      const t = this.top(i);
      coreCentre[fi] = (coreCentre[fi] ?? new THREE.Vector3()).add(t);
      counts[fi]++;
    });
    const boxes: GrowItem[] = [];
    const cyl: GrowItem[] = [];
    const cones: GrowItem[] = [];
    const lamp: GrowItem[] = [];
    coreCentre.forEach((sum, fi) => {
      if (!sum || !counts[fi]) return;
      const c = sum.divideScalar(counts[fi]);
      const d = 0.55 + fi * 0.05;
      if (fi === 0) {
        // lighthouse: striped tower + lamp + cap
        for (let k = 0; k < 6; k++) {
          cyl.push({
            matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 0.25 + k * 0.5), new THREE.Quaternion(), new THREE.Vector3(0.42 - k * 0.025, 0.5, 0.42 - k * 0.025)),
            color: k % 2 ? '#d94a3a' : '#f4f2ee',
            delay: d + k * 0.03,
            pivot: c.clone(),
          });
        }
        lamp.push({ matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 3.25), new THREE.Quaternion(), new THREE.Vector3(0.3, 0.4, 0.3)), color: '#fff2b0', delay: d + 0.2, pivot: c.clone() });
        cones.push({ matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 3.7), new THREE.Quaternion(), new THREE.Vector3(0.42, 0.5, 0.42)), color: '#d94a3a', delay: d + 0.22, pivot: c.clone() });
      } else if (fi === 1) {
        // palm hill: three palms
        for (let k = 0; k < 3; k++) {
          // each palm stands exactly on one core cell
          const [pr, pc] = PALM_CELLS[k];
          const p = c.clone().add(new THREE.Vector3(pc - 3, 0, pr - 3));
          const h = 1.2 + k * 0.25;
          boxes.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(p.y + h / 2), new THREE.Quaternion(), new THREE.Vector3(0.1, h, 0.1)), color: this.pal.trunk, delay: d, pivot: p.clone() });
          for (let j = 0; j < 5; j++) {
            const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (j / 5) * Math.PI * 2 + k, -0.5));
            const top = p.clone().setY(p.y + h);
            boxes.push({
              matrix: new THREE.Matrix4().compose(top.clone().add(new THREE.Vector3(0.3, -0.06, 0).applyQuaternion(q)), q, new THREE.Vector3(0.65, 0.05, 0.17)),
              color: this.mode === 'winter' ? '#e8eef2' : this.pal.foliage[j % this.pal.foliage.length],
              delay: d + 0.08,
              pivot: top.clone(),
            });
          }
        }
      } else {
        // hut with a pitched roof
        boxes.push({ matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 0.31), new THREE.Quaternion(), new THREE.Vector3(0.84, 0.62, 0.8)), color: '#c99a6a', delay: d, pivot: c.clone() });
        cones.push({
          matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 0.84), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)), new THREE.Vector3(0.66, 0.44, 0.66)),
          color: this.mode === 'winter' ? '#f4f8fb' : '#8a4a32',
          delay: d + 0.06,
          pivot: c.clone(),
        });
        boxes.push({ matrix: new THREE.Matrix4().compose(c.clone().setY(c.y + 0.2).add(new THREE.Vector3(0, 0, 0.41)), new THREE.Quaternion(), new THREE.Vector3(0.2, 0.38, 0.02)), color: '#5a3d28', delay: d + 0.05, pivot: c.clone() });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), boxes);
    this.grow.add(new THREE.CylinderGeometry(1, 1, 1, 14), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), cyl);
    this.grow.add(new THREE.CylinderGeometry(0, 1, 1, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), cones);
    this.lampMat = new THREE.MeshStandardMaterial({ color: '#fff2b0', emissive: '#ffd35a', emissiveIntensity: 0 });
    this.grow.add(new THREE.CylinderGeometry(1, 1, 1, 10), this.lampMat, lamp, false);
  }

  /** Surf: little white bits where the sea touches land. */
  private buildFoam() {
    const foam: GrowItem[] = [];
    if (this.mode === 'winter') return;
    this.water.forEach((w, i) => {
      if (!w.shallow || rand(i * 17 + 5) > 0.35) return;
      const p = new THREE.Vector3(w.x + (rand(i + 1) - 0.5) * 0.6, 0.07, w.z + (rand(i + 2) - 0.5) * 0.6);
      foam.push({
        matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i) * 3, 0)), new THREE.Vector3(0.3, 0.02, 0.12)),
        color: '#f4fbff',
        delay: 0.5 + rand(i + 3) * 0.2,
        pivot: p.clone(),
      });
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), foam, false);
  }

  private buildBoats() {
    if (this.mode === 'winter') {
      this.boatHull = this.boatSail = null as unknown as THREE.InstancedMesh;
      return;
    }
    const runs = straightRuns((r, c) => this.isWater(r, c), this.size, 5);
    runs.sort((a, b) => rand(a.line * 31 + a.from + (a.horizontal ? 7 : 0)) - rand(b.line * 31 + b.from + (b.horizontal ? 7 : 0)));
    runs.slice(0, 5).forEach((run, i) => this.boats.push({ ...run, speed: 0.35 + rand(i + 5) * 0.3, phase: rand(i * 7 + 1) * 2 }));
    const n = Math.max(1, this.boats.length);
    this.boatHull = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.7, 0.16, 0.3)), this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })), n);
    this.boatSail = new THREE.InstancedMesh(this.track(new THREE.CylinderGeometry(0, 0.28, 0.6, 3)), this.track(new THREE.MeshStandardMaterial({ color: '#fbfbf8', roughness: 0.5 })), n);
    [this.boatHull, this.boatSail].forEach((m) => {
      m.count = this.boats.length;
      m.castShadow = true;
      this.group.add(m);
    });
    const c = new THREE.Color();
    this.boats.forEach((_, i) => this.boatHull.setColorAt(i, c.set(['#8a5a3a', '#f4f2ee', '#d94a3a', '#3a6fc0', '#f2c14e'][i % 5])));
  }

  private buildParticles() {
    this.particleKind = this.mode === 'winter' ? 'snow' : this.mode === 'volcano' ? 'smoke' : 'none';
    const n = this.particleKind === 'snow' ? 120 : this.particleKind === 'smoke' ? 26 : 1;
    this.particles = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 1, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: this.particleKind === 'smoke' ? '#8a8580' : '#ffffff', roughness: 1, transparent: this.particleKind === 'smoke', opacity: 0.85 })),
      n
    );
    this.particles.count = this.particleKind === 'none' ? 0 : n;
    this.group.add(this.particles);
  }

  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    lerpStageLighting(e, this.pal.mood, ambient, sun, point);
    this.slabMat.color.set(NEUTRAL_LIGHT.slab).lerp(new THREE.Color(this.pal.slab), e);
    this.rockUniforms.uSide.value = e;
    const glow = THREE.MathUtils.smoothstep(e, 0.5, 1);
    if (this.lavaMat) this.lavaMat.emissiveIntensity = 2.4 * glow;
    this.lampMat.emissiveIntensity = 1.6 * glow;
  }

  update(growth: number, time: number) {
    this.growth = growth;
    if (growth !== this.lastGrowth) {
      this.lastGrowth = growth;
      this.grow.update(growth);
      const rise = THREE.MathUtils.smoothstep(growth, 0.06, 0.66);
      this.terrain.visible = rise > 0.002;
      this.terrain.scale.y = Math.max(0.001, rise);
      const sea = THREE.MathUtils.smoothstep(growth, 0.2, 0.7);
      this.sea.visible = sea > 0.002;
      this.seaMat.opacity = 0.82 * sea;
      // sea floor drops a little so the sandy shallows show through the translucent sea
      this.seaLevel = sea;
      this.slab.position.y = -0.45 - 0.5 * sea;
    }
    // sea: white mosaic (QR) → turquoise, with gentle waves in the side view
    const k = THREE.MathUtils.smoothstep(growth, 0.08, 0.6);
    const c = new THREE.Color();
    const m4 = new THREE.Matrix4();
    const waves = this.mode !== 'winter' ? growth : 0;
    for (let i = 0; i < this.water.length; i++) {
      const w = this.water[i];
      c.copy(this.waterQr[i]).lerp(this.waterSide[i], k);
      this.waterMesh.setColorAt(i, c);
      const y = 0.03 - 0.55 * this.seaLevel + Math.sin(time * 1.6 + w.x * 0.7 + w.z * 0.5) * 0.035 * waves;
      m4.makeTranslation(w.x, y, w.z);
      this.waterMesh.setMatrixAt(i, m4);
    }
    if (this.waterMesh.instanceColor) this.waterMesh.instanceColor.needsUpdate = true;
    this.waterMesh.instanceMatrix.needsUpdate = true;
    this.updateBoats(time);
    this.updateParticles(time);
  }

  private updateBoats(time: number) {
    if (!this.boatHull) return;
    const vis = THREE.MathUtils.clamp((this.growth - 0.8) / 0.2, 0, 1);
    this.boatHull.visible = this.boatSail.visible = vis > 0 && this.boats.length > 0;
    if (vis <= 0) return;
    const half = this.size / 2;
    const d = new THREE.Object3D();
    this.boats.forEach((b, i) => {
      const len = b.to - b.from + 1;
      const s = (time * b.speed / len + b.phase) % 2;
      const forward = s < 1;
      const t = forward ? s : 2 - s;
      const along = b.from - half + 0.4 + t * (len - 0.8);
      const across = b.line - half + 0.5;
      const pos = b.horizontal ? new THREE.Vector3(along, 0.15, across) : new THREE.Vector3(across, 0.15, along);
      pos.y += Math.sin(time * 2 + i) * 0.03;
      const yaw = b.horizontal ? (forward ? 0 : Math.PI) : forward ? -Math.PI / 2 : Math.PI / 2;
      // turn around smoothly at the ends
      const edge = Math.min(t, 1 - t) * len;
      const sc = vis * Math.min(1, 0.4 + edge);
      d.position.copy(pos);
      d.rotation.set(0, yaw, Math.sin(time * 1.7 + i) * 0.06);
      d.scale.setScalar(sc);
      d.updateMatrix();
      this.boatHull.setMatrixAt(i, d.matrix);
      d.position.y += 0.38 * sc;
      d.updateMatrix();
      this.boatSail.setMatrixAt(i, d.matrix);
    });
    this.boatHull.instanceMatrix.needsUpdate = true;
    this.boatSail.instanceMatrix.needsUpdate = true;
    if (this.boatHull.instanceColor) this.boatHull.instanceColor.needsUpdate = true;
  }

  private updateParticles(time: number) {
    const vis = THREE.MathUtils.clamp((this.growth - 0.85) / 0.15, 0, 1);
    this.particles.visible = vis > 0 && this.particleKind !== 'none';
    if (!this.particles.visible) return;
    const d = new THREE.Object3D();
    const half = this.size / 2;
    for (let i = 0; i < this.particles.count; i++) {
      if (this.particleKind === 'snow') {
        const fall = this.terrainTop + 4;
        const y = fall - ((time * (0.6 + rand(i) * 0.5) + rand(i + 50) * fall) % fall);
        d.position.set((rand(i + 1) - 0.5) * (half * 2 + 1) + Math.sin(time + i) * 0.3, y, (rand(i + 2) - 0.5) * (half * 2 + 1));
        d.rotation.set(time + i, time * 0.7, 0);
        d.scale.setScalar(0.09 * vis);
      } else {
        // smoke puffs rising from the crater, growing and drifting with the wind
        const life = (time * 0.18 + rand(i + 3)) % 1;
        const cc = this.craterCentre ?? new THREE.Vector3(0, this.terrainTop, 0);
        d.position.set(cc.x + (rand(i + 4) - 0.5) * 1.6 + life * 2.2, cc.y + 0.3 + life * 6, cc.z + (rand(i + 5) - 0.5) * 1.6 - life * 1.2);
        d.rotation.set(rand(i) * 3, time * 0.2 + i, 0);
        d.scale.setScalar((0.4 + life * 1.4) * vis * Math.min(1, (1 - life) * 3));
      }
      d.updateMatrix();
      this.particles.setMatrixAt(i, d.matrix);
    }
    this.particles.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
