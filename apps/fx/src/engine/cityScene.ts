import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import type { StageScene } from './stageScene';

/**
 * "QR City" — a voxel metropolis whose rooftops are the QR code when seen from directly above.
 *
 *  - every dark QR module is a building column; neighbouring dark modules inside the same 3×3 lot
 *    merge into one building of one height, so the side view reads as city blocks, not pixels;
 *  - the three finder squares are landmark districts: a perimeter block (outer ring), a courtyard
 *    garden (light ring) and a skyscraper with a spire (centre 3×3);
 *  - light modules are the city floor: streets with markings, squares and parks;
 *  - detail (rooftop units, antennas, trees, lamps, road markings, cars) only exists in the side view
 *    and folds away while the camera swings back to the top, where only the QR cubes remain.
 *
 * Time of day (day / sunset / night) changes lighting, facades and windows — but only in the side
 * view: the top view is always lit neutrally so the QR keeps its contrast.
 */

export type TimeOfDay = 'day' | 'sunset' | 'night';

interface CityMode {
  facades: string[];
  road: string;
  park: string[];
  slab: string;
  marking: string;
  glass: string;
  /** 0 = windows are reflective glass, 1 = windows glow (night). */
  night: number;
  windowLit: string;
  ambient: { color: string; intensity: number };
  sun: { color: string; intensity: number; position: [number, number, number] };
  car: string[];
}

export const CITY_MODES: Record<TimeOfDay, CityMode> = {
  day: {
    facades: ['#d9cfc1', '#c9bba7', '#b8735a', '#9fb0c0', '#e4e0d8', '#8a9aa8', '#c48a6a', '#a7b5a0'],
    road: '#a3a5aa',
    park: ['#7fb54a', '#6ea842', '#8cc05a'],
    slab: '#e6e2da',
    marking: '#ffffff',
    glass: '#a9c4d8',
    night: 0,
    windowLit: '#ffd27a',
    ambient: { color: '#ffffff', intensity: 1.2 },
    sun: { color: '#fff6e8', intensity: 2.6, position: [22, 48, 28] },
    car: ['#e94f4f', '#f2c14e', '#4f8fe9', '#f5f5f5', '#2b2b2b', '#5fbf8f'],
  },
  sunset: {
    facades: ['#e0b48f', '#c98a6a', '#b0766a', '#d9a27e', '#a8707a', '#e6c3a0', '#bf8f80', '#d0a090'],
    road: '#9a8a86',
    park: ['#8fa24a', '#7f9442', '#9aab55'],
    slab: '#ead6c4',
    marking: '#fff0dc',
    glass: '#ffc890',
    night: 0.25,
    windowLit: '#ffcf80',
    ambient: { color: '#ffd2b8', intensity: 0.95 },
    sun: { color: '#ffad6b', intensity: 2.7, position: [46, 16, -6] },
    car: ['#e94f4f', '#f2c14e', '#4f8fe9', '#f5f5f5', '#2b2b2b', '#5fbf8f'],
  },
  night: {
    facades: ['#3a4150', '#2f3542', '#454c5c', '#3d3a48', '#2c3340', '#4a4458', '#36404c', '#40485a'],
    road: '#363b46',
    park: ['#2f4a35', '#2a4230', '#35523a'],
    slab: '#2a2e38',
    marking: '#8a8f9a',
    glass: '#1f2633',
    night: 1,
    windowLit: '#ffd27a',
    ambient: { color: '#5b6aa8', intensity: 0.7 },
    sun: { color: '#a8b8ff', intensity: 0.9, position: [-20, 40, 10] },
    car: ['#c0392b', '#d4a43a', '#3a6fc0', '#d8d8d8', '#1e1e1e', '#3f9f70'],
  },
};

/** Top view lighting — identical for every mode so the QR always scans. */
const NEUTRAL = {
  ambient: { color: '#ffffff', intensity: 1.25 },
  sun: { color: '#ffffff', intensity: 2.5, position: [22, 48, 28] as [number, number, number] },
  slab: '#f3f1ec',
};

const ROOF_LUM = 100;
const FLOOR_H = 0.75;

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

export interface CityBuilding {
  id: number;
  h: number;
  facadeIndex: number;
  /** indices into the dark module list */
  cells: number[];
  isTower: boolean;
}

export interface CityLayout {
  size: number;
  half: number;
  /** per dark module */
  height: number[];
  building: number[];
  buildings: CityBuilding[];
  maxH: number;
}

function finderLocal(r: number, c: number, size: number): [number, number] | null {
  if (r < 7 && c < 7) return [r, c];
  if (r < 7 && c >= size - 7) return [r, c - (size - 7)];
  if (r >= size - 7 && c < 7) return [r - (size - 7), c];
  return null;
}

export function cityLayout(modules: DarkModule[], size: number): CityLayout {
  const half = size / 2;
  const index = new Map<number, number>();
  modules.forEach((m, i) => index.set(m.r * size + m.c, i));

  const building = new Array<number>(modules.length).fill(-1);
  const buildings: CityBuilding[] = [];
  const maxFloors = Math.round((size * 0.62) / FLOOR_H);

  // Landmark districts: ring block + tower per finder
  const finderOrigins: [number, number][] = [
    [0, 0],
    [0, size - 7],
    [size - 7, 0],
  ];
  finderOrigins.forEach(([r0, c0], fi) => {
    const ring: number[] = [];
    const core: number[] = [];
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const i = index.get((r0 + r) * size + (c0 + c));
        if (i === undefined) continue;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) core.push(i);
        else ring.push(i);
      }
    }
    const ringB: CityBuilding = { id: buildings.length, h: 3 * FLOOR_H, facadeIndex: (fi * 3 + 1) % 8, cells: ring, isTower: false };
    buildings.push(ringB);
    ring.forEach((i) => (building[i] = ringB.id));
    const towerFloors = Math.round((size * 0.5) / FLOOR_H) + fi * 2;
    const tower: CityBuilding = { id: buildings.length, h: towerFloors * FLOOR_H, facadeIndex: (fi * 3 + 3) % 8, cells: core, isTower: true };
    buildings.push(tower);
    core.forEach((i) => (building[i] = tower.id));
  });

  // Regular buildings: connected dark modules inside the same 3×3 lot
  const lotOf = (r: number, c: number) => Math.floor(r / 3) * 1000 + Math.floor(c / 3);
  modules.forEach((m, start) => {
    if (building[start] !== -1) return;
    const lot = lotOf(m.r, m.c);
    const cells: number[] = [];
    const stack = [start];
    building[start] = -2;
    while (stack.length) {
      const i = stack.pop()!;
      cells.push(i);
      const { r, c } = modules[i];
      for (const [dr, dc] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const rr = r + dr, cc = c + dc;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        if (lotOf(rr, cc) !== lot) continue;
        const j = index.get(rr * size + cc);
        if (j === undefined || building[j] !== -1) continue;
        building[j] = -2;
        stack.push(j);
      }
    }
    // downtown profile: tall in the middle, low towards the edges
    let cx = 0, cz = 0;
    cells.forEach((i) => {
      cx += modules[i].c - half + 0.5;
      cz += modules[i].r - half + 0.5;
    });
    cx /= cells.length;
    cz /= cells.length;
    const id = buildings.length;
    const d = Math.min(1, Math.hypot(cx, cz) / (half * 1.1));
    const profile = Math.pow(1 - d, 1.4);
    let floors = 2 + Math.round(profile * maxFloors * (0.45 + 0.55 * rand(id * 7 + 3)));
    if (rand(id * 13 + 5) < 0.07) floors += 5; // the odd tall one outside downtown
    const b: CityBuilding = { id, h: floors * FLOOR_H, facadeIndex: Math.floor(rand(id * 3 + 1) * 8), cells, isTower: false };
    buildings.push(b);
    cells.forEach((i) => (building[i] = id));
  });

  const height = modules.map((_, i) => buildings[building[i]].h);
  return { size, half, height, building, buildings, maxH: Math.max(...height) };
}

/** Targets for the QR-module voxels: each one is a building column. */
export function cityVoxelTargets(modules: DarkModule[], size: number) {
  const L = cityLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return {
      x: m.c - L.half + 0.5,
      y: h / 2,
      z: m.r - L.half + 0.5,
      scaleX: 1.13,
      scaleY: h / 0.88,
      scaleZ: 1.13,
    };
  });
}

export function cityVoxelColors(L: CityLayout, i: number, mode: TimeOfDay) {
  const b = L.buildings[L.building[i]];
  const facade = CITY_MODES[mode].facades[b.facadeIndex % CITY_MODES[mode].facades.length];
  return {
    qr: atLuminance(facade, ROOF_LUM + (rand(i * 5 + 11) - 0.5) * 14),
    side: facade,
  };
}

/** Grow order: low buildings first, towers last. */
export function cityGrowDelay(L: CityLayout, i: number) {
  const b = L.buildings[L.building[i]];
  return 0.04 + (b.h / L.maxH) * 0.32 + rand(b.id * 17 + 2) * 0.06;
}

// ---------------------------------------------------------------------------
// Facade material: procedural windows on side faces, glowing at night
// ---------------------------------------------------------------------------

export interface CityMaterialUniforms {
  uSide: { value: number };
  uNight: { value: number };
  uTime: { value: number };
  uGlass: { value: THREE.Color };
  uLit: { value: THREE.Color };
}

export function createCityMaterial(
  mode: TimeOfDay,
  shared?: CityMaterialUniforms
): { material: THREE.MeshStandardMaterial; uniforms: CityMaterialUniforms } {
  const cfg = CITY_MODES[mode];
  const uniforms: CityMaterialUniforms = shared ?? {
    uSide: { value: 0 },
    uNight: { value: 0 },
    uTime: { value: 0 },
    uGlass: { value: new THREE.Color(cfg.glass) },
    uLit: { value: new THREE.Color(cfg.windowLit) },
  };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7, metalness: 0.05 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'varying vec3 vCityPos;\nvarying vec3 vCityN;\n' +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 cityWp = vec4(transformed, 1.0);
        vec3 cityN = objectNormal;
        #ifdef USE_INSTANCING
          cityWp = instanceMatrix * cityWp;
          cityN = mat3(instanceMatrix) * cityN;
        #endif
        cityWp = modelMatrix * cityWp;
        vCityPos = cityWp.xyz;
        vCityN = normalize(mat3(modelMatrix) * cityN);`
      );
    shader.fragmentShader =
      `varying vec3 vCityPos;
      varying vec3 vCityN;
      uniform float uSide;
      uniform float uNight;
      uniform float uTime;
      uniform vec3 uGlass;
      uniform vec3 uLit;
      float cityHash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
      ` +
      shader.fragmentShader
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float citySideFace = 1.0 - step(0.5, abs(vCityN.y));
          float cityTopFace = step(0.5, vCityN.y);
          bool cityAlongZ = abs(vCityN.x) > 0.5;
          float cityU = cityAlongZ ? vCityPos.z : vCityPos.x;
          float cityW = cityAlongZ ? vCityPos.x : vCityPos.z;
          vec2 cityCell = vec2(cityU * 2.0, vCityPos.y / ${FLOOR_H.toFixed(2)});
          vec2 cityF = fract(cityCell);
          float cityWin = step(0.2, cityF.x) * step(cityF.x, 0.8) * step(0.25, cityF.y) * step(cityF.y, 0.8);
          cityWin *= citySideFace * step(0.6, vCityPos.y) * uSide;
          float cityH = cityHash(vec3(floor(cityCell), floor(cityW * 2.0)));
          // lit windows change now and then
          float cityOn = step(0.42, fract(cityH + floor(uTime * 0.07 + cityH * 13.0) * 0.37));
          vec3 cityGlass = mix(uGlass, uGlass * 0.45, uNight);
          diffuseColor.rgb = mix(diffuseColor.rgb, cityGlass, cityWin * 0.85);
          // roofs a touch darker than facades in the side view
          diffuseColor.rgb *= mix(1.0, 0.86, cityTopFace * uSide);
          float cityGlow = cityWin * cityOn * uNight;`
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          totalEmissiveRadiance += uLit * cityGlow * (0.75 + 0.5 * cityH);`
        );
  };
  material.customProgramCacheKey = () => 'qr-city-facade';
  return { material, uniforms };
}

// ---------------------------------------------------------------------------
// Decor
// ---------------------------------------------------------------------------

interface GrowItem {
  matrix: THREE.Matrix4;
  color: string;
  delay: number;
  pivot: THREE.Vector3;
}

interface Grown {
  mesh: THREE.InstancedMesh;
  base: THREE.Matrix4[];
  delay: number[];
  pivot: THREE.Vector3[];
}

interface Car {
  horizontal: boolean;
  line: number;
  from: number;
  to: number;
  dir: 1 | -1;
  speed: number;
  phase: number;
}

type Tile = { x: number; z: number; r: number; c: number; kind: 'road' | 'park' };

export class CityDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  private uniforms: CityMaterialUniforms;
  private layout: CityLayout;
  private cfg: CityMode;
  private grown: Grown[] = [];
  private disposables: { dispose(): void }[] = [];
  private tiles: Tile[] = [];
  private tileMesh!: THREE.InstancedMesh;
  private tileQr: THREE.Color[] = [];
  private tileSide: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private lampMat!: THREE.MeshStandardMaterial;
  private headMat!: THREE.MeshBasicMaterial;
  private tailMat!: THREE.MeshBasicMaterial;
  private cars: Car[] = [];
  private carBody!: THREE.InstancedMesh;
  private carCabin!: THREE.InstancedMesh;
  private carHead!: THREE.InstancedMesh;
  private carTail!: THREE.InstancedMesh;
  private lastGrowth = -1;
  private growth = 0;
  private modeName: TimeOfDay;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    mode: TimeOfDay
  ) {
    this.modeName = mode;
    this.layout = cityLayout(modules, size);
    this.cfg = CITY_MODES[mode];
    const m = createCityMaterial(mode);
    this.voxelMaterial = m.material;
    this.uniforms = m.uniforms;
    this.build();
  }

  public get maxHeight() {
    return this.layout.maxH + 2.5; // spires
  }

  voxelColor(i: number) {
    return cityVoxelColors(this.layout, i, this.modeName);
  }

  growDelay(i: number) {
    return cityGrowDelay(this.layout, i);
  }

  /** Side view: the plain QR column disappears inside the detailed building that grows around it. */
  readonly voxelSideWindow: [number, number] = [0.45, 0.8];
  voxelSideScale(): [number, number, number] {
    return [0, 0, 0];
  }

  public get cityLayout() {
    return this.layout;
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private isLight(r: number, c: number) {
    if (r < 0 || c < 0 || r >= this.size || c >= this.size) return true;
    return !this.matrix[r][c];
  }

  private build() {
    const N = this.size;
    const half = N / 2;
    const cfg = this.cfg;

    // --- slab ---
    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL.slab, roughness: 0.85 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    slab.castShadow = true;
    this.group.add(slab);

    // --- city floor on light modules: streets, squares, parks ---
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (this.matrix[r][c]) continue;
        const local = finderLocal(r, c, N);
        let kind: Tile['kind'] = 'road';
        if (local) {
          const [fr, fc] = local;
          // courtyard garden inside the landmark ring
          if (fr >= 1 && fr <= 5 && fc >= 1 && fc <= 5) kind = 'park';
        } else {
          let open = true;
          for (let dr = -1; dr <= 1 && open; dr++)
            for (let dc = -1; dc <= 1; dc++) if (!this.isLight(r + dr, c + dc)) { open = false; break; }
          if (open && rand(Math.floor(r / 4) * 97 + Math.floor(c / 4) * 31 + 7) < 0.45) kind = 'park';
        }
        this.tiles.push({ x: c - half + 0.5, z: r - half + 0.5, r, c, kind });
      }
    }
    this.tileMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(1, 0.06, 1)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 })),
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
      const side =
        t.kind === 'park'
          ? cfg.park[Math.floor(rand(i * 7 + 2) * cfg.park.length)]
          : cfg.road;
      // a little per-tile variation so asphalt and lawns don't look flat
      const col = new THREE.Color(side).multiplyScalar(0.94 + rand(i * 11 + 9) * 0.1);
      this.tileSide.push(col);
      this.tileMesh.setColorAt(i, this.tileQr[i]);
    });
    this.group.add(this.tileMesh);

    this.buildDetailedBuildings();
    this.buildMarkings();
    this.buildTrees();
    this.buildLamps();
    this.buildRooftops();
    this.buildCars();
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
    this.grown.push({ mesh, base: items.map((i) => i.matrix), delay: items.map((i) => i.delay), pivot: items.map((i) => i.pivot) });
  }

  /**
   * Detailed buildings (side view only). Each building cell is rebuilt from parts sharing the facade
   * window shader: slightly inset body, set-back upper tier on tall towers, cornice ledges, a roof
   * parapet, a darker ground-floor band with awnings, and hip roofs on small low houses.
   * Insets/overhangs are applied only on a building's outer faces, so cells of one building join up.
   */
  private buildDetailedBuildings() {
    const L = this.layout;
    const N = this.size;
    const half = L.half;
    const owner = new Map<number, number>();
    this.modules.forEach((m, i) => owner.set(m.r * N + m.c, L.building[i]));
    const isRoad = new Set(this.tiles.filter((t) => t.kind === 'road').map((t) => t.r * N + t.c));

    const body: GrowItem[] = [];
    const trims: GrowItem[] = [];
    const shops: GrowItem[] = [];
    const awnings: GrowItem[] = [];
    const roofs: GrowItem[] = [];
    const awningColors = ['#d94a3a', '#2f8f6a', '#f2c14e', '#3a6fc0', '#e07a3a'];

    /** box spanning [x0,x1]×[y0,y1]×[z0,z1] */
    const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
      new THREE.Matrix4().compose(
        new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2),
        new THREE.Quaternion(),
        new THREE.Vector3(x1 - x0, y1 - y0, z1 - z0)
      );

    this.modules.forEach((m, i) => {
      const bid = L.building[i];
      const b = L.buildings[bid];
      const h = b.h;
      const floors = Math.round(h / FLOOR_H);
      const cx = m.c - half + 0.5;
      const cz = m.r - half + 0.5;
      const ext = {
        l: owner.get(m.r * N + m.c - 1) !== bid || m.c === 0,
        r: owner.get(m.r * N + m.c + 1) !== bid || m.c === N - 1,
        u: owner.get((m.r - 1) * N + m.c) !== bid || m.r === 0,
        d: owner.get((m.r + 1) * N + m.c) !== bid || m.r === N - 1,
      };
      const facade = cityVoxelColors(L, i, this.modeName).side;
      const trim = '#' + new THREE.Color(facade).lerp(new THREE.Color('#f4f1ea'), 0.45).getHexString();
      const delay = Math.min(0.7, this.growDelay(i) + 0.04);
      const pivot = new THREE.Vector3(cx, 0, cz);
      const span = (inset: number) => ({
        x0: cx - 0.5 + (ext.l ? inset : 0),
        x1: cx + 0.5 - (ext.r ? inset : 0),
        z0: cz - 0.5 + (ext.u ? inset : 0),
        z1: cz + 0.5 - (ext.d ? inset : 0),
      });
      const tall = floors >= 9 && !b.isTower ? true : b.isTower;
      const tierAt = tall ? Math.round(floors * 0.62) * FLOOR_H : h;

      // body (+ setback tier)
      const s0 = span(0.05);
      body.push({ matrix: box(s0.x0, s0.x1, 0, tierAt, s0.z0, s0.z1), color: facade, delay, pivot });
      if (tierAt < h) {
        const s1 = span(0.2);
        body.push({ matrix: box(s1.x0, s1.x1, tierAt, h, s1.z0, s1.z1), color: facade, delay: delay + 0.04, pivot });
      }

      // ground floor shop band, slightly proud of the facade
      const sg = span(0.01);
      shops.push({ matrix: box(sg.x0, sg.x1, 0, 0.72, sg.z0, sg.z1), color: '#' + new THREE.Color(facade).multiplyScalar(0.62).getHexString(), delay, pivot });

      // ledges / parapet along outer faces only
      const ledge = (y: number, t: number, out: number, inset: number, color: string, extraDelay: number) => {
        const s = span(inset);
        if (ext.l) trims.push({ matrix: box(s.x0 - out, s.x0 + 0.08, y, y + t, s.z0 - (ext.u ? out : 0), s.z1 + (ext.d ? out : 0)), color, delay: delay + extraDelay, pivot });
        if (ext.r) trims.push({ matrix: box(s.x1 - 0.08, s.x1 + out, y, y + t, s.z0 - (ext.u ? out : 0), s.z1 + (ext.d ? out : 0)), color, delay: delay + extraDelay, pivot });
        if (ext.u) trims.push({ matrix: box(s.x0 - (ext.l ? out : 0), s.x1 + (ext.r ? out : 0), y, y + t, s.z0 - out, s.z0 + 0.08), color, delay: delay + extraDelay, pivot });
        if (ext.d) trims.push({ matrix: box(s.x0 - (ext.l ? out : 0), s.x1 + (ext.r ? out : 0), y, y + t, s.z1 - 0.08, s.z1 + out), color, delay: delay + extraDelay, pivot });
      };
      ledge(0.72, 0.06, 0.05, 0.05, trim, 0.02); // shop cornice
      for (let f = 6; f * FLOOR_H < tierAt - 0.2; f += 6) ledge(f * FLOOR_H - 0.03, 0.06, 0.04, 0.05, trim, 0.05);
      if (tierAt < h) ledge(tierAt - 0.02, 0.1, 0.06, 0.05, trim, 0.06);

      const lowHouse = floors <= 3 && b.cells.length <= 3 && !b.isTower;
      if (lowHouse) {
        // hip roof, terracotta
        const s = span(0.05);
        roofs.push({
          matrix: new THREE.Matrix4().compose(
            new THREE.Vector3((s.x0 + s.x1) / 2, h + 0.27, (s.z0 + s.z1) / 2),
            new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)),
            new THREE.Vector3((s.x1 - s.x0) * 0.74, 0.54, (s.z1 - s.z0) * 0.74)
          ),
          color: this.modeName === 'night' ? '#5a3a34' : '#b5533a',
          delay: delay + 0.08,
          pivot,
        });
      } else {
        ledge(h, 0.2, 0.0, tierAt < h ? 0.2 : 0.05, trim, 0.08); // parapet
      }

      // awnings over shop fronts that face a street
      const faces: [boolean, number, number][] = [[ext.l, 0, -1], [ext.r, 0, 1], [ext.u, -1, 0], [ext.d, 1, 0]];
      faces.forEach(([isExt, dr, dc], fi) => {
        if (!isExt || !isRoad.has((m.r + dr) * N + (m.c + dc)) || rand(i * 7 + fi) > 0.45) return;
        const color = awningColors[Math.floor(rand(i * 3 + fi) * awningColors.length)];
        const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(dr * 0.5, 0, -dc * 0.5));
        const p = new THREE.Vector3(cx + dc * 0.6, 0.62, cz + dr * 0.6);
        awnings.push({
          matrix: new THREE.Matrix4().compose(p, tilt, new THREE.Vector3(dc !== 0 ? 0.24 : 0.8, 0.04, dr !== 0 ? 0.24 : 0.8)),
          color,
          delay: delay + 0.1,
          pivot,
        });
      });
    });

    const facadeMat = createCityMaterial(this.modeName, this.uniforms).material;
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), facadeMat, body);
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), trims);
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), createCityMaterial(this.modeName, this.uniforms).material, shops);
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), awnings, false);
    this.addGrown(new THREE.CylinderGeometry(0, 0.72, 1, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), roofs);
  }

  private buildMarkings() {
    const items: GrowItem[] = [];
    this.tiles.forEach((t, i) => {
      if (t.kind !== 'road') return;
      const lr = this.isLight(t.r, t.c - 1) && this.isLight(t.r, t.c + 1);
      const ud = this.isLight(t.r - 1, t.c) && this.isLight(t.r + 1, t.c);
      if (lr === ud) return; // crossings and dead ends stay plain
      const pos = new THREE.Vector3(t.x, 0.065, t.z);
      const scale = lr ? new THREE.Vector3(0.42, 0.01, 0.07) : new THREE.Vector3(0.07, 0.01, 0.42);
      items.push({
        matrix: new THREE.Matrix4().compose(pos, new THREE.Quaternion(), scale),
        color: this.cfg.marking,
        delay: 0.45 + rand(i + 3) * 0.1,
        pivot: pos.clone(),
      });
    });
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), items, false);
  }

  private buildTrees() {
    const trunks: GrowItem[] = [];
    const crowns: GrowItem[] = [];
    this.tiles.forEach((t, i) => {
      if (t.kind !== 'park' || rand(i * 13 + 1) > 0.62) return;
      const ox = (rand(i + 21) - 0.5) * 0.3;
      const oz = (rand(i + 22) - 0.5) * 0.3;
      const h = 0.35 + rand(i + 23) * 0.25;
      const foot = new THREE.Vector3(t.x + ox, 0.06, t.z + oz);
      trunks.push({
        matrix: new THREE.Matrix4().compose(foot.clone().setY(0.06 + h / 2), new THREE.Quaternion(), new THREE.Vector3(0.1, h, 0.1)),
        color: '#6b4a32',
        delay: 0.35 + rand(i + 4) * 0.2,
        pivot: foot,
      });
      const s = 0.45 + rand(i + 24) * 0.25;
      const green = this.cfg.park[Math.floor(rand(i + 25) * this.cfg.park.length)];
      crowns.push({
        matrix: new THREE.Matrix4().compose(
          foot.clone().setY(0.06 + h + s * 0.45),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rand(i + 26) * Math.PI, 0)),
          new THREE.Vector3(s, s * 0.9, s)
        ),
        color: '#' + new THREE.Color(green).multiplyScalar(0.85).getHexString(),
        delay: 0.45 + rand(i + 5) * 0.25,
        pivot: foot,
      });
    });
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), trunks);
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), crowns);
  }

  private buildLamps() {
    const posts: GrowItem[] = [];
    const heads: GrowItem[] = [];
    this.tiles.forEach((t, i) => {
      if (t.kind !== 'road' || rand(i * 19 + 4) > 0.12) return;
      // stand next to a building edge
      const nb = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ].find(([dr, dc]) => !this.isLight(t.r + dr, t.c + dc));
      if (!nb) return;
      const foot = new THREE.Vector3(t.x + nb[1] * 0.36, 0.06, t.z + nb[0] * 0.36);
      posts.push({
        matrix: new THREE.Matrix4().compose(foot.clone().setY(0.06 + 0.45), new THREE.Quaternion(), new THREE.Vector3(0.06, 0.9, 0.06)),
        color: '#4a4f58',
        delay: 0.5 + rand(i + 6) * 0.15,
        pivot: foot,
      });
      heads.push({
        matrix: new THREE.Matrix4().compose(foot.clone().setY(0.98), new THREE.Quaternion(), new THREE.Vector3(0.16, 0.1, 0.16)),
        color: '#ffffff',
        delay: 0.55 + rand(i + 7) * 0.15,
        pivot: foot,
      });
    });
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), posts, false);
    this.lampMat = new THREE.MeshStandardMaterial({ color: '#fff2cc', emissive: this.cfg.windowLit, emissiveIntensity: 0 });
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), this.lampMat, heads, false);
  }

  private buildRooftops() {
    const L = this.layout;
    const half = L.half;
    const units: GrowItem[] = [];
    const tanks: GrowItem[] = [];
    const masts: GrowItem[] = [];
    const tallest = [...L.buildings].filter((b) => !b.isTower).sort((a, b) => b.h - a.h).slice(0, 5).map((b) => b.id);

    for (const b of L.buildings) {
      const delay = Math.min(0.85, 0.08 + (b.h / L.maxH) * 0.32 + 0.3);
      const cellPos = (k: number) => {
        const m = this.modules[b.cells[k % b.cells.length]];
        return new THREE.Vector3(m.c - half + 0.5, b.h, m.r - half + 0.5);
      };
      if (b.isTower) {
        // landmark spire: crown + needle
        let cx = 0, cz = 0;
        b.cells.forEach((i) => {
          cx += this.modules[i].c - half + 0.5;
          cz += this.modules[i].r - half + 0.5;
        });
        cx /= b.cells.length;
        cz /= b.cells.length;
        const top = new THREE.Vector3(cx, b.h, cz);
        units.push({
          matrix: new THREE.Matrix4().compose(top.clone().setY(b.h + 0.35), new THREE.Quaternion(), new THREE.Vector3(1.8, 0.7, 1.8)),
          color: '#8a9099',
          delay,
          pivot: top.clone(),
        });
        masts.push({
          matrix: new THREE.Matrix4().compose(top.clone().setY(b.h + 0.7 + 1.6), new THREE.Quaternion(), new THREE.Vector3(0.12, 3.2, 0.12)),
          color: '#c9ccd2',
          delay: Math.min(0.9, delay + 0.05),
          pivot: top.clone().setY(b.h + 0.7),
        });
        continue;
      }
      if (b.cells.length >= 2 && rand(b.id * 5 + 1) < 0.6) {
        const p = cellPos(Math.floor(rand(b.id + 2) * b.cells.length));
        p.x += (rand(b.id + 3) - 0.5) * 0.3;
        p.z += (rand(b.id + 4) - 0.5) * 0.3;
        units.push({
          matrix: new THREE.Matrix4().compose(p.clone().setY(b.h + 0.13), new THREE.Quaternion(), new THREE.Vector3(0.45, 0.26, 0.32)),
          color: '#9aa0a8',
          delay,
          pivot: p.clone(),
        });
      }
      if (b.cells.length >= 4 && rand(b.id * 7 + 2) < 0.4) {
        const p = cellPos(Math.floor(rand(b.id + 5) * b.cells.length));
        tanks.push({
          matrix: new THREE.Matrix4().compose(p.clone().setY(b.h + 0.4), new THREE.Quaternion(), new THREE.Vector3(0.32, 0.55, 0.32)),
          color: '#8a6a4a',
          delay,
          pivot: p.clone(),
        });
      }
      if (tallest.includes(b.id)) {
        const p = cellPos(0);
        const h = 1.2 + rand(b.id + 6) * 1.4;
        masts.push({
          matrix: new THREE.Matrix4().compose(p.clone().setY(b.h + h / 2), new THREE.Quaternion(), new THREE.Vector3(0.06, h, 0.06)),
          color: '#c9ccd2',
          delay,
          pivot: p.clone(),
        });
      }
    }
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), units);
    this.addGrown(new THREE.CylinderGeometry(1, 1, 1, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), tanks);
    this.addGrown(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }), masts);
  }

  private buildCars() {
    const N = this.size;
    const road = new Set(this.tiles.filter((t) => t.kind === 'road').map((t) => t.r * N + t.c));
    const runs: Omit<Car, 'dir' | 'speed' | 'phase'>[] = [];
    // straight runs of road tiles along rows and columns
    for (let line = 0; line < N; line++) {
      for (const horizontal of [true, false]) {
        let start = -1;
        for (let k = 0; k <= N; k++) {
          const isRoad = k < N && road.has(horizontal ? line * N + k : k * N + line);
          if (isRoad && start < 0) start = k;
          if (!isRoad && start >= 0) {
            if (k - start >= 4) runs.push({ horizontal, line, from: start, to: k - 1 });
            start = -1;
          }
        }
      }
    }
    runs.sort((a, b) => rand(a.line * 31 + a.from + (a.horizontal ? 7 : 0)) - rand(b.line * 31 + b.from + (b.horizontal ? 7 : 0)));
    const picked = runs.slice(0, Math.min(18, runs.length));
    picked.forEach((run, i) => {
      const n = run.to - run.from + 1 >= 10 ? 2 : 1;
      for (let k = 0; k < n; k++) {
        this.cars.push({
          ...run,
          dir: rand(i * 3 + k) < 0.5 ? 1 : -1,
          speed: 0.9 + rand(i * 5 + k) * 0.9,
          phase: rand(i * 7 + k * 3),
        });
      }
    });

    const count = Math.max(1, this.cars.length);
    this.carBody = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.62, 0.2, 0.3)), this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.2 })), count);
    this.carCabin = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.32, 0.15, 0.26)), this.track(new THREE.MeshStandardMaterial({ color: '#2a3340', roughness: 0.3 })), count);
    this.headMat = this.track(new THREE.MeshBasicMaterial({ color: '#fff3c4' }));
    this.tailMat = this.track(new THREE.MeshBasicMaterial({ color: '#ff3b3b' }));
    this.carHead = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.04, 0.06, 0.24)), this.headMat, count);
    this.carTail = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.04, 0.06, 0.24)), this.tailMat, count);
    [this.carBody, this.carCabin, this.carHead, this.carTail].forEach((m) => {
      m.count = this.cars.length;
      m.castShadow = m === this.carBody;
      this.group.add(m);
    });
    const c = new THREE.Color();
    this.cars.forEach((_, i) => this.carBody.setColorAt(i, c.set(this.cfg.car[Math.floor(rand(i * 9 + 4) * this.cfg.car.length)])));
  }

  /** Lighting, materials and slab follow the view: neutral from the top, the chosen time of day from the side. */
  public applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    const cfg = this.cfg;
    ambient.color.set(NEUTRAL.ambient.color).lerp(new THREE.Color(cfg.ambient.color), e);
    ambient.intensity = THREE.MathUtils.lerp(NEUTRAL.ambient.intensity, cfg.ambient.intensity, e);
    sun.color.set(NEUTRAL.sun.color).lerp(new THREE.Color(cfg.sun.color), e);
    sun.intensity = THREE.MathUtils.lerp(NEUTRAL.sun.intensity, cfg.sun.intensity, e);
    const p0 = new THREE.Vector3(...NEUTRAL.sun.position);
    sun.position.copy(p0.lerp(new THREE.Vector3(...cfg.sun.position), e));
    point.intensity = 0;
    this.slabMat.color.set(NEUTRAL.slab).lerp(new THREE.Color(cfg.slab), e);
    this.uniforms.uSide.value = e;
    this.uniforms.uNight.value = cfg.night * THREE.MathUtils.smoothstep(e, 0.4, 1);
    this.lampMat.emissiveIntensity = 2.2 * this.uniforms.uNight.value;
    const lightsOn = this.uniforms.uNight.value;
    this.headMat.color.set('#fff3c4').multiplyScalar(0.35 + 0.65 * lightsOn);
    this.tailMat.color.set('#ff3b3b').multiplyScalar(0.35 + 0.65 * lightsOn);
  }

  /**
   * @param growth 0 = top view (only QR cubes) … 1 = side view (full city)
   * @param time seconds — cars and window flicker
   */
  public update(growth: number, time: number) {
    this.growth = growth;
    this.uniforms.uTime.value = time;
    if (growth !== this.lastGrowth) {
      this.lastGrowth = growth;
      // floor tiles: white mosaic (QR) → asphalt / lawn
      const c = new THREE.Color();
      for (let i = 0; i < this.tiles.length; i++) {
        c.copy(this.tileQr[i]).lerp(this.tileSide[i], THREE.MathUtils.smoothstep(growth, 0.1, 0.7));
        this.tileMesh.setColorAt(i, c);
      }
      if (this.tileMesh.instanceColor) this.tileMesh.instanceColor.needsUpdate = true;

      const m = new THREE.Matrix4();
      const s = new THREE.Matrix4();
      const tNeg = new THREE.Matrix4();
      const tPos = new THREE.Matrix4();
      for (const gr of this.grown) {
        let any = false;
        for (let i = 0; i < gr.base.length; i++) {
          const local = THREE.MathUtils.clamp((growth - gr.delay[i]) / (1 - gr.delay[i]), 0, 1);
          const k = local <= 0 ? 0 : local >= 1 ? 1 : 1 - Math.pow(1 - local, 3);
          if (k > 0) any = true;
          const p = gr.pivot[i];
          tNeg.makeTranslation(-p.x, -p.y, -p.z);
          tPos.makeTranslation(p.x, p.y, p.z);
          const ks = k || 1e-4;
          s.makeScale(ks, ks, ks);
          m.copy(tPos).multiply(s).multiply(tNeg).multiply(gr.base[i]);
          gr.mesh.setMatrixAt(i, m);
        }
        gr.mesh.visible = any;
        gr.mesh.instanceMatrix.needsUpdate = true;
      }
    }
    this.updateCars(time);
  }

  private updateCars(time: number) {
    const vis = THREE.MathUtils.clamp((this.growth - 0.8) / 0.2, 0, 1);
    const meshes = [this.carBody, this.carCabin, this.carHead, this.carTail];
    meshes.forEach((m) => (m.visible = vis > 0 && this.cars.length > 0));
    if (vis <= 0) return;
    const half = this.size / 2;
    const d = new THREE.Object3D();
    const place = (mesh: THREE.InstancedMesh, i: number, pos: THREE.Vector3, yaw: number, local: THREE.Vector3, sc: number) => {
      d.position.copy(local).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).add(pos);
      d.rotation.set(0, yaw, 0);
      d.scale.setScalar(sc || 1e-4);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    };
    this.cars.forEach((car, i) => {
      const len = car.to - car.from + 1;
      const s = (time * car.speed / len + car.phase) % 1;
      const t = car.dir > 0 ? s : 1 - s;
      const along = car.from - half + 0.5 - 0.5 + 0.3 + t * (len - 0.6);
      const lane = car.dir * 0.2;
      const across = car.line - half + 0.5 + lane;
      const pos = car.horizontal ? new THREE.Vector3(along, 0.17, across) : new THREE.Vector3(across, 0.17, along);
      // car geometry points along +x; turn it to the direction of travel
      const yaw = car.horizontal ? (car.dir > 0 ? 0 : Math.PI) : car.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      const fade = Math.min(1, s * 10, (1 - s) * 10) * vis;
      place(this.carBody, i, pos, yaw, new THREE.Vector3(0, 0, 0), fade);
      place(this.carCabin, i, pos, yaw, new THREE.Vector3(-0.04, 0.16, 0), fade);
      place(this.carHead, i, pos, yaw, new THREE.Vector3(0.31, 0.02, 0), fade);
      place(this.carTail, i, pos, yaw, new THREE.Vector3(-0.31, 0.02, 0), fade);
    });
    meshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));
    if (this.carBody.instanceColor) this.carBody.instanceColor.needsUpdate = true;
  }

  /** Restore plain lighting when the city is replaced by another shape. */
  public static resetLighting(ambient: THREE.AmbientLight, sun: THREE.DirectionalLight) {
    ambient.color.set('#ffffff');
    sun.color.set('#ffffff');
    sun.position.set(...NEUTRAL.sun.position);
  }

  public dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
