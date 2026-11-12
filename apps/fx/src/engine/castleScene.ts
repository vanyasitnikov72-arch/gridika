import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import { GrowSet, NEUTRAL_LIGHT, finderLocal, lerpStageLighting, type GrowItem, type StageScene } from './stageScene';

/**
 * "QR Castle" — a fortress whose wall tops and roofs are the QR code when seen from directly above.
 *
 *  - every dark QR module is a brick wall section, higher towards the citadel in the middle;
 *    isolated dark modules are little houses with hip roofs;
 *  - the three finder squares are towers: a curtain wall ring with battlements around a 3×3 keep
 *    with a conical roof and a flag (only the keep's centre cell carries the banner colour in the QR);
 *  - light modules are the cobbled courtyard; a moat with a drawbridge surrounds the castle;
 *  - battlements, roofs, flags, windows, torches, snow and the moat only exist in the side view.
 *
 * Modes: day / night / winter — applied only in the side view, the top view always scans.
 */

export type CastleMode = 'day' | 'night' | 'winter';

interface CastlePalette {
  stone: string[];
  roof: string;
  courtyard: string;
  water: string;
  slab: string;
  banners: [string, string, string];
  snow: boolean;
  night: number;
  mood: {
    ambient: { color: string; intensity: number };
    sun: { color: string; intensity: number; position: [number, number, number] };
  };
}

export const CASTLE_MODES: Record<CastleMode, CastlePalette> = {
  day: {
    stone: ['#b8ab94', '#a89c86', '#c4b8a2', '#9e937e'],
    roof: '#b5453a',
    courtyard: '#cfc6b4',
    water: '#3f8fb0',
    slab: '#6f8a4a',
    banners: ['#c0392b', '#2f5fb0', '#d8a92a'],
    snow: false,
    night: 0,
    mood: { ambient: { color: '#ffffff', intensity: 1.2 }, sun: { color: '#fff2dc', intensity: 2.6, position: [22, 48, 28] } },
  },
  night: {
    stone: ['#8a90a4', '#7e8498', '#969cb0', '#767c8e'],
    roof: '#6a2f3a',
    courtyard: '#666b7a',
    water: '#1f3550',
    slab: '#3a4a3a',
    banners: ['#c0392b', '#2f5fb0', '#d8a92a'],
    snow: false,
    night: 1,
    mood: { ambient: { color: '#8a98d8', intensity: 1.15 }, sun: { color: '#b8c4ff', intensity: 1.3, position: [-20, 40, 10] } },
  },
  winter: {
    stone: ['#a9adb5', '#9a9fa8', '#b5b9c0', '#8f949e'],
    roof: '#8a3a3a',
    courtyard: '#eef2f6',
    water: '#a9c9da',
    slab: '#e6eef4',
    banners: ['#c0392b', '#2f5fb0', '#d8a92a'],
    snow: true,
    night: 0,
    mood: { ambient: { color: '#e8f0ff', intensity: 1.25 }, sun: { color: '#f0f4ff', intensity: 2.3, position: [30, 32, 20] } },
  },
};

const WALL_LUM = 92;
const STEP = 0.4;

type Kind = 'wall' | 'house' | 'ring' | 'keep' | 'keepTop';

export interface CastleLayout {
  size: number;
  half: number;
  kind: Kind[];
  height: number[];
  /** finder index for tower cells, -1 otherwise */
  tower: number[];
  maxH: number;
}

export function castleLayout(modules: DarkModule[], size: number): CastleLayout {
  const half = size / 2;
  const dark = new Set(modules.map((m) => m.r * size + m.c));
  const isDark = (r: number, c: number) => r >= 0 && c >= 0 && r < size && c < size && dark.has(r * size + c);
  const kind: Kind[] = [];
  const height: number[] = [];
  const tower: number[] = [];
  modules.forEach((m, i) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc, fi] = local;
      tower.push(fi);
      if (fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4) {
        kind.push(fr === 3 && fc === 3 ? 'keepTop' : 'keep');
        height.push(5.2);
      } else {
        kind.push('ring');
        height.push(3.2);
      }
      return;
    }
    tower.push(-1);
    const lonely = !isDark(m.r - 1, m.c) && !isDark(m.r + 1, m.c) && !isDark(m.r, m.c - 1) && !isDark(m.r, m.c + 1);
    if (lonely) {
      kind.push('house');
      height.push(1.2);
      return;
    }
    kind.push('wall');
    // citadel: walls rise towards the middle
    const d = Math.hypot(m.c - half + 0.5, m.r - half + 0.5) / (half * 0.95);
    const profile = Math.pow(Math.max(0, 1 - d), 1.3);
    const h = 1.6 + profile * 3.2 + (rand(i * 7 + 1) < 0.1 ? 0.8 : 0);
    height.push(Math.round(h / STEP) * STEP);
  });
  return { size, half, kind, height, tower, maxH: Math.max(...height) };
}

export function castleVoxelTargets(modules: DarkModule[], size: number) {
  const L = castleLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

/** Stone material: running-bond bricks on wall faces, slab top, only in the side view. */
function createStoneMaterial(shared?: { uSide: { value: number } }) {
  const uniforms = shared ?? { uSide: { value: 0 } };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'varying vec3 vStonePos;\nvarying vec3 vStoneN;\n' +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 stoneWp = vec4(transformed, 1.0);
        vec3 stoneN = objectNormal;
        #ifdef USE_INSTANCING
          stoneWp = instanceMatrix * stoneWp;
          stoneN = mat3(instanceMatrix) * stoneN;
        #endif
        vStonePos = (modelMatrix * stoneWp).xyz;
        vStoneN = normalize(mat3(modelMatrix) * stoneN);`
      );
    shader.fragmentShader =
      'varying vec3 vStonePos;\nvarying vec3 vStoneN;\nuniform float uSide;\n' +
      shader.fragmentShader.replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float stSide = 1.0 - step(0.5, abs(vStoneN.y));
        float stU = abs(vStoneN.x) > 0.5 ? vStonePos.z : vStonePos.x;
        float row = floor(vStonePos.y / 0.22);
        float brickU = stU * 2.4 + mod(row, 2.0) * 0.5;
        float mortar = (1.0 - step(0.08, fract(vStonePos.y / 0.22))) + (1.0 - step(0.06, fract(brickU)));
        float shade = 0.9 + 0.12 * fract(sin(dot(vec2(floor(brickU), row), vec2(12.9898, 78.233))) * 43758.5453);
        vec3 brick = diffuseColor.rgb * shade * mix(1.0, 0.62, clamp(mortar, 0.0, 1.0));
        diffuseColor.rgb = mix(diffuseColor.rgb, brick, stSide * uSide);`
      );
  };
  material.customProgramCacheKey = () => 'qr-castle-stone';
  return { material, uniforms };
}

interface Flag {
  pole: THREE.Mesh;
  cloth: THREE.Mesh;
  base: THREE.Vector3;
  delay: number;
}

export class CastleDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  public readonly targets: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  public readonly voxelSideWindow: [number, number] = [0.6, 0.9];
  private stoneUniforms: { uSide: { value: number } };
  private layout: CastleLayout;
  private pal: CastlePalette;
  private disposables: { dispose(): void }[] = [];
  private grow: GrowSet;
  private tiles: { x: number; z: number; r: number; c: number }[] = [];
  private tileMesh!: THREE.InstancedMesh;
  private tileQr: THREE.Color[] = [];
  private tileSide: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private glowMats: THREE.MeshStandardMaterial[] = [];
  private flags: Flag[] = [];
  private snowfall: THREE.InstancedMesh | null = null;
  private lastGrowth = -1;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    mode: CastleMode
  ) {
    this.layout = castleLayout(modules, size);
    this.pal = CASTLE_MODES[mode];
    const sm = createStoneMaterial();
    this.voxelMaterial = sm.material;
    this.stoneUniforms = sm.uniforms;
    this.targets = castleVoxelTargets(modules, size);
    this.grow = new GrowSet(this.group, (o) => this.track(o));
    this.build();
  }

  get maxHeight() {
    return this.layout.maxH + 3.4; // keep roofs and flags
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  private stoneColor(i: number) {
    const m = this.modules[i];
    const lot = Math.floor(m.r / 4) * 97 + Math.floor(m.c / 4) * 31;
    return this.pal.stone[Math.floor(rand(lot + 3) * this.pal.stone.length)];
  }

  voxelColor(i: number) {
    const k = this.layout.kind[i];
    const side = this.stoneColor(i);
    let hue = side;
    if (k === 'house') hue = this.pal.roof;
    // the dome covers the whole inner 3×3 square, so all of it takes the dome (banner) colour
    if (k === 'keepTop' || k === 'keep') hue = this.pal.banners[this.layout.tower[i]];
    return { qr: atLuminance(hue, WALL_LUM + (rand(i * 5 + 17) - 0.5) * 12), side };
  }

  growDelay(i: number) {
    // walls rise course by course: low curtain walls first, the citadel and towers last
    return 0.04 + (this.layout.height[i] / this.layout.maxH) * 0.32 + rand(i * 7 + 3) * 0.05;
  }

  /** Walls keep their (bricked) column; houses are replaced by a house model. */
  voxelSideScale(i: number): [number, number, number] {
    return this.layout.kind[i] === 'house' ? [0, 0, 0] : [1, 1, 1];
  }

  private top(i: number) {
    const m = this.modules[i];
    return new THREE.Vector3(m.c - this.layout.half + 0.5, this.layout.height[i], m.r - this.layout.half + 0.5);
  }

  /** Detail appears once the walls are up and the camera is tilted. */
  private detailDelay(i: number) {
    return Math.min(0.9, 0.58 + rand(i * 11 + 5) * 0.12);
  }

  private build() {
    const N = this.size;
    const half = N / 2;
    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL_LIGHT.slab, roughness: 0.9 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    this.group.add(slab);

    // cobbled courtyard on light modules
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
      this.tileSide.push(new THREE.Color(this.pal.courtyard).multiplyScalar(0.9 + rand(i * 7 + 2) * 0.14));
      this.tileMesh.setColorAt(i, this.tileQr[i]);
    });
    this.group.add(this.tileMesh);

    this.buildBattlements();
    this.buildHouses();
    this.buildKeeps();
    this.buildWindowsAndTorches();
    this.buildMoat();
    if (this.pal.snow) this.buildSnow();
    this.update(0, 0);
  }

  /** Crenellations along every outer edge of wall tops (where the neighbour is lower). */
  private buildBattlements() {
    const L = this.layout;
    const N = this.size;
    const heightAt = new Map<number, number>();
    this.modules.forEach((m, i) => heightAt.set(m.r * N + m.c, L.height[i]));
    const merlons: GrowItem[] = [];
    const caps: GrowItem[] = [];
    this.modules.forEach((m, i) => {
      const k = L.kind[i];
      if (k !== 'wall' && k !== 'ring') return;
      const top = this.top(i);
      const h = L.height[i];
      const delay = this.detailDelay(i);
      const color = this.stoneColor(i);
      if (this.pal.snow) {
        caps.push({ matrix: new THREE.Matrix4().compose(top.clone().setY(h + 0.04), new THREE.Quaternion(), new THREE.Vector3(1.0, 0.08, 1.0)), color: '#f6f9fc', delay, pivot: top.clone() });
      }
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const nh = heightAt.get((m.r + dr) * N + (m.c + dc)) ?? 0;
        if (nh >= h) continue;
        for (const along of [-0.25, 0.25]) {
          const p = new THREE.Vector3(
            top.x + (dc !== 0 ? dc * 0.39 : along),
            h + 0.16,
            top.z + (dr !== 0 ? dr * 0.39 : along)
          );
          merlons.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(dc !== 0 ? 0.2 : 0.26, 0.32, dr !== 0 ? 0.2 : 0.26)), color, delay, pivot: p.clone().setY(h) });
          if (this.pal.snow) {
            caps.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(h + 0.35), new THREE.Quaternion(), new THREE.Vector3(dc !== 0 ? 0.22 : 0.28, 0.06, dr !== 0 ? 0.22 : 0.28)), color: '#f6f9fc', delay, pivot: p.clone().setY(h) });
          }
        }
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), createStoneMaterial(this.stoneUniforms).material, merlons);
    if (caps.length) this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), caps, false);
  }

  /** Little houses on isolated cells: plastered body, timber door, hip roof. */
  private buildHouses() {
    const L = this.layout;
    const bodies: GrowItem[] = [];
    const roofs: GrowItem[] = [];
    this.modules.forEach((_, i) => {
      if (L.kind[i] !== 'house') return;
      const m = this.modules[i];
      const base = new THREE.Vector3(m.c - L.half + 0.5, 0, m.r - L.half + 0.5);
      const delay = Math.min(0.8, this.growDelay(i) + 0.3);
      bodies.push({ matrix: new THREE.Matrix4().compose(base.clone().setY(0.45), new THREE.Quaternion(), new THREE.Vector3(0.82, 0.9, 0.82)), color: this.pal.snow ? '#e4dccb' : '#e8dcc2', delay, pivot: base.clone() });
      bodies.push({ matrix: new THREE.Matrix4().compose(base.clone().add(new THREE.Vector3(0, 0.25, 0.42)), new THREE.Quaternion(), new THREE.Vector3(0.24, 0.42, 0.04)), color: '#6a4a32', delay, pivot: base.clone() });
      roofs.push({
        matrix: new THREE.Matrix4().compose(base.clone().setY(0.9 + 0.3), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)), new THREE.Vector3(0.7, 0.6, 0.7)),
        color: this.pal.snow ? '#f4f8fb' : this.pal.roof,
        delay: delay + 0.05,
        pivot: base.clone(),
      });
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), bodies);
    this.grow.add(new THREE.CylinderGeometry(0, 1, 1, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), roofs);
  }

  /** Conical roof over each 3×3 keep with a flag, plus a flag on the highest citadel wall. */
  private buildKeeps() {
    const L = this.layout;
    const half = L.half;
    const roofs: GrowItem[] = [];
    const N = this.size;
    const origins: [number, number][] = [[0, 0], [0, N - 7], [N - 7, 0]];
    origins.forEach(([r0, c0], fi) => {
      const cx = c0 + 3.5 - half, cz = r0 + 3.5 - half;
      const h = 5.2;
      const p = new THREE.Vector3(cx, h + 1.1, cz);
      roofs.push({
        // square dome exactly over the 3×3 keep (4-sided, turned 45° so its base is the square)
        matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 4, 0)), new THREE.Vector3(1.5 * Math.SQRT2, 2.2, 1.5 * Math.SQRT2)),
        color: this.pal.banners[fi],
        delay: 0.62 + fi * 0.03,
        pivot: new THREE.Vector3(cx, h, cz),
      });
      this.addFlag(new THREE.Vector3(cx, h + 2.15, cz), this.pal.banners[fi], 0.7 + fi * 0.03);
    });
    // citadel flag on the highest wall
    let best = -1;
    this.modules.forEach((_, i) => {
      if (L.kind[i] === 'wall' && (best < 0 || L.height[i] > L.height[best])) best = i;
    });
    if (best >= 0) this.addFlag(this.top(best), this.pal.banners[0], 0.72);
    this.grow.add(new THREE.CylinderGeometry(0, 1, 1, 4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }), roofs);
  }

  private addFlag(base: THREE.Vector3, color: string, delay: number) {
    const pole = new THREE.Mesh(this.track(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6)), this.track(new THREE.MeshStandardMaterial({ color: '#4a4a52', roughness: 0.5 })));
    const cloth = new THREE.Mesh(this.track(new THREE.BoxGeometry(0.7, 0.42, 0.03)), this.track(new THREE.MeshStandardMaterial({ color, roughness: 0.7, side: THREE.DoubleSide })));
    [pole, cloth].forEach((o) => {
      o.visible = false;
      o.castShadow = true;
      this.group.add(o);
    });
    this.flags.push({ pole, cloth, base: base.clone(), delay });
  }

  /** Windows on towers and tall walls; torches along the battlements (both glow at night). */
  private buildWindowsAndTorches() {
    const L = this.layout;
    const N = this.size;
    const dark = new Set(this.modules.map((m) => m.r * N + m.c));
    const windowMat = this.track(new THREE.MeshStandardMaterial({ color: '#2a2a32', emissive: '#ffb84a', emissiveIntensity: 0, roughness: 0.4 }));
    const flameMat = this.track(new THREE.MeshStandardMaterial({ color: '#ffd27a', emissive: '#ff8a2a', emissiveIntensity: 0 }));
    this.glowMats.push(windowMat, flameMat);
    const windows: GrowItem[] = [];
    const posts: GrowItem[] = [];
    const flames: GrowItem[] = [];
    this.modules.forEach((m, i) => {
      const k = L.kind[i];
      const h = L.height[i];
      const top = this.top(i);
      const delay = this.detailDelay(i);
      if ((k === 'keep' || k === 'ring' || (k === 'wall' && h >= 3)) && rand(i * 13 + 2) < 0.55) {
        for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
          if (dark.has((m.r + dr) * N + (m.c + dc))) continue;
          const y = Math.min(h - 0.6, 1.0 + rand(i + dr * 3 + dc) * (h - 1.6));
          const p = new THREE.Vector3(top.x + dc * 0.5, y, top.z + dr * 0.5);
          windows.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(dc ? 0.04 : 0.18, 0.3, dr ? 0.04 : 0.18)), color: '#ffffff', delay, pivot: p.clone() });
        }
      }
      if ((k === 'wall' || k === 'ring') && rand(i * 19 + 7) < 0.12) {
        const p = top.clone().setY(h + 0.25);
        posts.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(0.06, 0.5, 0.06)), color: '#5a3d28', delay, pivot: top.clone() });
        flames.push({ matrix: new THREE.Matrix4().compose(p.clone().setY(h + 0.58), new THREE.Quaternion(), new THREE.Vector3(0.14, 0.2, 0.14)), color: '#ffffff', delay: delay + 0.03, pivot: top.clone() });
      }
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), windowMat, windows, false);
    if (this.pal.night) {
      this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }), posts, false);
      this.grow.add(new THREE.ConeGeometry(0.5, 1, 8), flameMat, flames, false);
    }
  }

  /** Moat in the quiet zone around the grid + a drawbridge on the front side. */
  private buildMoat() {
    const N = this.size;
    const half = N / 2;
    const w = 1.1;
    const items: GrowItem[] = [];
    const e = half + w / 2 + 0.02;
    const len = N + 2 * w;
    const sides: [number, number, number, number][] = [
      [0, -e, len, w],
      [0, e, len, w],
      [-e, 0, w, N],
      [e, 0, w, N],
    ];
    sides.forEach(([x, z, sx, sz]) => {
      const p = new THREE.Vector3(x, 0.02, z);
      items.push({ matrix: new THREE.Matrix4().compose(p, new THREE.Quaternion(), new THREE.Vector3(sx, 0.05, sz)), color: this.pal.water, delay: 0.55, pivot: p.clone() });
    });
    const bridge: GrowItem[] = [];
    const bp = new THREE.Vector3(0, 0.12, e);
    bridge.push({ matrix: new THREE.Matrix4().compose(bp, new THREE.Quaternion(), new THREE.Vector3(1.6, 0.12, w + 0.4)), color: '#7a5634', delay: 0.68, pivot: bp.clone() });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.05 }), items, false);
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 }), bridge);
  }

  private buildSnow() {
    this.snowfall = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.09, 0.09, 0.09)), this.track(new THREE.MeshStandardMaterial({ color: '#ffffff' })), 110);
    this.snowfall.visible = false;
    this.group.add(this.snowfall);
  }

  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    lerpStageLighting(e, this.pal.mood, ambient, sun, point);
    this.slabMat.color.set(NEUTRAL_LIGHT.slab).lerp(new THREE.Color(this.pal.slab), e);
    this.stoneUniforms.uSide.value = THREE.MathUtils.smoothstep(e, 0.2, 0.8);
    const glow = this.pal.night * THREE.MathUtils.smoothstep(e, 0.6, 1);
    this.glowMats.forEach((m) => (m.emissiveIntensity = 2.4 * glow));
  }

  update(growth: number, time: number) {
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
    // flags wave in the wind
    this.flags.forEach((f, i) => {
      const s = THREE.MathUtils.clamp((growth - f.delay) / (1 - f.delay), 0, 1);
      f.pole.visible = f.cloth.visible = s > 0.01;
      f.pole.position.set(f.base.x, f.base.y + 0.7 * s, f.base.z);
      f.pole.scale.set(1, Math.max(0.001, s), 1);
      const wave = Math.sin(time * 3 + i) * 0.25;
      f.cloth.position.set(f.base.x + 0.36 * s, f.base.y + 1.2 * s, f.base.z);
      f.cloth.rotation.set(0, wave, Math.sin(time * 5 + i) * 0.05);
      f.cloth.scale.set(Math.max(0.001, s), Math.max(0.001, s), 1);
    });
    // winter snowfall
    if (this.snowfall) {
      const vis = THREE.MathUtils.clamp((growth - 0.85) / 0.15, 0, 1);
      this.snowfall.visible = vis > 0;
      if (vis > 0) {
        const d = new THREE.Object3D();
        const span = this.size + 2;
        const top = this.layout.maxH + 6;
        for (let i = 0; i < this.snowfall.count; i++) {
          const y = top - ((time * (0.5 + rand(i) * 0.5) + rand(i + 50) * top) % top);
          d.position.set((rand(i + 1) - 0.5) * span + Math.sin(time + i) * 0.3, y, (rand(i + 2) - 0.5) * span);
          d.scale.setScalar(vis);
          d.updateMatrix();
          this.snowfall.setMatrixAt(i, d.matrix);
        }
        this.snowfall.instanceMatrix.needsUpdate = true;
      }
    }
  }

  dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
