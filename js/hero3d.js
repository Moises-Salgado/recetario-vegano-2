/* Recetario Vegano · portada 3D
   Escena hecha con Three.js que reemplaza el paisaje plano de la portada: cielo, nubes, montañas,
   pradera con flores, rocas y la media palta, con frutas y verduras girando alrededor como las
   esferas del ejemplo «webgl_effects_parallaxbarrier» de Three.js (sin la barrera de paralaje).
   Si el navegador no tiene WebGL 2, la portada plana sigue tal cual. */
import * as THREE from 'three';

const TAU = Math.PI * 2;
const AVO_H = 2.064;      // alto de la palta en unidades de la escena
const SKY_Y = 34;         // altura de la palta cuando flota en el cielo
const REST_Y = 0.83;      // altura de su centro cuando se posa en la pradera

const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const eio = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eout = t => 1 - Math.pow(1 - t, 3);
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const col = hex => new THREE.Color(hex);

/* ================= Azar y ruido ================= */
function rng(seed) { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
function hash3(x, y, z) { let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (a, b, d) => hash3(xi + a, yi + b, zi + d);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u), x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u), x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w) * 2 - 1;
}
function fbm(x, y, z, o = 3) { let a = 0.5, f = 1, s = 0; for (let i = 0; i < o; i++) { s += a * noise3(x * f, y * f, z * f); f *= 2.03; a *= 0.5; } return s; }

/* ================= Geometría ================= */
function prep(geo) { const g = geo.index ? geo.toNonIndexed() : geo; if (!g.attributes.normal) g.computeVertexNormals(); return g; }
function paint(geo, fn, keepIndex) {
  const g = keepIndex ? geo : prep(geo);
  if (!g.attributes.normal) g.computeVertexNormals();
  const p = g.attributes.position, n = g.attributes.normal, out = new Float32Array(p.count * 3), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    c.setRGB(1, 1, 1);
    fn(c, p.getX(i), p.getY(i), p.getZ(i), n.getX(i), n.getY(i), n.getZ(i));
    out[i * 3] = c.r; out[i * 3 + 1] = c.g; out[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(out, 3));
  return g;
}
function solid(geo, hex) { const k = col(hex); return paint(geo, c => c.copy(k)); }
function merge(list) {
  let n = 0; list.forEach(g => { n += g.attributes.position.count; });
  const P = new Float32Array(n * 3), Nn = new Float32Array(n * 3), Cc = new Float32Array(n * 3); let o = 0;
  list.forEach(g => { P.set(g.attributes.position.array, o); Nn.set(g.attributes.normal.array, o); Cc.set(g.attributes.color.array, o); o += g.attributes.position.count * 3; });
  const m = new THREE.BufferGeometry();
  m.setAttribute('position', new THREE.BufferAttribute(P, 3));
  m.setAttribute('normal', new THREE.BufferAttribute(Nn, 3));
  m.setAttribute('color', new THREE.BufferAttribute(Cc, 3));
  m.computeBoundingSphere();
  return m;
}
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
function place(geo, x, y, z, rx, ry, rz, sx, sy, sz) {
  const kx = sx == null ? 1 : sx, ky = sy == null ? kx : sy, kz = sz == null ? kx : sz;
  _m4.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(rx || 0, ry || 0, rz || 0)), _s.set(kx, ky, kz));
  geo.applyMatrix4(_m4);
  return geo;
}
function bump(geo, amp, freq, seed) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), d = amp * fbm(x * freq + seed, y * freq, z * freq, 2);
    p.setXYZ(i, x + n.getX(i) * d, y + n.getY(i) * d, z + n.getZ(i) * d);
  }
  geo.computeVertexNormals();
  return geo;
}
function profile(pts, n) { return new THREE.SplineCurve(pts.map(q => new THREE.Vector2(q[0], q[1]))).getPoints(n).map(v => { v.x = Math.max(0, v.x); return v; }); }
function lathe(pts, seg, n) { const pr = profile(pts, n || 18); pr[0].x = 0; pr[pr.length - 1].x = 0; return new THREE.LatheGeometry(pr, seg); }
function radiusAt(pts, y) { for (let i = 1; i < pts.length; i++) if (y <= pts[i][1]) { const t = (y - pts[i - 1][1]) / (pts[i][1] - pts[i - 1][1]); return lerp(pts[i - 1][0], pts[i][0], t); } return 0; }
function taperTube(curve, segs, rad, rs, shape) {
  const geo = new THREE.TubeGeometry(curve, segs, rad, rs, false), p = geo.attributes.position;
  for (let i = 0; i <= segs; i++) {
    const c = curve.getPointAt(i / segs), k = shape(i / segs);
    for (let j = 0; j <= rs; j++) { const ix = i * (rs + 1) + j; p.setXYZ(ix, c.x + (p.getX(ix) - c.x) * k, c.y + (p.getY(ix) - c.y) * k, c.z + (p.getZ(ix) - c.z) * k); }
  }
  geo.computeVertexNormals();
  return geo;
}
function lobes(geo, n, amp, fy) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + amp * (fy ? fy(y) : 1) * Math.cos(n * Math.atan2(x, z)); p.setXYZ(i, x * k, y, z * k); }
  geo.computeVertexNormals();
  return geo;
}
function leafGeo(len, wid, hex) { return place(solid(new THREE.SphereGeometry(1, 8, 4), hex), 0, 0, len * 0.92, 0, 0, 0, wid, wid * 0.2, len); }
function addLeaf(parts, len, wid, hex, tilt, yaw, x, y, z) { const g = leafGeo(len, wid, hex); place(g, 0, 0, 0, tilt, 0, 0); place(g, x || 0, y || 0, z || 0, 0, yaw, 0); parts.push(g); }

/* ================= Frutas ================= */
function fStrawberry() {
  const pr = [[0, -0.52], [0.08, -0.49], [0.17, -0.41], [0.27, -0.27], [0.35, -0.11], [0.4, 0.05], [0.41, 0.17], [0.38, 0.28], [0.31, 0.36], [0.19, 0.42], [0.07, 0.445], [0, 0.44]];
  const red = col('#dc2430'), deep = col('#a8121f'), pale = col('#f57a63');
  const body = paint(bump(lathe(pr, 22, 16), 0.01, 9, 1), (c, x, y, z) => {
    c.copy(red).lerp(deep, sstep(0.0, -0.5, y) * 0.55).lerp(pale, sstep(0.3, 0.44, y) * 0.5).multiplyScalar(0.92 + 0.12 * noise3(x * 7, y * 7, z * 7));
  });
  const parts = [body], seed = new THREE.OctahedronGeometry(0.02, 0);
  for (let r = 0; r < 7; r++) {
    const ty = lerp(-0.4, 0.28, r / 6), rad = radiusAt(pr, ty), n = Math.max(5, Math.round(rad * 30));
    for (let k = 0; k < n; k++) {
      const a = (k + (r % 2) * 0.5) / n * TAU;
      parts.push(place(solid(seed.clone(), '#f7d65a'), Math.sin(a) * rad * 0.985, ty, Math.cos(a) * rad * 0.985, 0, a, 0, 1, 1.5, 0.7));
    }
  }
  for (let k = 0; k < 6; k++) addLeaf(parts, 0.13, 0.075, k % 2 ? '#3d8a2e' : '#56a33b', 0.5, k / 6 * TAU + 0.3, 0, 0.43, 0);
  parts.push(place(solid(new THREE.CylinderGeometry(0.022, 0.03, 0.16, 6), '#4c862e'), 0, 0.52, 0));
  return merge(parts);
}
function fOrange() {
  const o1 = col('#f49a1e'), o2 = col('#e0740f'), o3 = col('#ffb64b');
  const body = paint(bump(new THREE.SphereGeometry(0.5, 22, 16), 0.008, 24, 3), (c, x, y, z) => {
    c.copy(o1).lerp(o2, clamp(0.5 - y) * 0.4 + 0.15 * noise3(x * 6, y * 6, z * 6)).lerp(o3, sstep(0.2, 0.5, y) * 0.3);
  });
  const parts = [body, place(solid(new THREE.SphereGeometry(0.05, 8, 5), '#6b7d2a'), 0, 0.49, 0, 0, 0, 0, 1, 0.4, 1)];
  addLeaf(parts, 0.12, 0.09, '#3d8b37', -0.55, 0.6, 0, 0.5, 0);
  return merge(parts);
}
function fLemon() {
  const pr = [[0, -0.57], [0.05, -0.53], [0.13, -0.46], [0.23, -0.36], [0.31, -0.22], [0.35, -0.07], [0.355, 0.06], [0.34, 0.2], [0.28, 0.33], [0.19, 0.44], [0.1, 0.51], [0.04, 0.55], [0, 0.57]];
  const y1 = col('#f7d63c'), y2 = col('#e8bb1c'), gr = col('#b7c43a');
  return merge([paint(bump(lathe(pr, 22, 18), 0.008, 22, 5), (c, x, y, z) => {
    c.copy(y1).lerp(y2, 0.3 + 0.3 * noise3(x * 5, y * 5, z * 5)).lerp(gr, sstep(0.42, 0.57, Math.abs(y)) * 0.5);
  })]);
}
function fApple() {
  const pr = [[0, -0.34], [0.07, -0.385], [0.17, -0.41], [0.29, -0.38], [0.39, -0.27], [0.455, -0.1], [0.47, 0.06], [0.45, 0.2], [0.39, 0.31], [0.29, 0.38], [0.17, 0.39], [0.08, 0.34], [0.02, 0.29], [0, 0.28]];
  const red = col('#cc1a2e'), dark = col('#8a0e1e'), blush = col('#f2b53d');
  const body = paint(bump(lathe(pr, 24, 18), 0.005, 8, 7), (c, x, y, z) => {
    const n = noise3(x * 4 + 2, y * 9, z * 4);
    c.copy(red).lerp(dark, clamp(-y * 0.8) * 0.5 + 0.15 * n).lerp(blush, sstep(0.1, -0.45, x + 0.15 * n) * 0.6);
  });
  const stem = solid(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(0.01, 0.42, 0), new THREE.Vector3(0.07, 0.52, 0)), 6, 0.018, 6), '#6b4a2a');
  const parts = [body, stem];
  addLeaf(parts, 0.13, 0.09, '#4c9a34', -0.35, -0.8, 0.02, 0.44, 0);
  return merge(parts);
}
function fCherries() {
  const c1 = col('#b51230'), c2 = col('#6c0616'), hi = col('#e5405a');
  const cherry = (x, y, z, s) => place(paint(new THREE.SphereGeometry(0.17, 16, 12), (c, px, py) => {
    c.copy(c1).lerp(c2, sstep(0.05, -0.17, py) * 0.6).lerp(hi, sstep(0.06, 0.17, py) * 0.25);
  }), x, y, z, 0, 0, 0, s, s * 0.92, s);
  const j = new THREE.Vector3(0.04, 0.42, 0);
  const st1 = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.15, -0.1, 0), new THREE.Vector3(-0.1, 0.2, 0.02), j), 10, 0.014, 5);
  const st2 = new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0.17, -0.16, 0.06), new THREE.Vector3(0.14, 0.18, 0.03), j), 10, 0.014, 5);
  const parts = [cherry(-0.15, -0.24, 0, 1), cherry(0.17, -0.3, 0.06, 0.95), solid(st1, '#5f8a2a'), solid(st2, '#5f8a2a')];
  addLeaf(parts, 0.12, 0.08, '#4c9a34', -0.6, 1.2, 0.04, 0.42, 0);
  return merge(parts);
}
function fBlueberry() {
  const b1 = col('#36477f'), b2 = col('#232f5d'), frost = col('#8193c7');
  const g = place(bump(new THREE.SphereGeometry(0.5, 14, 10), 0.012, 4, 9), 0, 0, 0, 0, 0, 0, 1, 0.86, 1);
  const body = paint(g, (c, x, y, z) => { c.copy(b1).lerp(b2, 0.3 + 0.3 * noise3(x * 5, y * 5, z * 5)).lerp(frost, clamp(0.35 + 0.4 * noise3(x * 3 + 5, y * 3, z * 3)) * 0.55); });
  return merge([body, place(solid(new THREE.TorusGeometry(0.11, 0.045, 5, 5), '#1c2347'), 0, 0.41, 0, Math.PI / 2, 0, 0)]);
}
function fKiwi() {
  const cream = col('#f3efc4'), lg = col('#c3de78'), g1 = col('#8cc43f'), g2 = col('#6aa52e'), skin = col('#86663a');
  const face = (c, x, y, z) => {
    const r = Math.hypot(x, z), a = Math.atan2(z, x), ray = 0.5 + 0.5 * Math.cos(a * 18);
    c.copy(cream).lerp(lg, sstep(0.07, 0.15, r)).lerp(g1, sstep(0.15, 0.3, r)).lerp(g2, sstep(0.3, 0.47, r) * 0.7);
    if (r > 0.17) c.lerp(lg, ray * 0.2 * sstep(0.18, 0.4, r));
    if (r > 0.455) c.copy(skin);
  };
  const top = paint(place(new THREE.RingGeometry(0.001, 0.48, 36, 9), 0, 0.055, 0, -Math.PI / 2, 0, 0), face);
  const bot = paint(place(new THREE.RingGeometry(0.001, 0.48, 36, 9), 0, -0.055, 0, Math.PI / 2, 0, 0), face);
  const edge = solid(new THREE.CylinderGeometry(0.48, 0.48, 0.11, 36, 1, true), '#7a5a32');
  const parts = [top, bot, edge], r = rng(19), sg = new THREE.OctahedronGeometry(1, 0);
  for (let k = 0; k < 20; k++) {
    const a = k / 20 * TAU + r() * 0.2, rr = 0.2 + r() * 0.03;
    for (const yy of [0.057, -0.057]) parts.push(place(solid(sg.clone(), '#1d1a14'), Math.cos(a) * rr, yy, Math.sin(a) * rr, 0, -a, 0, 0.026, 0.006, 0.012));
  }
  return merge(parts);
}
function fBanana() {
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.55, 0.12, 0), new THREE.Vector3(0, -0.32, 0), new THREE.Vector3(0.55, 0.14, 0));
  const geo = taperTube(curve, 28, 0.13, 6, t => Math.pow(Math.sin(Math.PI * clamp(t * 1.04 - 0.02)), 0.55) * 0.92 + 0.08);
  const yel = col('#f6d64a'), grn = col('#a9c23a'), brn = col('#5b3d1d');
  const body = paint(geo, (c, x, y, z) => {
    const t = (x + 0.55) / 1.1;
    c.copy(yel).lerp(grn, sstep(0.28, 0.0, t) * 0.6).lerp(brn, clamp(sstep(0.07, 0.0, t) + sstep(0.93, 1.0, t)));
    if (noise3(x * 30, y * 30, z * 30) > 0.6) c.lerp(brn, 0.5);
  });
  return merge([body, place(solid(new THREE.CylinderGeometry(0.03, 0.04, 0.14, 6), '#6b5a2a'), -0.6, 0.17, 0, 0, 0, 0.8)]);
}
function fGrapes() {
  const p1 = col('#6e2a6c'), p2 = col('#471646'), hi = col('#a058a0'), parts = [], r = rng(77);
  [[0.36, 1], [0.24, 3], [0.1, 5], [-0.04, 5], [-0.18, 4], [-0.31, 2], [-0.42, 1]].forEach((L, li) => {
    const n = L[1], R = n === 1 ? 0 : 0.06 + n * 0.028;
    for (let k = 0; k < n; k++) {
      const a = k / n * TAU + li * 0.7, s = 0.105 + r() * 0.015;
      parts.push(place(paint(new THREE.SphereGeometry(s, 10, 7), (c, x, y) => { c.copy(p1).lerp(p2, sstep(0.0, -s, y) * 0.6).lerp(hi, sstep(s * 0.3, s, y) * 0.3); }), Math.cos(a) * R, L[0], Math.sin(a) * R));
    }
  });
  parts.push(place(solid(new THREE.CylinderGeometry(0.02, 0.026, 0.2, 6), '#6b5a2a'), 0, 0.5, 0, 0, 0, 0.2));
  return merge(parts);
}
function fPear() {
  const pr = [[0, -0.48], [0.1, -0.47], [0.22, -0.43], [0.32, -0.34], [0.37, -0.21], [0.36, -0.07], [0.31, 0.04], [0.24, 0.13], [0.19, 0.23], [0.165, 0.33], [0.13, 0.42], [0.07, 0.48], [0, 0.5]];
  const y1 = col('#d2d94f'), g1 = col('#a7be39'), bl = col('#e2903b');
  const body = paint(bump(lathe(pr, 22, 18), 0.006, 10, 11), (c, x, y, z) => {
    c.copy(y1).lerp(g1, 0.3 + 0.3 * noise3(x * 5, y * 5, z * 5)).lerp(bl, sstep(-0.05, -0.35, x) * 0.5);
    if (noise3(x * 40, y * 40, z * 40) > 0.62) c.multiplyScalar(0.78);
  });
  const stem = solid(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.47, 0), new THREE.Vector3(0.02, 0.6, 0), new THREE.Vector3(0.08, 0.66, 0)), 6, 0.018, 6), '#6b4a2a');
  return merge([body, stem]);
}
function fWatermelon() {
  const A = 0.5, a0 = -Math.PI / 2 - A, a1 = -Math.PI / 2 + A;
  const sector = (r0, r1, depth, hex) => {
    const sh = new THREE.Shape();
    if (r0 <= 0) { sh.moveTo(0, 0); sh.absarc(0, 0, r1, a0, a1, false); sh.lineTo(0, 0); }
    else { sh.absarc(0, 0, r1, a0, a1, false); sh.absarc(0, 0, r0, a1, a0, true); }
    const g = new THREE.ExtrudeGeometry(sh, { depth, bevelEnabled: false, curveSegments: 12 });
    g.translate(0, 0, -depth / 2);
    return solid(g, hex);
  };
  const parts = [sector(0, 0.5, 0.16, '#ee3c48'), sector(0.5, 0.55, 0.15, '#f5c3ae'), sector(0.55, 0.585, 0.14, '#e4f1c4'), sector(0.585, 0.62, 0.13, '#3c8c3a')];
  const sg = new THREE.SphereGeometry(1, 6, 4), r = rng(5);
  for (let k = 0; k < 9; k++) {
    const rr = 0.2 + r() * 0.24, aa = lerp(a0 + 0.12, a1 - 0.12, r());
    for (const zz of [0.081, -0.081]) parts.push(place(solid(sg.clone(), '#1b1712'), Math.cos(aa) * rr, Math.sin(aa) * rr, zz, 0, 0, aa, 0.024, 0.014, 0.006));
  }
  const g = merge(parts); g.translate(0, 0.32, 0);
  return g;
}
function fPeach() {
  const g = new THREE.SphereGeometry(0.5, 22, 16), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = Math.exp(-(x * x) / 0.006) * sstep(-0.2, 0.35, z) * 0.06; p.setXYZ(i, x, y * 0.95, z - k); }
  g.computeVertexNormals();
  const o = col('#f7b56b'), r1 = col('#e55a49'), y1 = col('#f9d48c');
  const body = paint(g, (c, x, y, z) => { c.copy(o).lerp(r1, clamp(0.45 + 0.6 * (z * 0.6 + x * 0.5) + 0.25 * noise3(x * 3, y * 3, z * 3))).lerp(y1, sstep(0.1, -0.5, z + x) * 0.4); });
  const parts = [body];
  addLeaf(parts, 0.12, 0.08, '#4c9a34', -0.5, 0.4, 0, 0.47, 0);
  return merge(parts);
}

/* ================= Verduras ================= */
function vCarrot() {
  const pr = [[0, -0.56], [0.02, -0.51], [0.05, -0.39], [0.085, -0.21], [0.115, -0.01], [0.14, 0.19], [0.155, 0.33], [0.15, 0.41], [0.11, 0.455], [0.04, 0.47], [0, 0.47]];
  const o1 = col('#f2801c'), o2 = col('#d4600e');
  const body = paint(bump(lathe(pr, 18, 18), 0.006, 12, 21), (c, x, y, z) => { c.copy(o1).lerp(o2, 0.2 + 0.4 * Math.pow(Math.abs(Math.sin(y * 38)), 8) + 0.15 * noise3(x * 8, y * 8, z * 8)); });
  const parts = [body];
  for (let k = 0; k < 5; k++) addLeaf(parts, 0.17, 0.04, k % 2 ? '#3f8f2d' : '#5fae3a', -1.1 - (k % 2) * 0.2, k / 5 * TAU, 0, 0.45, 0);
  return merge(parts);
}
function vBroccoli() {
  const st1 = col('#a8cd66'), st2 = col('#7aa842'), d1 = col('#2b6326'), d2 = col('#4b9137');
  const parts = [place(paint(new THREE.CylinderGeometry(0.075, 0.1, 0.42, 10), (c, x, y) => { c.copy(st1).lerp(st2, sstep(0.05, 0.21, y)); }), 0, -0.25, 0)];
  const fl = (x, y, z, r, seed) => parts.push(place(paint(bump(new THREE.SphereGeometry(r, 10, 8), r * 0.22, 38, seed), (c, px, py, pz) => { c.copy(d1).lerp(d2, clamp(0.5 + 0.9 * noise3(px * 40 + seed, py * 40, pz * 40))); }), x, y, z));
  fl(0, 0.3, 0, 0.16, 1);
  for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; fl(Math.cos(a) * 0.17, 0.22, Math.sin(a) * 0.17, 0.13, 2 + k); }
  for (let k = 0; k < 8; k++) { const a = k / 8 * TAU + 0.3; fl(Math.cos(a) * 0.27, 0.09, Math.sin(a) * 0.27, 0.105, 10 + k); }
  return merge(parts);
}
function vTomato() {
  const g = new THREE.SphereGeometry(0.5, 22, 16), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.035 * Math.cos(5 * Math.atan2(x, z)) * sstep(-0.1, 0.4, y); p.setXYZ(i, x * k, y * 0.82 - sstep(0.42, 0.5, y) * 0.04, z * k); }
  g.computeVertexNormals();
  const r1 = col('#e63a2b'), r2 = col('#b5231a'), o = col('#f47a3b');
  const parts = [paint(g, (c, x, y, z) => { c.copy(r1).lerp(r2, sstep(0.0, -0.4, y) * 0.45 + 0.1 * noise3(x * 5, y * 5, z * 5)).lerp(o, sstep(0.25, 0.41, y) * 0.3); })];
  for (let k = 0; k < 5; k++) addLeaf(parts, 0.1, 0.045, '#3d8a2e', 0.15, k / 5 * TAU + 0.2, 0, 0.4, 0);
  parts.push(place(solid(new THREE.CylinderGeometry(0.018, 0.025, 0.1, 6), '#3d7a2a'), 0, 0.45, 0));
  return merge(parts);
}
function vCorn() {
  const pr = [[0, -0.5], [0.08, -0.49], [0.14, -0.45], [0.17, -0.36], [0.18, -0.2], [0.18, 0.05], [0.17, 0.25], [0.15, 0.38], [0.11, 0.46], [0.05, 0.5], [0, 0.51]];
  const g = lathe(pr, 48, 34), p = g.attributes.position, kern = (x, y, z) => Math.abs(Math.sin(Math.atan2(x, z) * 8)) * Math.abs(Math.sin(y * 30));
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.07 * kern(x, y, z); p.setXYZ(i, x * k, y, z * k); }
  g.computeVertexNormals();
  const y1 = col('#f7d245'), y2 = col('#d29b1c');
  const parts = [paint(g, (c, x, y, z) => { c.copy(y2).lerp(y1, sstep(0.08, 0.55, kern(x, y, z))); })];
  for (let k = 0; k < 3; k++) { const h = leafGeo(0.36, 0.13, k % 2 ? '#8dbd4a' : '#6aa23a'); place(h, 0, 0, 0, -1.15, 0, 0); place(h, 0, -0.5, 0, 0, k / 3 * TAU, 0); parts.push(h); }
  return merge(parts);
}
function vPepper() {
  const pr = [[0, -0.36], [0.12, -0.42], [0.26, -0.4], [0.34, -0.28], [0.37, -0.08], [0.36, 0.12], [0.32, 0.27], [0.21, 0.34], [0.09, 0.31], [0, 0.29]];
  const r1 = col('#d92b1e'), r2 = col('#a3140e'), hi = col('#f2553c');
  const body = paint(lobes(lathe(pr, 32, 18), 4, 0.1), (c, x, y, z) => { c.copy(r1).lerp(r2, 0.35 * (0.5 - 0.5 * Math.cos(4 * Math.atan2(x, z))) + 0.15 * noise3(x * 5, y * 5, z * 5)).lerp(hi, sstep(0.15, 0.3, y) * 0.2); });
  const stem = solid(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.26, 0), new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(0.06, 0.46, 0)), 6, 0.04, 7), '#3e7d2b');
  return merge([body, stem, place(solid(new THREE.CylinderGeometry(0.1, 0.12, 0.05, 10), '#3e7d2b'), 0, 0.29, 0)]);
}
function vEggplant() {
  const pr = [[0, -0.5], [0.12, -0.48], [0.22, -0.41], [0.27, -0.27], [0.275, -0.08], [0.25, 0.1], [0.19, 0.24], [0.14, 0.34], [0.11, 0.41], [0, 0.43]];
  const p1 = col('#3d1d4c'), p2 = col('#2a1235'), hi = col('#6b3a7d');
  const parts = [paint(bump(lathe(pr, 22, 18), 0.004, 6, 31), (c, x, y, z) => { c.copy(p1).lerp(p2, 0.3 + 0.3 * noise3(x * 4, y * 4, z * 4)).lerp(hi, sstep(0.15, 0.4, x + z * 0.3) * 0.25); })];
  for (let k = 0; k < 5; k++) addLeaf(parts, 0.13, 0.07, '#4c7f2c', 1.05, k / 5 * TAU, 0, 0.42, 0);
  parts.push(place(solid(new THREE.CylinderGeometry(0.03, 0.04, 0.16, 6), '#4c7f2c'), 0, 0.5, 0, 0, 0, 0.15));
  return merge(parts);
}
function vMushroom() {
  const cap = [[0, 0.02], [0.12, 0.03], [0.3, 0.02], [0.4, 0.0], [0.43, 0.05], [0.42, 0.13], [0.37, 0.22], [0.27, 0.3], [0.14, 0.34], [0, 0.35]];
  const cream = col('#f1e7d6'), tan = col('#cdb795'), gill = col('#a08c70'), gd = col('#7a6850'), sw = col('#f4eee4'), sb = col('#d9ccb5');
  const top = paint(lathe(cap, 28, 20), (c, x, y, z, nx, ny) => {
    if (ny < -0.4) c.copy(gill).lerp(gd, Math.pow(Math.abs(Math.cos(Math.atan2(x, z) * 30)), 4) * 0.6);
    else c.copy(cream).lerp(tan, clamp(sstep(0.2, 0.34, y) * 0.7 + 0.12 * noise3(x * 9, y * 9, z * 9)));
  });
  const stem = paint(place(new THREE.CylinderGeometry(0.1, 0.12, 0.4, 12), 0, -0.18, 0), (c, x, y) => { c.copy(sw).lerp(sb, sstep(-0.2, -0.38, y)); });
  return merge([top, stem]);
}
function vChili() {
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.42, 0.18, 0), new THREE.Vector3(0.05, 0.12, 0), new THREE.Vector3(0.45, -0.25, 0));
  const g = taperTube(curve, 24, 0.075, 8, t => (t < 0.08 ? 0.75 + t * 3 : Math.pow(1 - (t - 0.08) / 0.92, 0.7) * 0.97 + 0.03));
  const r1 = col('#d81f1a'), r2 = col('#a5120e');
  const body = paint(g, (c, x, y, z) => { c.copy(r1).lerp(r2, 0.3 + 0.3 * noise3(x * 6, y * 6, z * 6)); });
  const cap = place(solid(new THREE.CylinderGeometry(0.06, 0.075, 0.06, 8), '#3e7d2b'), -0.43, 0.18, 0, 0, 0, Math.PI / 2 + 0.1);
  const stem = solid(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.45, 0.18, 0), new THREE.Vector3(-0.56, 0.2, 0), new THREE.Vector3(-0.6, 0.3, 0)), 6, 0.018, 6), '#4c8a2e');
  return merge([body, cap, stem]);
}
function vPumpkin() {
  const g = new THREE.SphereGeometry(0.5, 30, 18), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 0.92 + 0.08 * Math.pow(Math.abs(Math.sin(Math.atan2(x, z) * 5)), 0.5);
    p.setXYZ(i, x * k, y * 0.72 - Math.exp(-(x * x + z * z) / 0.012) * 0.07 * Math.sign(y), z * k);
  }
  g.computeVertexNormals();
  const o1 = col('#ee8a2c'), o2 = col('#c4621a'), o3 = col('#f7a84c');
  const body = paint(g, (c, x, y, z) => { const s = Math.abs(Math.sin(Math.atan2(x, z) * 5)); c.copy(o2).lerp(o1, sstep(0.0, 0.5, s)).lerp(o3, sstep(0.6, 1, s) * 0.3 * sstep(-0.2, 0.3, y)); });
  return merge([body, place(solid(new THREE.CylinderGeometry(0.035, 0.06, 0.16, 6), '#6f6436'), 0.01, 0.38, 0, 0, 0, 0.18)]);
}
function vOnion() {
  const pr = [[0, -0.4], [0.13, -0.38], [0.29, -0.29], [0.39, -0.12], [0.4, 0.04], [0.34, 0.19], [0.22, 0.31], [0.11, 0.41], [0.05, 0.5], [0, 0.55]];
  const v1 = col('#8b2c5f'), v2 = col('#b85f8f'), v3 = col('#5f1b40');
  const body = paint(lathe(pr, 26, 18), (c, x, y, z) => { c.copy(v1).lerp(v2, Math.pow(0.5 + 0.5 * Math.cos(Math.atan2(x, z) * 14), 3) * 0.45).lerp(v3, sstep(0.3, 0.55, y) * 0.4); });
  return merge([body, place(solid(new THREE.CylinderGeometry(0.06, 0.03, 0.05, 8), '#d9c49d'), 0, -0.41, 0)]);
}
function vCucumber() {
  const pr = [[0, -0.5], [0.08, -0.48], [0.13, -0.42], [0.155, -0.3], [0.16, -0.1], [0.16, 0.1], [0.155, 0.3], [0.13, 0.42], [0.08, 0.48], [0, 0.5]];
  const g1 = col('#2f6a2b'), g2 = col('#6fa043'), dot = col('#d9e8b0');
  return merge([paint(bump(lathe(pr, 20, 18), 0.006, 20, 41), (c, x, y, z) => {
    c.copy(g1).lerp(g2, Math.pow(0.5 + 0.5 * Math.cos(Math.atan2(x, z) * 6 + y * 2), 4) * 0.5);
    if (noise3(x * 45, y * 45, z * 45) > 0.62) c.lerp(dot, 0.7);
  })]);
}
function vPeas() {
  const pod = col('#5aa035'), dark = col('#3f7f26'), pea = col('#8fd14a'), peaHi = col('#b6e36a');
  const g = new THREE.SphereGeometry(1, 22, 10), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i) * 0.5; p.setXYZ(i, x, p.getY(i) * 0.1 + 0.28 * x * x, p.getZ(i) * 0.13); }
  g.computeVertexNormals();
  const parts = [paint(g, (c, x, y) => { c.copy(pod).lerp(dark, sstep(-0.02, -0.1, y - 0.28 * x * x) * 0.35); })];
  for (let k = 0; k < 5; k++) { const x = -0.28 + k * 0.14; parts.push(place(paint(new THREE.SphereGeometry(0.085, 12, 9), (c, px, py) => { c.copy(pea).lerp(peaHi, sstep(0.02, 0.085, py) * 0.4); }), x, 0.075 + 0.28 * x * x, 0)); }
  parts.push(place(solid(new THREE.CylinderGeometry(0.015, 0.02, 0.1, 5), '#4c8a2e'), -0.53, 0.09, 0, 0, 0, 1.0));
  return merge(parts);
}
function vPotato() {
  const g = new THREE.SphereGeometry(0.5, 20, 14), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.12 * fbm(x * 2.2 + 3, y * 2.2, z * 2.2, 3); p.setXYZ(i, x * k * 0.95, y * k * 0.68, z * k * 0.78); }
  g.computeVertexNormals();
  const b1 = col('#c09257'), b2 = col('#9a6e3c'), eye = col('#6b4826');
  return merge([paint(g, (c, x, y, z) => { c.copy(b1).lerp(b2, clamp(0.4 + 0.7 * noise3(x * 6, y * 6, z * 6))); if (noise3(x * 14 + 7, y * 14, z * 14) > 0.55) c.lerp(eye, 0.6); })]);
}
function vGarlic() {
  const pr = [[0, -0.32], [0.14, -0.33], [0.28, -0.25], [0.35, -0.1], [0.35, 0.04], [0.29, 0.17], [0.18, 0.28], [0.09, 0.36], [0.04, 0.46], [0, 0.5]];
  const w = col('#f2ece0'), pur = col('#c7a3c3');
  const body = paint(lobes(lathe(pr, 30, 18), 7, 0.07, y => sstep(-0.3, 0.0, y) * sstep(0.45, 0.2, y)), (c, x, y, z) => { c.copy(w).lerp(pur, Math.pow(0.5 + 0.5 * Math.cos(Math.atan2(x, z) * 7), 6) * 0.35 * sstep(0.3, -0.1, y)); });
  return merge([body, place(solid(new THREE.CylinderGeometry(0.05, 0.03, 0.05, 8), '#c9b48e'), 0, -0.33, 0)]);
}
const KINDS = [
  { make: fStrawberry, size: 0.55, w: 1.2, rough: 0.34 },
  { make: fOrange, size: 0.6, w: 1.0, rough: 0.55 },
  { make: fLemon, size: 0.5, w: 0.9, rough: 0.45 },
  { make: fApple, size: 0.62, w: 1.0, rough: 0.3 },
  { make: fCherries, size: 0.78, w: 1.0, rough: 0.24 },
  { make: fBlueberry, size: 0.21, w: 1.2, rough: 0.6 },
  { make: fKiwi, size: 0.55, w: 1.0, rough: 0.35 },
  { make: fBanana, size: 0.95, w: 0.7, rough: 0.5 },
  { make: fGrapes, size: 0.62, w: 0.8, rough: 0.28 },
  { make: fPear, size: 0.62, w: 0.8, rough: 0.5 },
  { make: fWatermelon, size: 0.78, w: 0.8, rough: 0.4 },
  { make: fPeach, size: 0.58, w: 0.8, rough: 0.75 },
  { make: vCarrot, size: 0.75, w: 1.0, rough: 0.55 },
  { make: vBroccoli, size: 0.72, w: 0.9, rough: 0.85 },
  { make: vTomato, size: 0.55, w: 1.0, rough: 0.3 },
  { make: vCorn, size: 0.85, w: 0.8, rough: 0.45 },
  { make: vPepper, size: 0.62, w: 0.9, rough: 0.25 },
  { make: vEggplant, size: 0.8, w: 0.7, rough: 0.22 },
  { make: vMushroom, size: 0.5, w: 1.0, rough: 0.8 },
  { make: vChili, size: 0.6, w: 0.9, rough: 0.3 },
  { make: vPumpkin, size: 0.75, w: 0.6, rough: 0.55 },
  { make: vOnion, size: 0.55, w: 0.7, rough: 0.4 },
  { make: vCucumber, size: 0.8, w: 0.7, rough: 0.45 },
  { make: vPeas, size: 0.6, w: 0.8, rough: 0.45 },
  { make: vPotato, size: 0.55, w: 0.6, rough: 0.85 },
  { make: vGarlic, size: 0.45, w: 0.6, rough: 0.6 }
];

/* ================= Palta ================= */
function makeAvocado() {
  const S = 1 / 220, Yp = (300 - 332) * S;
  const raw = [[0, 482], [70, 475], [120, 455], [155, 420], [174, 370], [178, 320], [170, 270], [148, 220], [118, 170], [100, 125], [92, 90], [76, 60], [52, 40], [0, 28]];
  const pts = new THREE.SplineCurve(raw.map(q => new THREE.Vector2(q[0] * S, (300 - q[1]) * S))).getPoints(60);
  pts[0].x = 0; pts[pts.length - 1].x = 0;
  const rAt = y => {
    if (y <= pts[0].y || y >= pts[pts.length - 1].y) return 0;
    for (let i = 1; i < pts.length; i++) if (y <= pts[i].y) return lerp(pts[i - 1].x, pts[i].x, (y - pts[i - 1].y) / (pts[i].y - pts[i - 1].y));
    return 0;
  };
  // Cáscara: la mitad de atrás de un torno con la silueta de la palta.
  const sk1 = col('#3c5c1d'), sk2 = col('#24380f'), sk3 = col('#5e8230');
  const skinG = bump(new THREE.LatheGeometry(pts, 64, Math.PI / 2, Math.PI), 0.007, 14, 2);
  paint(skinG, (c, x, y, z) => { const n = noise3(x * 9, y * 9, z * 9); c.copy(sk1).lerp(sk2, clamp(0.4 + 0.6 * n)).lerp(sk3, sstep(0.55, 0.9, noise3(x * 31, y * 31, z * 31)) * 0.6); }, true);
  // Cara cortada: malla polar alrededor del cuesco, con el degradado de la versión plana.
  const NA = 128, rings = [0, 0.05, 0.1, 0.16, 0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 0.78, 0.85, 0.9, 0.925, 0.94, 0.955, 0.975, 1];
  const rho = new Float32Array(NA);
  for (let k = 0; k < NA; k++) {
    const a = k / NA * TAU, ca = Math.cos(a), sa = Math.sin(a); let lo = 0, hi = 1.7;
    for (let it = 0; it < 28; it++) { const m = (lo + hi) / 2; if (Math.abs(m * ca) <= rAt(Yp + m * sa)) lo = m; else hi = m; }
    rho[k] = lo;
  }
  const stops = [[0, '#f6f3b2'], [0.38, '#e5e78c'], [0.68, '#c6d866'], [0.9, '#97ba3f'], [0.935, '#78a02e'], [0.95, '#3c5c1d'], [1, '#2a4313']].map(s => [s[0], col(s[1])]);
  const halo = col('#a9bd4d');
  const grad = (c, u) => { for (let i = 1; i < stops.length; i++) if (u <= stops[i][0]) { c.copy(stops[i - 1][1]).lerp(stops[i][1], (u - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0])); return; } c.copy(stops[stops.length - 1][1]); };
  const pos = [0, Yp, 0.03], cl = [], idx = [], c = new THREE.Color();
  grad(c, 0); cl.push(c.r, c.g, c.b);
  for (let i = 1; i < rings.length; i++) for (let k = 0; k < NA; k++) {
    const u = rings[i], a = k / NA * TAU, d = u * rho[k];
    pos.push(Math.cos(a) * d, Yp + Math.sin(a) * d, 0.03 * (1 - u * u));
    grad(c, u);
    if (u < 0.9) c.lerp(halo, Math.exp(-Math.pow((d - 0.44) / 0.07, 2)) * 0.35);
    cl.push(c.r, c.g, c.b);
  }
  const vid = (i, k) => 1 + (i - 1) * NA + (k % NA);
  for (let k = 0; k < NA; k++) idx.push(0, vid(1, k), vid(1, k + 1));
  for (let i = 1; i < rings.length - 1; i++) for (let k = 0; k < NA; k++) { idx.push(vid(i, k), vid(i + 1, k), vid(i + 1, k + 1)); idx.push(vid(i, k), vid(i + 1, k + 1), vid(i, k + 1)); }
  const faceG = new THREE.BufferGeometry();
  faceG.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  faceG.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3));
  faceG.setIndex(idx); faceG.computeVertexNormals();
  // Cuesco
  const L = new THREE.Vector3(-0.5, 0.55, 0.65).normalize(), pc1 = col('#5f3518'), pc2 = col('#93572b'), pc3 = col('#c88a52');
  const pitG = place(new THREE.SphereGeometry(0.373, 40, 28), 0, Yp, -0.02, 0, 0, 0, 1, 1.04, 0.92);
  paint(pitG, (cc, x, y, z, nx, ny, nz) => { const t = nx * L.x + ny * L.y + nz * L.z; cc.copy(pc1).lerp(pc2, sstep(-0.35, 0.45, t)).lerp(pc3, sstep(0.6, 1, t) * 0.55).multiplyScalar(0.94 + 0.1 * noise3(x * 12, y * 12, z * 12)); }, true);
  const group = new THREE.Group();
  const skin = new THREE.Mesh(skinG, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.58 }));
  const face = new THREE.Mesh(faceG, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 }));
  const pit = new THREE.Mesh(pitG, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.22 }));
  [skin, face, pit].forEach(m => { m.castShadow = true; m.receiveShadow = true; group.add(m); });
  return group;
}

/* ================= Paisaje ================= */
function groundH(x, z) {
  const d = Math.hypot(x, z), flat = sstep(5, 16, d), far = sstep(-30, -140, z);
  let h = 0.9 * Math.sin(x * 0.075 + 1.3) * Math.cos(z * 0.06 - 0.4) + 0.55 * Math.sin(x * 0.17 + z * 0.11 + 2.1) + 0.9 * fbm(x * 0.03, 0.5, z * 0.03, 3);
  h = h * (0.6 + 2.4 * far) + far * 5.5 * (0.6 + 0.4 * Math.sin(x * 0.02 + 0.7));
  return h * flat;
}
function makeMeadow() {
  const N = 150, g = new THREE.PlaneGeometry(2, 2, N, N); g.rotateX(-Math.PI / 2);
  const p = g.attributes.position, f = u => Math.sign(u) * (48 * Math.abs(u) + 330 * Math.pow(Math.abs(u), 3));
  for (let i = 0; i < p.count; i++) { const x = f(p.getX(i)), z = f(p.getZ(i)) - 40; p.setXYZ(i, x, groundH(x, z), z); }
  g.computeVertexNormals();
  const cA = col('#4c681f'), cB = col('#6d8b34'), cC = col('#89a948'), cD = col('#a9c36c');
  paint(g, (c, x, y, z) => {
    const n = fbm(x * 0.08, 3, z * 0.08, 2), dist = sstep(10, 160, -z);
    c.copy(cB).lerp(cA, clamp(0.45 - n * 0.9) * 0.7).lerp(cC, clamp(0.4 + n) * 0.45 + clamp(y * 0.1) * 0.3).lerp(cD, dist * 0.55);
  }, true);
  return g;
}
function makeMountains() {
  const parts = [], r = rng(31), snow = col('#f2f6f9');
  const peak = (x, z, h, rad, far) => {
    const g = new THREE.ConeGeometry(rad, h, 9, 5, true), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), k = 1 - (py + h / 2) / h, j = fbm(px * 0.05 + x, py * 0.05, pz * 0.05 + z, 2);
      p.setXYZ(i, px * (1 + 0.28 * j), py + j * h * 0.07 * k, pz * (1 + 0.28 * j));
    }
    const ng = g.toNonIndexed(); ng.computeVertexNormals();
    const base = col(far ? '#adc1d4' : '#91aac0');
    paint(ng, (c, px, py, pz) => { const hh = (py + h / 2) / h; if (hh > 0.64 + 0.1 * noise3(px * 0.2, py * 0.2, pz * 0.2)) c.copy(snow); else c.copy(base).multiplyScalar(0.9 + 0.16 * hh); });
    parts.push(place(ng, x, h / 2 - 3, z));
  };
  for (let x = -460; x <= 460; x += 34 + r() * 22) peak(x, -300 - r() * 40, 40 + r() * 30, 30 + r() * 16, true);
  for (let x = -420; x <= 420; x += 30 + r() * 20) peak(x + 14, -215 - r() * 30, 20 + r() * 14, 24 + r() * 12, false);
  return merge(parts);
}
function makeCloud(seed, w) {
  const r = rng(seed), parts = [], puff = new THREE.SphereGeometry(1, 14, 10);
  parts.push(place(puff.clone(), 0, 0, 0, 0, 0, 0, w * 0.5, w * 0.12, w * 0.24));
  const n = 6 + Math.floor(r() * 4);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = (t - 0.5) * w * 0.82, hump = Math.sin(t * Math.PI), rr = w * (0.1 + 0.13 * hump) * (0.85 + r() * 0.3);
    parts.push(place(puff.clone(), x, rr * 0.35 + hump * w * 0.04, (r() - 0.5) * w * 0.14, 0, 0, 0, rr, rr * 0.92, rr * 0.95));
  }
  const top = col('#ffffff'), bot = col('#b3c8dc');
  const g = merge(parts.map(q => paint(q, (c, x, y) => { c.copy(bot).lerp(top, sstep(-w * 0.08, w * 0.12, y)); })));
  const p = g.attributes.position, fl = -w * 0.06;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i); if (y < fl) p.setY(i, fl + (y - fl) * 0.3); }
  return g;
}
function makeRock(seed) {
  const g = new THREE.SphereGeometry(1, 22, 15), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i), k = 1 + 0.26 * fbm(x * 1.3 + seed, y * 1.3, z * 1.3, 3) + 0.06 * noise3(x * 6, y * 6, z * 6);
    p.setXYZ(i, x * k, Math.max(y * k, -0.55), z * k);
  }
  g.computeVertexNormals();
  const a = col('#76654b'), b = col('#b8a684'), cc = col('#d6c8ab'), ao = col('#4e3f2a');
  paint(g, (c, x, y, z, nx, ny) => { c.copy(a).lerp(b, sstep(-0.6, 0.35, y)).lerp(cc, sstep(0.25, 0.95, ny) * 0.7).lerp(ao, sstep(-0.3, -0.55, y) * 0.5).multiplyScalar(0.93 + 0.1 * noise3(x * 5, y * 5, z * 5)); }, true);
  return g;
}
function flowerGeo(petal, center, n) {
  const pos = [], cl = [], pc = col(petal), pt = col(petal).lerp(col('#ffffff'), 0.25), cc = col(center);
  const P = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];
  const tri = (A, B, C, ca, cb, cC) => { pos.push(...A, ...B, ...C); cl.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b, cC.r, cC.g, cC.b); };
  for (let k = 0; k < n * 2; k++) {
    const a0 = k / (n * 2) * TAU, a1 = (k + 1) / (n * 2) * TAU, tip0 = k % 2 === 0;
    const A = P(a0, tip0 ? 0.075 : 0.03, tip0 ? 0.012 : 0.004), B = P(a1, tip0 ? 0.03 : 0.075, tip0 ? 0.004 : 0.012);
    tri([0, 0, 0], B, A, pc, tip0 ? pc : pt, tip0 ? pt : pc);
  }
  for (let k = 0; k < 6; k++) { const a0 = k / 6 * TAU, a1 = (k + 1) / 6 * TAU; tri([0, 0.016, 0], P(a1, 0.024, 0.01), P(a0, 0.024, 0.01), cc, cc, cc); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3));
  g.computeVertexNormals();
  return g;
}
function grassGeo() {
  const pos = [], cl = [], dark = col('#3d5c19'), light = col('#9fc256');
  for (let k = 0; k < 3; k++) {
    const a = k / 3 * TAU + 0.3, h = 0.2 + k * 0.06, ca = Math.cos(a), sa = Math.sin(a);
    pos.push(ca * 0.02 + sa * 0.018, 0, sa * 0.02 - ca * 0.018, ca * 0.02 - sa * 0.018, 0, sa * 0.02 + ca * 0.018, ca * 0.08, h, sa * 0.08);
    cl.push(dark.r, dark.g, dark.b, dark.r, dark.g, dark.b, light.r, light.g, light.b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(cl, 3));
  g.computeVertexNormals();
  return g;
}
function addWind(mat, amp, base, uni) {
  mat.onBeforeCompile = sh => {
    sh.uniforms.uWind = uni;
    sh.vertexShader = 'uniform float uWind;\n' + sh.vertexShader.replace('#include <begin_vertex>', [
      '#include <begin_vertex>',
      '#ifdef USE_INSTANCING',
      'vec3 ip = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);',
      '#else',
      'vec3 ip = vec3(0.0);',
      '#endif',
      'float sw = sin(uWind * 1.6 + ip.x * 0.35 + ip.z * 0.25) * ' + amp.toFixed(3) + ' * max(transformed.y + ' + base.toFixed(3) + ', 0.0);',
      'transformed.x += sw; transformed.z += sw * 0.4;'
    ].join('\n'));
  };
}

/* ================= Cielo ================= */
function makeSkyMaterial(env) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {
      cTop: { value: col('#3f7fae') }, cMid: { value: col('#5c94c2') }, cLow: { value: col('#a9d2ea') }, cHor: { value: col('#dcedf6') }, cGround: { value: col('#5f7d2c') },
      sunDir: { value: new THREE.Vector3(0.42, 0.44, -0.79).normalize() }, sunCol: { value: col('#fffbe8') }, sunAmt: { value: 1 },
      moonDir: { value: new THREE.Vector3(0.34, 0.17, -0.92).normalize() }, moonAmt: { value: 0 }, stars: { value: 0 }, time: { value: 0 }, envMode: { value: env ? 1 : 0 }
    },
    vertexShader: [
      'varying vec3 vDir;',
      'void main() {',
      '  vec4 wp = modelMatrix * vec4(position, 1.0);',
      '  vDir = wp.xyz - cameraPosition;',
      '  gl_Position = projectionMatrix * viewMatrix * wp;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 cTop; uniform vec3 cMid; uniform vec3 cLow; uniform vec3 cHor; uniform vec3 cGround;',
      'uniform vec3 sunDir; uniform vec3 sunCol; uniform float sunAmt; uniform vec3 moonDir; uniform float moonAmt;',
      'uniform float stars; uniform float time; uniform float envMode;',
      'varying vec3 vDir;',
      'float hash13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }',
      'void main() {',
      '  vec3 d = normalize(vDir);',
      '  float h = d.y;',
      '  vec3 c = mix(cHor, cLow, smoothstep(0.0, 0.1, h));',
      '  c = mix(c, cMid, smoothstep(0.08, 0.3, h));',
      '  c = mix(c, cTop, smoothstep(0.28, 0.7, h));',
      '  c = mix(c, cGround, envMode * smoothstep(0.0, -0.08, h));',
      '  float g = max(dot(d, sunDir), 0.0);',
      '  c += sunCol * sunAmt * (0.9 * pow(g, 900.0) + 0.3 * pow(g, 64.0) + 0.14 * pow(g, 8.0));',
      '  float m = max(dot(d, moonDir), 0.0);',
      '  c += vec3(0.95, 0.94, 0.86) * moonAmt * (smoothstep(0.99955, 0.9997, m) * 1.4 + 0.08 * pow(m, 60.0));',
      '  if (stars > 0.001) {',
      '    vec3 q = d * 150.0; vec3 iq = floor(q); vec3 fq = fract(q) - 0.5;',
      '    float r = hash13(iq);',
      '    float s = step(0.982, r) * smoothstep(0.36, 0.0, length(fq)) * (0.7 + 0.3 * sin(time * 1.7 + r * 60.0));',
      '    c += vec3(s) * stars * 2.4 * smoothstep(0.015, 0.12, h);',
      '  }',
      '  gl_FragColor = vec4(c, 1.0);',
      '  #include <tonemapping_fragment>',
      '  #include <colorspace_fragment>',
      '}'
    ].join('\n')
  });
}

/* ================= Inicio ================= */
async function waitForApi() {
  for (let i = 0; i < 900; i++) {
    if (window.RV_HERO && window.RV_HERO.state.ready) return window.RV_HERO;
    await new Promise(res => requestAnimationFrame(res));
  }
  return null;
}

async function start() {
  const API = await waitForApi();
  const stage = document.getElementById('stage');
  if (!API || !stage) return;
  const mobileish = window.matchMedia('(pointer: coarse)').matches || Math.min(window.innerWidth, window.innerHeight) < 600;
  const canvas = document.createElement('canvas');
  canvas.className = 'hero3d-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Media palta en 3D entre nubes, con frutas y verduras girando a su alrededor');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { return; }
  stage.insertBefore(canvas, stage.firstChild);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1.6, 0.1, 2200);
  const horizon = col('#dcedf6');
  scene.fog = new THREE.Fog(horizon, 60, 440);

  // Cielo y luz del entorno (reflejos suaves del cielo en las frutas)
  const skyMat = makeSkyMaterial(false);
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), skyMat);
  sky.frustumCulled = false;
  scene.add(sky);
  const pmrem = new THREE.PMREMGenerator(renderer), envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 32, 16), makeSkyMaterial(true)));
  scene.environment = pmrem.fromScene(envScene, 0.04).texture;
  scene.environmentIntensity = 0.55;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(col('#dcefff'), col('#7c9944'), 1.4);
  const sun = new THREE.DirectionalLight(col('#fff1dc'), 2.7);
  const SUN_DIR = new THREE.Vector3(0.45, 0.78, 0.44).normalize();
  sun.position.copy(SUN_DIR).multiplyScalar(40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobileish ? 1024 : 2048, mobileish ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 10, far: 80 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
  scene.add(hemi, sun, sun.target);

  // Pradera, montañas, flores, pasto y rocas
  const meadow = new THREE.Mesh(makeMeadow(), new THREE.MeshLambertMaterial({ vertexColors: true }));
  meadow.receiveShadow = true;
  scene.add(meadow);
  scene.add(new THREE.Mesh(makeMountains(), new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true })));

  const WIND = { value: 0 }, dummy = new THREE.Object3D();
  const scatter = (geo, mat, count, seed, area, scaleFn) => {
    const mesh = new THREE.InstancedMesh(geo, mat, count), r = rng(seed);
    for (let i = 0; i < count; i++) {
      let x, z, tries = 0;
      do { x = (r() * 2 - 1) * area.x; z = lerp(area.z0, area.z1, Math.pow(r(), area.k)); tries++; } while (Math.hypot(x, z) < 1.2 && tries < 20);
      const s = scaleFn(r, z);
      dummy.position.set(x, groundH(x, z) - 0.005, z); dummy.rotation.set(0, r() * TAU, 0); dummy.scale.setScalar(s); dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  };
  const grassMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }); addWind(grassMat, 0.35, 0.0, WIND);
  const flowerMatY = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }); addWind(flowerMatY, 0.25, 0.1, WIND);
  const flowerMatW = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }); addWind(flowerMatW, 0.25, 0.1, WIND);
  const lift = (geo, y) => { geo.translate(0, y, 0); return geo; };
  scatter(grassGeo(), grassMat, mobileish ? 1400 : 2800, 3, { x: 16, z0: 5, z1: -26, k: 0.8 }, r => 0.8 + r() * 0.7);
  scatter(lift(flowerGeo('#f3c83a', '#d99a1e', 5), 0.1), flowerMatY, mobileish ? 900 : 1700, 5, { x: 30, z0: 5, z1: -70, k: 0.75 }, (r, z) => (1 + r() * 0.5) * (1 + Math.max(0, -z) * 0.035));
  scatter(lift(flowerGeo('#fbf7ea', '#f0c240', 5), 0.1), flowerMatW, mobileish ? 260 : 480, 9, { x: 26, z0: 5, z1: -50, k: 0.8 }, (r, z) => (0.9 + r() * 0.4) * (1 + Math.max(0, -z) * 0.035));
  scatter(lift(flowerGeo('#f3c83a', '#d99a1e', 5), 0.1), flowerMatY, mobileish ? 160 : 320, 13, { x: 8, z0: 4.6, z1: -7, k: 1 }, r => 1.3 + r() * 0.8);

  const rockMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true, envMapIntensity: 0.35 });
  const rocks = [makeRock(1.3), makeRock(4.1), makeRock(7.7), makeRock(9.2)].map(g => { const m = new THREE.Mesh(g, rockMat); m.castShadow = true; m.receiveShadow = true; scene.add(m); return m; });

  // Sombra suave de contacto bajo la palta
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sg = sc.getContext('2d'), gr = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(28,42,10,0.75)'); gr.addColorStop(0.6, 'rgba(28,42,10,0.25)'); gr.addColorStop(1, 'rgba(28,42,10,0)');
  sg.fillStyle = gr; sg.fillRect(0, 0, 128, 128);
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0 }));
  blob.rotation.x = -Math.PI / 2; blob.position.set(0, 0.02, 0.05);
  scene.add(blob);

  // Nubes: [x, y, z, ancho, velocidad]
  const CLOUDS = [
    [-34, 58, -70, 20, 0.5], [26, 66, -90, 24, 0.35], [55, 50, -60, 16, 0.6], [-8, 74, -110, 26, 0.3], [-62, 64, -100, 22, 0.4],
    [-120, 24, -200, 40, 0.9], [40, 28, -230, 46, 0.7], [150, 22, -210, 38, 0.8], [-30, 20, -170, 30, 1],
    [-9, 31.2, -6, 8, 0.25], [8.5, 31.6, -9, 9.5, 0.3], [-1.5, 30.4, -15, 12, 0.2], [17, 30.8, -13, 9, 0.28], [-19, 31, -12, 10, 0.22],
    [-6.5, 22, 1.5, 6, 0.3], [7, 16, -1, 7, 0.25], [-9, 11, -4, 8, 0.2], [10, 26, 2.5, 5, 0.3]
  ];
  const cloudMat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const clouds = CLOUDS.map((c, i) => { const m = new THREE.Mesh(makeCloud(40 + i, c[3]), cloudMat); m.position.set(c[0], c[1], c[2]); m.userData = { v: c[4], span: Math.abs(c[2]) > 150 ? 260 : (Math.abs(c[2]) > 50 ? 120 : 40) }; scene.add(m); return m; });

  // Palta
  const avo = makeAvocado();
  scene.add(avo);

  // Frutas y verduras: una malla con instancias por cada tipo
  const N = mobileish ? 56 : 104, wsum = KINDS.reduce((a, k) => a + k.w, 0), fr = rng(2024);
  const meshes = KINDS.map(k => { const n = Math.max(2, Math.round(N * k.w / wsum)); const m = new THREE.InstancedMesh(k.make(), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: k.rough, metalness: 0 }), n); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.castShadow = true; m.frustumCulled = false; scene.add(m); return m; });
  const fruits = [];
  meshes.forEach((m, ki) => { for (let j = 0; j < m.count; j++) fruits.push({ m, j, size: KINDS[ki].size * (0.68 + fr() * 0.38) }); });
  for (let i = fruits.length - 1; i > 0; i--) { const j = Math.floor(fr() * (i + 1)); const t = fruits[i]; fruits[i] = fruits[j]; fruits[j] = t; }
  fruits.forEach(f => { f.z = lerp(-4.6, 2.1, fr()); f.rx = fr() * TAU; f.ry = fr() * TAU; f.rz = fr() * TAU; f.wx = (fr() - 0.5) * 1.4; f.wy = (fr() - 0.5) * 1.4; f.wz = (fr() - 0.5) * 1.0; });

  // Luz según el momento del día (se mezcla con los tintes de la portada)
  const LIGHTS = {
    almuerzo: { sun: '#fff1dc', si: 2.7, hi: 1.4, dir: [0.42, 0.44, -0.79], glow: '#fffbe8', ga: 1, moon: 0, stars: 0 },
    desayuno: { sun: '#ffd8b0', si: 2.4, hi: 1.3, dir: [-0.62, 0.06, -0.78], glow: '#ffcf9a', ga: 1.6, moon: 0, stars: 0 },
    once: { sun: '#ffc68a', si: 2.4, hi: 1.3, dir: [0.66, 0.08, -0.75], glow: '#ffb070', ga: 1.6, moon: 0, stars: 0 },
    cena: { sun: '#b4c2ff', si: 1.7, hi: 1.15, dir: [0.38, 0.2, -0.9], glow: '#c9d4ff', ga: 0, moon: 1, stars: 1 }
  };
  Object.keys(LIGHTS).forEach(k => { const L = LIGHTS[k]; L.sunC = col(L.sun); L.glowC = col(L.glow); L.dirV = new THREE.Vector3().fromArray(L.dir).normalize(); });

  // Tamaño y calidad
  let W = 0, H = 0, PR = 0, quality = 1, mode = '';
  const basePR = Math.min(window.devicePixelRatio || 1, 2);
  function placeRocks(tf) {
    const G = API.state.G, s = Math.min(H / G.H, W / G.minW), d = AVO_H * H / (2 * tf * 0.908 * G.avoH * s);
    const el = Math.atan(((G.y1 - G.H / 2) * s) / (H / 2) * tf) - Math.atan(-0.22 * tf);
    const camZ = Math.cos(el) * d, m = mode === 'm';
    const zr = m ? -0.4 : 0.5, half = (camZ - zr) * tf * camera.aspect;
    const set = (r, x, y, z, sx, sy, sz, ry) => { r.position.set(x, y, z); r.scale.set(sx, sy, sz); r.rotation.set(0, ry, 0); };
    if (m) {
      set(rocks[0], -(half + 0.35), 0.15, zr, 1.15, 1.2, 1.0, 0.4); set(rocks[1], -(half - 0.05), 0.0, zr + 1.0, 0.6, 0.55, 0.55, 1.1);
      set(rocks[2], half + 0.25, 0.2, zr - 0.3, 1.2, 1.3, 1.0, 2.0); set(rocks[3], half - 0.1, 0.0, zr + 0.9, 0.55, 0.5, 0.5, 2.6);
    } else {
      set(rocks[0], -(half + 0.05), 0.1, zr, 1.25, 1.05, 1.1, 0.4); set(rocks[1], -(half - 0.75), -0.05, zr - 1.6, 0.55, 0.45, 0.5, 1.1);
      set(rocks[2], half + 0.0, 0.15, zr - 0.4, 1.3, 1.12, 1.1, 2.0); set(rocks[3], half - 0.8, -0.05, zr - 2.0, 0.5, 0.42, 0.45, 2.6);
    }
  }
  function resize() {
    const w = stage.clientWidth || window.innerWidth, h = stage.clientHeight || window.innerHeight, pr = basePR * quality, md = API.state.mode;
    if (w === W && h === H && pr === PR && md === mode) return;
    W = w; H = h; PR = pr; mode = md;
    renderer.setPixelRatio(pr); renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.fov = mode === 'm' ? 58 : 42; camera.updateProjectionMatrix();
    placeRocks(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
  }

  // Animación
  const T3D = performance.now(), fm = new THREE.Matrix4(), fq = new THREE.Quaternion(), fe = new THREE.Euler(), fp = new THREE.Vector3(), fs = new THREE.Vector3(), cv = new THREE.Vector3(), target = new THREE.Vector3();
  let last = T3D, lightK = null, enabled = false, slow = 0, fast = 0, frames = 0;
  const cur = { sunC: new THREE.Color(), glowC: new THREE.Color(), dirV: new THREE.Vector3(), si: 0, hi: 0, ga: 0, moon: 0, stars: 0 };

  function update(now, dt) {
    const S = API.state, G = S.G, rm = S.rm;
    resize();
    const p = S.p, t = S.t, ft = rm ? 0 : (now - T3D) / 1000;
    const pA = clamp(p / 0.35), pC = clamp((p - 0.7) / 0.3), eA = eio(pA), eC = eio(pC);
    const tf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2), s = Math.min(H / G.H, W / G.minW);
    // Encuadre igual al de la portada plana: misma altura en pantalla y mismo tamaño de la palta
    const yBase = G.y0 + (G.y1 - G.y0) * eA - G.worldC * eC, avoS = 1 - (1 - G.avoSC) * eC;
    const ndcY = -((yBase - G.H / 2) * s) / (H / 2);
    const d = AVO_H * H / (2 * tf * 0.908 * G.avoH * s * avoS);
    const wy = lerp(SKY_Y, REST_Y, eA);
    const hor = lerp(lerp(-0.72, 0.22, eA), 0.5, eC);
    const alpha = Math.atan(-ndcY * tf);
    const el = alpha - Math.atan(-hor * tf) - S.my * 0.07;
    const az = S.mx * 0.3 + (rm ? 0 : Math.sin(ft * 0.21) * (mode === 'm' ? 0.06 : 0.03));
    camera.position.set(Math.sin(az) * Math.cos(el) * d, wy + Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(target.set(0, wy, 0));
    camera.rotateX(alpha);
    sky.position.copy(camera.position);

    // Palta
    const intro = rm ? 1 : eout(clamp(t / 1.1)), amp = rm ? 0 : 1 - eA, ph = t * TAU / 5;
    avo.position.set(0, wy + 0.055 * Math.sin(ph) * amp + (1 - intro) * 0.35, 0);
    avo.rotation.set(0.06 * Math.sin(ph * 0.8) * amp, TAU * eA + 0.2 * Math.sin(ph * 0.55) * amp, 0.05 * Math.sin(ph + 0.9) * amp);
    avo.scale.setScalar(0.92 + 0.08 * intro);
    const land = eio(clamp((pA - 0.55) / 0.45));
    blob.material.opacity = land * 0.85;

    // Frutas y verduras alrededor de la palta, como las esferas del ejemplo de Three.js
    const halfH = d * tf, halfW = halfH * camera.aspect;
    const RX = Math.max(1.9, halfW * 1.2), RY = halfH * 1.2, T = ft * 0.1;
    const fi = rm ? 1 : eout(clamp((now - T3D) / 1800)), spread = 1 + 1.8 * (1 - fi);
    for (let i = 0; i < fruits.length; i++) {
      const f = fruits[i], a = T + i, b = T + i * 1.1;
      let x = RX * Math.cos(a) * lerp(1, 1.15, eA) * spread;
      let y = lerp(RY * Math.sin(b) - halfH * 0.12, 1.35 + 1.25 * Math.sin(b), eA) * spread;
      const z = f.z * spread;
      // la palta siempre queda a la vista: nada pasa por delante de ella ni la atraviesa
      if (z > -1.2) {
        const qx = x / (1.25 + f.size * 0.5), qy = (y - 0.15) / (1.6 + f.size * 0.5), q2 = qx * qx + qy * qy;
        if (q2 < 1) { const k = 1 / Math.sqrt(Math.max(q2, 1e-4)); x *= k; y = 0.15 + (y - 0.15) * k; }
      }
      fp.set(x, wy + y, z);
      cv.subVectors(fp, camera.position); const L = cv.length(), minL = 2 + f.size;
      if (L < minL) fp.copy(camera.position).addScaledVector(cv, minL / Math.max(L, 1e-3));
      const gy = groundH(fp.x, fp.z) + f.size * 0.4; if (fp.y < gy) fp.y = gy;
      fq.setFromEuler(fe.set(f.rx + ft * f.wx, f.ry + ft * f.wy, f.rz + ft * f.wz));
      fm.compose(fp, fq, fs.setScalar(f.size));
      f.m.setMatrixAt(f.j, fm);
    }
    meshes.forEach(m => { m.instanceMatrix.needsUpdate = true; });

    // Nubes y viento
    clouds.forEach(c => { if (rm) return; c.position.x += c.userData.v * dt; const sp = c.userData.span; if (c.position.x > sp) c.position.x -= sp * 2; });
    WIND.value = ft;

    // Luz según el momento
    const L = LIGHTS[S.light] || LIGHTS.almuerzo, k = lightK === null ? 1 : 1 - Math.exp(-dt / 0.45);
    lightK = 1;
    cur.sunC.lerp(L.sunC, k); cur.glowC.lerp(L.glowC, k); cur.dirV.lerp(L.dirV, k).normalize();
    cur.si = lerp(cur.si, L.si, k); cur.hi = lerp(cur.hi, L.hi, k); cur.ga = lerp(cur.ga, L.ga, k); cur.moon = lerp(cur.moon, L.moon, k); cur.stars = lerp(cur.stars, L.stars, k);
    sun.color.copy(cur.sunC); sun.intensity = cur.si; hemi.intensity = cur.hi;
    const u = skyMat.uniforms;
    u.sunDir.value.copy(cur.dirV); u.sunCol.value.copy(cur.glowC); u.sunAmt.value = cur.ga; u.moonAmt.value = cur.moon; u.stars.value = cur.stars; u.time.value = ft;

    renderer.shadowMap.needsUpdate = eA > 0.3;
  }

  function frame(now) {
    const S = API.state;
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (!S.active || document.hidden) return;
    try {
      update(now, dt);
      renderer.render(scene, camera);
    } catch (e) {
      renderer.setAnimationLoop(null); canvas.remove(); API.disable3D();
      return;
    }
    frames++;
    if (!enabled && frames > 1) { enabled = true; API.enable3D(); }
    // Calidad adaptable: baja la resolución si el equipo no alcanza ~30 cuadros por segundo
    if (now - T3D > 2500 && dt > 0) {
      if (dt > 0.034) { slow++; fast = 0; } else if (dt < 0.014) { fast++; slow = 0; } else { slow = Math.max(0, slow - 1); fast = Math.max(0, fast - 1); }
      if (slow > 40 && quality > 0.55) { quality = Math.max(0.55, quality - 0.15); slow = 0; }
      else if (fast > 240 && quality < 1) { quality = Math.min(1, quality + 0.15); fast = 0; }
    }
  }

  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); renderer.setAnimationLoop(null); canvas.remove(); API.disable3D(); });
  window.RV_3D = { scene, camera, renderer, get frames() { return frames; } };
  renderer.setAnimationLoop(frame);
}

start();
