import * as THREE from 'three';
import { generateQrMatrix, isFinderPattern } from './qrMatrix';
import { generateTargetShapePositions, type TargetShapeType } from './shapes';

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
    name: 'Изумруд и Сливки',
    subtitle: 'Бархатный изумруд на сливочном подиуме',
    bgColor: '#f6f4ee',
    groundColor: '#ffffff',
    voxelColor: '#064e3b',
    accentColor: '#059669',
    finderColor: '#10b981',
    isDark: false,
  },
  'terracotta-clay': {
    id: 'terracotta-clay',
    name: 'Терракота и Крем',
    subtitle: 'Теплый глиняный акцент и карамель',
    bgColor: '#f6f3ee',
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
    bgColor: '#f6f4ee',
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
}

export class QrMorphViewer {
  private container: HTMLElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private instancedMesh!: THREE.InstancedMesh;
  private groundMesh!: THREE.Mesh;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private pointLight!: THREE.PointLight;

  private voxels: VoxelData[] = [];
  private text: string;
  private shape: TargetShapeType;
  private theme: ThemeConfig;
  private state: 'qr' | 'morphed' = 'qr';
  private morphProgress = 0; // 0 = QR, 1 = Morphed
  private targetProgress = 0;

  private animFrameId: number | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private isVisible = true;

  // Dragging and camera controls
  private isDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;
  private rotX = 0;
  private rotY = 0;
  private targetRotX = 0;
  private targetRotY = 0;

  private onStateChange?: (state: 'qr' | 'morphed') => void;
  private onReady?: () => void;

  constructor(options: QrViewerOptions) {
    this.container = options.container;
    this.text = options.text;
    this.shape = options.shape;
    this.theme = THEMES[options.themeId] || THEMES['velvet-emerald'];
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

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 36, 42);
    this.camera.lookAt(0, 0, 0);

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
      this.theme.isDark ? 0xffffff : 0xf1f5f9,
      this.theme.isDark ? 0.7 : 1.25
    );
    this.scene.add(this.ambientLight);

    // Key light (soft warm top-right)
    this.dirLight = new THREE.DirectionalLight(0xffffff, this.theme.isDark ? 1.5 : 1.5);
    this.dirLight.position.set(22, 45, 26);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.bias = -0.001;
    this.scene.add(this.dirLight);

    // Rim/Accent light for edge reflections
    this.pointLight = new THREE.PointLight(this.theme.accentColor, this.theme.isDark ? 2 : 1.5, 70);
    this.pointLight.position.set(-18, 22, -18);
    this.scene.add(this.pointLight);

    // 4. Ground pedestal (tactile ceramic cylinder)
    const groundGeo = new THREE.CylinderGeometry(20, 20.8, 1.2, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.theme.groundColor,
      roughness: this.theme.isDark ? 0.4 : 0.55,
      metalness: this.theme.isDark ? 0.3 : 0.06,
    });
    this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
    this.groundMesh.position.y = -0.7;
    this.groundMesh.receiveShadow = true;
    this.scene.add(this.groundMesh);

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
    const targetPositions = generateTargetShapePositions(this.shape, count, size);

    // Cube geometry
    const cubeSize = 0.88;
    const boxGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // Material
    const voxelMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, // colored via instanceColor
      roughness: 0.25,
      metalness: 0.35,
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
      const target = targetPositions[i] || { x: 0, y: 0, z: 0 };

      // QR position centered
      const qrX = c - halfSize + 0.5;
      const qrZ = r - halfSize + 0.5;
      const qrY = 0.5;

      const dist = Math.hypot(qrX, qrZ);
      const waveDelay = (dist / (halfSize * 1.4)) * 0.45;

      this.voxels.push({
        qrX,
        qrY,
        qrZ,
        qrScaleX: 1,
        qrScaleY: 1,
        qrScaleZ: 1,
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
      if (isFinder) {
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
      const localT = THREE.MathUtils.clamp(
        (this.morphProgress - v.waveDelay) / (1 - v.waveDelay || 0.001),
        0,
        1
      );
      // Smooth cubic ease in out
      const ease = localT < 0.5 ? 4 * localT * localT * localT : 1 - Math.pow(-2 * localT + 2, 3) / 2;

      // Parabolic arc for vertical explosion effect during transition
      const arcLift = Math.sin(localT * Math.PI) * 5.0;

      const x = THREE.MathUtils.lerp(v.qrX, v.targetX, ease);
      const y = THREE.MathUtils.lerp(v.qrY, v.targetY, ease) + arcLift;
      const z = THREE.MathUtils.lerp(v.qrZ, v.targetZ, ease);

      const sx = THREE.MathUtils.lerp(v.qrScaleX, v.targetScaleX, ease);
      const sy = THREE.MathUtils.lerp(v.qrScaleY, v.targetScaleY, ease);
      const sz = THREE.MathUtils.lerp(v.qrScaleZ, v.targetScaleZ, ease);

      dummy.position.set(x, y, z);
      dummy.scale.set(sx, sy, sz);

      // Add dynamic rotation during morph
      if (localT > 0 && localT < 1) {
        dummy.rotation.x = localT * Math.PI * 2;
        dummy.rotation.y = localT * Math.PI;
      } else {
        dummy.rotation.set(0, 0, 0);
      }

      dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  public toggleState() {
    this.setState(this.state === 'qr' ? 'morphed' : 'qr');
  }

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
      mat.color.set(this.theme.groundColor);
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

    // Pointer down
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;
    };

    // Pointer move
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (this.isDragging) {
        const deltaX = clientX - this.prevMouseX;
        const deltaY = clientY - this.prevMouseY;

        this.targetRotY += deltaX * 0.01;
        this.targetRotX += deltaY * 0.01;
        // Limit pitch
        this.targetRotX = Math.max(-0.6, Math.min(0.8, this.targetRotX));

        this.prevMouseX = clientX;
        this.prevMouseY = clientY;
      } else if (this.state === 'qr') {
        // Subtle parallax hover when in QR mode
        const rect = el.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((clientY - rect.top) / rect.height - 0.5) * 2;
        this.targetRotY = normX * 0.15;
        this.targetRotX = normY * 0.15;
      }
    };

    // Pointer up
    const onPointerUp = () => {
      this.isDragging = false;
      if (this.state === 'qr') {
        this.targetRotX = 0;
        this.targetRotY = 0;
      }
    };

    // Click handler to trigger morph
    let startX = 0;
    let startY = 0;
    el.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      onPointerDown(e);
    });

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', (e) => {
      onPointerUp();
      const dist = Math.hypot(e.clientX - startX, e.clientY - startY);
      // If it wasn't a drag gesture, toggle morph!
      if (dist < 6) {
        this.toggleState();
      }
    });

    // Resize
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
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

    // 1. Progress interpolation
    const diff = this.targetProgress - this.morphProgress;
    if (Math.abs(diff) > 0.001) {
      this.morphProgress += diff * 0.08;
      this.updateMeshTransforms();
    } else {
      this.morphProgress = this.targetProgress;
    }

    // 2. Camera / Scene rotation
    if (this.state === 'morphed' && !this.isDragging) {
      // Idle slow ambient rotation
      this.targetRotY += 0.005;
    }

    this.rotX += (this.targetRotX - this.rotX) * 0.1;
    this.rotY += (this.targetRotY - this.rotY) * 0.1;

    if (this.instancedMesh) {
      this.instancedMesh.rotation.y = this.rotY;
      this.instancedMesh.rotation.x = this.rotX;
    }
    if (this.groundMesh) {
      this.groundMesh.rotation.y = this.rotY;
      this.groundMesh.rotation.x = this.rotX;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public exportSnapshot(): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  public destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.container.innerHTML = '';
  }
}
