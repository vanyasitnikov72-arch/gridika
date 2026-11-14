import * as THREE from 'three';
import { generateQrMatrix, isFinderPattern } from '../engine/qrMatrix';
import { CastleDecor } from '../engine/castleScene';

export function initCastleWidget(containerId: string, options: { url?: string; height?: number; mode?: 'day' | 'night' | 'winter' } = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const url = options.url || 'https://gridika.ru';
  const height = options.height || 480;
  const castleMode = options.mode || 'day';
  const { modules, size } = generateQrMatrix(url);

  const darkCoords: { r: number; c: number; isFinder: boolean }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c]) {
        darkCoords.push({ r, c, isFinder: isFinderPattern(r, c, size) });
      }
    }
  }

  const width = container.clientWidth || 480;

  // 1. Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1f17);

  // 2. Camera (Orthographic for perfect QR scanning from above and isometric 3D)
  const aspect = width / height;
  const orthoCam = new THREE.OrthographicCamera(-20 * aspect, 20 * aspect, 20, -20, 0.1, 1000);

  // 3. Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 4. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xfff2dc, 2.6);
  dirLight.position.set(22, 48, 28);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.left = -22;
  dirLight.shadow.camera.right = 22;
  dirLight.shadow.camera.top = 22;
  dirLight.shadow.camera.bottom = -22;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0x22d38e, 0, 50);
  scene.add(pointLight);

  // 5. Castle Decor (slab, courtyard, battlements, keeps with roofs & waving flags, moat, drawbridge)
  const castleDecor = new CastleDecor(darkCoords, modules, size, castleMode);
  scene.add(castleDecor.group);

  // 6. Instanced Mesh for Wall Voxels
  const count = darkCoords.length;
  const boxGeo = new THREE.BoxGeometry(0.88, 0.88, 0.88);
  const instancedMesh = new THREE.InstancedMesh(boxGeo, castleDecor.voxelMaterial, count);
  instancedMesh.castShadow = true;
  instancedMesh.receiveShadow = true;

  const targetPositions = castleDecor.targets;
  const halfSize = size / 2;

  interface VoxelItem {
    qrX: number;
    qrY: number;
    qrZ: number;
    targetX: number;
    targetY: number;
    targetZ: number;
    targetScaleX: number;
    targetScaleY: number;
    targetScaleZ: number;
    waveDelay: number;
    qrColor: THREE.Color;
    sideColor: THREE.Color;
  }

  const voxels: VoxelItem[] = [];
  const colorObj = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const { r, c } = darkCoords[i];
    const target = targetPositions[i] || { x: 0, y: 0, z: 0, scaleX: 1, scaleY: 1, scaleZ: 1 };
    const qrX = c - halfSize + 0.5;
    const qrZ = r - halfSize + 0.5;
    const qrY = 0.5;
    const waveDelay = castleDecor.growDelay(i);
    const cc = castleDecor.voxelColor(i);

    voxels.push({
      qrX,
      qrY,
      qrZ,
      targetX: target.x,
      targetY: target.y,
      targetZ: target.z,
      targetScaleX: target.scaleX ?? 1,
      targetScaleY: target.scaleY ?? 1,
      targetScaleZ: target.scaleZ ?? 1,
      waveDelay,
      qrColor: new THREE.Color(cc.qr),
      sideColor: new THREE.Color(cc.side),
    });

    colorObj.set(cc.side);
    instancedMesh.setColorAt(i, colorObj);
  }
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  scene.add(instancedMesh);

  // 7. Interactive State (starts in 3D Castle state: viewT = 1)
  let targetProgress = 1;
  let viewT = 1;
  let treeView = 1;
  let rotOffset = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let prevX = 0;
  let clock = new THREE.Clock();

  function updateTransforms() {
    const dummy = new THREE.Object3D();
    const e = viewT;
    const color = new THREE.Color();

    for (let i = 0; i < voxels.length; i++) {
      const v = voxels[i];
      const localT = THREE.MathUtils.clamp((e - v.waveDelay) / (1 - v.waveDelay || 0.001), 0, 1);
      const ease = localT < 0.5 ? 4 * localT * localT * localT : 1 - Math.pow(-2 * localT + 2, 3) / 2;
      const arc = Math.sin(localT * Math.PI) * 4.5;

      const x = v.qrX + (v.targetX - v.qrX) * ease;
      const y = v.qrY + (v.targetY - v.qrY) * ease + arc;
      const z = v.qrZ + (v.targetZ - v.qrZ) * ease;

      const sx = 1.142 + (v.targetScaleX - 1.142) * ease;
      const sy = 1 + (v.targetScaleY - 1) * ease;
      const sz = 1.142 + (v.targetScaleZ - 1.142) * ease;

      dummy.position.set(x, y, z);
      dummy.scale.set(sx, sy, sz);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      color.copy(v.qrColor).lerp(v.sideColor, e);
      instancedMesh.setColorAt(i, color);
    }
    instancedMesh.instanceMatrix.needsUpdate = true;
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    castleDecor.applyLighting(e, ambientLight, dirLight, pointLight);
    castleDecor.update(e, clock.getElapsedTime());
  }

  // Camera setup
  function updateCamera() {
    const e = viewT;
    const stageH = castleDecor.maxHeight;
    const elev = THREE.MathUtils.lerp(Math.PI / 2 - 1e-4, THREE.MathUtils.degToRad(32), e);
    const yaw = THREE.MathUtils.lerp(0, Math.PI / 4, e) + rotOffset;
    const target = new THREE.Vector3(0, THREE.MathUtils.lerp(0, stageH * 0.4, e), 0);
    const D = 200;

    orthoCam.position.set(
      target.x + D * Math.cos(elev) * Math.sin(yaw),
      target.y + D * Math.sin(elev),
      target.z + D * Math.cos(elev) * Math.cos(yaw)
    );
    orthoCam.up.set(0, 1, 0);
    orthoCam.lookAt(target);

    const w = container.clientWidth || 480;
    const h = container.clientHeight || height;
    const asp = w / h;
    const fitW = THREE.MathUtils.lerp((size + 2.4) * 1.56, size * 1.62 + 4, e);
    const fitH = THREE.MathUtils.lerp((size + 2.4) * 1.56, stageH * 1.18 + 4, e);
    const vh = Math.max(fitH, fitW / asp);

    orthoCam.left = (-vh * asp) / 2;
    orthoCam.right = (vh * asp) / 2;
    orthoCam.top = vh / 2;
    orthoCam.bottom = -vh / 2;
    orthoCam.updateProjectionMatrix();
  }

  // Initial update
  updateTransforms();
  updateCamera();

  // Mouse / Touch events: Click toggles QR ⟷ Castle; Drag rotates
  const canvas = renderer.domElement;
  canvas.style.cursor = 'grab';

  canvas.addEventListener('pointerdown', (ev) => {
    isDragging = true;
    startX = prevX = ev.clientX;
    startY = ev.clientY;
    canvas.style.cursor = 'grabbing';
  });

  window.addEventListener('pointermove', (ev) => {
    if (!isDragging) return;
    const dx = ev.clientX - prevX;
    rotOffset += dx * 0.008;
    prevX = ev.clientX;
  });

  window.addEventListener('pointerup', (ev) => {
    if (!isDragging) return;
    isDragging = false;
    canvas.style.cursor = 'grab';
    const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
    if (dist < 6) {
      targetProgress = targetProgress === 1 ? 0 : 1;
      if (targetProgress === 0) rotOffset = 0; // Reset rotation so QR is square and easily scannable
    }
  });

  // Render loop
  let lastTime = performance.now() / 1000;
  function animate() {
    requestAnimationFrame(animate);

    const now = performance.now() / 1000;
    const dt = Math.min(0.05, now - lastTime);
    lastTime = now;

    if (viewT !== targetProgress) {
      const step = dt / 1.15;
      viewT = targetProgress > viewT ? Math.min(targetProgress, viewT + step) : Math.max(targetProgress, viewT - step);
      updateTransforms();
    } else {
      castleDecor.update(viewT, clock.getElapsedTime());
    }

    if (targetProgress === 1 && !isDragging) {
      rotOffset += 0.002; // Gentle slow rotation in 3D mode
    }

    updateCamera();
    renderer.render(scene, orthoCam);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = container.clientWidth || 480;
    const h = container.clientHeight || height;
    renderer.setSize(w, h);
    updateCamera();
  });
}
