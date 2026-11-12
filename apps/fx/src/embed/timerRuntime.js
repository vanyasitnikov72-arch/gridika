/* Gridika · Таймер акции — runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. Digits are a 5×7 pixel font turned into cubes;
 * when a digit changes, the cubes the new digit does not need fly away, the missing ones fly in,
 * the shared ones stay. Time is counted from an absolute moment (UTC ms), not from page load.
 *
 * data: { end: <UTC ms>, format: 'dhms' | 'hms' | 'dhm', title: '', button: { text, url } | null,
 *         personal: <hours> | 0 — "N hours from this visitor's first visit" (remembered in their browser), pid: '<id>',
 *         endAction: 'text' | 'link' | 'hide', endText: '', endUrl: '', mode: 'sale' | 'launch' | 'newyear' }
 */

export var TIMER_MODES = {
  sale: { label: 'Распродажа', digit: '#e8343f', colon: '#ffc83d', podium: '#ffc83d', podiumEdge: '#f0a91b', title: '#2a1416', btn: '#e8343f', btnText: '#ffffff', confetti: ['#e8343f', '#ffc83d', '#ffffff', '#ff8a3d'] },
  launch: { label: 'Запуск', digit: '#35e0b0', colon: '#7c8cff', podium: '#1f2a33', podiumEdge: '#2c3b47', title: '#0f2a24', btn: '#16a37f', btnText: '#ffffff', confetti: ['#35e0b0', '#7c8cff', '#ffffff', '#c7f9ea'] },
  newyear: { label: 'Новый год', digit: '#1f9a57', colon: '#f2c14e', podium: '#f2c14e', podiumEdge: '#d9a630', title: '#123222', btn: '#1f9a57', btnText: '#ffffff', confetti: ['#1f9a57', '#f2c14e', '#ffffff', '#e8343f'], fall: '#ffffff' },
  blackfriday: { label: 'Чёрная пятница', digit: '#17171d', colon: '#ff2e88', podium: '#ff2e88', podiumEdge: '#e0207a', title: '#17171d', btn: '#17171d', btnText: '#ffffff', confetti: ['#ff2e88', '#17171d', '#ffffff', '#ffd23f'] },
  minimal: { label: 'Минимал', digit: '#2b2b33', colon: '#b9b2a6', podium: '#ece6da', podiumEdge: '#ddd5c6', title: '#2b2b33', btn: '#2b2b33', btnText: '#ffffff', confetti: ['#2b2b33', '#b9b2a6', '#ffffff'] },
  spring: { label: 'Весна', digit: '#ec5c9a', colon: '#a78bfa', podium: '#fde2ef', podiumEdge: '#f7c6dc', title: '#5b1f45', btn: '#ec4899', btnText: '#ffffff', confetti: ['#ec5c9a', '#a78bfa', '#ffffff', '#fbcfe8'], fall: '#fbcfe8' },
};

var FONT = {
  0: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};
function bit(d, c) { return FONT[d][Math.floor(c / 5)][c % 5] === '1'; }

/** time left as digits: [[d,d],[h,h],[m,m],[s,s]] (days left out for 'hms') */
export function timerParts(endMs, nowMs, format) {
  var s = Math.max(0, Math.floor((endMs - nowMs) / 1000));
  var d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  var two = function (v) { v = Math.min(99, v); return [Math.floor(v / 10), v % 10]; };
  if (format === 'hms') return { left: s, groups: [two(Math.min(99, Math.floor(s / 3600))), two(m), two(sec)] };
  if (format === 'dhm') return { left: s, groups: [two(d), two(h), two(m)] };
  return { left: s, groups: [two(d), two(h), two(m), two(sec)] };
}

var GROUP_LABELS = { dhms: ['дней', 'часов', 'минут', 'секунд'], hms: ['часов', 'минут', 'секунд'], dhm: ['дней', 'часов', 'минут'] };

/** personal countdown: the end is this visitor's first visit + N hours (kept in their browser) */
function personalEnd(data, studio, studioStart) {
  var span = data.personal * 3600000;
  if (studio) return studioStart + span;
  var key = 'gridika-timer-' + (data.pid || 'x'), first = 0;
  try { first = parseInt(localStorage.getItem(key) || '0', 10) || 0; } catch (e) {}
  if (!first) { first = Date.now(); try { localStorage.setItem(key, String(first)); } catch (e) {} }
  return first + span;
}

export function createTimerViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data, previewEnd: false, studio: !!init.studio };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }
  function pal() { return TIMER_MODES[state.data.mode] || TIMER_MODES.sale; }

  // ---------- DOM: title / stage (canvas + labels + final text) / button ----------
  var css = [
    '.gtm{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}',
    '.gtm-title{font-weight:800;font-size:clamp(16px,2.6vw,24px);line-height:1.2;margin:0 0 6px;letter-spacing:-.01em}',
    '.gtm-stage{position:relative;width:100%}',
    '.gtm-stage canvas{display:block;width:100%;height:100%}',
    '.gtm-labels{position:absolute;inset:0;pointer-events:none}',
    '.gtm-labels span{position:absolute;transform:translateX(-50%);font-size:clamp(10px,1.5vw,13px);font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.55;transition:opacity .4s}',
    '.gtm-end{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 16px;font-weight:900;font-size:clamp(22px,5vw,46px);letter-spacing:-.02em;line-height:1.1;opacity:0;transform:scale(.9);transition:opacity .6s,transform .7s cubic-bezier(.34,1.56,.64,1);pointer-events:none}',
    '.gtm-flash{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,255,255,.95),rgba(255,255,255,0) 70%);opacity:0;pointer-events:none}',
    '.gtm-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:10px;padding:13px 24px;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;box-shadow:0 10px 24px -10px rgba(0,0,0,.45);transition:transform .2s,filter .2s}',
    '.gtm-btn:hover{transform:translateY(-1px);filter:brightness(1.06)}',
  ].join('');
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  var root = document.createElement('div');
  root.className = 'gtm';
  root.innerHTML = '<style>' + css + '</style><div class="gtm-title"></div><div class="gtm-stage"><div class="gtm-labels"></div><div class="gtm-flash"></div><div class="gtm-end"></div></div><a class="gtm-btn" target="_top"></a>';
  container.appendChild(root);
  var titleEl = root.querySelector('.gtm-title'), stage = root.querySelector('.gtm-stage'), labelsEl = root.querySelector('.gtm-labels');
  var flashEl = root.querySelector('.gtm-flash'), endEl = root.querySelector('.gtm-end'), btnEl = root.querySelector('.gtm-btn');

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Timer WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, previewEnd: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  stage.insertBefore(renderer.domElement, labelsEl);
  var cv = renderer.domElement;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(26, 2.4, 0.1, 500);
  var hemi = new THREE.HemisphereLight(0xffffff, 0xd9d2c5, 1.5); scene.add(hemi);
  var key = new THREE.DirectionalLight(0xffffff, 1.7); key.position.set(-4, 9, 10); scene.add(key);
  var group = new THREE.Group(); scene.add(group);
  // a fixed slight tilt shows the tops of the cubes and the podium (labels are placed for this view)
  group.rotation.x = 0.16;
  var cube = new THREE.BoxGeometry(U * 0.9, U * 0.9, U * 1.3);
  var digitMat = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.05, emissive: 0x000000 });
  var podiumMat = new THREE.MeshStandardMaterial({ roughness: 0.6 });
  var bitMat = new THREE.MeshStandardMaterial({ roughness: 0.5 });

  // ---------- layout ----------
  var slots = [], N = 0, digitMesh = null, colonMesh = null, podium = null, layout = null;
  var on, kind, tC, cur, groupsNow = null;
  // narrow blocks (phones, small columns): days : hours over minutes : seconds, twice the size
  var ROW_GAP = 13;
  function wantTwoRows() {
    var w = stage.clientWidth || container.clientWidth || 600;
    return state.data.format === 'dhms' && w < 480;
  }
  function buildLayout() {
    [digitMesh, colonMesh].forEach(function (m) { if (m) { group.remove(m); m.dispose(); } });
    if (podium) { group.remove(podium); podium.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); }
    var nGroups = state.data.format === 'dhms' ? 4 : 3;
    var twoRows = nGroups === 4 && wantTwoRows();
    var rows = twoRows ? [[0, 1], [2, 3]] : [nGroups === 3 ? [0, 1, 2] : [0, 1, 2, 3]];
    slots = []; var colons = [], groupCenters = [], maxCols = 0;
    podium = new THREE.Group();
    rows.forEach(function (gs, r) {
      var cols = gs.length * 11 + (gs.length - 1) * 3, x0 = -(cols - 1) / 2, yOff = (rows.length - 1) * ROW_GAP / 2 - r * ROW_GAP;
      maxCols = Math.max(maxCols, cols);
      var x = 0;
      gs.forEach(function (g, k) {
        groupCenters[g] = { x: (x0 + x + 5) * U, y: (yOff - 5.4) * U };
        slots.push({ x: x0 + x, y: yOff }); slots.push({ x: x0 + x + 6, y: yOff });
        x += 11;
        if (k < gs.length - 1) { colons.push({ x: x0 + x + 1, y: yOff }); x += 3; }
      });
      // podium under each row
      var slab = new THREE.Mesh(new THREE.BoxGeometry((cols + 4) * U, U * 1.1, U * 5), podiumMat);
      slab.position.set(0, (yOff - 4.2) * U, -U * 1.2);
      podium.add(slab);
    });
    group.add(podium);
    N = slots.length * 35;
    digitMesh = new THREE.InstancedMesh(cube, digitMat, N);
    digitMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    on = new Uint8Array(N); kind = new Uint8Array(N); tC = new Float32Array(N); cur = slots.map(function () { return -1; });
    var m4 = new THREE.Matrix4();
    for (var i = 0; i < N; i++) { m4.makeScale(0, 0, 0); digitMesh.setMatrixAt(i, m4); }
    group.add(digitMesh);
    // colons: two cubes each
    colonMesh = new THREE.InstancedMesh(cube, bitMat, Math.max(1, colons.length * 2));
    colonMesh.count = colons.length * 2;
    colons.forEach(function (c, k) {
      [2, 4].forEach(function (row, j) { m4.makeTranslation(c.x * U, (c.y + 3 - row) * U, 0); colonMesh.setMatrixAt(k * 2 + j, m4); });
    });
    group.add(colonMesh);
    layout = { cols: maxCols, rows: rows.length, groupCenters: groupCenters, nGroups: nGroups, twoRows: twoRows };
    groupsNow = null;
    if (ended) { podium.visible = colonMesh.visible = false; }
    applyColors();
    buildLabels();
    fit();
  }
  function home(slot, c, out) {
    out.set((slots[slot].x + (c % 5)) * U, (slots[slot].y + 3 - Math.floor(c / 5)) * U, 0);
    return out;
  }

  function applyColors() {
    var p = pal();
    digitMat.color.set(p.digit); digitMat.emissive.set(p.digit);
    bitMat.color.set(p.colon);
    podiumMat.color.set(p.podium);
    titleEl.style.color = p.title; endEl.style.color = p.digit;
    labelsEl.style.color = p.title;
    btnEl.style.background = p.btn; btnEl.style.color = p.btnText;
    if (confMesh) colorConfetti();
  }

  // ---------- digits changing ----------
  var tmp = new THREE.Vector3(), q = new THREE.Quaternion(), e = new THREE.Euler(), sv = new THREE.Vector3(), m4b = new THREE.Matrix4();
  var dirtyUntil = 0;
  function setDigit(slot, d, t, first) {
    if (cur[slot] === d) return;
    var base = slot * 35;
    for (var c = 0; c < 35; c++) {
      var i = base + c, want = d >= 0 && bit(d, c) ? 1 : 0;
      if (want && !on[i]) { kind[i] = 1; tC[i] = t + (first ? slot * 0.06 + rnd(i) * 0.25 : rnd(i + t) * 0.12); }
      else if (!want && on[i]) { kind[i] = 2; tC[i] = t + rnd(i + 3) * 0.08; }
      on[i] = want;
    }
    cur[slot] = d;
    dirtyUntil = Math.max(dirtyUntil, t + (first ? 1.6 : 0.8));
  }
  var APPEAR = 0.45, LEAVE = 0.38;
  function placeDigits(t) {
    if (t > dirtyUntil + 0.05) return;
    for (var i = 0; i < N; i++) {
      var slot = Math.floor(i / 35), c = i % 35;
      home(slot, c, tmp);
      var sc = on[i] ? 1 : 0, ax = 0, ay = 0;
      if (kind[i] === 1) {
        var k = reduced ? 1 : clamp01((t - tC[i]) / APPEAR), ek = easeOutBack(k);
        tmp.y += (1 - easeOut(k)) * U * (2.5 + rnd(i) * 2); tmp.z += (1 - easeOut(k)) * U * 3;
        tmp.x += (1 - easeOut(k)) * (rnd(i + 5) - 0.5) * U * 2;
        sc = Math.max(0, ek); ax = (1 - k) * 2;
        if (k >= 1) kind[i] = 0;
      } else if (kind[i] === 2) {
        var k2 = reduced ? 1 : clamp01((t - tC[i]) / LEAVE);
        tmp.x += (rnd(i + 9) - 0.5) * U * 3 * k2; tmp.y -= U * 1.5 * k2 * k2; tmp.z += U * 2.5 * k2;
        sc = 1 - easeOut(k2); ay = k2 * 3;
        if (k2 >= 1) { kind[i] = 0; sc = 0; }
      }
      e.set(ax, ay, 0); q.setFromEuler(e); sv.setScalar(Math.max(0.0001, sc));
      m4b.compose(tmp, q, sv); digitMesh.setMatrixAt(i, m4b);
    }
    digitMesh.instanceMatrix.needsUpdate = true;
  }

  // ---------- labels under the groups ----------
  function buildLabels() {
    var names = GROUP_LABELS[state.data.format] || GROUP_LABELS.dhms;
    labelsEl.innerHTML = names.map(function (n) { return '<span>' + n + '</span>'; }).join('');
    placeLabels();
  }
  function placeLabels() {
    if (!layout) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    var spans = labelsEl.children;
    for (var g = 0; g < spans.length; g++) {
      tmp.set(layout.groupCenters[g].x, layout.groupCenters[g].y, U * 1.3).applyMatrix4(group.matrixWorld).project(camera);
      spans[g].style.left = ((tmp.x + 1) / 2 * w).toFixed(1) + 'px';
      spans[g].style.top = ((1 - tmp.y) / 2 * h).toFixed(1) + 'px';
    }
  }

  // ---------- confetti and snow ----------
  var confMesh = null, conf = null, confT = -10;
  var CN = 160;
  function colorConfetti() {
    var p = pal(), col = new THREE.Color();
    for (var i = 0; i < CN; i++) { col.set(p.confetti[i % p.confetti.length]); confMesh.setColorAt(i, col); }
    if (confMesh.instanceColor) confMesh.instanceColor.needsUpdate = true;
  }
  confMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.42, U * 0.42, U * 0.16), new THREE.MeshStandardMaterial({ roughness: 0.5 }), CN);
  confMesh.frustumCulled = false;
  conf = new Float32Array(CN * 9);
  (function () { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var i = 0; i < CN; i++) confMesh.setMatrixAt(i, m); })();
  colorConfetti();
  scene.add(confMesh);
  function burst() {
    confT = now();
    for (var i = 0; i < CN; i++) {
      var o = i * 9, a = rnd(i) * Math.PI * 2, sp = 6 + rnd(i + 1) * 10;
      conf[o] = (rnd(i + 2) - 0.5) * layout.cols * U * 0.6; conf[o + 1] = 0; conf[o + 2] = U * 2;
      conf[o + 3] = Math.cos(a) * sp * 0.6; conf[o + 4] = 6 + rnd(i + 3) * 9; conf[o + 5] = Math.sin(a) * sp * 0.3 + 2;
      conf[o + 6] = rnd(i + 4) * 6; conf[o + 7] = rnd(i + 5) * 6; conf[o + 8] = 0;
    }
  }
  var lastConfT = 0;
  function updateConfetti(t) {
    var age = t - confT;
    if (age > 3.6) { if (age < 3.8) { var m = new THREE.Matrix4().makeScale(0, 0, 0); for (var j = 0; j < CN; j++) confMesh.setMatrixAt(j, m); confMesh.instanceMatrix.needsUpdate = true; } return; }
    var dt = Math.min(0.05, Math.max(0, t - lastConfT)); lastConfT = t;
    for (var i = 0; i < CN; i++) {
      var o = i * 9;
      conf[o + 4] -= 18 * dt; conf[o + 3] *= 0.99; conf[o + 5] *= 0.99;
      conf[o] += conf[o + 3] * dt; conf[o + 1] += conf[o + 4] * dt; conf[o + 2] += conf[o + 5] * dt;
      conf[o + 6] += dt * 7; conf[o + 7] += dt * 5;
      tmp.set(conf[o], conf[o + 1], conf[o + 2]); e.set(conf[o + 6], conf[o + 7], 0); q.setFromEuler(e);
      sv.setScalar(age > 2.8 ? Math.max(0.0001, 1 - (age - 2.8) / 0.8) : 1);
      m4b.compose(tmp, q, sv); confMesh.setMatrixAt(i, m4b);
    }
    confMesh.instanceMatrix.needsUpdate = true;
  }

  var SN = 70, snow = new THREE.InstancedMesh(new THREE.BoxGeometry(U * 0.28, U * 0.28, U * 0.28), new THREE.MeshBasicMaterial({ color: 0xffffff }), SN);
  snow.frustumCulled = false; scene.add(snow);
  function updateSnow(t) {
    var fall = pal().fall, show = !!fall && !reduced;
    if (show) snow.material.color.set(fall);
    snow.visible = show;
    if (!show || !layout) return;
    var W = (layout.cols + 10) * U, H = (layout.rows * ROW_GAP + 4) * U;
    for (var i = 0; i < SN; i++) {
      var sp = 0.5 + rnd(i) * 0.7, y = H / 2 - (((t * sp * 1.6 + rnd(i + 1) * H) % H));
      tmp.set((rnd(i + 2) - 0.5) * W + Math.sin(t * 0.8 + i) * 0.3, y + 1, (rnd(i + 3) - 0.3) * 6);
      e.set(t * sp, t * sp * 0.7, 0); q.setFromEuler(e); sv.setScalar(0.6 + rnd(i + 4) * 0.8);
      m4b.compose(tmp, q, sv); snow.setMatrixAt(i, m4b);
    }
    snow.instanceMatrix.needsUpdate = true;
  }

  // ---------- the end ----------
  var ended = false;
  function showEnd(animated) {
    var d = state.data, preview = state.previewEnd;
    ended = true;
    var t = now();
    for (var s = 0; s < slots.length; s++) setDigit(s, -1, t, false);
    podium.visible = colonMesh.visible = false;
    labelsEl.style.opacity = '0';
    var text = d.endText || 'Акция началась!';
    if (d.endAction === 'hide' && !preview && !state.studio) { container.style.display = 'none'; return; }
    if (d.endAction === 'hide') text = 'Блок скроется';
    if (d.endAction === 'link' && d.endUrl) {
      if (!preview && !state.studio && animated) setTimeout(function () { try { window.top.location.href = d.endUrl; } catch (er) { location.href = d.endUrl; } }, 1800);
      else if (preview || state.studio) text = (d.endText || 'Акция началась!') + ' →';
    }
    endEl.textContent = text;
    endEl.style.opacity = '1'; endEl.style.transform = 'scale(1)';
    if (animated && !reduced) {
      burst();
      flashEl.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], { duration: 900, easing: 'ease-out' });
    }
  }
  function hideEnd() {
    ended = false;
    podium.visible = colonMesh.visible = true;
    labelsEl.style.opacity = '';
    endEl.style.opacity = '0'; endEl.style.transform = 'scale(.9)';
    groupsNow = null;
  }

  var studioStart = Date.now();
  function tick(t) {
    if (state.previewEnd) { if (!ended) showEnd(true); return; }
    var endMs = state.data.personal > 0 ? personalEnd(state.data, state.studio, studioStart) : state.data.end;
    var parts = timerParts(endMs, Date.now(), state.data.format);
    if (parts.left <= 0) { if (!ended) showEnd(groupsNow !== null); return; }
    if (ended) hideEnd();
    var first = groupsNow === null;
    var flat = [];
    parts.groups.forEach(function (g) { flat.push(g[0], g[1]); });
    for (var s = 0; s < slots.length; s++) setDigit(s, flat[s], t, first);
    groupsNow = parts.groups;
  }

  // ---------- frame ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true;
  function now() { return (performance.now() - t0) / 1000; }
  function frame(t) {
    if (!layout) return;
    tick(t);
    placeDigits(t);
    // the standing digits breathe a little
    digitMat.emissiveIntensity = (reduced ? 0.06 : 0.05 + 0.05 * (0.5 + 0.5 * Math.sin(t * 2.2))) + (pal().glow || 0);
    updateConfetti(t); updateSnow(t);
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(); last = t;
    if (!visible || paused) return;
    frame(t); renderer.render(scene, camera);
  }
  function fit() {
    if (!layout) return;
    if (layout.twoRows !== wantTwoRows()) return buildLayout();
    var w = stage.clientWidth || 600;
    // the stage keeps the timer's proportions: digits, podium and labels with a little air
    var worldW = (layout.cols + 5) * U, worldH = (layout.rows * ROW_GAP + 3) * U;
    var h = Math.round(w * worldH / worldW);
    stage.style.height = h + 'px';
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    var halfW = worldW / 2, halfH = worldH / 2;
    var dist = Math.max(halfH / tanV, halfW / (tanV * camera.aspect)) * 1.04 + U * 3;
    camera.position.set(0, U * 0.4, dist); camera.lookAt(0, -U * 1.2, 0);
    camera.near = dist / 40; camera.far = dist * 4; camera.updateProjectionMatrix();
    group.updateMatrixWorld(true);
    placeLabels();
  }

  function applyText() {
    var d = state.data;
    titleEl.textContent = d.title || '';
    titleEl.style.display = d.title ? '' : 'none';
    if (d.button && d.button.text) {
      btnEl.style.display = ''; btnEl.textContent = d.button.text;
      if (d.button.url) btnEl.href = d.button.url; else btnEl.removeAttribute('href');
    } else btnEl.style.display = 'none';
  }

  var ro = new ResizeObserver(fit); ro.observe(stage);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) { var en = es[0]; visible = en ? en.isIntersecting : true; }, { threshold: [0, 0.01] });
    io.observe(container);
  }

  applyText(); buildLayout(); loop();

  // ---------- public ----------
  api.setData = function (d) {
    var prev = state.data;
    state.data = d;
    applyText(); applyColors();
    if (d.personal !== prev.personal) studioStart = Date.now();
    if (d.format !== prev.format) { buildLayout(); hideEnd(); }
    else if (d.end !== prev.end || d.personal !== prev.personal || d.endAction !== prev.endAction || d.endText !== prev.endText) { if (ended) hideEnd(); }
  };
  /** studio: show what happens at the end */
  api.previewEnd = function (v) { state.previewEnd = !!v; if (!v && ended) hideEnd(); };
  api.setPaused = function (p) { paused = p; };
  api.snapshot = function () {
    frame(now()); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    out.getContext('2d').drawImage(cv, 0, 0);
    return out;
  };
  /** for checks: skip the fly-in */
  api.settle = function () { dirtyUntil = now() + 0.05; for (var i = 0; i < N; i++) { tC[i] = -100; } };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
    [digitMat, podiumMat, bitMat].forEach(function (m) { m.dispose(); });
    renderer.dispose(); root.remove();
  };
  return api;
}
