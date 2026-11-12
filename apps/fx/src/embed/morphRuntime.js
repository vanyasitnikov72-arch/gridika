/* Gridika · Морф «до / после» — runtime shared by the studio and the site snippet.
 * Plain JS without imports: three.js is passed in. Both pictures come as colour grids of the same
 * size (RGB565, base64), so the snippet carries no image files.
 *
 * data: { w, h, a: '<base64 RGB565>', b: '<base64 RGB565>', labels: ['До', 'После'] | null,
 *         speed: 'slow' | 'normal' | 'fast', labelStyle: 'dark' | 'light', depth: 'flat' | 'deep',
 *         control: 'slider' | 'scroll' | 'auto', mode: 'wave' | 'burst' | 'pixel' }
 */

export var MORPH_MODES = {
  wave: { label: 'Волна' },
  burst: { label: 'Взрыв' },
  pixel: { label: 'Пиксель' },
  spiral: { label: 'Спираль' },
  rain: { label: 'Дождь' },
  mosaic: { label: 'Мозаика' },
};
var SPEED = { slow: 1.6, normal: 1, fast: 0.6 };

/** base64 RGB565 → Float32Array of sRGB 0..1 triples */
export function decodeMorphGrid(s, n) {
  var bin = atob(s), out = new Float32Array(n * 3);
  for (var i = 0; i < n; i++) {
    var v = bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8);
    out[i * 3] = ((v >> 11) & 31) / 31;
    out[i * 3 + 1] = ((v >> 5) & 63) / 63;
    out[i * 3 + 2] = (v & 31) / 31;
  }
  return out;
}

export function createMorphViewer(THREE, container, init) {
  var U = 0.5;
  var state = { data: init.data };
  var api = {};
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function clamp01(t) { return t < 0 ? 0 : t > 1 ? 1 : t; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function rnd(i) { var n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); }

  // ---------- renderer / scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); } catch (e2) {
      console.warn('Morph WebGLRenderer init failed:', e2);
      var noop = function () {};
      return { setData: noop, setProgress: noop, setPaused: noop, snapshot: function () { return document.createElement('canvas'); }, dispose: noop };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.touchAction = 'pan-y';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
  var group = new THREE.Group(); scene.add(group);
  var D = U * 0.6, cube = null;
  function depthOf(d) { return d.depth === 'deep' ? U * 1.6 : U * 0.6; }

  // Unlit colours with a fixed shade per face: the face looking at the camera keeps the exact photo
  // colour, sides and tops darken a little so lifted cubes read as 3D.
  var mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  mat.onBeforeCompile = function (sh) {
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vViewN;')
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        'vec3 nn = normal;',
        '#ifdef USE_INSTANCING',
        'nn = mat3(instanceMatrix) * nn;',
        '#endif',
        'vViewN = normalize(normalMatrix * nn);',
      ].join('\n'));
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vViewN;')
      .replace('#include <color_fragment>', [
        '#include <color_fragment>',
        'vec3 n = normalize(vViewN);',
        'float shade = 0.58 + 0.42 * max(n.z, 0.0) + 0.12 * n.y;',
        'diffuseColor.rgb *= clamp(shade, 0.4, 1.0);',
      ].join('\n'));
  };
  mat.customProgramCacheKey = function () { return 'gridika-morph-faces'; };

  // ---------- overlay: labels, slider, scroll hint, autoplay pill (plain DOM on top of the canvas) ----------
  var css = [
    '.gmx{position:absolute;inset:0;pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#fff}',
    '.gmx-chip{position:absolute;top:12px;padding:5px 11px;border-radius:999px;background:rgba(18,16,26,.5);font-size:12px;font-weight:700;letter-spacing:.02em;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);transition:opacity .3s}',
    '.gmx-light .gmx-chip{background:rgba(255,255,255,.88);color:#1d1a24;box-shadow:0 2px 10px rgba(0,0,0,.12)}',
    '.gmx-glass{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;border-radius:999px;background:rgba(18,16,26,.42);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 0 0 1px rgba(255,255,255,.14);transition:opacity .45s,transform .45s}',
    '.gmx-slider{width:min(68%,400px);height:44px;padding:0 22px;box-sizing:border-box;pointer-events:auto;cursor:grab;touch-action:none;outline:none}',
    '.gmx-slider:focus-visible{box-shadow:0 8px 24px rgba(0,0,0,.2),inset 0 0 0 2px #fff}',
    '.gmx-track{position:relative;flex:1;height:6px;border-radius:6px;background:rgba(255,255,255,.26)}',
    '.gmx-fill{position:absolute;left:0;top:0;bottom:0;border-radius:6px;background:linear-gradient(90deg,rgba(255,255,255,.55),#fff)}',
    '.gmx-knob{position:absolute;top:50%;width:32px;height:32px;margin:-16px 0 0 -16px;border-radius:50%;background:#fff;color:#221d2c;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.32),0 0 0 5px rgba(255,255,255,.22);transition:transform .18s cubic-bezier(.34,1.56,.64,1)}',
    '.gmx-slider:hover .gmx-knob{transform:scale(1.08)}',
    '.gmx-drag{cursor:grabbing}.gmx-drag .gmx-knob{transform:scale(.92)}',
    '.gmx-hint{padding:8px 15px 8px 11px;font-size:12.5px;font-weight:600;white-space:nowrap}',
    '.gmx-mouse{position:relative;width:15px;height:23px;border:2px solid #fff;border-radius:9px;box-sizing:border-box;flex:none}',
    '.gmx-mouse:after{content:"";position:absolute;left:50%;top:4px;width:2px;height:5px;margin-left:-1px;border-radius:2px;background:#fff;animation:gmx-wheel 1.5s ease-in-out infinite}',
    '@keyframes gmx-wheel{0%{transform:translateY(0);opacity:1}65%{transform:translateY(7px);opacity:0}100%{transform:translateY(7px);opacity:0}}',
    '.gmx-auto{padding:6px 15px 6px 6px;font-size:12px;font-weight:600;pointer-events:auto;white-space:nowrap;max-width:calc(100% - 24px);box-sizing:border-box}',
    '.gmx-auto [data-t]{overflow:hidden;text-overflow:ellipsis}',
    '.gmx-hint{max-width:calc(100% - 24px);box-sizing:border-box}',
    '.gmx-play{width:28px;height:28px;border-radius:50%;border:0;background:#fff;color:#221d2c;display:flex;align-items:center;justify-content:center;cursor:pointer;flex:none;padding:0}',
    '.gmx-mini{position:relative;width:56px;height:4px;border-radius:4px;background:rgba(255,255,255,.28);overflow:hidden;flex:none}',
    '.gmx-mini i{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:#fff}',
    '.gmx-slider,.gmx-auto{opacity:.45}',
    '.gmx-on .gmx-slider,.gmx-on .gmx-auto,.gmx-slider:focus-visible,.gmx-drag{opacity:1}',
    '.gmx-swipe{position:relative;width:14px;height:26px;flex:none}',
    '.gmx-swipe:before{content:"";position:absolute;left:50%;top:3px;bottom:3px;width:2px;margin-left:-1px;border-radius:2px;background:rgba(255,255,255,.35)}',
    '.gmx-swipe i{position:absolute;left:50%;top:14px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.28);animation:gmx-swipe 1.6s ease-in-out infinite}',
    '.gmx-rev .gmx-swipe i{animation-name:gmx-swipe-down}',
    '@keyframes gmx-swipe{0%{top:14px;opacity:0}20%{top:14px;opacity:1}75%{top:0;opacity:1}100%{top:0;opacity:0}}',
    '@keyframes gmx-swipe-down{0%{top:0;opacity:0}20%{top:0;opacity:1}75%{top:14px;opacity:1}100%{top:14px;opacity:0}}',
    '@media (prefers-reduced-motion: reduce){.gmx-mouse:after,.gmx-swipe i{animation:none}}',
  ].join('');
  var ui = document.createElement('div');
  ui.className = 'gmx';
  ui.innerHTML = '<style>' + css + '</style>';
  container.appendChild(ui);
  var el = function (tag, cls, html) { var x = document.createElement(tag); if (cls) x.className = cls; if (html) x.innerHTML = html; ui.appendChild(x); return x; };
  var chipA = el('span', 'gmx-chip'), chipB = el('span', 'gmx-chip');
  chipA.style.left = '12px'; chipB.style.right = '12px';
  var CHEV = '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 2 1 6l4 4M11 2l4 4-4 4"/></svg>';
  // slider
  var bar = el('div', 'gmx-glass gmx-slider', '<div class="gmx-track"><div class="gmx-fill"></div><div class="gmx-knob">' + CHEV + '</div></div>');
  bar.setAttribute('role', 'slider'); bar.setAttribute('aria-label', 'До / после'); bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', '100'); bar.tabIndex = 0;
  var track = bar.querySelector('.gmx-track'), fill = bar.querySelector('.gmx-fill'), knob = bar.querySelector('.gmx-knob');
  // scroll: how to use it, and how far it has gone
  var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var hint = el('div', 'gmx-glass gmx-hint', (touch ? '<span class="gmx-swipe"><i></i></span>' : '<span class="gmx-mouse"></span>') + '<span data-h></span>');
  var hintText = hint.querySelector('[data-h]');
  var HINT_DOWN = touch ? 'Листайте страницу' : 'Прокрутите вниз', HINT_UP = touch ? 'Листайте назад — вернуть' : 'Прокрутите вверх — вернуть';
  // autoplay: pause / play and where it is
  var PLAY = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  var PAUSE = '<svg width="12" height="12" viewBox="0 0 12 12"><rect x="2" y="1.5" width="3" height="9" rx="1" fill="currentColor"/><rect x="7" y="1.5" width="3" height="9" rx="1" fill="currentColor"/></svg>';
  var auto = el('div', 'gmx-glass gmx-auto', '<button type="button" class="gmx-play" aria-label="Пауза">' + PAUSE + '</button><span class="gmx-mini"><i></i></span><span data-t>Меняется само</span>');
  auto.title = 'Нажмите на фото, чтобы переключить сразу';
  var playBtn = auto.querySelector('.gmx-play'), autoFill = auto.querySelector('.gmx-mini i'), autoText = auto.querySelector('[data-t]');
  var autoPaused = false;

  // the controls stay dim until the visitor comes to the block (hover, touch, keyboard)
  var quietTimer = 0;
  function wake(ms) {
    clearTimeout(quietTimer);
    ui.classList.add('gmx-on');
    if (ms) quietTimer = setTimeout(function () { if (!dragging && !canvasDrag) ui.classList.remove('gmx-on'); }, ms);
  }
  container.addEventListener('pointerenter', function (ev) { if (ev.pointerType === 'mouse') wake(0); });
  container.addEventListener('pointerleave', function (ev) { if (ev.pointerType === 'mouse') wake(1200); });
  container.addEventListener('pointerdown', function (ev) { if (ev.pointerType !== 'mouse') wake(2500); });
  container.addEventListener('focusin', function () { wake(0); });
  container.addEventListener('focusout', function () { wake(1200); });

  // ---------- grid ----------
  var mesh = null, N = 0, colA, colB, delay, rx, ry, dirX, dirY, amp, curFace;
  var size = { w: 1, h: 1 };
  var col = new THREE.Color();

  function build() {
    if (mesh) { group.remove(mesh); mesh.dispose(); mesh = null; }
    var d = state.data;
    N = d.w * d.h;
    size = { w: d.w * U, h: d.h * U };
    if (cube) cube.dispose();
    D = depthOf(d);
    cube = new THREE.BoxGeometry(U, U, D);
    colA = decodeMorphGrid(d.a, N); colB = decodeMorphGrid(d.b, N);
    mesh = new THREE.InstancedMesh(cube, mat, N);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    delay = new Float32Array(N); rx = new Float32Array(N); ry = new Float32Array(N);
    dirX = new Float32Array(N); dirY = new Float32Array(N); amp = new Float32Array(N);
    curFace = new Int8Array(N).fill(-1);
    var cx = (d.w - 1) / 2, cy = (d.h - 1) / 2, maxR = Math.hypot(cx, cy) || 1;
    for (var y = 0, i = 0; y < d.h; y++) {
      for (var x = 0; x < d.w; x++, i++) {
        rx[i] = (x - cx) * U; ry[i] = (cy - y) * U;
        var dx = x - cx, dy = cy - y, dl = Math.hypot(dx, dy) || 1;
        dirX[i] = dx / dl; dirY[i] = dy / dl; amp[i] = 0.5 + rnd(i + 3) * 0.8;
      }
    }
    setDelays();
    group.add(mesh);
    lastP = -1;
    resize();
  }
  function setDelays() {
    var d = state.data, cx = (d.w - 1) / 2, cy = (d.h - 1) / 2, maxR = Math.hypot(cx, cy) || 1;
    for (var y = 0, i = 0; y < d.h; y++) {
      for (var x = 0; x < d.w; x++, i++) {
        var fx = x / Math.max(1, d.w - 1), fy = y / Math.max(1, d.h - 1);
        if (d.mode === 'burst') delay[i] = (Math.hypot(x - cx, y - cy) / maxR) * 0.75 + rnd(i + 11) * 0.25;
        else if (d.mode === 'pixel') delay[i] = fy * 0.7 + fx * 0.15 + rnd(i + 13) * 0.15;
        else if (d.mode === 'spiral') {
          // a spiral arm sweeping out from the centre
          var ang = (Math.atan2(cy - y, x - cx) + Math.PI) / (Math.PI * 2);
          delay[i] = (Math.hypot(x - cx, y - cy) / maxR) * 0.55 + ang * 0.35 + rnd(i + 19) * 0.1;
        }
        else if (d.mode === 'rain') delay[i] = fx * 0.2 + fy * 0.25 + rnd(i + 23) * 0.55;
        else if (d.mode === 'mosaic') delay[i] = rnd(i + 29);
        else delay[i] = fx * 0.88 + rnd(i + 17) * 0.12;
      }
    }
  }

  // ---------- progress ----------
  var P = 0, target = 0, lastP = -1, dragging = false, uiDirty = true;
  var m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
  function windowFor(mode) {
    return mode === 'pixel' ? 0.3 : mode === 'burst' ? 0.5 : mode === 'spiral' ? 0.42 : mode === 'rain' ? 0.4 : mode === 'mosaic' ? 0.22 : 0.36;
  }

  function place(Pv) {
    if (!mesh) return;
    var mode = state.data.mode, L = windowFor(mode);
    for (var i = 0; i < N; i++) {
      var l = clamp01((Pv - delay[i] * (1 - L)) / L), s = Math.sin(Math.PI * l);
      var x = rx[i], y = ry[i], z = 0, ax = 0, ay = 0, az = 0, face;
      if (mode === 'pixel') {
        var k = easeInOut(l); ax = Math.PI * k; z = s * D * 1.2; face = k < 0.5 ? 0 : 1;
      } else if (mode === 'burst') {
        var a = amp[i];
        x += dirX[i] * s * U * 5 * a; y += dirY[i] * s * U * 5 * a; z = s * U * 9 * a;
        ax = s * (rnd(i + 21) - 0.5) * 5; ay = s * (rnd(i + 23) - 0.5) * 5; face = l < 0.5 ? 0 : 1;
      } else if (mode === 'spiral') {
        // the cube is carried round the centre and lifted, then set down in the new picture
        var th = s * 1.4, cs = Math.cos(th), sn = Math.sin(th);
        x = rx[i] * cs - ry[i] * sn; y = rx[i] * sn + ry[i] * cs;
        z = s * U * 4.5 * amp[i]; az = s * 1.6; ax = s * 0.4; face = l < 0.5 ? 0 : 1;
      } else if (mode === 'rain') {
        // the old cube falls away, the new one drops in from above
        if (l < 0.5) { var kf = l * 2; y -= kf * kf * U * 16; z = kf * U * 2; ax = kf * 1.4; face = 0; }
        else { var kr = (l - 0.5) * 2, er = 1 - (1 - kr) * (1 - kr) * (1 - kr); y += (1 - er) * U * 16; z = (1 - er) * U * 2; ax = -(1 - er) * 1.4; face = 1; }
        if (l <= 0) face = 0;
      } else if (mode === 'mosaic') {
        var km = easeInOut(l); ay = Math.PI * km; z = s * D * 1.4; face = km < 0.5 ? 0 : 1;
      } else {
        z = s * U * 3.2; ay = s * 0.5; ax = -s * 0.25; face = l < 0.5 ? 0 : 1;
      }
      e.set(ax, ay, az); q.setFromEuler(e); p.set(x, y, z);
      m4.compose(p, q, one); mesh.setMatrixAt(i, m4);
      if (face !== curFace[i]) {
        var c = face ? colB : colA;
        col.setRGB(c[i * 3], c[i * 3 + 1], c[i * 3 + 2], THREE.SRGBColorSpace);
        mesh.setColorAt(i, col); curFace[i] = face;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function updateUi() {
    var d = state.data, labels = d.labels, c = d.control;
    ui.classList.toggle('gmx-light', d.labelStyle === 'light');
    chipA.textContent = labels ? labels[0] : ''; chipB.textContent = labels ? labels[1] : '';
    chipA.style.display = labels && labels[0] ? '' : 'none'; chipB.style.display = labels && labels[1] ? '' : 'none';
    chipA.style.opacity = String(1 - smooth(clamp01(P * 1.6))); chipB.style.opacity = String(smooth(clamp01(P * 1.6 - 0.6)));
    bar.style.display = c === 'slider' ? '' : 'none';
    fill.style.width = (P * 100).toFixed(2) + '%'; knob.style.left = (P * 100).toFixed(2) + '%';
    bar.setAttribute('aria-valuenow', String(Math.round(P * 100)));
    // scroll: the hint says which way to scroll; it hides while the picture is changing
    hint.style.display = c === 'scroll' ? '' : 'none';
    if (c === 'scroll') {
      var moving = P > 0.02 && P < 0.98;
      hintText.textContent = target > 0.5 ? HINT_UP : HINT_DOWN;
      hint.classList.toggle('gmx-rev', target > 0.5);
      hint.style.opacity = moving ? '0' : '1';
      hint.style.transform = 'translateX(-50%) translateY(' + (moving ? '10px' : '0') + ')';
    }
    auto.style.display = c === 'auto' ? '' : 'none';
    autoFill.style.width = (P * 100).toFixed(2) + '%';
  }

  // ---------- controls ----------
  function setFromClientX(clientX, el) {
    var r = el.getBoundingClientRect();
    target = clamp01((clientX - r.left) / r.width);
  }
  bar.addEventListener('pointerdown', function (ev) { dragging = true; bar.classList.add('gmx-drag'); bar.setPointerCapture(ev.pointerId); setFromClientX(ev.clientX, track); });
  bar.addEventListener('pointermove', function (ev) { if (dragging) setFromClientX(ev.clientX, track); });
  var endDrag = function () { dragging = false; bar.classList.remove('gmx-drag'); };
  bar.addEventListener('pointerup', endDrag);
  bar.addEventListener('pointercancel', endDrag);
  bar.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') { target = clamp01(target + 0.1); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') { target = clamp01(target - 0.1); ev.preventDefault(); }
  });
  // dragging across the picture moves the transition too (slider mode)
  var canvasDrag = false;
  // mouse: press and drag; finger: only a sideways swipe moves the transition, an up/down swipe scrolls the page
  var touchStart = null;
  cv.addEventListener('pointerdown', function (ev) {
    if (state.data.control !== 'slider') return;
    if (ev.pointerType === 'mouse') { canvasDrag = true; cv.setPointerCapture(ev.pointerId); setFromClientX(ev.clientX, cv); }
    else touchStart = { x: ev.clientX, y: ev.clientY, id: ev.pointerId };
  });
  cv.addEventListener('pointermove', function (ev) {
    if (canvasDrag) return setFromClientX(ev.clientX, cv);
    if (!touchStart) return;
    var dx = ev.clientX - touchStart.x, dy = ev.clientY - touchStart.y;
    if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      canvasDrag = true; touchStart = null;
      try { cv.setPointerCapture(ev.pointerId); } catch (e) {}
      wake(2500); setFromClientX(ev.clientX, cv);
    } else if (Math.abs(dy) > 10) touchStart = null;
  });
  var endCanvasDrag = function () { canvasDrag = false; touchStart = null; };
  cv.addEventListener('pointerup', endCanvasDrag);
  cv.addEventListener('pointercancel', endCanvasDrag);
  cv.addEventListener('click', function () {
    // autoplay: a click on the picture flips to the other one right away
    if (state.data.control !== 'auto') return;
    if (autoPaused) setAutoPaused(false);
    autoT0 = now() - (P > 0.5 ? AUTO.hold * 2 + AUTO.morph : AUTO.hold);
  });
  function setAutoPaused(v) {
    autoPaused = v;
    playBtn.innerHTML = v ? PLAY : PAUSE;
    playBtn.setAttribute('aria-label', v ? 'Продолжить' : 'Пауза');
    autoText.textContent = v ? 'Пауза' : 'Меняется само';
    // resume from where it stopped: the next phase that starts at this picture
    if (!v) autoT0 = now() - (P > 0.5 ? AUTO.hold + AUTO.morph : 0);
  }
  playBtn.addEventListener('click', function (ev) { ev.stopPropagation(); setAutoPaused(!autoPaused); });

  var AUTO = { hold: 1.6, morph: 2.2 }, autoT0 = 0;
  function sp() { return SPEED[state.data.speed] || 1; }
  function syncSpeed() { AUTO.hold = 1.6 * sp(); AUTO.morph = 2.2 * sp(); }
  function autoTarget(t) {
    var cyc = AUTO.hold * 2 + AUTO.morph * 2, u = ((t - autoT0) % cyc + cyc) % cyc;
    if (u < AUTO.hold) return 0;
    if (u < AUTO.hold + AUTO.morph) return easeInOut((u - AUTO.hold) / AUTO.morph);
    if (u < AUTO.hold * 2 + AUTO.morph) return 1;
    return 1 - easeInOut((u - AUTO.hold * 2 - AUTO.morph) / AUTO.morph);
  }
  var lastScrollY = window.scrollY, scrollAcc = 0;
  function onScroll() {
    if (state.data.control !== 'scroll' || !visible) { lastScrollY = window.scrollY; return; }
    var dy = window.scrollY - lastScrollY; lastScrollY = window.scrollY;
    if (dy === 0) return;
    // a new direction starts counting anew
    if ((dy > 0) !== (scrollAcc > 0)) scrollAcc = 0;
    scrollAcc += dy;
    if (scrollAcc > 24) target = 1;
    else if (scrollAcc < -24) target = 0;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- animation ----------
  var t0 = performance.now(), last = 0, raf = 0, paused = false, visible = true, manual = false;
  function now() { return (performance.now() - t0) / 1000; }

  function frame(t, dt) {
    if (!mesh) return;
    var c = state.data.control;
    if (!manual) {
      if (c === 'auto') { if (!autoPaused) target = reduced ? (Math.floor(t / 4) % 2) : autoTarget(t); }
    }
    if (reduced) P = target;
    // scroll: an even pace, the whole change takes ~1.5 s; the rest follows the target softly
    else if (c === 'scroll' && !manual) { var pace = dt / (1.5 * sp()); P += Math.max(-pace, Math.min(pace, target - P)); }
    else P += (target - P) * Math.min(1, dt * (c === 'auto' ? 30 : 9));
    if (Math.abs(target - P) < 0.0005) P = target;
    if (P !== lastP) { place(P); lastP = P; updateUi(); }
    else if (uiDirty) { updateUi(); }
    uiDirty = false;
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    var t = now(), dt = Math.min(0.05, t - last); last = t;
    if (!visible || paused) return;
    frame(t, dt); renderer.render(scene, camera);
  }

  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 300, aspect = w / h;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = aspect;
    var tanV = Math.tan((camera.fov * Math.PI) / 360);
    // the picture stays flat and fills the frame edge to edge: the front faces sit right on its border
    var dist = Math.max(size.h / 2 / tanV, size.w / 2 / (tanV * aspect)) + D / 2;
    camera.position.set(0, 0, dist); camera.lookAt(0, 0, 0);
    camera.near = dist / 50; camera.far = dist * 4; camera.updateProjectionMatrix();
  }

  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (es) { var en = es[0]; visible = en ? en.isIntersecting : true; }, { threshold: [0, 0.01] });
    io.observe(container);
  }

  syncSpeed(); build(); place(0); updateUi(); loop();

  // ---------- public ----------
  api.setData = function (d) {
    var gridChanged = !state.data || d.w !== state.data.w || d.h !== state.data.h || d.a !== state.data.a || d.b !== state.data.b || d.depth !== state.data.depth;
    var modeChanged = d.mode !== state.data.mode;
    state.data = d;
    if (gridChanged) build();
    else if (modeChanged) setDelays();
    curFace.fill(-1); lastP = -1; uiDirty = true;
    scrollAcc = 0; lastScrollY = window.scrollY;
    if (d.control === 'scroll' && !manual) target = 0;
    syncSpeed();
    if (d.control === 'auto') { autoT0 = now(); setAutoPaused(false); }
    manual = false;
  };
  /** studio / checks: hold the transition at a point (0 = before, 1 = after) */
  api.setProgress = function (v, instant) { manual = true; target = clamp01(v); if (instant) { P = target; lastP = -1; } };
  api.release = function () { manual = false; if (state.data.control === 'auto') autoT0 = now(); };
  api.setPaused = function (pz) { paused = pz; };
  api.snapshot = function () {
    frame(now(), 1 / 60); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    out.getContext('2d').drawImage(cv, 0, 0);
    return out;
  };
  api.dispose = function () {
    cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); window.removeEventListener('scroll', onScroll);
    if (mesh) mesh.dispose(); cube.dispose(); mat.dispose(); renderer.dispose(); cv.remove(); ui.remove();
  };
  return api;
}
