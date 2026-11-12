/* Gridika · Визитка с QR — runtime shared by the studio and the Tilda snippet.
 * Plain JS without imports: three.js is passed in, so the same text can be inlined into the embed.
 * Everything the card needs (contact text, links, the precomputed QR matrix) comes in `data`. */

export const CARD_PALETTES = {
  emerald: { body: '#0f4d3a', edge: '#0b3b2d', bgA: '#14684f', bgB: '#0a3326', text: '#f4f1ec', sub: '#a9dcc6', accent: '#8BF0C2', panel: '#f6f2ea', module: '#0b2a20', cube: '#19C37D', cubeIcon: '#0a3326', metal: 0.1 },
  graphite: { body: '#2a2f37', edge: '#1c2026', bgA: '#3a414c', bgB: '#1b1f25', text: '#eef1f5', sub: '#a7b0bd', accent: '#d4dbe5', panel: '#f1efeb', module: '#15181d', cube: '#e6e9ee', cubeIcon: '#22272e', metal: 0.25 },
  gold: { body: '#15120d', edge: '#b8933f', bgA: '#211c14', bgB: '#0c0a07', text: '#ecd9a4', sub: '#b7a274', accent: '#d9b45f', panel: '#f5ecd6', module: '#16130d', cube: '#d9b45f', cubeIcon: '#15120d', metal: 0.7 },
  ocean: { body: '#0d2f4f', edge: '#0a2540', bgA: '#164a7a', bgB: '#0a2540', text: '#eef6ff', sub: '#9cc3e6', accent: '#6fd3ff', panel: '#f1f6fb', module: '#0a1f33', cube: '#6fd3ff', cubeIcon: '#0a2540', metal: 0.15 },
  berry: { body: '#4a1026', edge: '#3a0c1e', bgA: '#6e1838', bgB: '#2e0918', text: '#fff0f4', sub: '#e3a3b8', accent: '#ff8fb1', panel: '#fbf1f4', module: '#2a0814', cube: '#ff8fb1', cubeIcon: '#3a0c1e', metal: 0.1 },
  amethyst: { body: '#2a1a52', edge: '#1f1340', bgA: '#41297e', bgB: '#1a1036', text: '#f4f0ff', sub: '#b9a8e8', accent: '#b69cff', panel: '#f5f2fc', module: '#160d2e', cube: '#b69cff', cubeIcon: '#1f1340', metal: 0.15 },
  terracotta: { body: '#7a3420', edge: '#5e2717', bgA: '#9c4a2c', bgB: '#5a2414', text: '#fff4ea', sub: '#f0c2a4', accent: '#ffd2a8', panel: '#fbf3ea', module: '#3a160b', cube: '#ffd2a8', cubeIcon: '#5a2414', metal: 0.05 },
  snow: { body: '#f2efe9', edge: '#d9d3c7', bgA: '#ffffff', bgB: '#ebe6dc', text: '#1d1f22', sub: '#6b6560', accent: '#1f6f54', panel: '#ffffff', module: '#111312', cube: '#1d1f22', cubeIcon: '#ffffff', metal: 0.05 },
};

export const CARD_STYLES = ['classic', 'minimal', 'pixel', 'wave', 'split', 'diagonal', 'grid'];

export function createCardViewer(THREE, container, init) {
  var W = 5.4, H = 8.6, D = 0.24, R = 0.38, FACE_Z = D / 2 + 0.035;
  var FONT = "'Nunito', system-ui, sans-serif";
  var state = { data: init.data, mode: init.mode || 'graphite', style: init.style || 'classic', logo: init.logo || null };
  var api = { onFlip: null };

  // ---------- helpers ----------
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function pal() { return CARD_PALETTES[state.mode] || CARD_PALETTES.graphite; }
  function rrShape(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function faceGeo(w, h, r) {
    var g = new THREE.ShapeGeometry(rrShape(w, h, r), 10), p = g.attributes.position, uv = g.attributes.uv;
    for (var i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
    return g;
  }
  /** rounded cube: extruded rounded square; caps (group 0) get 0..1 UVs for an icon */
  function roundCube(size, depth, r) {
    var b = Math.min(0.05, depth * 0.2);
    var g = new THREE.ExtrudeGeometry(rrShape(size - b * 2, size - b * 2, r), { depth: depth - b * 2, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });
    g.translate(0, 0, -depth / 2 + b);
    var p = g.attributes.position, uv = g.attributes.uv, cap = g.groups[0];
    for (var i = cap.start; i < cap.start + cap.count; i++) uv.setXY(i, (p.getX(i) + size / 2) / size, (p.getY(i) + size / 2) / size);
    return g;
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function fit(ctx, text, weight, size, maxW) {
    var s = size;
    var minS = Math.max(24, Math.round(size * 0.45)); // below this the line stops reading: cut it instead
    do { ctx.font = weight + ' ' + s + 'px ' + FONT; if (ctx.measureText(text).width <= maxW) break; s -= 4; } while (s > minS);
    return s;
  }
  /** fit() and, if even the smallest size is too wide, cut the end off with an ellipsis */
  function fitStr(ctx, text, weight, size, maxW) {
    fit(ctx, text, weight, size, maxW);
    if (ctx.measureText(text).width <= maxW) return text;
    var t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.replace(/\s+$/, '') + '…';
  }
  function hash(x, y) { var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return n - Math.floor(n); }
  function mix(a, b, t) {
    var A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
    var r = Math.round(((A >> 16) & 255) * (1 - t) + ((B >> 16) & 255) * t);
    var g = Math.round(((A >> 8) & 255) * (1 - t) + ((B >> 8) & 255) * t);
    var bl = Math.round((A & 255) * (1 - t) + (B & 255) * t);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }
  function icon(ctx, kind, cx, cy, s, color) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(s / 24, s / 24); ctx.translate(-12, -12);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (kind === 'telegram') {
      ctx.beginPath(); ctx.moveTo(21.5, 3.5); ctx.lineTo(2.5, 11); ctx.lineTo(9.5, 13.5); ctx.lineTo(12, 20.5); ctx.lineTo(15, 15.5); ctx.lineTo(19.5, 19); ctx.closePath(); ctx.fill();
    } else if (kind === 'whatsapp') {
      ctx.beginPath(); ctx.arc(12, 11.5, 8.5, 0.7 * Math.PI, 2.55 * Math.PI); ctx.lineTo(4.2, 20.5); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(9, 8.5); ctx.quadraticCurveTo(9, 14.5, 15.5, 15); ctx.stroke();
    } else if (kind === 'site') {
      ctx.beginPath(); ctx.arc(12, 12, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(12, 12, 4, 9, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(21, 12); ctx.stroke();
    } else if (kind === 'phone') {
      ctx.beginPath(); ctx.moveTo(6, 3.5); ctx.lineTo(9.5, 3.5); ctx.lineTo(11, 8); ctx.lineTo(8.8, 9.6); ctx.quadraticCurveTo(10.5, 13.5, 14.4, 15.2);
      ctx.lineTo(16, 13); ctx.lineTo(20.5, 14.5); ctx.lineTo(20.5, 18); ctx.quadraticCurveTo(20.5, 20.5, 18, 20.5); ctx.quadraticCurveTo(3.5, 19.5, 3.5, 6); ctx.quadraticCurveTo(3.5, 3.5, 6, 3.5); ctx.fill();
    } else {
      rr(ctx, 3, 5.5, 18, 13, 2.5); ctx.stroke(); ctx.beginPath(); ctx.moveTo(3.5, 7); ctx.lineTo(12, 13); ctx.lineTo(20.5, 7); ctx.stroke();
    }
    ctx.restore();
  }
  function tex(canvas) {
    var t = new THREE.CanvasTexture(canvas);
    if ('colorSpace' in t) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  // ---------- scene ----------
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
  } catch (e1) {
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    } catch (e2) {
      console.warn('Card WebGLRenderer init failed:', e2);
      return {
        domElement: document.createElement('div'),
        setContact: function() {},
        setMode: function() {},
        setStyle: function() {},
        setLogo: function() {},
        setFlipped: function() {},
        setPaused: function() {},
        checkScan: function() { return { ok: false }; },
        dispose: function() {}
      };
    }
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  var cv = renderer.domElement;
  cv.style.display = 'block'; cv.style.width = '100%'; cv.style.height = '100%'; cv.style.touchAction = 'pan-y';

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(-4, 6, 10); scene.add(key);
  var rim = new THREE.DirectionalLight(0xffffff, 0.6); rim.position.set(6, -3, 4); scene.add(rim);

  var floatG = new THREE.Group(), pivot = new THREE.Group();
  floatG.add(pivot); scene.add(floatG);

  var bodyMat = new THREE.MeshStandardMaterial({ roughness: 0.55 });
  var frontCanvas = document.createElement('canvas'); frontCanvas.width = 1080; frontCanvas.height = 1720;
  var backCanvas = document.createElement('canvas'); backCanvas.width = 1080; backCanvas.height = 1720;
  var frontTex = tex(frontCanvas), backTex = tex(backCanvas);
  var frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.62 });
  var backMat = new THREE.MeshBasicMaterial({ map: backTex });

  var body = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(W, H, R), { depth: D, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 14 }), bodyMat);
  body.position.z = -D / 2; pivot.add(body);
  var front = new THREE.Mesh(faceGeo(W, H, R), frontMat); front.position.z = FACE_Z; pivot.add(front);
  var back = new THREE.Mesh(faceGeo(W, H, R), backMat); back.rotation.y = Math.PI; back.position.z = -FACE_Z; pivot.add(back);
  var qrGroup = new THREE.Group(); qrGroup.rotation.y = Math.PI; qrGroup.position.z = -FACE_Z; pivot.add(qrGroup);
  var cubeGroup = new THREE.Group(); cubeGroup.position.z = FACE_Z; pivot.add(cubeGroup);

  var glareMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uPos: { value: new THREE.Vector2(0.3, 0.7) }, uStrength: { value: 0 }, uAspect: { value: W / H } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec2 vUv; uniform vec2 uPos; uniform float uStrength; uniform float uAspect;' +
      'void main(){ vec2 p = vUv - uPos; p.x *= uAspect; float spot = exp(-dot(p,p) * 7.0);' +
      'float band = exp(-pow((vUv.x + vUv.y) - (uPos.x + uPos.y), 2.0) * 22.0) * 0.45;' +
      'gl_FragColor = vec4(vec3(1.0), (spot * 0.55 + band) * uStrength); }',
  });
  var glare = new THREE.Mesh(faceGeo(W, H, R), glareMat); glare.position.z = FACE_Z + 0.004; pivot.add(glare);

  var sc = document.createElement('canvas'); sc.width = 256; sc.height = 384;
  var sctx = sc.getContext('2d'); sctx.filter = 'blur(22px)'; sctx.fillStyle = 'rgba(30,25,20,0.55)'; rr(sctx, 50, 50, 156, 284, 26); sctx.fill();
  var shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.55, H * 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.55 }));
  shadow.position.set(0.45, -0.7, -2.2); scene.add(shadow);

  var moduleMat = new THREE.MeshStandardMaterial({ roughness: 0.7 });
  var qrMesh = null, qrCells = [], qrModule = 0.08;
  var cubes = [];

  // ---------- drawing ----------
  function drawMonogram(ctx, x, y, s, p, invert) {
    var c = state.data.contact;
    if (state.logo && state.logo.width) {
      var k = Math.min(s / state.logo.width, s / state.logo.height);
      ctx.drawImage(state.logo, x, y + (s - state.logo.height * k) / 2, state.logo.width * k, state.logo.height * k);
      return;
    }
    var initials = (c.name.trim() || 'Ваше Имя').split(/\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');
    ctx.fillStyle = invert ? p.bgB : p.accent; rr(ctx, x, y, s, s, s * 0.23); ctx.fill();
    ctx.fillStyle = invert ? p.accent : p.bgB; ctx.font = '900 ' + Math.round(s * 0.48) + 'px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(initials, x + s / 2, y + s / 2 + s * 0.03);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
  function contactRows() {
    var c = state.data.contact, rows = [];
    if (c.phone.trim()) rows.push(['phone', c.phone.trim()]);
    if (c.email.trim()) rows.push(['email', c.email.trim()]);
    if (state.data.siteLabel) rows.push(['site', state.data.siteLabel]);
    return rows;
  }
  function nameLines() {
    var n = state.data.contact.name.trim() || 'Ваше Имя', w = n.split(/\s+/);
    return w.length > 1 ? [w[0], w.slice(1).join(' ')] : [n];
  }

  function drawFront() {
    var p = pal(), c = state.data.contact, ctx = frontCanvas.getContext('2d'), cw = 1080, ch = 1720, maxW = cw - 180;
    var g = ctx.createLinearGradient(0, 0, cw, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    var st = state.style, rows = contactRows(), lines = nameLines(), y, i;

    if (st === 'minimal') {
      ctx.strokeStyle = p.accent; ctx.globalAlpha = 0.35; ctx.lineWidth = 4; rr(ctx, 50, 50, cw - 100, ch - 100, 46); ctx.stroke(); ctx.globalAlpha = 1;
      drawMonogram(ctx, cw / 2 - 70, 170, 140, p);
      ctx.textAlign = 'center'; ctx.fillStyle = p.text; y = 640;
      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 120, maxW), cw / 2, y); y += 126; }
      ctx.fillStyle = p.accent; ctx.fillRect(cw / 2 - 50, y - 40, 100, 6); y += 50;
      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 52, maxW), cw / 2, y); y += 62; }
      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 44, maxW), cw / 2, y); }
      y = 1200;
      for (i = 0; i < rows.length; i++) { ctx.fillStyle = p.text; ctx.fillText(fitStr(ctx, rows[i][1], 700, 44, maxW), cw / 2, y); y += 66; }
      ctx.textAlign = 'left';
    } else {
      var top = 110;
      if (st === 'pixel') {
        // voxel mosaic across the top half, monogram sitting on it
        var cell = 60;
        for (var gy = 0; gy < 11; gy++) for (var gx = 0; gx < 18; gx++) {
          var h = hash(gx, gy), fade = 1 - gy / 11;
          if (h > 0.3 + fade * 0.55) continue;
          ctx.globalAlpha = 0.18 + fade * 0.62;
          ctx.fillStyle = mix(p.accent, p.bgA, 0.1 + h * 0.55);
          rr(ctx, 20 + gx * cell, 20 + gy * cell, cell - 8, cell - 8, 8); ctx.fill();
        }
        ctx.globalAlpha = 1; top = 470;
        drawMonogram(ctx, 90, 140, 210, p);
      } else if (st === 'wave') {
        // the Gridika wave washing in from the bottom-left
        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.18;
        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1020);
        ctx.bezierCurveTo(260, 900, 420, 1180, 640, 1120); ctx.bezierCurveTo(860, 1060, 940, 1240, cw, 1200); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 0.32;
        ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1260); ctx.bezierCurveTo(300, 1150, 520, 1420, 760, 1340); ctx.bezierCurveTo(900, 1290, 980, 1380, cw, 1360); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
        drawMonogram(ctx, 90, 110, 190, p);
      } else if (st === 'split') {
        // two-tone: a solid accent block with the name, the dark half below
        var sg = ctx.createLinearGradient(0, 0, cw, 900); sg.addColorStop(0, p.accent); sg.addColorStop(1, mix(p.accent, p.bgA, 0.25));
        ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cw, 0); ctx.lineTo(cw, 860); ctx.bezierCurveTo(760, 930, 320, 830, 0, 900); ctx.closePath(); ctx.fill();
        drawMonogram(ctx, 90, 110, 170, p, true);
      } else if (st === 'diagonal') {
        // a bold diagonal band with thin echoes
        // kept above the name: at the left edge the band ends well before the first line of text
        ctx.save(); ctx.translate(cw * 0.8, 40); ctx.rotate(-0.45);
        ctx.fillStyle = p.accent; ctx.globalAlpha = 0.9; ctx.fillRect(-1100, -70, 2200, 140);
        ctx.globalAlpha = 0.35; ctx.fillRect(-1100, -126, 2200, 16); ctx.fillRect(-1100, -160, 2200, 6);
        ctx.restore(); ctx.globalAlpha = 1;
        drawMonogram(ctx, 90, 110, 190, p);
      } else if (st === 'grid') {
        // blueprint: a fine grid and crop marks
        ctx.strokeStyle = p.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.12;
        for (gx = 60; gx < cw; gx += 60) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, ch); ctx.stroke(); }
        for (gy = 60; gy < ch; gy += 60) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(cw, gy); ctx.stroke(); }
        ctx.globalAlpha = 0.8; ctx.lineWidth = 5;
        [[50, 50, 1, 1], [cw - 50, 50, -1, 1], [50, ch - 50, 1, -1], [cw - 50, ch - 50, -1, -1]].forEach(function (k) {
          ctx.beginPath(); ctx.moveTo(k[0], k[1] + k[3] * 70); ctx.lineTo(k[0], k[1]); ctx.lineTo(k[0] + k[2] * 70, k[1]); ctx.stroke();
        });
        ctx.globalAlpha = 1; ctx.lineWidth = 6; rr(ctx, 90, 110, 190, 190, 44); ctx.stroke();
        var gi = (c.name.trim() || 'Ваше Имя').split(/\s+/).slice(0, 2).map(function (w) { return (w[0] || '').toUpperCase(); }).join('');
        if (state.logo && state.logo.width) drawMonogram(ctx, 105, 125, 160, p);
        else { ctx.fillStyle = p.accent; ctx.font = '900 88px ' + FONT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(gi, 185, 212); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; }
      } else {
        // classic: a few cubes fading out of the top-right corner
        for (gy = 0; gy < 9; gy++) for (gx = 0; gx < 9; gx++) {
          var d = Math.hypot(gx, gy) / 9;
          if (hash(gx, gy) > 0.82 - d * 0.5 || d > 1.05) continue;
          ctx.globalAlpha = 0.22 * (1 - d); ctx.fillStyle = p.accent;
          rr(ctx, cw - 70 - (gx + 1) * 46, 70 + gy * 46, 38, 38, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
        drawMonogram(ctx, 90, 110, 190, p);
      }
      y = st === 'pixel' ? 820 : st === 'split' ? 500 : 720;
      ctx.fillStyle = st === 'split' ? p.bgB : p.text;
      for (i = 0; i < lines.length; i++) { ctx.fillText(fitStr(ctx, lines[i], 900, 128, maxW), 90, y); y += 132; }
      y += st === 'split' ? 170 : 10;
      if (c.role.trim()) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, c.role.trim(), 800, 56, maxW), 92, y); y += 64; }
      if (c.company.trim()) { ctx.fillStyle = p.sub; ctx.fillText(fitStr(ctx, c.company.trim(), 700, 46, maxW), 92, y); }
      var ry = st === 'pixel' ? 1290 : 1220;
      ctx.fillStyle = p.accent; ctx.fillRect(92, ry - 90, 90, 8);
      for (i = 0; i < rows.length; i++) {
        icon(ctx, rows[i][0], 112, ry - 16, 40, p.accent); ctx.fillStyle = p.text;
        ctx.fillText(fitStr(ctx, rows[i][1], 700, 46, maxW - 80), 160, ry); ry += 72;
      }
      void top;
    }
    ctx.fillStyle = p.sub; ctx.globalAlpha = 0.7; ctx.font = '700 34px ' + FONT; ctx.textAlign = 'right';
    ctx.fillText('QR на обороте ↻', cw - 90, ch - 92); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
    frontTex.needsUpdate = true;
  }

  function drawBack() {
    var p = pal(), ctx = backCanvas.getContext('2d'), cw = 1080, ch = 1720;
    var g = ctx.createLinearGradient(cw, 0, 0, ch); g.addColorStop(0, p.bgA); g.addColorStop(1, p.bgB);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cw, ch);
    if (state.style === 'pixel') {
      for (var gx = 0; gx < 18; gx++) for (var gy = 0; gy < 3; gy++) {
        var h = hash(gx + 40, gy); if (h > 0.55) continue;
        ctx.globalAlpha = 0.18 + h * 0.3; ctx.fillStyle = p.accent; rr(ctx, 20 + gx * 60, ch - 200 + gy * 60, 52, 52, 8); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else if (state.style === 'wave') {
      ctx.fillStyle = p.accent; ctx.globalAlpha = 0.2;
      ctx.beginPath(); ctx.moveTo(0, ch); ctx.lineTo(0, 1500); ctx.bezierCurveTo(300, 1420, 600, 1600, cw, 1480); ctx.lineTo(cw, ch); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
    }
    var m = 70;
    ctx.fillStyle = p.panel; rr(ctx, m, m + 40, cw - m * 2, cw - m * 2, 48); ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = p.text; ctx.font = '900 72px ' + FONT; ctx.fillText('Сохранить контакт', cw / 2, cw + 180);
    ctx.fillStyle = p.sub; ctx.font = '700 42px ' + FONT;
    ctx.fillText('Наведите камеру телефона', cw / 2, cw + 250); ctx.fillText('на QR-код', cw / 2, cw + 300);
    var n = state.data.contact.name.trim();
    if (n) { ctx.fillStyle = p.accent; ctx.fillText(fitStr(ctx, n, 800, 52, cw - 200), cw / 2, ch - (state.style === 'pixel' ? 250 : 150)); }
    ctx.textAlign = 'left';
    backTex.needsUpdate = true;
  }

  function buildQr() {
    if (qrMesh) { qrGroup.remove(qrMesh); qrMesh.geometry.dispose(); }
    var q = state.data.qr, size = q.size, quiet = 3, unit = W / 1080, panelPx = 1080 - 140;
    var mod = (panelPx * unit) / (size + quiet * 2), cy = H / 2 - (70 + 40 + panelPx / 2) * unit;
    qrModule = mod; qrCells = [];
    for (var i = 0; i < q.cells.length; i++) {
      var c = q.cells[i][0], r = q.cells[i][1];
      var dc = Math.hypot(c - size / 2, r - size / 2) / (size * 0.71);
      qrCells.push({ x: (c - (size - 1) / 2) * mod, y: cy - (r - (size - 1) / 2) * mod, delay: dc * 0.55 + ((r * 7 + c * 13) % 10) * 0.012 });
    }
    qrMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(mod * 1.04, mod * 1.04, mod * 0.9), moduleMat, qrCells.length);
    qrGroup.add(qrMesh);
    assembleStart = flipped ? -2 : -1;
    updateQr(1e9);
  }

  var mtx = new THREE.Matrix4(), quat = new THREE.Quaternion(), scl = new THREE.Vector3(), vec = new THREE.Vector3();
  function updateQr(now) {
    if (!qrMesh) return;
    var h = qrModule * 0.9;
    for (var i = 0; i < qrCells.length; i++) {
      var cell = qrCells[i], k;
      if (assembleStart === -1) k = 0; else if (assembleStart === -2) k = 1; else k = (now - assembleStart - cell.delay) / 0.45;
      k = Math.min(1, Math.max(0, k));
      var e = easeOutBack(k), s = Math.max(0.0001, Math.min(1.08, e));
      vec.set(cell.x, cell.y, h / 2 + (1 - Math.min(1, e)) * 2.2); scl.set(s, s, s);
      mtx.compose(vec, quat, scl); qrMesh.setMatrixAt(i, mtx);
    }
    qrMesh.instanceMatrix.needsUpdate = true;
  }

  function cubeTex(kind) {
    var p = pal(), c = document.createElement('canvas'); c.width = c.height = 128;
    var ctx = c.getContext('2d'); ctx.fillStyle = p.cube; ctx.fillRect(0, 0, 128, 128); icon(ctx, kind, 64, 64, 62, p.cubeIcon);
    return tex(c);
  }
  function buildCubes() {
    cubes.forEach(function (cb) { cubeGroup.remove(cb.mesh); cb.mesh.geometry.dispose(); cb.mesh.material.forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); });
    cubes = [];
    var size = 0.66, links = (state.data.links || []).slice(0, 3), p = pal(), metal = state.mode === 'gold' ? 0.5 : 0.05;
    links.forEach(function (l, i) {
      var face = new THREE.MeshStandardMaterial({ map: cubeTex(l.kind), roughness: 0.5, metalness: metal * 0.8 });
      var side = new THREE.MeshStandardMaterial({ color: p.cube, roughness: 0.5, metalness: metal });
      var mesh = new THREE.Mesh(roundCube(size, size * 0.55, 0.1), [face, side]);
      var bx = state.style === 'minimal' ? (i - (links.length - 1) / 2) * (size + 0.22) : -W / 2 + 0.62 + size / 2 + i * (size + 0.22);
      mesh.position.set(bx, -H / 2 + 0.62 + size / 2, size * 0.275);
      cubeGroup.add(mesh);
      cubes.push({ mesh: mesh, url: l.url, lift: 0 });
    });
  }

  function applyMode() {
    var p = pal();
    bodyMat.color.set(p.edge); bodyMat.metalness = p.metal; bodyMat.roughness = p.metal > 0.5 ? 0.35 : 0.55;
    moduleMat.color.set(p.module);
  }
  function redraw() { drawFront(); drawBack(); buildCubes(); }

  // ---------- interaction ----------
  var raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(), inside = false, hovered = null, down = null;
  var flipped = false, flipFrom = 0, flipTo = 0, flipStart = -1, assembleStart = -1;
  var tiltX = 0, tiltY = 0, distFront = 20, distBack = 18, visible = true, paused = false, raf = 0, disposed = false;
  var t0 = performance.now();
  function now() { return (performance.now() - t0) / 1000; }
  var gyro = null;

  function flipAngle(t) {
    if (flipStart < 0) return flipTo;
    var k = Math.min(1, (t - flipStart) / 0.9);
    return flipFrom + (flipTo - flipFrom) * easeInOut(k);
  }
  function setFlipped(f) {
    if (f === flipped) return;
    var t = now(); flipFrom = flipAngle(t); flipped = f; flipTo = f ? Math.PI : 0; flipStart = t;
    if (f) assembleStart = t + 0.55;
    if (api.onFlip) api.onFlip(f);
  }
  cv.addEventListener('pointermove', function (e) {
    var r = cv.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); inside = true;
  });
  cv.addEventListener('pointerleave', function () { inside = false; hovered = null; cv.style.cursor = ''; });
  cv.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; });
  cv.addEventListener('pointerup', function (e) {
    if (!down) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y; down = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { setFlipped(!flipped); return; }
    if (Math.hypot(dx, dy) > 8) return;
    if (hovered && !flipped) { window.open(hovered.url, '_blank', 'noopener'); return; }
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObject(pivot, true).length) setFlipped(!flipped);
  });
  // phones: tilt with the gyroscope once the page gets orientation events
  window.addEventListener('deviceorientation', function (e) {
    if (e.beta == null || e.gamma == null) return;
    gyro = { x: Math.max(-1, Math.min(1, (e.beta - 40) / 30)), y: Math.max(-1, Math.min(1, e.gamma / 30)) };
  });

  function resize() {
    var w = container.clientWidth || 400, h = container.clientHeight || 500;
    renderer.setSize(w, h, false); cv.style.width = '100%'; cv.style.height = '100%';
    camera.aspect = w / h;
    var fov = THREE.MathUtils.degToRad(camera.fov);
    function fitD(pw, ph) { return Math.max((H * ph) / 2 / Math.tan(fov / 2), (W * pw) / 2 / Math.tan(fov / 2) / camera.aspect); }
    distFront = fitD(1.3, 1.18); distBack = distFront; // the QR side keeps the same size as the front
    camera.position.set(0, 0, flipped ? distBack : distFront); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
  }

  function frame(t) {
    var angle = flipAngle(t), fk = flipStart < 0 ? 1 : Math.min(1, (t - flipStart) / 0.9), lift = Math.sin(fk * Math.PI) * 0.9;
    camera.position.z += ((flipped ? distBack : distFront) - camera.position.z) * 0.06;
    var amp = flipped ? 0.25 : 1, px = inside ? pointer.x : gyro ? gyro.y : null, py = inside ? pointer.y : gyro ? -gyro.x : null;
    var tx = py !== null ? -py * 0.2 * amp : Math.sin(t * 0.7) * 0.03 * amp;
    var ty = px !== null ? px * 0.28 * amp : Math.sin(t * 0.5) * 0.06 * amp;
    tiltX += (tx - tiltX) * 0.08; tiltY += (ty - tiltY) * 0.08;
    pivot.rotation.set(tiltX, angle + tiltY, 0); pivot.position.z = lift;
    floatG.position.y = Math.sin(t * 1.1) * 0.06;
    shadow.scale.x = Math.max(0.12, Math.abs(Math.cos(angle)));
    shadow.position.x = 0.45 - tiltY * 1.2; shadow.position.y = -0.7 + tiltX * 1.2;
    var u = glareMat.uniforms; u.uPos.value.set(0.5 - tiltY * 1.6, 0.5 + tiltX * 2.0);
    u.uStrength.value = (flipped ? 0 : 0.18 + Math.min(1, Math.hypot(tiltX, tiltY) * 5) * 0.35) * (1 - Math.sin(fk * Math.PI));
    if (assembleStart >= 0 && t - assembleStart < 1.4) updateQr(t);
    hovered = null;
    if (inside && !flipped && fk >= 1) {
      raycaster.setFromCamera(pointer, camera);
      var hit = raycaster.intersectObjects(cubes.map(function (c) { return c.mesh; }), false)[0];
      if (hit) for (var i = 0; i < cubes.length; i++) if (cubes[i].mesh === hit.object) hovered = cubes[i];
    }
    cv.style.cursor = inside ? 'pointer' : '';
    cubes.forEach(function (cb) {
      cb.lift += ((cb === hovered ? 1 : 0) - cb.lift) * 0.18;
      cb.mesh.position.z = 0.66 * 0.275 + cb.lift * 0.32; cb.mesh.scale.setScalar(1 + cb.lift * 0.1);
      cb.mesh.rotation.set(cb.lift * 0.18, -cb.lift * 0.22, 0);
    });
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible || paused) return;
    frame(now()); renderer.render(scene, camera);
  }

  var ro = new ResizeObserver(resize); ro.observe(container);
  var io = null;
  if ('IntersectionObserver' in window) { io = new IntersectionObserver(function (e) { visible = e[0] ? e[0].isIntersecting : true; }, { threshold: 0.02 }); io.observe(container); }

  applyMode(); drawFront(); drawBack(); buildQr(); buildCubes(); resize(); loop();
  if (document.fonts && document.fonts.load) {
    Promise.all([document.fonts.load('900 64px Nunito'), document.fonts.load('700 40px Nunito')]).then(function () { if (!disposed) { drawFront(); drawBack(); } });
  }

  // ---------- public ----------
  api.setData = function (d) { state.data = d; drawFront(); drawBack(); buildQr(); buildCubes(); };
  api.setMode = function (m) { state.mode = m; applyMode(); redraw(); };
  api.setStyle = function (s) { state.style = s; redraw(); };
  api.setLogo = function (img) { state.logo = img; drawFront(); };
  api.setFlipped = setFlipped;
  api.isFlipped = function () { return flipped; };
  api.setPaused = function (p) { paused = p; };
  /** render the current frame into a 2D canvas (works without preserveDrawingBuffer) */
  api.snapshot = function () {
    frame(now()); renderer.render(scene, camera);
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height;
    var c = out.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, out.width, out.height); c.drawImage(cv, 0, 0);
    return out;
  };
  api.dispose = function () {
    disposed = true; cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect();
    scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      var m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); });
    });
    renderer.dispose(); cv.remove();
  };
  return api;
}
