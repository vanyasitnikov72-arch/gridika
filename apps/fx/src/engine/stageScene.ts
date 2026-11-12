import * as THREE from 'three';

/**
 * A themed "QR scene" (city, island, …): the QR voxels become part of a diorama in the side view
 * and fold back into a flat, scannable QR in the top view.
 */
export interface StageScene {
  readonly group: THREE.Group;
  /** Material for the QR voxels (may add procedural detail in the side view). */
  readonly voxelMaterial: THREE.Material;
  /** Highest point of the diorama, frames the side view. */
  readonly maxHeight: number;
  /** Optional per-voxel targets (overrides the generic shape targets, e.g. mode-dependent heights). */
  readonly targets?: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  /** QR colour (top view, scannable) and side-view colour of a voxel. */
  voxelColor(i: number): { qr: string; side: string };
  /** Grow order of a voxel in [0, ~0.5]. */
  growDelay(i: number): number;
  /**
   * Like the tree: in the side view the QR cube is replaced by detailed geometry. The cube scales
   * by this factor (per axis, 0 = gone) while the view passes through \`voxelSideWindow\`, i.e. while
   * the camera is moving and the detail grows over it — so the swap is not noticeable.
   */
  voxelSideScale?(i: number): [number, number, number];
  readonly voxelSideWindow?: [number, number];
  /**
   * Bottom height a voxel rests on at view progress \`e\` — lets voxels ride exactly on a surface
   * that rises with the transition (cake tiers), so nothing sinks into it or floats above it.
   */
  voxelBase?(i: number, e: number): number;
  /** Scene animates its QR voxels every frame in the side view (equalizer bars). */
  readonly animated?: boolean;
  /** Height factor of a voxel column at \`time\` (side view only, blended in by the viewer). */
  voxelDance?(i: number, time: number): number;
  /** Lighting follows the view: neutral at e = 0 (top), scene mood at e = 1 (side). */
  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight): void;
  update(e: number, time: number): void;
  dispose(): void;
}

export const NEUTRAL_LIGHT = {
  ambient: { color: '#ffffff', intensity: 1.25 },
  sun: { color: '#ffffff', intensity: 2.5, position: [22, 48, 28] as [number, number, number] },
  slab: '#f3f1ec',
};

export function resetStageLighting(ambient: THREE.AmbientLight, sun: THREE.DirectionalLight) {
  ambient.color.set(NEUTRAL_LIGHT.ambient.color);
  sun.color.set(NEUTRAL_LIGHT.sun.color);
  sun.position.set(...NEUTRAL_LIGHT.sun.position);
}

/** Shared helper: lerp lights from neutral (top view) to a scene mood (side view). */
export function lerpStageLighting(
  e: number,
  mood: { ambient: { color: string; intensity: number }; sun: { color: string; intensity: number; position: [number, number, number] } },
  ambient: THREE.AmbientLight,
  sun: THREE.DirectionalLight,
  point: THREE.PointLight
) {
  ambient.color.set(NEUTRAL_LIGHT.ambient.color).lerp(new THREE.Color(mood.ambient.color), e);
  ambient.intensity = THREE.MathUtils.lerp(NEUTRAL_LIGHT.ambient.intensity, mood.ambient.intensity, e);
  sun.color.set(NEUTRAL_LIGHT.sun.color).lerp(new THREE.Color(mood.sun.color), e);
  sun.intensity = THREE.MathUtils.lerp(NEUTRAL_LIGHT.sun.intensity, mood.sun.intensity, e);
  sun.position.copy(new THREE.Vector3(...NEUTRAL_LIGHT.sun.position).lerp(new THREE.Vector3(...mood.sun.position), e));
  point.intensity = 0;
}

/** Instanced items that scale in around a pivot as the view progresses (shared by scenes). */
export interface GrowItem {
  matrix: THREE.Matrix4;
  color: string;
  delay: number;
  pivot: THREE.Vector3;
}

export class GrowSet {
  private sets: { mesh: THREE.InstancedMesh; base: THREE.Matrix4[]; delay: number[]; pivot: THREE.Vector3[] }[] = [];

  constructor(private group: THREE.Group, private track: <T extends { dispose(): void }>(o: T) => T) {}

  add(geo: THREE.BufferGeometry, mat: THREE.Material, items: GrowItem[], castShadow = true) {
    const mesh = new THREE.InstancedMesh(this.track(geo), this.track(mat), Math.max(1, items.length));
    mesh.count = items.length;
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    const c = new THREE.Color();
    items.forEach((it, i) => mesh.setColorAt(i, c.set(it.color)));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    this.group.add(mesh);
    this.sets.push({ mesh, base: items.map((i) => i.matrix), delay: items.map((i) => i.delay), pivot: items.map((i) => i.pivot) });
    return mesh;
  }

  update(growth: number) {
    const m = new THREE.Matrix4();
    const s = new THREE.Matrix4();
    const tNeg = new THREE.Matrix4();
    const tPos = new THREE.Matrix4();
    for (const gr of this.sets) {
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
}

/** Light-module straight runs (for cars, boats). */
export function straightRuns(isFree: (r: number, c: number) => boolean, size: number, minLen: number) {
  const runs: { horizontal: boolean; line: number; from: number; to: number }[] = [];
  for (let line = 0; line < size; line++) {
    for (const horizontal of [true, false]) {
      let start = -1;
      for (let k = 0; k <= size; k++) {
        const free = k < size && (horizontal ? isFree(line, k) : isFree(k, line));
        if (free && start < 0) start = k;
        if (!free && start >= 0) {
          if (k - start >= minLen) runs.push({ horizontal, line, from: start, to: k - 1 });
          start = -1;
        }
      }
    }
  }
  return runs;
}

export function finderLocal(r: number, c: number, size: number): [number, number, number] | null {
  if (r < 7 && c < 7) return [r, c, 0];
  if (r < 7 && c >= size - 7) return [r, c - (size - 7), 1];
  if (r >= size - 7 && c < 7) return [r - (size - 7), c, 2];
  return null;
}
