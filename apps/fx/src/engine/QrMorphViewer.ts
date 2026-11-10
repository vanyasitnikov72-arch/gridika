import * as THREE from 'three';
import { generateQrMatrix, isFinderPattern } from './qrMatrix';
import { generateTargetShapePositions, type TargetShapeType } from './shapes';
import { TreeDecor, treeVoxelColor, treeVoxelSideColor, type TreeSeason } from './treeScene';
import { CityDecor, type TimeOfDay } from './cityScene';
import { IslandDecor, type IslandMode } from './islandScene';
import { resetStageLighting, type StageScene } from './stageScene';

export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  bgColor: string;
  groundColor: string;
  voxelColor: string;
  accentColor: string;
  finderColor: string;
  isDark: boolean;
}

export const THEMES: Record<string, ThemeConfig> = {
  'velvet-emerald': {
    id: 'velvet-emerald',
    name: 'Fresh Mint',
    subtitle: 'Свежая мята и сосновый акцент',
    bgColor: '#F0EBE9',
    groundColor: '#fcfbf9',
    voxelColor: '#19C37D',
    accentColor: '#22d38e',
    finderColor: '#132A22',
    isDark: false,
  },
  'terracotta-clay': {
    id: 'terracotta-clay',
    name: 'Терракота и Крем',
    subtitle: 'Теплый глиняный акцент и карамель',
    bgColor: '#F0EBE9',
    groundColor: '#ffffff',
    voxelColor: '#3d2516',
    accentColor: '#ea580c',
    finderColor: '#f97316',
    isDark: false,
  },
  'espresso-cream': {
    id: 'espresso-cream',
    name: 'Эспрессо и Фарфор',
    subtitle: 'Глубокий темный кофе на молочном',
    bgColor: '#F0EBE9',
    groundColor: '#ffffff',
    voxelColor: '#201e1c',
    accentColor: '#57534e',
    finderColor: '#292524',
    isDark: false,
  },
  'soft-indigo': {
    id: 'soft-indigo',
    name: 'Кобальт и Лаванда',
    subtitle: 'Мягкий пастельный индиго',
    bgColor: '#f4f4f8',
    groundColor: '#ffffff',
    voxelColor: '#1e1b4b',
    accentColor: '#4f46e5',
    finderColor: '#6366f1',
    isDark: false,
  },
  'dark-obsidian': {
    id: 'dark-obsidian',
    name: 'Глубокий Обсидиан',
    subtitle: 'Контрастный темный графит',
    bgColor: '#161514',
    groundColor: '#23201d',
    voxelColor: '#3f3a36',
    accentColor: '#10b981',
    finderColor: '#34d399',
    isDark: true,
  },
};

export interface QrViewerOptions {
  container: HTMLElement;
  text: string;
  shape: TargetShapeType;
  themeId: string;
  autoRotate?: boolean;
  season?: TreeSeason;
  timeOfDay?: TimeOfDay;
  islandMode?: IslandMode;
  onStateChange?: (state: 'qr' | 'morphed') => void;
  onReady?: () => void;
}

interface VoxelData {
  // Base QR position
  qrX: number;
  qrY: number;
  qrZ: number;
  qrScaleX: number;
  qrScaleY: number;
  qrScaleZ: number;

  // Morphed 3D position
  targetX: number;
  targetY: number;
  targetZ: number;
  targetScaleX: number;
  targetScaleY: number;
  targetScaleZ: number;

  // Animation delay based on distance
  waveDelay: number;
  isFinder: boolean;

  // QR Tree: colour in the top view (QR) and in the side view (pale bloom / bright grass)
  qrColor?: THREE.Color;
  sideColor?: THREE.Color;
  /** Extra scale in the side view (crown cubes shrink a bit so the bloom reads softer). */
  sideScale?: number;
}

export class QrMorphViewer {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  /** QR Tree uses a parallel (orthographic) camera so the crown projects exactly onto the QR grid. */
  private orthoCam!: THREE.OrthographicCamera;
  /** Tree view tween: 0 = straight top-down (QR), 1 = isometric side view (tree). */
  private viewT = 0;
  /** Eased tree view progress (0 top-down QR … 1 side view); also drives decor growth. */
  private treeView = 0;
  private lastFrameTime = 0;
  private instancedMesh!: THREE.InstancedMesh;
  private groundMesh!: THREE.Mesh;
  /** Square slab podium shared by every shape (the tree brings its own inside TreeDecor). */
  private slabMesh: THREE.Mesh | null = null;
  /** Highest point of the current shape — frames the side view. */
  private stageTop = 10;
  /** Flat shapes (phone, heart) are turned to face the 45° side-view camera. */
  private faceYaw = 0;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

  private voxels: VoxelData[] = [];
  private text: string;
  private shape: TargetShapeType;
  private theme: ThemeConfig;
  private state: 'qr' | 'morphed' = 'qr';
  private season: TreeSeason = 'spring';
  private treeDecor: TreeDecor | null = null;
  /** Themed diorama scene (city, island, …) — null for the tree and plain shapes. */
  private stageScene: StageScene | null = null;
  private timeOfDay: TimeOfDay = 'day';
  private islandMode: IslandMode = 'summer';
  private qrSize = 25;
  private clock = new THREE.Clock();
  private morphProgress = 0; // 0 = QR, 1 = Morphed
  private targetProgress = 0;

  private animFrameId: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;
  private onPointerDownHandler?: (e: PointerEvent) => void;
  private onPointerUpHandler?: (e: PointerEvent) => void;
  private onResizeHandler?: () => void;


  private onStateChange?: (state: 'qr' | 'morphed') => void;
  private onReady?: () => void;

  constructor(options: QrViewerOptions) {
    this.container = options.container;
    this.text = options.text;
    this.shape = options.shape;
    this.theme = THEMES[options.themeId] || THEMES['velvet-emerald'];
    this.season = options.season ?? 'spring';
    this.timeOfDay = options.timeOfDay ?? 'day';
    this.islandMode = options.islandMode ?? 'summer';
    this.onStateChange = options.onStateChange;
    this.onReady = options.onReady;

    this.init();
  }

  private init() {
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;

    // 1. Scene & Camera (transparent canvas for organic spill background)
    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    this.camera.position.set(0, 46, 56);
    this.camera.lookAt(0, 3.5, 0);
    this.orthoCam = new THREE.OrthographicCamera(-20, 20, 20, -20, 0.1, 1000);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting (balanced for tactile Soft 3D studio aesthetic)
    this.ambientLight = new THREE.AmbientLight(
      this.theme.isDark ? 0xffffff : 0xfcfbf9,
      this.theme.isDark ? 0.7 : 1.35
    );
    this.scene.add(this.ambientLight);

    // Key light (soft warm top-right)
    this.dirLight = new THREE.DirectionalLight(0xffffff, this.theme.isDark ? 1.5 : 1.6);
    this.dirLight.position.set(22, 48, 28);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.bias = -0.001;
    this.dirLight.shadow.camera.left = -22;
    this.dirLight.shadow.camera.right = 22;
    this.dirLight.shadow.camera.top = 22;
    this.dirLight.shadow.camera.bottom = -22;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 120;
    this.scene.add(this.dirLight);

    // Rim/Accent light for edge reflections
    this.pointLight = new THREE.PointLight(this.theme.accentColor, this.theme.isDark ? 2 : 1.5, 70);
    this.pointLight.position.set(-18, 22, -18);
    this.scene.add(this.pointLight);

    // 4. Ground pedestal (tactile ceramic cylinder with soft beveled edge)
    const groundGeo = new THREE.CylinderGeometry(15.6, 16.2, 0.45, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.theme.isDark ? 0x22201e : 0xfbf9f5,
      roughness: this.theme.isDark ? 0.4 : 0.6,
      metalness: this.theme.isDark ? 0.3 : 0.04,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.position.y = -0.25;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

    // Soft shadow receiver plane underneath
    const shadowGeo = new THREE.PlaneGeometry(60, 60);
    const shadowMat = new THREE.ShadowMaterial({
      opacity: this.theme.isDark ? 0.35 : 0.08,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.27;
    shadowMesh.receiveShadow = true;
    this.scene.add(shadowMesh);

    // 5. Build QR Voxels
    this.rebuildVoxels();

    // 6. Event listeners
    this.bindEvents();

    // 7. Intersection Observer for battery optimization
    this.setupIntersectionObserver();

    // 8. Start loop
    this.animate();

    if (this.onReady) {
      this.onReady();
    }
  }

  public rebuildVoxels() {
    if (this.instancedMesh) {
      this.scene.remove(this.instancedMesh);
      this.instancedMesh.geometry.dispose();
      if (Array.isArray(this.instancedMesh.material)) {
        this.instancedMesh.material.forEach((m) => m.dispose());
      } else {
        this.instancedMesh.material.dispose();
      }
    }

    const { modules, size } = generateQrMatrix(this.text);
    const darkCoords: { r: number; c: number; isFinder: boolean }[] = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (modules[r][c]) {
          darkCoords.push({
            r,
            c,
            isFinder: isFinderPattern(r, c, size),
          });
        }
      }
    }

    const count = darkCoords.length;
    const isTree = this.shape === 'tree';
    this.qrSize = size;
    this.faceYaw = this.shape === 'phone' || this.shape === 'heart' ? Math.PI / 4 : 0;
    let targetPositions = generateTargetShapePositions(this.shape, count, size, darkCoords);

    // QR Tree decor (base slab, trunk, branches, extra leaves, grass, petals)
    if (this.treeDecor) {
      this.treeDecor.dispose();
      this.treeDecor = null;
    }
    if (isTree) {
      this.treeDecor = new TreeDecor(darkCoords, modules, size, this.season);
      this.scene.add(this.treeDecor.group);
    }
    if (this.stageScene) {
      this.stageScene.dispose();
      this.stageScene = null;
    }
    if (this.shape === 'city') this.stageScene = new CityDecor(darkCoords, modules, size, this.timeOfDay);
    else if (this.shape === 'island') this.stageScene = new IslandDecor(darkCoords, modules, size, this.islandMode);
    const isStage = !!this.stageScene;
    if (this.stageScene) {
      this.scene.add(this.stageScene.group);
      if (this.stageScene.targets) targetPositions = this.stageScene.targets;
    } else {
      resetStageLighting(this.ambientLight, this.dirLight);
    }
    // Every shape stands on the same static square slab (the old round podium is retired)
    this.groundMesh.visible = false;
    if (this.slabMesh) {
      this.slabMesh.removeFromParent();
      this.slabMesh.geometry.dispose();
      (this.slabMesh.material as THREE.Material).dispose();
      this.slabMesh = null;
    }
    if (!isTree && !isStage) {
      const slabW = size + 2.4;
      this.slabMesh = new THREE.Mesh(
        new THREE.BoxGeometry(slabW, 0.9, slabW),
        new THREE.MeshStandardMaterial({
          color: this.theme.isDark ? '#23201d' : '#f3f1ec',
          roughness: 0.85,
        })
      );
      this.slabMesh.position.y = -0.45;
      this.slabMesh.receiveShadow = true;
      this.slabMesh.castShadow = true;
      this.scene.add(this.slabMesh);
    }
    // Side-view framing height
    this.stageTop = isTree
      ? size * 0.95
      : isStage
        ? this.stageScene!.maxHeight
        : Math.max(4, ...targetPositions.map((t) => t.y + 0.44 * (t.scaleY ?? 1)));
    // Tree lighting: (ambient + sun·cosθ) ≈ π, so top faces render at their true colour —
    // light tiles stay near-white and leaves keep their tone, which gives the top-down QR its contrast
    if (isTree || !this.theme.isDark) {
      this.ambientLight.intensity = 1.25;
      this.dirLight.intensity = 2.5;
      this.pointLight.intensity = 0.4;
    } else {
      this.ambientLight.intensity = this.theme.isDark ? 0.7 : 1.15;
      this.dirLight.intensity = this.theme.isDark ? 1.5 : 1.6;
      this.pointLight.intensity = this.theme.isDark ? 2 : 1.2;
    }

    // Cube geometry
    const cubeSize = 0.88;
    const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Material
    const voxelMat = isStage
      ? this.stageScene!.voxelMaterial // scene material (facade windows, rock strata, …)
      : new THREE.MeshStandardMaterial({
          color: 0xffffff, // colored via instanceColor
          roughness: isTree ? 0.6 : 0.25,
          metalness: isTree ? 0.0 : 0.35,
        });

    this.instancedMesh = new THREE.InstancedMesh(boxGeo, voxelMat, count);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;

    this.voxels = [];
    const colorObj = new THREE.Color();
    const voxelBaseColor = new THREE.Color(this.theme.voxelColor);
    const finderColor = new THREE.Color(this.theme.finderColor);
    const accentColor = new THREE.Color(this.theme.accentColor);

    const halfSize = size / 2;

    for (let i = 0; i < count; i++) {
      const { r, c, isFinder } = darkCoords[i];
      const raw = targetPositions[i] || { x: 0, y: 0, z: 0 };
      // turn flat shapes towards the camera (it sits on the +x/+z diagonal in the side view)
      const cy = Math.cos(this.faceYaw), sy = Math.sin(this.faceYaw);
      const target = { ...raw, x: raw.x * cy + raw.z * sy, z: -raw.x * sy + raw.z * cy };

      // QR position centered
      const qrX = c - halfSize + 0.5;
      const qrZ = r - halfSize + 0.5;
      const qrY = 0.5;

      const dist = Math.hypot(qrX, qrZ);
      const waveDelay = isStage
        ? this.stageScene!.growDelay(i)
        : (dist / (halfSize * 1.4)) * 0.45;

      this.voxels.push({
        qrX,
        qrY,
        qrZ,
        // 0.88 cube × 1.13 ≈ one full module: no light seams, so the flat QR scans cleanly
        qrScaleX: 1.13,
        qrScaleY: 1,
        qrScaleZ: 1.13,
        targetX: target.x,
        targetY: target.y,
        targetZ: target.z,
        targetScaleX: target.scaleX ?? 1,
        targetScaleY: target.scaleY ?? 1,
        targetScaleZ: target.scaleZ ?? 1,
        waveDelay,
        isFinder,
      });

      // Instance coloring
      if (isTree) {
        colorObj.set(treeVoxelColor(darkCoords[i], i, size, this.season));
        const side = treeVoxelSideColor(darkCoords[i], i, size, this.season);
        const v = this.voxels[this.voxels.length - 1];
        v.qrColor = colorObj.clone();
        v.sideColor = new THREE.Color(side.color);
        v.sideScale = side.scale;
      } else if (isStage) {
        const cc = this.stageScene!.voxelColor(i);
        colorObj.set(cc.qr);
        const v = this.voxels[this.voxels.length - 1];
        v.qrColor = colorObj.clone();
        v.sideColor = new THREE.Color(cc.side);
      } else if (isFinder) {
        colorObj.copy(finderColor);
      } else if (i % 7 === 0) {
        colorObj.copy(accentColor);
      } else {
        colorObj.copy(voxelBaseColor);
      }
      this.instancedMesh.setColorAt(i, colorObj);
    }

    this.instancedMesh.instanceColor!.needsUpdate = true;
    this.scene.add(this.instancedMesh);

    // Set initial instance matrices
    this.updateMeshTransforms();
  }

  private updateMeshTransforms() {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.voxels.length; i++) {
      const v = this.voxels[i];

      // Staggered morph animation curve
      const progress = this.treeDecor ? 1 : this.morphProgress;
      const localT = THREE.MathUtils.clamp(
        (progress - v.waveDelay) / (1 - v.waveDelay || 0.001),
        0,
        1
      );
      // Smooth cubic ease in out
      const ease = localT < 0.5 ? 4 * localT * localT * localT : 1 - Math.pow(-2 * localT + 2, 3) / 2;

      // Parabolic arc for vertical explosion effect during transition (not for the city: houses grow straight up)
      const arcLift = this.stageScene ? 0 : Math.sin(localT * Math.PI) * 5.0;

      const x = THREE.MathUtils.lerp(v.qrX, v.targetX, ease);
      const y = THREE.MathUtils.lerp(v.qrY, v.targetY, ease) + arcLift;
      const z = THREE.MathUtils.lerp(v.qrZ, v.targetZ, ease);

      const sx = THREE.MathUtils.lerp(v.qrScaleX, v.targetScaleX, ease);
      const sy = THREE.MathUtils.lerp(v.qrScaleY, v.targetScaleY, ease);
      const sz = THREE.MathUtils.lerp(v.qrScaleZ, v.targetScaleZ, ease);

      dummy.position.set(x, y, z);
      // shrink a bit faster than the camera moves so the cubes are gone before the bloom settles
      const ks =
        this.treeDecor && v.sideScale !== undefined
          ? Math.max(1e-4, THREE.MathUtils.lerp(1, v.sideScale, THREE.MathUtils.smoothstep(this.treeView, 0.12, 0.6)))
          : 1;
      dummy.scale.set(sx * ks, sy * ks, sz * ks);

      // Add dynamic rotation during morph
      if (this.stageScene) {
        dummy.rotation.set(0, 0, 0);
      } else if (localT > 0 && localT < 1) {
        dummy.rotation.x = localT * Math.PI * 2;
        dummy.rotation.y = localT * Math.PI + this.faceYaw * ease;
      } else {
        dummy.rotation.set(0, localT >= 1 ? this.faceYaw : 0, 0);
      }

      dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.treeDecor || this.stageScene) {
      // QR cubes blend from saturated (scannable, top view) to their side-view look
      const c = new THREE.Color();
      for (let i = 0; i < this.voxels.length; i++) {
        const v = this.voxels[i];
        if (!v.qrColor || !v.sideColor) continue;
        c.copy(v.qrColor).lerp(v.sideColor, this.treeView);
        this.instancedMesh.setColorAt(i, c);
      }
      this.instancedMesh.instanceColor!.needsUpdate = true;
      this.treeDecor?.update(this.treeView, this.clock.getElapsedTime());
      if (this.stageScene) {
        this.stageScene.applyLighting(this.treeView, this.ambientLight, this.dirLight, this.pointLight);
        this.stageScene.update(this.treeView, this.clock.getElapsedTime());
      }
    }
  }

  public setSeason(season: TreeSeason) {
    if (season === this.season) return;
    this.season = season;
    if (this.shape === 'tree') this.rebuildVoxels();
  }

  public setIslandMode(mode: IslandMode) {
    if (mode === this.islandMode) return;
    this.islandMode = mode;
    if (this.shape === 'island') this.rebuildVoxels();
  }

  public setTimeOfDay(mode: TimeOfDay) {
    if (mode === this.timeOfDay) return;
    this.timeOfDay = mode;
    if (this.shape === 'city') this.rebuildVoxels();
  }

  public getSeason(): TreeSeason {
    return this.season;
  }

  public toggleState() {
    this.setState(this.state === 'qr' ? 'morphed' : 'qr');
  }

  /** The stage never rotates any more; kept for the UI's reset button. */
  public resetView() {}

  public setState(nextState: 'qr' | 'morphed') {
    this.state = nextState;
    this.targetProgress = nextState === 'morphed' ? 1 : 0;
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  public getState(): 'qr' | 'morphed' {
    return this.state;
  }

  public updateConfig(newText: string, newShape: TargetShapeType, newThemeId: string) {
    let needsRebuild = false;

    if (newText !== this.text || newShape !== this.shape) {
      this.text = newText;
      this.shape = newShape;
      needsRebuild = true;
    }

    if (newThemeId !== this.theme.id) {
      this.theme = THEMES[newThemeId] || THEMES['velvet-emerald'];
      const mat = this.groundMesh.material as THREE.MeshStandardMaterial;
      mat.color.set(this.theme.isDark ? 0x22201e : 0xfbf9f5);
      mat.roughness = this.theme.isDark ? 0.4 : 0.6;
      mat.metalness = this.theme.isDark ? 0.3 : 0.05;
      this.pointLight.color.set(this.theme.accentColor);
      this.pointLight.intensity = this.theme.isDark ? 2 : 1.2;
      this.ambientLight.intensity = this.theme.isDark ? 0.7 : 1.15;
      needsRebuild = true;
    }

    if (needsRebuild) {
      this.rebuildVoxels();
    }
  }

  private bindEvents() {
    const el = this.renderer.domElement;

    // The stage is static: a tap (not a drag) toggles QR ⇄ shape, nothing rotates
    let isDownOnCanvas = false;
    let startX = 0;
    let startY = 0;

    this.onPointerDownHandler = (e: PointerEvent) => {
      isDownOnCanvas = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    this.onPointerUpHandler = (e: PointerEvent) => {
      if (!isDownOnCanvas) return;
      isDownOnCanvas = false;
      const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
      // If it wasn't a drag gesture, toggle morph!
      if (dist < 6) {
        this.toggleState();
      }
    };

    this.onResizeHandler = () => {
      this.handleResize();
    };

    el.addEventListener('pointerdown', this.onPointerDownHandler);
    window.addEventListener('pointerup', this.onPointerUpHandler);
    window.addEventListener('resize', this.onResizeHandler);
  }

  public handleResize() {
    if (!this.container || !this.renderer) return;
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
    this.renderer.setSize(width, height);
  }

  private setupIntersectionObserver() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    this.intersectionObserver.observe(this.container);
  }

  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);

    if (!this.isVisible) return; // Battery saving when out of viewport!

    // Static square podium for every shape: only the camera moves between two fixed poses,
    // and the morph itself is driven by that same camera tween (see updateStageCamera)
    this.updateStageCamera();

    this.renderer.render(this.scene, this.activeCamera());
  };

  private activeCamera(): THREE.Camera {
    return this.orthoCam;
  }

  /**
   * Smooth tilt between the straight top-down view (scannable QR) and the isometric side view
   * (diamond slab, ~32°). Shared by all shapes; the voxel morph / tree growth follow the same curve.
   */
  private updateStageCamera() {
    const now = performance.now() / 1000;
    const dt = Math.min(0.05, this.lastFrameTime ? now - this.lastFrameTime : 0);
    this.lastFrameTime = now;

    const duration = 1.15;
    const goal = this.targetProgress;
    if (this.viewT !== goal) {
      const step = dt / duration;
      this.viewT = goal > this.viewT ? Math.min(goal, this.viewT + step) : Math.max(goal, this.viewT - step);
    }
    const t = this.viewT;
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // easeInOutCubic

    const N = this.qrSize;
    const treeH = this.stageTop;
    const elev = THREE.MathUtils.lerp(Math.PI / 2 - 1e-4, THREE.MathUtils.degToRad(32), e);
    const yaw = THREE.MathUtils.lerp(0, Math.PI / 4, e);
    const target = new THREE.Vector3(0, THREE.MathUtils.lerp(0, treeH * 0.4, e), 0);
    const D = 200;
    this.orthoCam.position.set(
      target.x + D * Math.cos(elev) * Math.sin(yaw),
      target.y + D * Math.sin(elev),
      target.z + D * Math.cos(elev) * Math.cos(yaw)
    );
    this.orthoCam.up.set(0, 1, 0);
    this.orthoCam.lookAt(target);

    // Fit: square slab from the top, tall tree on a diamond base from the side
    const aspect = (this.container.clientWidth || 500) / (this.container.clientHeight || 500);
    // top view: slab takes ~68% of the stage so it stays clear of the green shape on the left
    const fitW = THREE.MathUtils.lerp((N + 2.4) * 1.56, N * 1.62 + 4, e);
    const fitH = THREE.MathUtils.lerp((N + 2.4) * 1.56, treeH * 1.18 + 4, e);
    const vh = Math.max(fitH, fitW / aspect);
    // nudge the picture to the right, away from the green blob that cuts into the stage's left edge
    const shift = vh * aspect * THREE.MathUtils.lerp(0.11, 0.06, e);
    this.orthoCam.left = (-vh * aspect) / 2 - shift;
    this.orthoCam.right = (vh * aspect) / 2 - shift;
    this.orthoCam.top = vh / 2;
    this.orthoCam.bottom = -vh / 2;
    this.orthoCam.updateProjectionMatrix();

    // Detail (trunk, branches, bloom, grass blades, petals) grows in / folds away with the camera,
    // so the top view is left with nothing but the coloured QR cubes
    if (e !== this.treeView) {
      this.treeView = e;
      this.morphProgress = e;
      this.updateMeshTransforms();
    } else {
      this.treeDecor?.update(e, this.clock.getElapsedTime());
      this.stageScene?.update(e, this.clock.getElapsedTime());
    }
    // Crown shadows would grey out light modules when seen from above
    this.dirLight.shadow.intensity = THREE.MathUtils.smoothstep(e, 0.15, 0.6);
  }

  public exportSnapshot(): string {
    this.renderer.render(this.scene, this.activeCamera());
    return this.renderer.domElement.toDataURL('image/png');
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.onPointerDownHandler && this.renderer?.domElement) {
      this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDownHandler);
    }
    if (this.onPointerUpHandler) {
      window.removeEventListener('pointerup', this.onPointerUpHandler);
    }
    if (this.onResizeHandler) {
      window.removeEventListener('resize', this.onResizeHandler);
    }
    this.treeDecor?.dispose();
    this.stageScene?.dispose();
    this.renderer?.dispose();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
