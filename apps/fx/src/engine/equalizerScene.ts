import * as THREE from 'three';
import { atLuminance, rand, type DarkModule } from './treeScene';
import { GrowSet, NEUTRAL_LIGHT, finderLocal, lerpStageLighting, type GrowItem, type StageScene } from './stageScene';

/**
 * "QR Equalizer" — a spectrum analyser whose bar tops are the QR code when seen from directly above.
 *
 *  - every dark QR module is an LED bar; bars dance like a music spectrum (bass on the left, treble
 *    on the right, a shared kick drum on every beat), each topped by a bright LED cap that rides with it;
 *  - the three finder squares are subwoofer cabinets with pulsing cones and a neon ring;
 *  - light modules are the stage floor, flashing on the beat.
 *
 * Modes: neon / sunset / mono — applied only in the side view, the top view always scans.
 */

export type EqMode = 'neon' | 'retro' | 'mono';

interface EqPalette {
  /** bar gradient: bottom → mid → top */
  bottom: string;
  mid: string;
  top: string;
  accent: string;
  floor: string;
  slab: string;
  /** cabinet colour — the same in the QR and in the side view, so the speakers never change colour */
  cabinet: string;
  mood: {
    ambient: { color: string; intensity: number };
    sun: { color: string; intensity: number; position: [number, number, number] };
  };
}

export const EQ_MODES: Record<EqMode, EqPalette> = {
  neon: {
    // soft teal → periwinkle → orchid (easy on the eyes)
    bottom: '#4fb8c8',
    mid: '#7f8fd8',
    top: '#b47ad6',
    accent: '#a98ae0',
    floor: '#13131c',
    slab: '#0b0b12',
    cabinet: '#2c2c3a',
    mood: { ambient: { color: '#8a8ab8', intensity: 0.65 }, sun: { color: '#b0b6ff', intensity: 1.0, position: [22, 48, 28] } },
  },
  retro: {
    // classic hi-fi meter: green → amber → red, warm wooden cabinets
    bottom: '#5cb85c',
    mid: '#e8c040',
    top: '#d9503a',
    accent: '#e8a030',
    floor: '#15110d',
    slab: '#0c0906',
    cabinet: '#3a2e24',
    mood: { ambient: { color: '#ffd8b0', intensity: 0.6 }, sun: { color: '#ffc890', intensity: 1.1, position: [30, 36, 20] } },
  },
  mono: {
    bottom: '#5a5a66',
    mid: '#a0a0aa',
    top: '#ffffff',
    accent: '#e03a3a',
    floor: '#111113',
    slab: '#08080a',
    cabinet: '#2c2c34',
    mood: { ambient: { color: '#ffffff', intensity: 0.6 }, sun: { color: '#ffffff', intensity: 1.0, position: [22, 48, 28] } },
  },
};

/** 3-stop gradient as hex. */
function gradHex(pal: EqPalette, t: number) {
  const c =
    t < 0.5
      ? new THREE.Color(pal.bottom).lerp(new THREE.Color(pal.mid), t * 2)
      : new THREE.Color(pal.mid).lerp(new THREE.Color(pal.top), t * 2 - 1);
  return '#' + c.getHexString();
}

const BAR_LUM = 62;
const CABINET_H = 2.4;
const BPM = 120;

type Kind = 'bar' | 'cab' | 'core';

export interface EqLayout {
  size: number;
  half: number;
  kind: Kind[];
  height: number[];
  barH: number;
}

export function eqLayout(modules: DarkModule[], size: number): EqLayout {
  const barH = size * 0.34;
  const kind: Kind[] = [];
  const height: number[] = [];
  modules.forEach((m) => {
    const local = finderLocal(m.r, m.c, size);
    if (local) {
      const [fr, fc] = local;
      kind.push(fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4 ? 'core' : 'cab');
      height.push(CABINET_H);
    } else {
      kind.push('bar');
      height.push(barH);
    }
  });
  return { size, half: size / 2, kind, height, barH };
}

export function eqVoxelTargets(modules: DarkModule[], size: number) {
  const L = eqLayout(modules, size);
  return modules.map((m, i) => {
    const h = L.height[i];
    return { x: m.c - L.half + 0.5, y: h / 2, z: m.r - L.half + 0.5, scaleX: 1.13, scaleY: h / 0.88, scaleZ: 1.13 };
  });
}

/** Kick drum envelope: sharp hit on each beat, decaying fast. */
function beatAt(t: number) {
  const phase = (t * BPM) / 60;
  return Math.exp(-(phase - Math.floor(phase)) * 6);
}

/** LED bar material: segmented gradient that glows in the side view (top view: plain QR colour). */
function createBarMaterial(pal: EqPalette, barH: number) {
  const uniforms = {
    uSide: { value: 0 },
    uBeat: { value: 0 },
    uBottom: { value: new THREE.Color(pal.bottom) },
    uMid: { value: new THREE.Color(pal.mid) },
    uTop: { value: new THREE.Color(pal.top) },
    uHmax: { value: barH * 1.15 },
  };
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.1 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader =
      'varying vec3 vEqPos;\n' +
      shader.vertexShader.replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vec4 eqWp = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          eqWp = instanceMatrix * eqWp;
        #endif
        vEqPos = (modelMatrix * eqWp).xyz;`
      );
    shader.fragmentShader =
      `varying vec3 vEqPos;
      uniform float uSide;
      uniform float uBeat;
      uniform vec3 uBottom;
      uniform vec3 uMid;
      uniform vec3 uTop;
      uniform float uHmax;
      ` +
      shader.fragmentShader
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          float eqT = clamp(vEqPos.y / uHmax, 0.0, 1.0);
          vec3 eqGrad = eqT < 0.5 ? mix(uBottom, uMid, eqT * 2.0) : mix(uMid, uTop, eqT * 2.0 - 1.0);
          float eqSeg = step(0.16, fract(vEqPos.y / 0.32));
          diffuseColor.rgb = mix(diffuseColor.rgb, eqGrad * mix(0.18, 0.9, eqSeg), uSide);`
        )
        .replace(
          '#include <emissivemap_fragment>',
          `#include <emissivemap_fragment>
          totalEmissiveRadiance += eqGrad * eqSeg * uSide * (0.32 + 0.28 * uBeat);`
        );
  };
  material.customProgramCacheKey = () => 'qr-eq-bar';
  return { material, uniforms };
}

export class EqualizerDecor implements StageScene {
  public readonly group = new THREE.Group();
  public readonly voxelMaterial: THREE.MeshStandardMaterial;
  public readonly targets: { x: number; y: number; z: number; scaleX: number; scaleY: number; scaleZ: number }[];
  public readonly animated = true;
  public readonly voxelSideWindow: [number, number] = [0.3, 0.65];
  private barUniforms: ReturnType<typeof createBarMaterial>['uniforms'];
  private layout: EqLayout;
  private pal: EqPalette;
  private disposables: { dispose(): void }[] = [];
  private grow: GrowSet;
  private tiles: { x: number; z: number; r: number; c: number }[] = [];
  private tileMesh!: THREE.InstancedMesh;
  private tileQr: THREE.Color[] = [];
  private slabMat!: THREE.MeshStandardMaterial;
  private bars: number[] = [];
  private caps!: THREE.InstancedMesh;
  private capMat!: THREE.MeshStandardMaterial;
  private woofers: { cone: THREE.Mesh; cap: THREE.Mesh; ring: THREE.Mesh; y: number }[] = [];
  private ringMat!: THREE.MeshStandardMaterial;

  constructor(
    private modules: DarkModule[],
    private matrix: boolean[][],
    private size: number,
    mode: EqMode
  ) {
    this.layout = eqLayout(modules, size);
    this.pal = EQ_MODES[mode];
    const bm = createBarMaterial(this.pal, this.layout.barH);
    this.voxelMaterial = bm.material;
    this.barUniforms = bm.uniforms;
    this.targets = eqVoxelTargets(modules, size);
    this.modules.forEach((_, i) => this.layout.kind[i] === 'bar' && this.bars.push(i));
    this.grow = new GrowSet(this.group, (o) => this.track(o));
    this.build();
  }

  get maxHeight() {
    return this.layout.barH * 1.25 + 1;
  }

  private track<T extends { dispose(): void }>(o: T): T {
    this.disposables.push(o);
    return o;
  }

  voxelColor(i: number) {
    const k = this.layout.kind[i];
    const m = this.modules[i];
    let hue: string;
    let side: string;
    if (k !== 'bar') {
      // speaker cabinets: one dark colour in the QR and in the side view — nothing changes on switch
      return { qr: this.pal.cabinet, side: this.pal.cabinet };
    }
    // QR: spectrum gradient from bass (left) to treble (right)
    hue = gradHex(this.pal, m.c / (this.size - 1));
    side = hue;
    return { qr: atLuminance(hue, BAR_LUM + (rand(i * 5 + 17) - 0.5) * 8), side };
  }

  growDelay(i: number) {
    // bars shoot up in a wave from the centre
    const m = this.modules[i];
    const d = Math.hypot(m.c - this.size / 2, m.r - this.size / 2) / (this.size / 2);
    return 0.04 + d * 0.3 + rand(i * 7 + 3) * 0.04;
  }

  /** Cabinet voxels hand over to the speaker models; bars stay (they are the bars). */
  voxelSideScale(i: number): [number, number, number] {
    return this.layout.kind[i] === 'bar' ? [1, 1, 1] : [0, 0, 0];
  }

  /** Spectrum: per-column frequency band, rows add a little phase, every beat kicks the bass. */
  private level(i: number, t: number) {
    const m = this.modules[i];
    const b = m.c / (this.size - 1);
    const w1 = 0.5 + 0.5 * Math.sin(t * (1.7 + b * 5.3) + m.c * 0.9 + m.r * 0.15);
    const w2 = 0.5 + 0.5 * Math.sin(t * (3.1 + b * 8.7) + m.c * 1.7 - m.r * 0.35);
    const kick = beatAt(t) * (1 - b) * 0.75;
    return 0.12 + 0.78 * (0.55 * w1 + 0.45 * w2) * (1 - 0.4 * b) + kick;
  }

  voxelDance(i: number, t: number) {
    return this.layout.kind[i] === 'bar' ? this.level(i, t) : 1;
  }

  private build() {
    const N = this.size;
    const half = N / 2;
    const slabW = N + 2.4;
    this.slabMat = this.track(new THREE.MeshStandardMaterial({ color: NEUTRAL_LIGHT.slab, roughness: 0.6 }));
    const slab = new THREE.Mesh(this.track(new THREE.BoxGeometry(slabW, 0.9, slabW)), this.slabMat);
    slab.position.y = -0.45;
    slab.receiveShadow = true;
    this.group.add(slab);

    // stage floor on light modules
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!this.matrix[r][c]) this.tiles.push({ x: c - half + 0.5, z: r - half + 0.5, r, c });
    this.tileMesh = new THREE.InstancedMesh(
      this.track(new THREE.BoxGeometry(0.98, 0.06, 0.98)),
      this.track(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.2 })),
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
      this.tileMesh.setColorAt(i, this.tileQr[i]);
    });
    this.group.add(this.tileMesh);

    this.buildSpeakers();
    this.buildCaps();
    this.update(0, 0);
  }

  /** Subwoofer cabinets over the finder squares, cone facing up, neon ring around it. */
  private buildSpeakers() {
    const N = this.size;
    const half = N / 2;
    const origins: [number, number][] = [
      [0, 0],
      [0, N - 7],
      [N - 7, 0],
    ];
    const cabinets: GrowItem[] = [];
    this.ringMat = this.track(new THREE.MeshStandardMaterial({ color: this.pal.accent, emissive: this.pal.accent, emissiveIntensity: 0 }));
    const coneMat = this.track(new THREE.MeshStandardMaterial({ color: '#2a2a34', roughness: 0.8 }));
    const capMat = this.track(new THREE.MeshStandardMaterial({ color: '#3a3a46', roughness: 0.5, metalness: 0.3 }));
    const coneGeo = this.track(new THREE.CylinderGeometry(2.0, 1.1, 0.35, 32, 1, true));
    const capGeo = this.track(new THREE.SphereGeometry(0.75, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2));
    const ringGeo = this.track(new THREE.TorusGeometry(2.25, 0.08, 8, 48));
    origins.forEach(([r0, c0], fi) => {
      const cx = c0 + 3.5 - half;
      const cz = r0 + 3.5 - half;
      const base = new THREE.Vector3(cx, 0, cz);
      cabinets.push({
        matrix: new THREE.Matrix4().compose(new THREE.Vector3(cx, CABINET_H / 2, cz), new THREE.Quaternion(), new THREE.Vector3(6.9, CABINET_H, 6.9)),
        color: this.pal.cabinet,
        delay: 0.18 + fi * 0.03,
        pivot: base,
      });
      const y = CABINET_H;
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(cx, y - 0.1, cz);
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(cx, y - 0.25, cz);
      const ring = new THREE.Mesh(ringGeo, this.ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(cx, y + 0.04, cz);
      [cone, cap, ring].forEach((o) => {
        o.visible = false;
        this.group.add(o);
      });
      this.woofers.push({ cone, cap, ring, y });
    });
    this.grow.add(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.15 }), cabinets);
  }

  /** Bright top segment of every bar — sits on the bar and moves with it. */
  private buildCaps() {
    this.capMat = this.track(new THREE.MeshStandardMaterial({ color: this.pal.top, emissive: this.pal.top, emissiveIntensity: 0.45 }));
    this.caps = new THREE.InstancedMesh(this.track(new THREE.BoxGeometry(0.98, 0.1, 0.98)), this.capMat, Math.max(1, this.bars.length));
    this.caps.count = this.bars.length;
    this.caps.visible = false;
    this.group.add(this.caps);
  }

  applyLighting(e: number, ambient: THREE.AmbientLight, sun: THREE.DirectionalLight, point: THREE.PointLight) {
    lerpStageLighting(e, this.pal.mood, ambient, sun, point);
    this.slabMat.color.set(NEUTRAL_LIGHT.slab).lerp(new THREE.Color(this.pal.slab), e);
    this.barUniforms.uSide.value = THREE.MathUtils.smoothstep(e, 0.2, 0.8);
  }

  update(growth: number, time: number) {
    this.grow.update(growth);
    const beat = beatAt(time);
    const side = THREE.MathUtils.smoothstep(growth, 0.2, 0.8);
    this.barUniforms.uBeat.value = beat * side;

    // floor: white mosaic (QR) → dark stage, flashing a checker pattern on the beat
    const floor = new THREE.Color(this.pal.floor);
    const flash = new THREE.Color(this.pal.accent);
    const c = new THREE.Color();
    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i];
      c.copy(floor);
      if ((t.r + t.c) % 2 === 0) c.lerp(flash, 0.18 * beat);
      c.lerp(this.tileQr[i], 1 - side);
      this.tileMesh.setColorAt(i, c);
    }
    if (this.tileMesh.instanceColor) this.tileMesh.instanceColor.needsUpdate = true;

    // woofers pump with the kick
    const show = THREE.MathUtils.smoothstep(growth, 0.45, 0.8);
    this.woofers.forEach((w) => {
      [w.cone, w.cap, w.ring].forEach((o) => (o.visible = show > 0.01));
      const s = Math.max(0.001, show);
      w.cone.scale.set(s * (1 + beat * 0.05), s, s * (1 + beat * 0.05));
      w.cap.scale.setScalar(s);
      w.cap.position.y = w.y - 0.25 + beat * 0.18 * show;
      w.ring.scale.setScalar(s);
    });
    this.ringMat.emissiveIntensity = (0.8 + 1.6 * beat) * show;

    // top caps ride on the bars (no peak hold: nothing floats or falls from above)
    const capsOn = THREE.MathUtils.smoothstep(growth, 0.8, 1);
    this.caps.visible = capsOn > 0.01;
    if (this.caps.visible) {
      const m4 = new THREE.Matrix4();
      const H = this.layout.barH;
      this.bars.forEach((i, k) => {
        const lvl = this.level(i, time);
        const m = this.modules[i];
        m4.compose(
          new THREE.Vector3(m.c - this.layout.half + 0.5, H * THREE.MathUtils.lerp(1, lvl, THREE.MathUtils.smoothstep(growth, 0.55, 1)) + 0.05, m.r - this.layout.half + 0.5),
          new THREE.Quaternion(),
          new THREE.Vector3(capsOn, capsOn, capsOn)
        );
        this.caps.setMatrixAt(k, m4);
      });
      this.caps.instanceMatrix.needsUpdate = true;
    }
  }

  dispose() {
    this.group.removeFromParent();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
}
