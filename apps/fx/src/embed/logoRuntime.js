/* Gridika · 3D-логотип из вокселей — runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. The logo comes precomputed as a small
 * colour grid (run-length string + palette), so the snippet needs no image at all.
 *
 * data: { w, h, palette: ['#hex', …], rle: '12.3a1b…', depth: 1..8, motion: 'spin'|'sway'|'still' }
 * mode: 'gloss' | 'matte' | 'chrome' | 'pearl' | 'toon' | 'neon'
 */

export var LOGO_MODES = {
  gloss: { label: 'Глянец' },
  matte: { label: 'Матовый' },
  chrome: { label: 'Металлик' },
  pearl: { label: 'Перламутр' },
  toon: { label: 'Мультяшный' },
  neon: { label: 'Неон' },
};
/** neon: no dark tile — a soft aura in the logo's own colour that melts into any page */
function neonAura(hex, css) {
  var n = parseInt(String(hex || '#8b5cf6').replace('#', ''), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  var c = function (a) { return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
  return css
    ? 'radial-gradient(ellipse 46% 40% at 50% 50%, ' + c(0.26) + ' 0%, ' + c(0.12) + ' 50%, ' + c(0.04) + ' 78%, ' + c(0) + ' 100%)'
    : [c(0.26), c(0.12), c(0.04), c(0)];
}

/** "3.2a1b" → array of length w*h with -1 (empty) or a palette index */
export function decodeLogoGrid(d) {
  var out = new Int16Array(d.w * d.h).fill(-1), n = 0, num = '';
  for (var i = 0; i < d.rle.length; i++) {
    var ch = d.rle[i];
    if (ch >= '0' && ch <= '9') { num += ch; continue; }
    var count = num ? parseInt(num, 10) : 1; num = '';
    var v = ch === '.' ? -1 : ch.charCodeAt(0) - 97;
    for (var k = 0; k < count && n < out.length; k++) out[n++] = v;
  }
  return out;
}

export function createLogoViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data, mode: init.mode || 'gloss' };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Logo WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, setMode: noop, replay: noop, burst: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.cursor = 'pointer'; cv.style.touchAction = 'pan-y';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 400);
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c5, 1.2); scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(-5, 8, 10); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(8, 3, -6); scene.add(rim);
  var group = new THREE.Group(); scene.add(group);
  var cube = new THREE.BoxGeometry(U, U, U);

  // soft studio reflections for the glossy mode (built once, no files)
  var envTex = null;
  function glossEnv() {
    if (envTex) return envTex;
    try {
      var pm = new THREE.PMREMGenerator(renderer), s = new THREE.Scene();
      var room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x8c8898, side: THREE.BackSide }));
      s.add(room);
      var panel = function (w, h, x, y, z, k) {
        var m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); m.color.setScalar(k);
        var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.lookAt(0, 0, 0); s.add(p);
      };
      panel(10, 4, 0, 9, 2, 5); panel(3, 12, -9, 1, 4, 3); panel(3, 12, 9, 1, -2, 2); panel(12, 2, 0, -8, 6, 0.8); panel(14, 3, 0, 4, 10, 1.6);
      envTex = pm.fromScene(s, 0.03).texture;
      pm.dispose();
    } catch (e) { envTex = null; }
    return envTex;
  }

  // three-step light for the cartoon look
  var toonRamp = new THREE.DataTexture(new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  toonRamp.minFilter = toonRamp.magFilter = THREE.NearestFilter; toonRamp.needsUpdate = true;

  var mats = {
    gloss: new THREE.MeshPhysicalMaterial({ roughness: 0.32, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.9 }),
    matte: new THREE.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }),
    chrome: new THREE.MeshStandardMaterial({ roughness: 0.24, metalness: 1, envMapIntensity: 0.95 }),
    pearl: new THREE.MeshPhysicalMaterial({ roughness: 0.28, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 520], sheen: 0.6, sheenRoughness: 0.4, sheenColor: new THREE.Color(0xffffff), envMapIntensity: 1 }),
    toon: new THREE.MeshToonMaterial({ gradientMap: toonRamp }),
    neon: new THREE.MeshStandardMaterial({ color: 0x1d1830, roughness: 0.5, metalness: 0.3 }),
  };
  // every cube gets a soft dark seam along its edges (the voxel grid without real gaps);
  // neon instead lights the edges up in the logo colour
  var EDGE_DARK = { gloss: 0.2, matte: 0.24, chrome: 0.3, pearl: 0.16, toon: 0.55 };
  Object.keys(mats).forEach(function (name) {
    var mat = mats[name], neon = name === 'neon';
    mat.onBeforeCompile = function (sh) {
      sh.uniforms.uHalf = { value: U * 0.5 };
      sh.uniforms.uEdge = { value: EDGE_DARK[name] || 0 };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vLocalP;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLocalP = position;');
      var edgeFn = [
        'vec3 q = abs(vLocalP) / uHalf;',
        'float mid = q.x + q.y + q.z - max(q.x, max(q.y, q.z)) - min(q.x, min(q.y, q.z));',
      ].join('\n');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vLocalP;\nuniform float uHalf;\nuniform float uEdge;');
      if (neon) {
        sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', [
          '#include <emissivemap_fragment>', edgeFn,
          'float edge = smoothstep(0.72, 0.96, mid);',
          '#if defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )',
          'totalEmissiveRadiance += vColor * (edge * 2.2 + 0.1);',
          '#endif',
        ].join('\n'));
      } else {
        sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', [
          '#include <color_fragment>', edgeFn,
          'diffuseColor.rgb *= 1.0 - uEdge * smoothstep(0.8, 0.985, mid);',
        ].join('\n'));
      }
    };
    mat.customProgramCacheKey = function () { return 'gridika-voxel-' + name; };
  });

  // ---------- voxels ----------
  var mesh = null, N = 0;
  var home, from, delay, spin, burstDir;
  var center = new THREE.Vector3(), size = { w: 1, h: 1, d: 1 };
  var built = 0; // time of the last assembly start
  var burstT = -10, dirty = true, hoverK = 0, hoverTarget = 0;
  var pointer = { x: 0, y: 0, inside: false, lx: 0, ly: 0 };

  function shade(hex, i) {
    var c = new THREE.Color(hex);
    var rim = mesh && mesh.userData.edge ? mesh.userData.edge[i] : 1;
    if (state.mode === 'matte') c.lerp(new THREE.Color(0xffffff), 0.22);
    if (state.mode === 'chrome') c.lerp(new THREE.Color(0xffffff), 0.12);
    if (state.mode === 'pearl') c.lerp(new THREE.Color(0xffffff), 0.28);
    var hl = {}; c.getHSL(hl);
    if (hl.l > 0.84 && state.mode !== 'neon') c.setHSL(hl.h, hl.s, 0.84);
    if (state.mode === 'neon') { var hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, Math.min(1, hsl.s * 1.15 + 0.1), Math.min(0.62, Math.max(0.5, hsl.l))); }
    if (state.mode === 'neon') c.multiplyScalar(rim ? 1 : 0.22);
    else c.multiplyScalar(0.93 + rnd(i * 3.1) * 0.09);
    return c;
  }
  function colorAll() {
    if (!mesh) return;
    for (var i = 0; i < N; i++) mesh.setColorAt(i, shade(state.data.palette[mesh.userData.col[i]] || '#888888', i));
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  function build() {
    if (mesh) { group.remove(mesh); mesh.dispose(); mesh = null; }
    var d = state.data, grid = decodeLogoGrid(d), depth = Math.max(1, Math.min(8, d.depth | 0 || 3));
    var cells = [];
    for (var y = 0; y < d.h; y++) for (var x = 0; x < d.w; x++) { var v = grid[y * d.w + x]; if (v >= 0) cells.push([x, y, v]); }
    N = cells.length * depth;
    size = { w: d.w * U, h: d.h * U, d: depth * U };
    mesh = new THREE.InstancedMesh(cube, mats[state.mode] || mats.gloss, Math.max(1, N));
    mesh.count = N;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    home = new Float32Array(N * 3); from = new Float32Array(N * 3); delay = new Float32Array(N); spin = new Float32Array(N * 3); burstDir = new Float32Array(N * 3);
    var col = new Uint8Array(N), edge = new Uint8Array(N);
    var filled = function (x, y) { return x >= 0 && y >= 0 && x < d.w && y < d.h && grid[y * d.w + x] >= 0; };
    for (var c = 0, i = 0; c < cells.length; c++) {
      for (var z = 0; z < depth; z++, i++) {
        var hx = (cells[c][0] - (d.w - 1) / 2) * U, hy = ((d.h - 1) / 2 - cells[c][1]) * U, hz = (z - (depth - 1) / 2) * U;
        home[i * 3] = hx; home[i * 3 + 1] = hy; home[i * 3 + 2] = hz;
        // drift in from a cloud inside the logo's own frame, a little in front of it
        from[i * 3] = hx * 0.6 + (rnd(i + 1) - 0.5) * size.w * 0.4;
        from[i * 3 + 1] = hy * 0.6 + (rnd(i + 7) - 0.5) * size.h * 0.4;
        from[i * 3 + 2] = hz + U * (3 + rnd(i + 13) * 7);
        // left to right sweep, front layers first
        delay[i] = (cells[c][0] / Math.max(1, d.w - 1)) * 0.9 + rnd(i + 21) * 0.45 + z * 0.03;
        spin[i * 3] = (rnd(i + 31) - 0.5) * 3; spin[i * 3 + 1] = (rnd(i + 37) - 0.5) * 3; spin[i * 3 + 2] = (rnd(i + 41) - 0.5) * 2;
        var bx = hx + (rnd(i + 51) - 0.5) * U * 4, by = hy + (rnd(i + 53) - 0.5) * U * 4, bz = (rnd(i + 57) - 0.2) * U * 6, bl = Math.hypot(bx, by, bz) || 1;
        var amp = U * (1 + rnd(i + 59) * 2);
        burstDir[i * 3] = bx / bl * amp; burstDir[i * 3 + 1] = by / bl * amp; burstDir[i * 3 + 2] = bz / bl * amp + U * 1.5;
        col[i] = cells[c][2];
        var cx = cells[c][0], cy = cells[c][1];
        edge[i] = !filled(cx - 1, cy) || !filled(cx + 1, cy) || !filled(cx, cy - 1) || !filled(cx, cy + 1) ? 1 : 0;
      }
    }
    mesh.userData.col = col;
    mesh.userData.edge = edge;
    group.add(mesh);
    colorAll();
    built = reduced ? -100 : now();
    dirty = true;
    resize();
  }

  // ---------- animation ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true;
  function now() { return (performance.now() - t0) / 1000; }
  var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), sv = new THREE.Vector3(1, 1, 1);
  var DUR = 1.5, ASSEMBLE_END = DUR + 1.5, BURST_LEN = 1.3, DISSOLVE = 0.6, dissolveT = -1;
  function easeSine(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }

  function updateVoxels(t) {
    var ta = t - built, tb = t - burstT;
    var pre = ta < 0, assembling = ta < ASSEMBLE_END, bursting = tb < BURST_LEN, hovering = hoverK > 0.002;
    if (!assembling && !bursting && !hovering && !dirty) return;
    var R2 = Math.pow(Math.max(size.w, size.h) * 0.16 + U * 2, 2);
    // before the assembly: either melting away (replay) or not shown yet (waiting to come into view)
    var dk = pre ? (dissolveT >= 0 ? clamp01((t - dissolveT) / DISSOLVE) : 1) : 0;
    for (var i = 0; i < N; i++) {
      var k, sc;
      if (pre) { k = 1 - easeSine(dk); sc = k; }
      else if (assembling) { var u = clamp01((ta - delay[i]) / DUR); k = easeSine(u); sc = easeOutCubic(clamp01(u * 1.7)); }
      else { k = 1; sc = 1; }
      var inv = 1 - k;
      var x = from[i * 3] + (home[i * 3] - from[i * 3]) * k;
      var y = from[i * 3 + 1] + (home[i * 3 + 1] - from[i * 3 + 1]) * k;
      var z = from[i * 3 + 2] + (home[i * 3 + 2] - from[i * 3 + 2]) * k;
      var rx = spin[i * 3] * inv, ry = spin[i * 3 + 1] * inv, rz = spin[i * 3 + 2] * inv;
      if (bursting) {
        var bt = clamp01(tb / BURST_LEN), lag = rnd(i + 71) * 0.12;
        var s = bt < 0.22 ? easeOutCubic(bt / 0.22) : 1 - easeInOut(clamp01((bt - 0.22 - lag) / (0.78 - lag)));
        x += burstDir[i * 3] * s; y += burstDir[i * 3 + 1] * s; z += burstDir[i * 3 + 2] * s;
        rx += spin[i * 3] * 0.25 * s; ry += spin[i * 3 + 1] * 0.25 * s;
      }
      if (hovering) {
        var dx = home[i * 3] - pointer.lx, dy = home[i * 3 + 1] - pointer.ly, d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          var f = Math.pow(1 - d2 / R2, 2) * hoverK, dl = Math.sqrt(d2) || 1;
          x += dx / dl * f * U * 0.9; y += dy / dl * f * U * 0.9; z += f * U * 2.4;
          rx += f * 0.5 * (rnd(i + 81) - 0.5); ry += f * 0.5 * (rnd(i + 83) - 0.5);
        }
      }
      e.set(rx, ry, rz); q.setFromEuler(e); p.set(x, y, z); sv.setScalar(Math.max(0.0001, sc));
      m4.compose(p, q, sv); mesh.setMatrixAt(i, m4);
    }
    mesh.instanceMatrix.needsUpdate = true;
    dirty = assembling || bursting || hovering;
  }

  var tilt = { x: 0, y: 0 };
  function frame(t, dt) {
    if (!mesh) return;
    hoverK += (hoverTarget - hoverK) * Math.min(1, dt * 6);
    var tx = pointer.inside ? -pointer.y * 0.22 : 0, ty = pointer.inside ? pointer.x * 0.32 : 0;
    tilt.x += (tx - tilt.x) * Math.min(1, dt * 3); tilt.y += (ty - tilt.y) * Math.min(1, dt * 3);
    var motion = reduced ? 'still' : state.data.motion;
    var ry = -0.32, rx = 0.14;
    if (motion === 'spin') { ry = t * (Math.PI * 2 / 14); rx = 0.1; }
    else if (motion === 'sway') { ry = -0.18 + Math.sin(t * 0.55) * 0.4; rx = 0.12 + Math.sin(t * 0.4) * 0.06; }
    group.rotation.set(rx + tilt.x, ry + tilt.y, 0);
    updateVoxels(t);
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(), dt = Math.min(0.05, t - last); last = t;
    if (!visible || paused) return;
    frame(t, dt); renderer.render(scene, camera);
  }

  function fitCamera() {
    var w = container.clientWidth || 400, h = container.clientHeight || 400, aspect = w / h;
    camera.aspect = aspect;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    // spinning: the widest the logo gets is its diagonal with the depth
    var halfW = (state.data.motion === 'spin' ? Math.hypot(size.w, size.d) : size.w) / 2, halfH = size.h / 2;
    var dist = Math.max(halfH / tanV, halfW / (tanV * aspect)) * 1.42 + size.d / 2;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(0.1, dist / 50); camera.far = dist * 6;
    camera.updateProjectionMatrix();
  }
  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 400;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    fitCamera();
  }

  var LIGHT = {
    gloss: [1.0, 1.9, 1.0], matte: [1.9, 1.0, 0.4], chrome: [0.5, 1.4, 1.2],
    pearl: [1.3, 1.3, 0.9], toon: [1.1, 1.8, 0.0], neon: [0.25, 0.5, 0.6],
  };
  var pageBg = container.style.background;
  function applyMode() {
    var m = LIGHT[state.mode] ? state.mode : 'gloss', dark = m === 'neon';
    scene.background = null;
    container.style.background = dark ? neonAura(state.data.palette[0], true) : pageBg;
    scene.environment = m === 'gloss' || m === 'chrome' || m === 'pearl' ? glossEnv() : null;
    hemi.intensity = LIGHT[m][0]; key.intensity = LIGHT[m][1]; rim.intensity = LIGHT[m][2];
    hemi.groundColor.set(dark ? 0x221d33 : 0xd9d2c5);
    if (mesh) { mesh.material = mats[state.mode] || mats.gloss; colorAll(); }
  }

  // ---------- pointer ----------
  var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(), hit = new THREE.Vector3(), nrm = new THREE.Vector3();
  function onMove(ev) {
    var r = cv.getBoundingClientRect();
    pointer.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((ev.clientY - r.top) / r.height) * 2 - 1;
    ndc.set(pointer.x, -pointer.y);
    ray.setFromCamera(ndc, camera);
    nrm.set(0, 0, 1).applyQuaternion(group.quaternion);
    plane.setFromNormalAndCoplanarPoint(nrm, group.position);
    if (ray.ray.intersectPlane(plane, hit)) {
      group.worldToLocal(hit);
      pointer.lx = hit.x; pointer.ly = hit.y;
      var inLogo = Math.abs(hit.x) < size.w / 2 + U && Math.abs(hit.y) < size.h / 2 + U;
      hoverTarget = inLogo && !reduced ? 1 : 0;
    }
  }
  var lastBurst = -10;
  function burst() {
    var t = now();
    if (reduced || t - built < ASSEMBLE_END * 0.8 || t - lastBurst < BURST_LEN + 0.3) return;
    burstT = lastBurst = t; dirty = true;
  }
  cv.addEventListener('pointerenter', function (ev) { pointer.inside = true; if (ev.pointerType === 'mouse') burst(); });
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerleave', function () { pointer.inside = false; hoverTarget = 0; });
  cv.addEventListener('click', burst);

  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      var en = es[0]; visible = en ? en.isIntersecting : true;
      // the cubes fly in when the block first comes into view, not while it is below the fold
      if (visible && waiting) { waiting = false; built = reduced ? -100 : now(); dirty = true; }
    }, { threshold: [0, 0.15] });
    io.observe(container);
  }

  var waiting = false;
  applyMode(); build();
  if (io && !reduced) { waiting = true; built = 1e9; }
  loop();

  // ---------- public ----------
  api.setData = function (d) {
    var shapeChanged = !state.data || d.rle !== state.data.rle || d.w !== state.data.w || d.depth !== state.data.depth;
    var motionChanged = d.motion !== state.data.motion;
    state.data = d;
    if (shapeChanged) build();
    else { colorAll(); if (motionChanged) fitCamera(); }
    if (state.mode === 'neon') container.style.background = neonAura(d.palette[0], true);
  };
  api.setMode = function (m) { state.mode = m; applyMode(); };
  api.replay = function () {
    var t = now(); waiting = false; burstT = -10; dirty = true;
    if (reduced) { built = -100; return; }
    dissolveT = t; built = t + DISSOLVE;
  };
  api.burst = function () { lastBurst = -10; burst(); };
  api.setPaused = function (pz) { paused = pz; };
  /** current frame on a transparent background (neon on its dark glow) */
  api.snapshot = function () {
    var t = now(); frame(t, 1 / 60); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    var ctx = out.getContext('2d');
    if (state.mode === 'neon') {
      var stops = neonAura(state.data.palette[0], false);
      ctx.save(); ctx.translate(out.width / 2, out.height / 2); ctx.scale(0.46, 0.4);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(out.width, out.height));
      g.addColorStop(0, stops[0]); g.addColorStop(0.5, stops[1]); g.addColorStop(0.78, stops[2]); g.addColorStop(1, stops[3]);
      ctx.fillStyle = g; ctx.fillRect(-out.width * 1.2, -out.height * 1.3, out.width * 2.4, out.height * 2.6); ctx.restore();
    }
    ctx.drawImage(cv, 0, 0);
    return out;
  };
  /** for checks: skip the assembly */
  api.settle = function () { built = -100; burstT = -10; dirty = true; };
  api.count = function () { return N; };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    if (mesh) mesh.dispose();
    cube.dispose(); Object.keys(mats).forEach(function (k) { mats[k].dispose(); });
    if (envTex) envTex.dispose();
    toonRamp.dispose(); container.style.background = pageBg;
    renderer.dispose(); cv.remove();
  };
  return api;
}
