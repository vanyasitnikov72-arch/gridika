/* Voxelka · Подарок с промокодом — runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. The reward (promo code / discount / QR coupon)
 * comes precomputed as a grid of cells, so the snippet needs no fonts or QR library for it. */

export const GIFT_PALETTES = {
  festive: { box: '#d6333f', ribbon: '#f2c14e', pattern: '#f6d26b', podium: '#f6efe4', podiumEdge: '#e4d8c4', reward: '#d6333f', plate: '#fff8ec', badge: '#d6333f', badgeText: '#fff8ec', confetti: ['#d6333f', '#f2c14e', '#ffffff', '#19C37D', '#ff8fb1', '#5b8def'], neon: false, metal: 0.25, btn: '#d6333f', btnText: '#ffffff' },
  kraft: { box: '#c9a27a', ribbon: '#6b4a2e', pattern: '#efe3cf', podium: '#f1e8da', podiumEdge: '#ddcfb8', reward: '#6b4a2e', plate: '#fbf4e8', badge: '#6b4a2e', badgeText: '#fbf4e8', confetti: ['#c9a27a', '#6b4a2e', '#efe3cf', '#a3c49a', '#d98a5a'], neon: false, metal: 0, btn: '#6b4a2e', btnText: '#fff7ec' },
  neon: { box: '#1b1b22', ribbon: '#ff2e88', pattern: '#2ef2ff', podium: '#2a2a33', podiumEdge: '#1c1c23', reward: '#ff2e88', plate: '#22222b', badge: '#ff2e88', badgeText: '#ffffff', confetti: ['#ff2e88', '#2ef2ff', '#f7ff2e', '#ffffff', '#9d4bff'], neon: true, metal: 0.1, btn: '#ff2e88', btnText: '#ffffff' },
  mint: { box: '#7fd6b4', ribbon: '#ff7aa8', pattern: '#ffffff', podium: '#f4f1ea', podiumEdge: '#e2dccf', reward: '#e0457b', plate: '#ffffff', badge: '#ff7aa8', badgeText: '#ffffff', confetti: ['#7fd6b4', '#ff7aa8', '#ffffff', '#ffd166', '#a78bfa'], neon: false, metal: 0.05, btn: '#e0457b', btnText: '#ffffff' },
  royal: { box: '#24356b', ribbon: '#dfe3ec', pattern: '#f2c14e', podium: '#eef0f5', podiumEdge: '#d6dae4', reward: '#24356b', plate: '#ffffff', badge: '#24356b', badgeText: '#f2c14e', confetti: ['#24356b', '#dfe3ec', '#f2c14e', '#ffffff', '#5b8def'], neon: false, metal: 0.55, btn: '#24356b', btnText: '#ffffff' },
  sunny: { box: '#ffc83d', ribbon: '#3b6fe0', pattern: '#ffffff', podium: '#f7f2e8', podiumEdge: '#e6dcc8', reward: '#3b6fe0', plate: '#ffffff', badge: '#3b6fe0', badgeText: '#ffffff', confetti: ['#ffc83d', '#3b6fe0', '#ffffff', '#ff6b6b', '#19C37D'], neon: false, metal: 0.1, btn: '#3b6fe0', btnText: '#ffffff' },
};

/** box proportions in voxels: width, height */
var SHAPES = { cube: [8, 6], tall: [6, 9], flat: [10, 4] };

export function createGiftViewer(THREE, container, init) {
  var U = 0.5; // voxel size
  var state = { data: init.data, mode: init.mode || 'festive' };
  var api = { onOpen: null };
  function pal() { return GIFT_PALETTES[state.mode] || GIFT_PALETTES.festive; }
  function easeOutBack(t) { var c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch (e2) {
      console.warn('Gift WebGLRenderer init failed:', e2);
      return {
        domElement: document.createElement('div'),
        setSettings: function() {},
        setMode: function() {},
        open: function() {},
        close: function() {},
        setPaused: function() {},
        checkScan: function() { return { ok: false }; },
        dispose: function() {}
      };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.cursor = 'pointer';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd8cfc0, 1.6); scene.add(hemi);
  var sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(6, 12, 8); scene.add(sun);
  var world = new THREE.Group(); scene.add(world);
  var cube = new THREE.BoxGeometry(U * 0.96, U * 0.96, U * 0.96);
  var mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), sc = new THREE.Vector3(), vp = new THREE.Vector3(), col = new THREE.Color();

  // podium
  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.8 });
  var podiumEdgeMat = new THREE.MeshStandardMaterial({ roughness: 0.85 });
  var podium = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 9), [podiumEdgeMat, podiumEdgeMat, podiumMat, podiumEdgeMat, podiumEdgeMat, podiumEdgeMat]);
  podium.position.y = -0.25; world.add(podium);
  var shc = document.createElement('canvas'); shc.width = shc.height = 128;
  var sx = shc.getContext('2d'); var sg = sx.createRadialGradient(64, 64, 8, 64, 64, 62);
  sg.addColorStop(0, 'rgba(40,30,20,0.45)'); sg.addColorStop(1, 'rgba(40,30,20,0)'); sx.fillStyle = sg; sx.fillRect(0, 0, 128, 128);
  var shadowTex = new THREE.CanvasTexture(shc);
  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.005; world.add(shadow);
  var lidShadow = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 }));
  lidShadow.rotation.x = -Math.PI / 2; lidShadow.position.y = 0.006; world.add(lidShadow);

  // ---------- the box (rebuilt when shape / pattern / colours change) ----------
  var boxG = new THREE.Group(); world.add(boxG);
  var bodyG = new THREE.Group(); boxG.add(bodyG);
  var lidG = new THREE.Group(); boxG.add(lidG);
  var paintMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55 }); // colours come per cube
  var ribbonMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.2 });
  var N = 8, HB = 6, LN = 10, LID_Y = 3.5;
  var bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh, bodyCells = [], bodyRibbon = [], lidCells = [], lidRibbon = [], bowCells = [];

  function patternAt(u, v) {
    var pat = state.data.pattern || 'plain';
    if (pat === 'dots') return u % 3 === 1 && v % 3 === 1;
    if (pat === 'stripes') return ((u + v) % 4) < 1;
    return false;
  }
  function disposeBox() {
    [bodyMesh, bodyRibbonMesh, lidMesh, lidRibbonMesh, bowMesh].forEach(function (m) { if (m) { m.parent.remove(m); if (m.dispose) m.dispose(); } });
  }
  function instanced(cells, mat, parent) {
    var m = new THREE.InstancedMesh(cube, mat, Math.max(1, cells.length));
    m.count = cells.length;
    cells.forEach(function (c, i) { mtx.makeTranslation(c[0], c[1], c[2]); m.setMatrixAt(i, mtx); });
    parent.add(m);
    return m;
  }
  function buildBox() {
    disposeBox();
    var dims = SHAPES[state.data.shape] || SHAPES.cube, p = pal();
    N = dims[0]; HB = dims[1]; LN = N + 2;
    var mid0 = N / 2 - 1, mid1 = N / 2, lm0 = LN / 2 - 1, lm1 = LN / 2;
    bodyCells = []; bodyRibbon = []; lidCells = []; lidRibbon = []; bowCells = [];
    var bodyCol = [], lidCol = [];
    for (var y = 0; y < HB; y++) for (var x = 0; x < N; x++) for (var z = 0; z < N; z++) {
      if (!(x === 0 || x === N - 1 || z === 0 || z === N - 1 || y === 0)) continue;
      var pos = [(x - (N - 1) / 2) * U, (y + 0.5) * U, (z - (N - 1) / 2) * U];
      bodyCells.push(pos);
      var u = (z === 0 || z === N - 1) ? x : z; // horizontal coordinate along the face
      bodyCol.push(y > 0 && patternAt(u, y) ? p.pattern : p.box);
      if (y === 0) continue;
      if ((x === mid0 || x === mid1) && (z === 0 || z === N - 1)) bodyRibbon.push([pos[0], pos[1], pos[2] + (z === 0 ? -1 : 1) * U * 0.56, 2]);
      if ((z === mid0 || z === mid1) && (x === 0 || x === N - 1)) bodyRibbon.push([pos[0] + (x === 0 ? -1 : 1) * U * 0.56, pos[1], pos[2], 0]);
    }
    for (y = 0; y < 2; y++) for (x = 0; x < LN; x++) for (z = 0; z < LN; z++) {
      if (y === 0 && x > 0 && x < LN - 1 && z > 0 && z < LN - 1) continue;
      var lp = [(x - (LN - 1) / 2) * U, (y - 0.5) * U, (z - (LN - 1) / 2) * U];
      if (x === lm0 || x === lm1 || z === lm0 || z === lm1) lidRibbon.push(lp);
      else { lidCells.push(lp); lidCol.push(y === 1 && patternAt(x, z) ? p.pattern : p.box); }
    }
    var BOW = ['.XX....XX.', 'X..X..X..X', 'X..XXXX..X', '.XXXXXXXX.'];
    for (var r = 0; r < BOW.length; r++) for (x = 0; x < BOW[r].length; x++) {
      if (BOW[r][x] !== 'X') continue;
      for (z = 0; z < 2; z++) bowCells.push([(x - 4.5) * U, (BOW.length - r + 0.5) * U, (z - 0.5) * U]);
    }
    bodyMesh = instanced(bodyCells, paintMat, bodyG);
    bodyRibbonMesh = instanced(bodyRibbon, ribbonMat, bodyG);
    lidMesh = instanced(lidCells, paintMat, lidG);
    lidRibbonMesh = instanced(lidRibbon, ribbonMat, lidG);
    bowMesh = instanced(bowCells, ribbonMat, lidG);
    // colours with a subtle per-cube shade so the voxels read
    [[bodyMesh, bodyCol, 1], [lidMesh, lidCol, 2]].forEach(function (a) {
      a[1].forEach(function (hex, i) { col.set(hex); col.multiplyScalar(0.93 + rnd(i + a[2] * 1000) * 0.1); a[0].setColorAt(i, col); });
      if (a[0].instanceColor) a[0].instanceColor.needsUpdate = true;
    });
    LID_Y = HB * U + U;
    computeLidRest();
    setBow(openT < 0 ? -1 : 9); setBodyRibbon(openT < 0 ? -1 : 9);
  }

  // The lid ends up leaning against the box corner on the camera's left, standing on the podium.
  // Computed from the box size so it never sinks into the podium, the box or the reward above.
  var lidRest = { pos: new THREE.Vector3(), yaw: 0, tilt: 0, top: 0 };
  function computeLidRest() {
    var th = 0.7, phi = camYaw - 0.35; // lean angle and the direction it leans towards the box
    var W2 = (LN * U) / 2, T2 = U, sn = Math.sin(th), cs = Math.cos(th);
    var yc = W2 * sn + T2 * cs + 0.03;                      // lowest corner just above the podium
    var yb = HB * U;                                         // box top
    var lx = (yb - yc + T2 * cs) / sn;                       // where the lid face reaches the box top
    var reach = Math.min(lx, W2) * cs + T2 * sn;              // how far the lid extends towards the box
    var support = (N * U / 2) * (Math.abs(Math.cos(phi)) + Math.abs(Math.sin(phi))); // box corner along that direction
    var dist = support + reach + 0.12;
    lidRest.pos.set(-Math.cos(phi) * dist, yc, Math.sin(phi) * dist);
    lidRest.yaw = phi; lidRest.tilt = th;
    lidRest.top = yc + W2 * sn + T2 * cs;
  }
  lidG.rotation.order = 'YZX';

  // ---------- reward on a plate: ticket (code), star badge (discount), framed card (QR) ----------
  var rewardG = new THREE.Group(); world.add(rewardG);
  var letterMat = new THREE.MeshStandardMaterial({ roughness: 0.45 });
  var qrModMat = new THREE.MeshBasicMaterial({ color: '#141414' });
  var plateMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7 });
  var plateWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  var rewardMesh = null, plateMesh = null, plateWhite = null, rewardCells = [], plateCells = [], plateWhiteCells = [];
  var rewardCell = 0.14, plateW = 0, plateH = 0, REWARD_Y = 6;

  function plateLayout(d) {
    // cells: [x, y, kind] — kind 0 = edge colour, 1 = plate colour, 2 = white (behind the QR)
    var cells = [], W, H, x, y;
    if (d.kind === 'percent') {
      var D = Math.ceil(Math.sqrt(d.w * d.w + d.h * d.h)) + 7, R = D / 2, c0 = (D - 1) / 2;
      for (y = 0; y < D; y++) for (x = 0; x < D; x++) {
        var dx = x - c0, dy = y - c0, rr = Math.sqrt(dx * dx + dy * dy), a = Math.atan2(dy, dx);
        var lim = R * (0.88 + 0.12 * Math.cos(a * 12));
        if (rr <= lim) cells.push([x, y, rr > lim - 1.2 ? 0 : 1]);
      }
      return { W: D, H: D, ox: Math.floor((D - d.w) / 2), oy: Math.floor((D - d.h) / 2), cells: cells };
    }
    var pad = 4, padY = d.kind === 'qr' ? 4 : 3, rad = 2;
    W = d.w + pad * 2; H = d.h + padY * 2;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      var cx = x < rad ? rad - x : x > W - 1 - rad ? x - (W - 1 - rad) : 0;
      var cy = y < rad ? rad - y : y > H - 1 - rad ? y - (H - 1 - rad) : 0;
      if (cx * cx + cy * cy > rad * rad + 0.5) continue; // rounded corners
      if (d.kind === 'code') { var my = (H - 1) / 2; if ((x < 2 || x > W - 3) && Math.abs(y - my) < 1.6 - (x < 2 ? x : W - 1 - x) * 0.5) continue; } // ticket notches
      var edge = x === 0 || y === 0 || x === W - 1 || y === H - 1 || cx * cx + cy * cy > (rad - 1) * (rad - 1) + 0.5;
      cells.push([x, y, edge ? 0 : d.kind === 'qr' ? 2 : 1]);
    }
    return { W: W, H: H, ox: pad, oy: padY, cells: cells };
  }

  function buildReward() {
    [rewardMesh, plateMesh, plateWhite].forEach(function (m) { if (m) { rewardG.remove(m); m.geometry.dispose(); } });
    var d = state.data.reward, isQr = d.kind === 'qr';
    var L = plateLayout(d);
    rewardCell = Math.min(isQr ? 0.17 : 0.15, (isQr ? 6.0 : 6.6) / L.W);
    plateW = L.W * rewardCell; plateH = L.H * rewardCell;
    REWARD_Y = Math.max(HB * U + 1.6, lidRest.top + 0.5) + plateH / 2;
    var cx = (L.W - 1) / 2, cy = (L.H - 1) / 2;
    rewardCells = d.cells.map(function (c, i) {
      return { x: (c[0] + L.ox - cx) * rewardCell, y: -(c[1] + L.oy - cy) * rewardCell, delay: 1.4 + (c[0] / d.w) * 0.5 + rnd(i) * 0.1, seed: i };
    });
    plateCells = []; plateWhiteCells = [];
    L.cells.forEach(function (c, i) {
      var cell = { x: (c[0] - cx) * rewardCell, y: -(c[1] - cy) * rewardCell, delay: 1.1 + Math.hypot(c[0] - cx, c[1] - cy) / L.W * 0.35, seed: i + 5000, k: c[2] };
      (c[2] === 2 ? plateWhiteCells : plateCells).push(cell);
    });
    var front = rewardCell * (isQr ? 0.5 : 1.3), back = rewardCell * 0.7;
    rewardMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, front), isQr ? qrModMat : letterMat, rewardCells.length);
    plateMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateMat, Math.max(1, plateCells.length));
    plateMesh.count = plateCells.length;
    plateWhite = new THREE.InstancedMesh(new THREE.BoxGeometry(rewardCell * 1.02, rewardCell * 1.02, back), plateWhiteMat, Math.max(1, plateWhiteCells.length));
    plateWhite.count = plateWhiteCells.length;
    rewardMesh.userData.z = front / 2 + back / 2;
    rewardG.add(plateMesh); rewardG.add(plateWhite); rewardG.add(rewardMesh);
    colorPlate();
    updateReward(openT < 0 ? -1 : now() - openT);
  }
  function colorPlate() {
    var p = pal(), d = state.data.reward;
    var edge = p.ribbon, body = d.kind === 'percent' ? p.badge : p.plate;
    plateCells.forEach(function (c, i) { col.set(c.k === 0 ? edge : body); col.multiplyScalar(0.95 + rnd(c.seed) * 0.08); plateMesh.setColorAt(i, col); });
    if (plateMesh.instanceColor) plateMesh.instanceColor.needsUpdate = true;
    letterMat.color.set(d.kind === 'percent' ? p.badgeText : p.reward);
    letterMat.emissive.set(p.neon ? (d.kind === 'percent' ? '#ffffff' : p.reward) : '#000000'); letterMat.emissiveIntensity = p.neon ? 0.6 : 0;
    plateMat.emissive.set(p.neon && d.kind === 'percent' ? p.badge : '#000000'); plateMat.emissiveIntensity = p.neon && d.kind === 'percent' ? 0.35 : 0;
  }

  function placeCells(mesh, cells, t, z, from) {
    for (var i = 0; i < cells.length; i++) {
      var c = cells[i], k = t < 0 ? 0 : clamp01((t - c.delay) / 0.5), e = easeOutBack(k), m1 = Math.min(1, e);
      var s = Math.max(0.0001, Math.min(1.1, e));
      vp.set(from.x + (c.x - from.x) * m1, from.y + (c.y - from.y) * m1 + Math.sin(k * Math.PI) * 0.5, z + (1 - m1) * 1.2);
      e3.set((1 - k) * 2.4 * (rnd(c.seed) - 0.5), (1 - k) * 3 * (rnd(c.seed + 7) - 0.5), 0); q.setFromEuler(e3);
      sc.set(s, s, s); mtx.compose(vp, q, sc); mesh.setMatrixAt(i, mtx);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
  function updateReward(t) {
    if (!rewardMesh) return;
    var from = new THREE.Vector3(0, -(REWARD_Y - HB * U * 0.6), 0); // inside the box, in reward space
    placeCells(plateMesh, plateCells, t, -rewardCell * 0.2, from);
    placeCells(plateWhite, plateWhiteCells, t, -rewardCell * 0.2, from);
    placeCells(rewardMesh, rewardCells, t, rewardMesh.userData.z - rewardCell * 0.2, from);
  }

  // ---------- confetti ----------
  var CN = 140;
  var confetti = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.16, 0.09), new THREE.MeshStandardMaterial({ roughness: 0.6, side: THREE.DoubleSide }), CN);
  confetti.frustumCulled = false; world.add(confetti);
  var conf = [];
  for (var ci = 0; ci < CN; ci++) conf.push({ p: new THREE.Vector3(), v: new THREE.Vector3(), r: new THREE.Euler(), w: new THREE.Vector3(), alive: false });
  function colorConfetti() {
    var cols = pal().confetti;
    for (var i = 0; i < CN; i++) { col.set(cols[i % cols.length]); confetti.setColorAt(i, col); }
    if (confetti.instanceColor) confetti.instanceColor.needsUpdate = true;
  }
  function burst() {
    for (var i = 0; i < CN; i++) {
      var a = rnd(i * 3) * Math.PI * 2, sp = 2.5 + rnd(i * 5) * 4;
      conf[i].p.set((rnd(i) - 0.5) * N * U * 0.6, HB * U + 0.4, (rnd(i + 9) - 0.5) * N * U * 0.6);
      conf[i].v.set(Math.cos(a) * sp * 0.55, 6 + rnd(i * 7) * 5, Math.sin(a) * sp * 0.55);
      conf[i].w.set(rnd(i + 1) * 12 - 6, rnd(i + 2) * 12 - 6, rnd(i + 3) * 12 - 6);
      conf[i].alive = true;
    }
  }
  function updateConfetti(dt) {
    for (var i = 0; i < CN; i++) {
      var c = conf[i];
      if (c.alive) {
        c.v.y -= 9.8 * dt; c.v.multiplyScalar(1 - 0.9 * dt);
        if (c.v.y < -2.2) c.v.y = -2.2;
        c.p.addScaledVector(c.v, dt);
        c.r.x += c.w.x * dt; c.r.y += c.w.y * dt; c.r.z += c.w.z * dt;
        // rest on the podium, or keep falling past its edge
        var onPodium = Math.abs(c.p.x) < 4.5 && Math.abs(c.p.z) < 4.5;
        if (onPodium && c.p.y < 0.03) { c.p.y = 0.03; c.v.set(0, 0, 0); c.w.set(0, 0, 0); c.r.x = -Math.PI / 2; }
        if (c.p.y < -6) c.alive = false;
      }
      q.setFromEuler(c.r); sc.setScalar(c.alive ? 1 : 0.0001); mtx.compose(c.p, q, sc); confetti.setMatrixAt(i, mtx);
    }
    confetti.instanceMatrix.needsUpdate = true;
  }

  // ---------- overlay (caption + button): plain DOM so it works on any site ----------
  var ov = document.createElement('div');
  ov.style.cssText = 'position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;font-family:Nunito,system-ui,sans-serif;width:max-content;max-width:92%';
  var hint = document.createElement('div');
  hint.style.cssText = 'padding:7px 14px;border-radius:999px;background:rgba(255,255,255,.92);box-shadow:0 6px 18px -8px rgba(0,0,0,.35);font-weight:800;font-size:13px;color:#2b2622';
  hint.textContent = 'Нажмите на подарок 🎁';
  var caption = document.createElement('div');
  caption.style.cssText = 'padding:6px 14px;border-radius:12px;background:rgba(255,255,255,.92);font-weight:800;font-size:13px;color:#2b2622;text-align:center;display:none';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.style.cssText = 'pointer-events:auto;border:0;cursor:pointer;padding:10px 18px;border-radius:999px;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 10px 22px -10px rgba(0,0,0,.45);display:none';
  ov.appendChild(hint); ov.appendChild(caption); ov.appendChild(btn);
  container.appendChild(ov);
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var d = state.data;
    if (d.reward.kind === 'qr' && d.url) { window.open(d.url, '_blank', 'noopener'); return; }
    var done = function () { btn.textContent = 'Скопировано ✓'; jiggle = now(); setTimeout(applyOverlay, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(d.code).then(done, done); else done();
  });
  function applyOverlay() {
    var d = state.data, p = pal(), opened = openT >= 0;
    hint.style.display = opened || d.trigger === 'scroll' ? 'none' : '';
    caption.textContent = d.caption || '';
    caption.style.display = opened && d.caption ? '' : 'none';
    btn.style.display = opened && (d.reward.kind === 'code' || (d.reward.kind === 'qr' && d.url)) ? '' : 'none';
    btn.textContent = d.reward.kind === 'qr' ? 'Открыть ссылку' : 'Скопировать промокод';
    btn.style.background = p.btn; btn.style.color = p.btnText;
  }

  // ---------- state & animation ----------
  var t0 = performance.now();
  function now() { return (performance.now() - t0) / 1000; }
  var openT = -1, jiggle = -10, visible = true, paused = false, raf = 0, last = now(), burstDone = false;

  function applyMode() {
    var p = pal();
    ribbonMat.color.set(p.ribbon); ribbonMat.metalness = p.metal;
    ribbonMat.emissive.set(p.neon ? p.ribbon : '#000000'); ribbonMat.emissiveIntensity = p.neon ? 0.85 : 0;
    podiumMat.color.set(p.podium); podiumEdgeMat.color.set(p.podiumEdge);
    hemi.groundColor.set(p.neon ? '#3a3040' : '#d8cfc0');
    buildBox(); colorConfetti(); if (plateMesh) colorPlate(); applyOverlay();
  }
  function open() { if (openT >= 0) return; openT = now(); burstDone = false; applyOverlay(); if (api.onOpen) api.onOpen(true); }
  function close() { openT = -1; for (var i = 0; i < CN; i++) conf[i].alive = false; applyOverlay(); if (api.onOpen) api.onOpen(false); }

  function ribbonScale(c, s) { return [c[3] === 0 ? 0.22 * s : s, s, c[3] === 2 ? 0.22 * s : s]; }
  function setBodyRibbon(t) {
    for (var i = 0; i < bodyRibbon.length; i++) {
      var c = bodyRibbon[i], k = t < 0 ? 0 : clamp01((t - 0.1 - (HB * U - c[1]) * 0.08) / 0.35), s = Math.max(0.0001, 1 - k), rs = ribbonScale(c, s);
      mtx.makeScale(rs[0], rs[1], rs[2]); mtx.setPosition(c[0], c[1] - k * 0.4, c[2]); bodyRibbonMesh.setMatrixAt(i, mtx);
    }
    bodyRibbonMesh.instanceMatrix.needsUpdate = true;
  }
  function setBow(t) {
    for (var i = 0; i < bowCells.length; i++) {
      var c = bowCells[i], k = t < 0 ? 0 : clamp01((t - rnd(i) * 0.12) / 0.4), s = Math.max(0.0001, 1 - k);
      mtx.makeScale(s, s, s); mtx.setPosition(c[0] + c[0] * 2.2 * k + (rnd(i + 3) - 0.5) * k, c[1] + k * 4.8 * (1 - k), c[2] + (rnd(i + 5) - 0.5) * 2.4 * k); bowMesh.setMatrixAt(i, mtx);
    }
    bowMesh.instanceMatrix.needsUpdate = true;
  }

  // the lid flips over and then hovers to the left of the box (it never touches the podium)
  var camYaw = 0.72, camPitch = 0.42, camDist = 20, camLook = new THREE.Vector3(0, 1.8, 0);
  // Frame the camera on the actual corners of what is visible: the box, the lid (on top or
  // leaning at the side) and, once open, the reward plate. Keeps everything in view at any size.
  var tmpM = new THREE.Matrix4(), tmpE = new THREE.Euler(0, 0, 0, 'YZX'), tmpV = new THREE.Vector3();
  function keyPoints(opened) {
    var pts = [], bh = N * U / 2, top = HB * U, i;
    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? bh : -bh, i & 2 ? top : 0, i & 4 ? bh : -bh));
    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? 4.5 : -4.5, -0.5, i & 2 ? 4.5 : -4.5)); // podium corners
    var W2 = LN * U / 2;
    if (!opened) {
      for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, LID_Y + U * 5.5, i & 2 ? W2 : -W2)); // lid + bow
      return pts;
    }
    tmpE.set(0, lidRest.yaw, lidRest.tilt); tmpM.makeRotationFromEuler(tmpE); tmpM.setPosition(lidRest.pos);
    for (i = 0; i < 8; i++) pts.push(new THREE.Vector3(i & 1 ? W2 : -W2, i & 2 ? U : -U, i & 4 ? W2 : -W2).applyMatrix4(tmpM));
    var r = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion), u = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    for (i = 0; i < 4; i++) pts.push(new THREE.Vector3(0, REWARD_Y, 0).addScaledVector(r, (i & 1 ? 1 : -1) * plateW / 2).addScaledVector(u, (i & 2 ? 1 : -1) * plateH / 2 + 0.15));
    return pts;
  }
  function camTargets() {
    var opened = openT >= 0, pts = keyPoints(opened);
    var f = new THREE.Vector3(Math.sin(camYaw) * Math.cos(camPitch), Math.sin(camPitch), Math.cos(camYaw) * Math.cos(camPitch));
    var r = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw)), u = new THREE.Vector3().crossVectors(f, r).normalize();
    var tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2), tanH = tanV * camera.aspect;
    // centre: middle of the projected extents (plus room at the bottom for the caption and button)
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach(function (p) { var x = p.dot(r), y = p.dot(u); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    y0 -= opened ? 1.1 : 0.7;
    var look = new THREE.Vector3().addScaledVector(r, (x0 + x1) / 2).addScaledVector(u, (y0 + y1) / 2);
    // distance: every point must fit within the field of view
    var dist = 0;
    pts.forEach(function (p) {
      tmpV.copy(p).sub(look);
      var x = Math.abs(tmpV.dot(r)), y = tmpV.dot(u), z = tmpV.dot(f);
      if (y < 0) y = Math.max(-y, Math.abs(y0 - look.dot(u)) * 0); else y = Math.abs(y);
      dist = Math.max(dist, z + x / tanH, z + y / tanV);
    });
    dist = Math.max(dist, z0dist(look, y0, u, f, tanV));
    return { look: look, dist: dist * 1.06 };
  }
  // keep the extra caption room at the bottom inside the frame
  function z0dist(look, y0, u, f, tanV) { return Math.abs(y0 - look.dot(u)) / tanV; }
  function placeCamera(snap) {
    var tg = camTargets();
    if (snap) { camLook.copy(tg.look); camDist = tg.dist; } else { camLook.lerp(tg.look, 0.05); camDist += (tg.dist - camDist) * 0.05; }
    camera.position.set(camLook.x + Math.sin(camYaw) * Math.cos(camPitch) * camDist, camLook.y + Math.sin(camPitch) * camDist, camLook.z + Math.cos(camYaw) * Math.cos(camPitch) * camDist);
    camera.lookAt(camLook);
  }

  function frame(t, dt) {
    var opened = openT >= 0, ot = opened ? t - openT : -1;
    if (!opened) {
      var phase = t % 3.2, jump = phase < 0.5 ? Math.sin(phase / 0.5 * Math.PI) * 0.35 : 0, squash = phase < 0.08 ? 1 : 0;
      boxG.rotation.z = Math.sin(t * 1.6) * 0.035; boxG.rotation.x = Math.sin(t * 1.3 + 1) * 0.02;
      boxG.position.y = jump; boxG.scale.set(1 + squash * 0.04, 1 - squash * 0.05, 1 + squash * 0.04);
      lidG.position.set(0, LID_Y, 0); lidG.rotation.set(0, 0, 0);
      setBow(-1); setBodyRibbon(-1); updateReward(-1);
      shadow.scale.setScalar((N / 8) * (1 - jump * 0.4)); lidShadow.material.opacity = 0;
    } else {
      boxG.rotation.z *= 0.9; boxG.rotation.x *= 0.9; boxG.position.y *= 0.85;
      var sq = ot < 0.22 ? Math.sin(ot / 0.22 * Math.PI) : 0;
      boxG.scale.set(1 + sq * 0.05, 1 - sq * 0.08, 1 + sq * 0.05);
      setBow(ot - 0.12); setBodyRibbon(ot);
      // three phases, so it never cuts through anything:
      // 1) straight up above the box, 2) out to the side tilting while high, 3) straight down onto the podium
      var lk = clamp01((ot - 0.15) / 0.9);
      var up = easeInOut(clamp01(lk / 0.3)), out = easeInOut(clamp01((lk - 0.2) / 0.45)), down = easeInOut(clamp01((lk - 0.62) / 0.38));
      var highY = LID_Y + 1.7;
      var y = lk < 0.62 ? LID_Y + (highY - LID_Y) * up : highY + (lidRest.pos.y - highY) * down;
      var settle = lk >= 1 ? Math.sin(Math.min(1, (ot - 1.05) / 0.25) * Math.PI) * 0.05 : 0;
      lidG.position.set(lidRest.pos.x * out, y + settle, lidRest.pos.z * out);
      lidG.rotation.set(0, lidRest.yaw * out, lidRest.tilt * out);
      var le = out;
      lidShadow.position.x = lidG.position.x; lidShadow.position.z = lidG.position.z;
      lidShadow.material.opacity = 0.5 * le;
      if (!burstDone && ot > 0.3) { burst(); burstDone = true; }
      updateReward(ot);
    }
    updateConfetti(Math.min(dt, 0.05));
    var bounce = Math.max(0, Math.sin(Math.min(1, (t - jiggle) / 0.35) * Math.PI)) * 0.25;
    rewardG.position.set(0, REWARD_Y + (opened ? Math.sin(t * 1.3) * 0.08 : 0) + bounce, 0);
    rewardG.quaternion.copy(camera.quaternion);
    placeCamera(false);
  }

  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(), dt = t - last; last = t;
    if (!visible || paused) return;
    frame(t, dt); renderer.render(scene, camera);
  }
  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 500;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h; camera.updateProjectionMatrix(); placeCamera(true);
  }

  cv.addEventListener('click', function () { if (openT < 0) open(); });
  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) {
      var e = es[0]; visible = e ? e.isIntersecting : true;
      if (e && state.data.trigger === 'scroll' && e.intersectionRatio >= 0.6 && openT < 0) setTimeout(open, 350);
    }, { threshold: [0, 0.02, 0.6] });
    io.observe(container);
  }

  applyMode(); buildReward(); resize(); loop();

  // ---------- public ----------
  api.setData = function (d) {
    var rebuildBox = d.shape !== state.data.shape || d.pattern !== state.data.pattern;
    state.data = d; if (rebuildBox) buildBox(); buildReward(); applyOverlay();
  };
  api.setMode = function (m) { state.mode = m; applyMode(); };
  api.open = open;
  api.close = close;
  api.isOpen = function () { return openT >= 0; };
  api.setPaused = function (p) { paused = p; };
  api.snapshot = function () {
    var t = now(); frame(t, 1 / 60); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);
    return out;
  };
  /** for checks: jump the camera to its target framing */
  api.snapCamera = function () { placeCamera(true); };
  /** for checks: screen extents (NDC) of the framing points and of the real lid */
  api.debugFrame = function () {
    lidG.updateMatrixWorld(true); camera.updateMatrixWorld(true);
    var ext = function (pts) { var e = { x0: 9, x1: -9, y0: 9, y1: -9 }; pts.forEach(function (p) { var v = p.clone().project(camera); e.x0 = Math.min(e.x0, v.x); e.x1 = Math.max(e.x1, v.x); e.y0 = Math.min(e.y0, v.y); e.y1 = Math.max(e.y1, v.y); }); return e; };
    var lid = [], h = U / 2;
    lidCells.forEach(function (c) { for (var i = 0; i < 8; i++) lid.push(new THREE.Vector3(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld)); });
    return { key: ext(keyPoints(openT >= 0)), lid: ext(lid), lidPos: lidG.position.toArray(), rest: lidRest.pos.toArray(), rot: [lidG.rotation.x, lidG.rotation.y, lidG.rotation.z, lidG.rotation.order] };
  };
  /** for checks: how many lid cube corners are inside the box, below the podium or inside the reward plate */
  api.collisions = function () {
    lidG.updateMatrixWorld(true); rewardG.updateMatrixWorld(true);
    var inv = new THREE.Matrix4().copy(rewardG.matrixWorld).invert(), v = new THREE.Vector3(), r = new THREE.Vector3(), h = U / 2;
    var bh = N * U / 2, out = { box: 0, floor: 0, reward: 0 };
    lidCells.concat(lidRibbon).forEach(function (c) {
      for (var i = 0; i < 8; i++) {
        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);
        if (v.y < -0.01) out.floor++;
        if (Math.abs(v.x) < bh - 0.02 && Math.abs(v.z) < bh - 0.02 && v.y < HB * U - 0.02) out.box++;
        r.copy(v).applyMatrix4(inv);
        if (openT >= 0 && now() - openT > 1.1 && Math.abs(r.x) < plateW / 2 && Math.abs(r.y) < plateH / 2 && Math.abs(r.z) < 0.4) out.reward++;
      }
    });
    return out;
  };
  /** lowest point of the lid (for checks: it must stay above the podium) */
  api.lidBottom = function () {
    lidG.updateMatrixWorld(true);
    var min = Infinity, v = new THREE.Vector3(), h = U / 2;
    lidCells.concat(lidRibbon).forEach(function (c) {
      for (var i = 0; i < 8; i++) {
        v.set(c[0] + (i & 1 ? h : -h), c[1] + (i & 2 ? h : -h), c[2] + (i & 4 ? h : -h)).applyMatrix4(lidG.matrixWorld);
        if (v.y < min) min = v.y;
      }
    });
    return min;
  };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); }); });
    renderer.dispose(); cv.remove(); ov.remove();
  };
  return api;
}
