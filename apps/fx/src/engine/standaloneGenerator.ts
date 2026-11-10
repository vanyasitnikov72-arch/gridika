import { generateQrMatrix, isFinderPattern } from './qrMatrix';
import { generateTargetShapePositions, type TargetShapeType } from './shapes';
import { THEMES } from './QrMorphViewer';

export interface EmbedOptions {
  text: string;
  shape: TargetShapeType;
  themeId: string;
  width?: string;
  height?: number;
  showBadge?: boolean;
}

/**
 * Generates ready-to-paste HTML/JS code for Tilda block T123 or any website.
 * Pre-computes the QR matrix and 3D voxel coordinates so the embed snippet is ultra-lightweight.
 */
export function generateEmbedCode(options: EmbedOptions): string {
  const { text, shape, themeId, height = 480, showBadge = true } = options;
  const theme = THEMES[themeId] || THEMES['dark-gold'];
  const { modules, size } = generateQrMatrix(text);

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

  const targets = generateTargetShapePositions(shape, darkCoords.length, size);

  // Compact payload
  const payload = {
    s: size,
    c: darkCoords.map((d) => [d.c, d.r, d.isFinder ? 1 : 0]),
    t: targets.map((p) => [
      Number(p.x.toFixed(2)),
      Number(p.y.toFixed(2)),
      Number(p.z.toFixed(2)),
      Number((p.scaleY ?? 1).toFixed(2)),
    ]),
    theme: {
      bg: theme.bgColor,
      ground: theme.groundColor,
      voxel: theme.voxelColor,
      accent: theme.accentColor,
      finder: theme.finderColor,
      dark: theme.isDark,
    },
  };

  const instanceId = 'temka-qr-' + Math.random().toString(36).substring(2, 8);

  const badgeHtml = showBadge
    ? `\n  <a href="https://temka.io/fx" target="_blank" rel="noopener" style="position:absolute; bottom:12px; right:12px; z-index:10; font-family:system-ui,-apple-system,sans-serif; font-size:11px; font-weight:500; color:${theme.isDark ? '#94a3b8' : '#64748b'}; text-decoration:none; background:${theme.isDark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.85)'}; backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); padding:4px 9px; border-radius:6px; border:1px solid ${theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; box-shadow:0 2px 6px rgba(0,0,0,0.1); transition:opacity 0.2s;">⚡ Сделано в Temka FX</a>`
    : '';

  return `<!-- Temka FX: 3D Интерактивный QR-код -->
<div id="${instanceId}" style="width:100%; height:${height}px; position:relative; overflow:hidden; border-radius:16px; background:${theme.bgColor};">${badgeHtml}
</div>
<script>
(function() {
  var data = ${JSON.stringify(payload)};
  var container = document.getElementById("${instanceId}");
  if (!container) return;

  function loadThree(cb) {
    if (window.THREE) return cb();
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.crossOrigin = "anonymous";
    s.onload = cb;
    s.onerror = function() {
      // Fallback mirror
      var s2 = document.createElement("script");
      s2.src = "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";
      s2.onload = cb;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s);
  }

  loadThree(function() {
    var T = window.THREE;
    var w = container.clientWidth || 400;
    var h = container.clientHeight || ${height};

    var scene = new T.Scene();
    scene.background = new T.Color(data.theme.bg);

    var camera = new T.PerspectiveCamera(40, w / h, 0.1, 1000);
    camera.position.set(0, 36, 42);
    camera.lookAt(0, 0, 0);

    var renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    var amb = new T.AmbientLight(0xffffff, data.theme.dark ? 0.75 : 0.95);
    scene.add(amb);

    var dir = new T.DirectionalLight(0xffffff, data.theme.dark ? 1.5 : 1.2);
    dir.position.set(20, 45, 25);
    dir.castShadow = true;
    scene.add(dir);

    var pt = new T.PointLight(data.theme.accent, 2, 60);
    pt.position.set(-15, 20, -15);
    scene.add(pt);

    var groundGeo = new T.CylinderGeometry(20, 21, 1.2, 48);
    var groundMat = new T.MeshStandardMaterial({ color: data.theme.ground, roughness: 0.4, metalness: 0.3 });
    var ground = new T.Mesh(groundGeo, groundMat);
    ground.position.y = -0.7;
    ground.receiveShadow = true;
    scene.add(ground);

    var count = data.c.length;
    var boxGeo = new T.BoxGeometry(0.88, 0.88, 0.88);
    var mat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25, metalness: 0.35 });
    var mesh = new T.InstancedMesh(boxGeo, mat, count);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    var colorObj = new T.Color();
    var colBase = new T.Color(data.theme.voxel);
    var colFinder = new T.Color(data.theme.finder);
    var colAcc = new T.Color(data.theme.accent);
    var half = data.s / 2;

    var voxels = [];
    for (var i = 0; i < count; i++) {
      var c = data.c[i];
      var t = data.t[i];
      var qx = c[0] - half + 0.5;
      var qz = c[1] - half + 0.5;
      var dist = Math.hypot(qx, qz);
      var delay = (dist / (half * 1.4)) * 0.45;

      voxels.push({
        qx: qx, qz: qz,
        tx: t[0], ty: t[1], tz: t[2], sy: t[3] || 1,
        delay: delay
      });

      if (c[2] === 1) colorObj.copy(colFinder);
      else if (i % 7 === 0) colorObj.copy(colAcc);
      else colorObj.copy(colBase);
      mesh.setColorAt(i, colorObj);
    }
    mesh.instanceColor.needsUpdate = true;
    scene.add(mesh);

    var dummy = new T.Object3D();
    var progress = 0, targetProgress = 0, rotX = 0, rotY = 0, targetRotX = 0, targetRotY = 0;
    var isDragging = false, startX = 0, startY = 0, prevX = 0, prevY = 0;

    function updateTransforms() {
      for (var i = 0; i < count; i++) {
        var v = voxels[i];
        var lt = Math.max(0, Math.min(1, (progress - v.delay) / (1 - v.delay || 0.001)));
        var ease = lt < 0.5 ? 4 * lt * lt * lt : 1 - Math.pow(-2 * lt + 2, 3) / 2;
        var arc = Math.sin(lt * Math.PI) * 5.0;

        var x = v.qx + (v.tx - v.qx) * ease;
        var y = 0.5 + (v.ty - 0.5) * ease + arc;
        var z = v.qz + (v.tz - v.qz) * ease;
        var sy = 1 + (v.sy - 1) * ease;

        dummy.position.set(x, y, z);
        dummy.scale.set(1, sy, 1);
        if (lt > 0 && lt < 1) {
          dummy.rotation.x = lt * Math.PI * 2;
          dummy.rotation.y = lt * Math.PI;
        } else {
          dummy.rotation.set(0, 0, 0);
        }
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
    updateTransforms();

    var canvas = renderer.domElement;
    canvas.addEventListener("pointerdown", function(e) {
      isDragging = true;
      startX = prevX = e.clientX;
      startY = prevY = e.clientY;
    });
    window.addEventListener("pointermove", function(e) {
      if (isDragging) {
        targetRotY += (e.clientX - prevX) * 0.01;
        targetRotX += (e.clientY - prevY) * 0.01;
        targetRotX = Math.max(-0.6, Math.min(0.8, targetRotX));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    });
    window.addEventListener("pointerup", function(e) {
      isDragging = false;
      var d = Math.hypot(e.clientX - startX, e.clientY - startY);
      if (d < 6) {
        targetProgress = targetProgress === 0 ? 1 : 0;
      }
    });

    var isVisible = true;
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function(es) {
        isVisible = es[0].isIntersecting;
      }, { threshold: 0.05 });
      obs.observe(container);
    }

    function loop() {
      requestAnimationFrame(loop);
      if (!isVisible) return;

      var diff = targetProgress - progress;
      if (Math.abs(diff) > 0.001) {
        progress += diff * 0.08;
        updateTransforms();
      }

      if (targetProgress === 1 && !isDragging) {
        targetRotY += 0.005;
      }
      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;

      mesh.rotation.y = rotY;
      mesh.rotation.x = rotX;
      ground.rotation.y = rotY;
      ground.rotation.x = rotX;

      renderer.render(scene, camera);
    }
    loop();

    window.addEventListener("resize", function() {
      var rw = container.clientWidth || 400;
      var rh = container.clientHeight || ${height};
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
    });
  });
})();
<\/script>`;
}
