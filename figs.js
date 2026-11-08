const FIG = (() => {
  const R = v => Math.round(v * 10) / 10;
  const svg = (inner, h = 210, w = 340) => `<svg viewBox="0 0 ${w} ${h}" role="img">${inner}</svg>`;
  const T = (x, y, s, c = '') => `<text class="lab ${c}" x="${R(x)}" y="${R(y)}">${s}</text>`;
  const line = (x1, y1, x2, y2, c = 'ink', extra = '') => `<line class="${c}" x1="${R(x1)}" y1="${R(y1)}" x2="${R(x2)}" y2="${R(y2)}" ${extra}/>`;
  function arr(x1, y1, x2, y2, c = 'f', lab = '', at = 'head', off = [0, 0]) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 10, w = 4.5;
    const bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a), px = -Math.sin(a) * w, py = Math.cos(a) * w;
    let s = line(x1, y1, bx, by, c) + `<polygon class="${c}f" points="${R(x2)},${R(y2)} ${R(bx + px)},${R(by + py)} ${R(bx - px)},${R(by - py)}"/>`;
    if (lab) {
      const ux = Math.cos(a), uy = Math.sin(a);
      const [lx, ly] = at === 'head' ? [x2 + ux * 14, y2 + uy * 14] : [x1 - ux * 14, y1 - uy * 14];
      s += T(lx + off[0], ly + off[1], lab, c + 'l');
    }
    return s;
  }
  // flecha polar: ang en grados (0 = derecha, 90 = arriba). into = la punta llega a (x,y)
  function pol(x, y, ang, len, c = 'f', lab = '', into = false, off = [0, 0]) {
    const dx = Math.cos(ang * Math.PI / 180), dy = -Math.sin(ang * Math.PI / 180);
    return into ? arr(x - dx * len, y - dy * len, x, y, c, lab, 'tail', off) : arr(x, y, x + dx * len, y + dy * len, c, lab, 'head', off);
  }
  const hatchG = (x1, x2, y) => { let s = line(x1, y, x2, y); for (let x = x1 + 5; x <= x2; x += 8) s += line(x, y, x - 6, y + 7, 'hatch'); return s; };
  const hatchC = (x1, x2, y) => { let s = line(x1, y, x2, y); for (let x = x1 + 5; x <= x2; x += 8) s += line(x, y, x - 6, y - 7, 'hatch'); return s; };
  const wallL = (x, y1, y2) => { let s = line(x, y1, x, y2); for (let y = y1 + 5; y <= y2; y += 9) s += line(x, y, x - 7, y + 6, 'hatch'); return s; };
  const wallR = (x, y1, y2) => { let s = line(x, y1, x, y2); for (let y = y1 + 5; y <= y2; y += 9) s += line(x, y, x + 7, y + 6, 'hatch'); return s; };
  const pin = (x, y) => `<polygon class="body" points="${x},${y} ${x - 11},${y + 18} ${x + 11},${y + 18}"/><circle class="inkf" cx="${x}" cy="${y}" r="2.5"/>` + hatchG(x - 16, x + 16, y + 18);
  const roller = (x, y) => `<polygon class="body" points="${x},${y} ${x - 10},${y + 12} ${x + 10},${y + 12}"/><circle class="ink" cx="${x - 5}" cy="${y + 16}" r="3.5" stroke-width="1.5"/><circle class="ink" cx="${x + 5}" cy="${y + 16}" r="3.5" stroke-width="1.5"/>` + hatchG(x - 16, x + 16, y + 20);
  function couple(x, y, dir, c, lab, r = 17) {
    const ccw = dir === 'ccw';
    const a0 = ccw ? -40 : 220, a1 = ccw ? 220 : -40;
    const P = a => [x + r * Math.cos(a * Math.PI / 180), y - r * Math.sin(a * Math.PI / 180)];
    const [sx, sy] = P(a0), [ex, ey] = P(a1);
    let s = `<path class="${c}" d="M${R(sx)} ${R(sy)} A${r} ${r} 0 1 ${ccw ? 0 : 1} ${R(ex)} ${R(ey)}"/>`;
    const tan = ccw ? a1 + 90 : a1 - 90, td = tan * Math.PI / 180;
    const hx = ex + Math.cos(td) * 2, hy = ey - Math.sin(td) * 2;
    s += arr(ex - Math.cos(td) * 8, ey + Math.sin(td) * 8, hx, hy, c);
    if (lab) s += T(x, y - r - 12, lab, c + 'l');
    return s;
  }
  const dim = (x1, x2, y, lab) => line(x1, y, x2, y, 'dimL') + line(x1, y - 5, x1, y + 5, 'dimL') + line(x2, y - 5, x2, y + 5, 'dimL') + T((x1 + x2) / 2, y + 12, lab, 'dl');
  const box = (x, y, w, h, lab) => `<rect class="body" x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/>` + (lab ? T(x + w / 2, y + h / 2, lab) : '');

  /* ---------- Vigas y barras ---------- */
  function beam(c, mode) {
    const L = c.L, x0 = c.x0 ?? 66, x1 = c.x1 ?? 292, y = c.y ?? 95, H = c.h ?? 210;
    const X = v => x0 + (v / L) * (x1 - x0);
    const dcl = mode === 'd';
    let s = '';
    const Wl = dcl && c.Wd ? c.Wd : (c.W || []);
    const wmax = Math.max(1, ...(c.W || []).map(w => Math.max(w.w1, w.w2)));
    if (!dcl) {
      (c.sup || []).forEach(p => {
        if (p.t === 'fixed') s += wallL(X(p.x), y - 34, y + 34);
        if (p.t === 'wallpin') s += wallL(X(p.x), y - (c.wallTop ?? 40), y + (c.wallBot ?? 30));
      });
    }
    s += `<rect class="body" x="${R(x0)}" y="${y - 6}" width="${R(x1 - x0)}" height="12" rx="2"/>`;
    // cargas distribuidas
    (c.W || []).forEach(w => {
      const h1 = 10 + w.w1 / wmax * 30, h2 = 10 + w.w2 / wmax * 30, a = X(w.x1), b = X(w.x2), top = y - 8;
      const cls = dcl ? 'g' : 'f';
      s += `<polygon points="${R(a)},${top} ${R(a)},${R(top - (w.w1 ? h1 : 0))} ${R(b)},${R(top - (w.w2 ? h2 : 0))} ${R(b)},${top}" fill="none" class="${dcl ? 'dimL' : 'ink'}" stroke-width="1.2"/>`;
      const n = Math.max(2, Math.round((b - a) / 22));
      for (let i = 0; i <= n; i++) {
        const xx = a + (b - a) * i / n, ww = w.w1 + (w.w2 - w.w1) * i / n;
        if (ww <= 0.001) continue;
        const hh = 10 + ww / wmax * 30;
        s += arr(xx, top - hh, xx, top, cls);
      }
      if (!dcl) s += T((a + b) / 2, top - Math.max(h1, h2) - 12, w.lab, 'fl');
    });
    if (dcl) Wl.forEach(w => {
      const Rv = (w.w1 + w.w2) / 2 * (w.x2 - w.x1);
      const xc = w.x1 + (w.x2 - w.x1) * (w.w1 + 2 * w.w2) / (3 * (w.w1 + w.w2));
      s += pol(X(xc), y - 6, -90, 62, 'f', 'R = ' + R(Rv) + ' ' + (w.u || 'kN'), true, w.o || [0, -2]);
      s += line(X(xc), y + 8, X(xc), y + 46, 'dimL');
    });
    // cargas puntuales
    (c.P || []).forEach(p => {
      const up = Math.sin(p.ang * Math.PI / 180) > 0.01;
      const len = p.len || 46;
      if (up) s += pol(X(p.x), y - 6, p.ang, len, p.c || 'f', p.lab, false, p.off || [0, 0]);
      else s += pol(X(p.x), y - 6, p.ang, len, p.c || 'f', p.lab, true, p.off || [0, 0]);
      if (dcl && c.comp && Math.abs(Math.cos(p.ang * Math.PI / 180)) > 0.05 && Math.abs(Math.sin(p.ang * Math.PI / 180)) > 0.05) {
        const ca = Math.cos(p.ang * Math.PI / 180), sa = Math.sin(p.ang * Math.PI / 180);
        const vx = X(p.x);
        if (up) { s += pol(vx, y - 6, 90, 40 * sa, 'rd', p.cy || 'Fy', false, [14, 0]); s += pol(vx, y - 6, ca > 0 ? 0 : 180, 40 * Math.abs(ca), 'rd', p.cx || 'Fx', false, [0, 10]); }
        else { s += pol(vx, y - 6, -90, 40 * Math.abs(sa), 'rd', p.cy || 'Fy', true, [16, 0]); s += pol(vx, y - 6, ca > 0 ? 0 : 180, 40 * Math.abs(ca), 'rd', p.cx || 'Fx', true, [0, -10]); }
      }
    });
    (c.C || []).forEach(m => s += couple(X(m.x), y, m.dir, 'f', m.lab, 15));
    // puntal (elemento de dos fuerzas) desde la pared
    if (c.strut) {
      const dx = X(c.strut.x), ang = c.strut.ang, ht = (dx - x0) * Math.tan(ang * Math.PI / 180);
      if (!dcl) { s += line(x0, y + 6 + ht, dx, y + 6, 'ink', 'stroke-width="5" stroke-linecap="round"') + `<circle class="body" cx="${R(x0)}" cy="${R(y + 6 + ht)}" r="4.5"/><circle class="body" cx="${R(dx)}" cy="${y + 6}" r="4.5"/>` + T(x0 + 14, y + 6 + ht + 4, 'C') + T(dx + 12, y + 20, 'D'); }
      else { s += pol(dx, y + 6, ang, 58, 'r', c.strut.lab || 'F_CD', true, [-8, 6]); s += line(dx, y + 6, dx - 50, y + 6, 'dimL'); s += T(dx - 46, y + 18, R(ang) + '°', 'dl'); }
    }
    // cable
    if (c.cable) {
      const bx = X(c.cable.x), ang = c.cable.ang, ht = (bx - x0) * Math.tan(ang * Math.PI / 180);
      if (!dcl) { s += line(bx, y, x0, y - ht, 'ink', 'stroke-dasharray="5 4" stroke-width="1.4"'); s += T(bx - 34, y - 12, ang + '°', 'dl'); }
      else { s += pol(bx, y, 180 - ang, 62, 'r', 'T'); s += line(bx, y, bx - 40, y, 'dimL'); s += T(bx - 42, y - 10, ang + '°', 'dl'); }
    }
    // apoyos / reacciones
    (c.sup || []).forEach(p => {
      const xx = X(p.x), n = p.n || '';
      if (!dcl) {
        if (p.t === 'pin') s += pin(xx, y + 6);
        if (p.t === 'roller') s += roller(xx, y + 6);
        if (p.t === 'wallpin') s += `<circle class="body" cx="${xx}" cy="${y}" r="5"/>`;
        if (p.t === 'pivot') s += `<polygon class="body" points="${xx},${y + 6} ${xx - 11},${y + 26} ${xx + 11},${y + 26}"/>`;
        if (p.t === 'point') s += `<circle class="inkf" cx="${xx}" cy="${y}" r="4.5"/>`;
        if (p.t === 'spring') { let pth = `M${xx} ${y + 6}`; for (let i = 0; i < 6; i++) pth += ` L${xx + (i % 2 ? -8 : 8)} ${y + 12 + i * 6}`; pth += ` L${xx} ${y + 48} L${xx} ${y + 54}`; s += `<path class="ink" d="${pth}" fill="none" stroke-width="1.6"/>` + hatchG(xx - 16, xx + 16, y + 54); }
        if (p.t === 'rollerInc') { s += `<g transform="rotate(${p.a} ${xx} ${y + 6})">` + roller(xx, y + 6) + `</g>`; s += T(xx + 26, y + 30, p.a + '°', 'dl'); }
        if (n) s += T(xx + (p.t === 'fixed' ? 14 : 0), y + (p.t === 'fixed' ? 22 : 40), n);
      } else {
        const side = xx < (x0 + x1) / 2 ? -1 : 1;
        if (p.t === 'pin' || p.t === 'wallpin') {
          s += pol(xx, y + 6, 90, 40, 'r', n + 'y', true);
          s += side < 0 ? pol(xx - 6, y, 0, 34, 'r', n + 'x', true) : pol(xx + 6, y, 180, 34, 'r', n + 'x', true);
        }
        if (p.t === 'roller' || p.t === 'pivot' || p.t === 'spring') s += pol(xx, y + 6, 90, 40, 'r', p.rn || (n + 'y'), true);
        if (p.t === 'rollerInc') s += pol(xx, y + 6, p.ra, 44, 'r', p.rn || n, true);
        if (p.t === 'fixed') {
          s += pol(xx, y + 6, 90, 40, 'r', n + 'y', true, [10, 0]);
          s += pol(xx - 6, y, 0, 34, 'r', n + 'x', true);
          s += couple(xx, y, 'ccw', 'r', 'M' + n, 22);
        }
        if (p.t === 'point') { s += `<circle class="inkf" cx="${xx}" cy="${y}" r="4"/>` + T(xx, y + 22, n); }
      }
    });
    if (dcl && c.Mres) s += couple(X(c.Mres.x ?? 0), y, c.Mres.dir, 'r', c.Mres.lab, 24);
    (c.D || []).forEach(d => s += dim(X(d[0]), X(d[1]), y + (dcl ? 62 : 54), d[2]));
    return svg(s, H);
  }

  /* ---------- Vectores ---------- */
  function vec(c, mode) {
    const cx = c.cx ?? 170, cy = c.cy ?? 110, sc = c.sc ?? (82 / Math.max(...c.F.map(f => f.F)));
    let s = line(cx - 140, cy, cx + 140, cy, 'dimL') + line(cx, cy + 92, cx, cy - 98, 'dimL') + T(cx + 132, cy + 12, 'x', 'dl') + T(cx + 10, cy - 92, 'y', 'dl');
    const d = mode === 'd';
    c.F.forEach(f => {
      if (c.comps && d) {
        const fx = f.F * Math.cos(f.a * Math.PI / 180) * sc, fy = f.F * Math.sin(f.a * Math.PI / 180) * sc;
        s += arr(cx, cy, cx + fx, cy, 'rd', 'Fx', 'head', [0, 14 * Math.sign(-fy || 1) * -1]);
        s += arr(cx + fx, cy, cx + fx, cy - fy, 'rd', 'Fy', 'head', [fx > 0 ? 16 : -16, 0]);
        s += pol(cx, cy, f.a, f.F * sc, 'g', '');
      } else s += pol(cx, cy, f.a, f.F * sc, d && !c.keep ? 'g' : 'f', f.l, false, f.o || [0, 0]);
    });
    if (d && c.Rv) {
      const r = c.Rv, x = r.x * sc, y = r.y * sc;
      if (r.show !== false) { s += arr(cx, cy, cx + x, cy, 'rd', 'ΣFx', 'head', [0, 12]); s += arr(cx + x, cy, cx + x, cy - y, 'rd', 'ΣFy', 'head', [x >= 0 ? 20 : -20, 0]); }
      s += arr(cx, cy, cx + x, cy - y, 'r', r.l, 'head', r.o || [0, 0]);
    }
    if (c.extra) s += c.extra(mode, cx, cy, sc);
    return svg(s, 220);
  }

  /* ---------- Nudo con cables ---------- */
  function knot(c, mode) {
    const cx = 170, cy = 112, top = 26;
    let s = '';
    const d = mode === 'd';
    if (!d) {
      s += hatchC(40, 300, top);
      c.k.forEach(k => {
        const a = k.a * Math.PI / 180, dx = Math.cos(a), dy = -Math.sin(a);
        if (Math.abs(dy) < 0.05) { const ex = dx > 0 ? 300 : 40; s += line(cx, cy, ex, cy, 'ink', 'stroke-width="1.6"') + (dx > 0 ? wallR(ex, cy - 30, cy + 30) : wallL(ex, cy - 30, cy + 30)); }
        else { const t = (top - cy) / dy; s += line(cx, cy, cx + dx * t, top, 'ink', 'stroke-width="1.6"'); }
        s += T(cx + Math.cos(a) * 46 + (dx < 0 ? -2 : 2), cy - Math.sin(a) * 46 + 14, k.g, 'dl');
      });
      s += line(cx, cy, cx, cy + 40, 'ink', 'stroke-width="1.6"') + box(cx - 30, cy + 40, 60, 30, c.W);
      s += `<circle class="inkf" cx="${cx}" cy="${cy}" r="3.5"/>`;
    } else {
      s += line(cx - 90, cy, cx + 90, cy, 'dimL');
      c.k.forEach(k => { s += pol(cx, cy, k.a, 70, 'r', k.T); s += T(cx + Math.cos(k.a * Math.PI / 180) * 34 + (Math.cos(k.a * Math.PI / 180) < 0 ? -6 : 6), cy - Math.sin(k.a * Math.PI / 180) * 34 + 14, k.g, 'dl'); });
      s += pol(cx, cy, -90, 66, 'f', c.W);
      s += `<circle class="inkf" cx="${cx}" cy="${cy}" r="4"/>`;
    }
    return svg(s, 210);
  }

  /* ---------- Plano inclinado ---------- */
  function incl(c, mode) {
    const th = c.th, t = th * Math.PI / 180, x0 = 50, base = 220, yb = 185;
    const yt = yb - base * Math.tan(t);
    const sp = 0.52, px = x0 + base * sp, py = yb - base * sp * Math.tan(t);
    const nx = -Math.sin(t), ny = Math.cos(t);
    const bx = px + nx * 17, by = py - ny * 17;
    const d = mode === 'd';
    let s = '';
    if (!d) {
      s += `<polygon class="ink" points="${x0},${yb} ${x0 + base},${yb} ${x0 + base},${R(yt)}" stroke-width="1.6"/>` + hatchG(x0 - 6, x0 + base + 8, yb);
      s += T(x0 + 42, yb - 10, th + '°', 'dl');
      s += `<g transform="rotate(${-th} ${R(bx)} ${R(by)})">` + box(R(bx - 20), R(by - 16), 40, 32, '') + `</g>` + T(bx, by, c.m);
      if (c.mu) s += T(x0 + base - 50, yb + 16, c.mu, 'dl');
      if (c.P === 'par') s += pol(bx + Math.cos(t) * 22, by - Math.sin(t) * 22, th, 54, 'f', c.Pl || 'P');
      if (c.P === 'hor') s += pol(bx - 22, by, 0, 52, 'f', c.Pl || 'P', true);
      if (c.pul) {
        const tx = x0 + base + 6, ty = yt - 6;
        s += line(bx + Math.cos(t) * 20, by - Math.sin(t) * 20, tx - Math.sin(t) * 0 - 4, ty - 4, 'ink', 'stroke-width="1.4"');
        s += `<circle class="body" cx="${tx}" cy="${R(ty + 4)}" r="9"/>` + line(tx + 9, ty + 4, tx + 9, ty + 70, 'ink', 'stroke-width="1.4"') + box(tx - 6, ty + 70, 30, 26, 'm');
      }
    } else {
      s += line(bx - Math.cos(t) * 90, by + Math.sin(t) * 90, bx + Math.cos(t) * 90, by - Math.sin(t) * 90, 'dimL') + line(bx - nx * 70, by + ny * 70, bx + nx * 80, by - ny * 80, 'dimL');
      s += T(bx + Math.cos(t) * 100, by - Math.sin(t) * 100, "x'", 'dl') + T(bx + nx * 92, by - ny * 92, "y'", 'dl');
      s += `<g transform="rotate(${-th} ${R(bx)} ${R(by)})">` + box(R(bx - 20), R(by - 16), 40, 32, '') + `</g>`;
      s += pol(bx, by, -90, 62, 'f', 'W', false, [10, 0]);
      s += pol(bx, by, 90 + th, 58, 'r', 'N');
      if (c.f) s += pol(bx, by, c.f === 'up' ? th : 180 + th, 52, 'r', 'f');
      if (c.P === 'par') s += pol(bx, by, th, 58, 'f', 'P');
      if (c.P === 'hor') s += pol(bx - 20, by, 0, 50, 'f', 'P', true);
      if (c.pul) s += pol(bx, by, th, 58, 'r', 'T');
      s += T(bx - 52, by + 44, 'θ = ' + th + '°', 'dl');
    }
    return svg(s, 215);
  }

  /* ---------- Bloque sobre el piso ---------- */
  function floorB(c, mode) {
    const x0 = 125, w = 80, yb = 160, h = 50, cx = x0 + w / 2, cy = yb - h / 2;
    const d = mode === 'd';
    let s = '';
    if (!d) {
      s += hatchG(40, 300, yb) + box(x0, yb - h, w, h, c.m);
      if (c.mu) s += T(270, yb + 18, c.mu, 'dl');
      if (c.push) s += pol(x0, cy, c.a || 0, 56, 'f', c.Pl, true);
      else { s += line(x0 + w, cy, x0 + w + Math.cos(c.a * Math.PI / 180) * 30, cy - Math.sin(c.a * Math.PI / 180) * 30, 'ink'); s += pol(x0 + w + Math.cos(c.a * Math.PI / 180) * 30, cy - Math.sin(c.a * Math.PI / 180) * 30, c.a, 50, 'f', c.Pl); if (c.a) s += T(x0 + w + 64, cy + 4, c.a + '°', 'dl'); }
    } else {
      s += box(x0, yb - h, w, h, '');
      s += pol(cx, cy, -90, 70, 'f', 'W', false, [12, 0]);
      s += pol(cx - 22, yb, 90, 44, 'r', 'N', true);
      s += pol(x0 + 4, yb, 180, 46, 'r', 'f');
      if (c.push) s += pol(x0, cy, c.a || 0, 56, 'f', 'P', true);
      else s += pol(x0 + w, cy, c.a, 60, 'f', 'P');
    }
    return svg(s, 210);
  }

  /* ---------- Armadura triangular ---------- */
  function tri(c, mode) {
    const sp = c.span, hh = c.h;
    const d = mode === 'd';
    const sc = Math.min((d ? 150 : 180) / sp, 110 / hh);
    const ax = d ? 30 : 80, ay = d ? 150 : 150, bx = ax + sp * sc, cxp = ax + sp * sc / 2, cyp = ay - hh * sc;
    let s = `<polygon points="${R(ax)},${ay} ${R(bx)},${ay} ${R(cxp)},${R(cyp)}" fill="none" class="ink" stroke-width="${d ? 3 : 4}" stroke-linejoin="round"/>`;
    [[ax, ay], [bx, ay], [cxp, cyp]].forEach(([x, y]) => s += `<circle class="body" cx="${R(x)}" cy="${R(y)}" r="4.5"/>`);
    s += T(ax - 12, ay - 10, 'A') + T(bx + 12, ay - 10, 'B') + T(cxp, cyp - 14, 'C');
    if (!d) {
      s += pin(ax, ay + 5) + roller(bx, ay + 5);
      s += pol(cxp, cyp + 4, -90, 38, 'f', c.P, false, [26, -10]);
      s += dim(ax, bx, ay + 40, sp + ' m') + line(bx + 26, ay, bx + 26, cyp, 'dimL') + T(bx + 40, (ay + cyp) / 2, hh + ' m', 'dl');
    } else {
      s += pol(cxp, cyp, -90, 32, 'f', c.P, false, [24, -6]);
      s += pol(ax, ay + 5, 90, 34, 'r', 'Ay', true) + pol(bx, ay + 5, 90, 34, 'r', 'By', true);
      // nodo A aislado
      const nx = 232, ny = 150, ang = Math.atan2(hh, sp / 2) * 180 / Math.PI;
      s += line(nx, ny, nx + 40, ny, 'ink', 'stroke-width="3"') + line(nx, ny, nx + 40 * Math.cos(ang * Math.PI / 180), ny - 40 * Math.sin(ang * Math.PI / 180), 'ink', 'stroke-width="3"');
      s += `<circle class="body" cx="${nx}" cy="${ny}" r="5"/>` + T(nx - 14, ny - 8, 'A');
      s += pol(nx + 44, ny, 0, 26, 'r', 'F_AB', false, [-20, 14]);
      s += pol(nx + 44 * Math.cos(ang * Math.PI / 180), ny - 44 * Math.sin(ang * Math.PI / 180), ang, 26, 'r', 'F_AC', false, [-6, 0]);
      s += pol(nx, ny + 5, 90, 34, 'r', 'Ay', true);
      s += T(nx + 20, 30, 'Nodo A', 'dl') + line(205, 20, 205, 195, 'dimL');
    }
    return svg(s, 215);
  }

  /* ---------- Casos especiales ---------- */
  const special = {
    spring(mode) {
      let s = '';
      if (mode !== 'd') {
        s += hatchC(110, 230, 26);
        let p = 'M170 26 L170 40'; for (let i = 0; i < 8; i++) p += ` L${i % 2 ? 158 : 182} ${46 + i * 8}`; p += ' L170 110 L170 120';
        s += `<path class="ink" d="${p}" stroke-width="1.6"/>` + box(140, 120, 60, 36, '150 N') + T(220, 76, 'k = 2000 N/m', 'dl');
      } else {
        s += box(140, 90, 60, 36, '') + pol(170, 90, 90, 56, 'r', 'F = k·s') + pol(170, 126, -90, 56, 'f', '150 N');
      }
      return svg(s, 210);
    },
    ladder(mode) {
      const fx = 205, fy = 180, tx = 280, ty = 50;
      let s = '';
      if (mode !== 'd') {
        s += hatchG(60, 290, fy) + wallR(tx, 30, fy);
        s += line(fx, fy, tx, ty, 'ink', 'stroke-width="6" stroke-linecap="round"');
        s += pol((fx + tx) / 2, (fy + ty) / 2, -90, 46, 'f', '200 N', false, [-26, 0]);
        s += T(fx - 28, fy - 12, '60°', 'dl') + T(fx - 60, 70, '5 m', 'dl') + T(170, 196, 'piso rugoso', 'dl') + T(tx + 26, 22, 'pared lisa', 'dl');
      } else {
        s += line(fx, fy, tx, ty, 'ink', 'stroke-width="6" stroke-linecap="round"');
        s += pol((fx + tx) / 2, (fy + ty) / 2, -90, 50, 'f', 'W', false, [12, 0]);
        s += pol(tx, ty, 180, 56, 'r', 'N_pared');
        s += pol(fx, fy, 90, 50, 'r', 'N_piso', true, [0, 0]);
        s += pol(fx, fy, 0, 52, 'r', 'f', true);
        s += line(fx, fy, fx + 100, fy, 'dimL') + T(fx + 28, fy - 10, '60°', 'dl');
        s += line(fx, fy + 22, tx, fy + 22, 'dimL') + T((fx + tx) / 2, fy + 34, '5·cos60°', 'dl');
        s += line(tx + 18, fy, tx + 18, ty, 'dimL') + T(tx + 32, (fy + ty) / 2, '5·sen60°', 'dl', ).replace('class="lab dl"', 'class="lab dl" transform="rotate(-90 ' + (tx + 32) + ' ' + ((fy + ty) / 2) + ')"');
      }
      return svg(s, 215);
    },
    table(mode) {
      let s = '';
      if (mode !== 'd') {
        s += line(40, 110, 250, 110, 'ink', 'stroke-width="3"') + line(60, 110, 60, 190) + line(230, 110, 230, 190);
        s += box(110, 70, 60, 40, 'A 20 kg') + line(170, 90, 252, 90, 'ink', 'stroke-width="1.4"');
        s += `<circle class="body" cx="252" cy="100" r="10"/>` + line(262, 100, 262, 140, 'ink', 'stroke-width="1.4"') + box(240, 140, 44, 32, 'B') + T(140, 128, 'μs = 0.3', 'dl');
      } else {
        s += box(60, 80, 60, 40, 'A') + pol(90, 100, -90, 70, 'f', 'W_A', false, [16, -8]) + pol(80, 120, 90, 40, 'r', 'N', true) + pol(120, 100, 0, 50, 'r', 'T') + pol(60, 114, 180, 40, 'r', 'f');
        s += line(205, 20, 205, 195, 'dimL');
        s += box(250, 90, 44, 32, 'B') + pol(272, 90, 90, 50, 'r', 'T') + pol(272, 122, -90, 50, 'f', 'W_B');
      }
      return svg(s, 210);
    },
    ladderG(c, mode) {
      const sc = 135 / (c.L * Math.sin(c.a * Math.PI / 180)), fx = 280 - c.L * Math.cos(c.a * Math.PI / 180) * sc, fy = 185, tx = 280, ty = fy - c.L * Math.sin(c.a * Math.PI / 180) * sc;
      const P = d => [fx + (tx - fx) * d / c.L, fy + (ty - fy) * d / c.L];
      const [gx, gy] = P(c.L / 2), [px, py] = P(c.pd);
      let s = '';
      if (mode !== 'd') {
        s += hatchG(60, 290, fy) + wallR(tx, 30, fy) + line(fx, fy, tx, ty, 'ink', 'stroke-width="6" stroke-linecap="round"');
        s += `<circle class="body" cx="${R(px)}" cy="${R(py - 12)}" r="7"/>` + line(px, py - 5, px, py, 'ink', 'stroke-width="3"') + T(px - 40, py - 14, c.pl, 'fl');
        s += T(fx - 26, fy - 12, c.a + '°', 'dl') + T((fx + tx) / 2 - 40, (fy + ty) / 2, c.L + ' m', 'dl') + T(fx, fy + 14, 'A', '') + T(tx - 12, ty, 'B');
      } else {
        s += line(fx, fy, tx, ty, 'ink', 'stroke-width="6" stroke-linecap="round"');
        s += pol(gx, gy, -90, 44, 'f', c.W, false, [30, 4]) + pol(px, py, -90, 50, 'f', c.pl, false, [-32, 4]);
        s += pol(tx, ty, 180, 56, 'r', 'N_B') + pol(fx, fy, 90, 46, 'r', 'N_A', true) + pol(fx, fy, 0, 50, 'r', 'f', true);
        s += line(fx, fy, fx + 90, fy, 'dimL') + T(fx + 30, fy - 10, c.a + '°', 'dl');
      }
      return svg(s, 215);
    },
    pointG(c, mode) {
      const ox = 120, oy = 120, k = 30, ax = ox + c.x * k, ay = oy - c.y * k;
      const a = Math.atan2(c.Fy, c.Fx) * 180 / Math.PI;
      let s = line(20, oy, 320, oy, 'dimL') + line(ox, 205, ox, 15, 'dimL') + `<circle class="inkf" cx="${ox}" cy="${oy}" r="4"/>` + T(ox - 12, oy + 14, 'O');
      s += `<circle class="inkf" cx="${ax}" cy="${ay}" r="4"/>` + T(ax + 16, ay + 16, 'A(' + c.x + ', ' + c.y + ')');
      if (mode !== 'd') s += pol(ax, ay, a, 70, 'f', c.l, false, [0, -6]) + T(250, 30, '(' + c.Fx + ', ' + c.Fy + ') N', 'dl');
      else {
        s += pol(ax, ay, c.Fx > 0 ? 0 : 180, 44, 'rd', 'Fx', false, [0, 12]) + pol(ax, ay, c.Fy > 0 ? 90 : -90, 54, 'rd', 'Fy', false, [16, 0]);
        s += line(ox, ay, ax, ay, 'dimL') + line(ax, oy, ax, ay, 'dimL') + T(ax, oy + 14, 'x = ' + c.x, 'dl') + T(ox - 30, ay, 'y = ' + c.y, 'dl');
        s += couple(ox, oy, c.dir, 'r', '', 14);
      }
      return svg(s, 215);
    },
    groove(mode) {
      const cx = 170, cy = 100, r = 38;
      let s = '';
      const l = [cx - r * Math.sin(30 * Math.PI / 180), cy + r * Math.cos(30 * Math.PI / 180)], q = [cx + r * Math.sin(45 * Math.PI / 180), cy + r * Math.cos(45 * Math.PI / 180)];
      if (mode !== 'd') {
        const c3 = Math.cos(Math.PI / 6), s3 = Math.sin(Math.PI / 6), c4 = Math.SQRT1_2;
        s += line(l[0] - 110 * c3, l[1] - 110 * s3, l[0] + 34 * c3, l[1] + 34 * s3, 'ink', 'stroke-width="2"');
        s += line(q[0] + 110 * c4, q[1] - 110 * c4, q[0] - 30 * c4, q[1] + 30 * c4, 'ink', 'stroke-width="2"');
        s += `<circle class="body" cx="${cx}" cy="${cy}" r="${r}"/>` + T(cx, cy, '200 N');
        s += T(l[0] - 40, l[1] + 4, '30°', 'dl') + T(q[0] + 44, q[1] + 6, '45°', 'dl');
      } else {
        s += `<circle class="body" cx="${cx}" cy="${cy}" r="${r}"/>`;
        s += pol(l[0], l[1], 60, 60, 'r', 'N₁', true) + pol(q[0], q[1], 135, 60, 'r', 'N₂', true) + pol(cx, cy, -90, 58, 'f', 'W', false, [12, 0]);
        s += T(170, 196, 'Cada normal es perpendicular a su plano', 'dl');
      }
      return svg(s, 210);
    },
    pratt(c, mode) {
      const sx = 20, x0 = 36, yb = 150, yt = 90;
      const N = { A: [0, 0], B: [3, 0], C: [6, 0], D: [9, 0], E: [12, 0], F: [3, 3], G: [6, 3], H: [9, 3] };
      const P = k => [x0 + N[k][0] * sx, yb - N[k][1] * sx];
      const bars = ['AB', 'BC', 'CD', 'DE', 'FG', 'GH', 'AF', 'BF', 'FC', 'CG', 'CH', 'DH', 'HE'];
      let s = '';
      const cut = c.cut && mode === 'd';
      bars.forEach(b => { const [x1, y1] = P(b[0]), [x2, y2] = P(b[1]); if (cut && (N[b[0]][0] > 3 && N[b[1]][0] > 3 || (N[b[0]][0] >= 6 && N[b[1]][0] >= 6))) return; if (cut && ['BC', 'FG', 'FC'].includes(b)) return; s += line(x1, y1, x2, y2, 'ink', 'stroke-width="3" stroke-linecap="round"'); });
      Object.keys(N).forEach(k => { if (cut && N[k][0] > 3) return; const [x, y] = P(k); s += `<circle class="body" cx="${x}" cy="${y}" r="4"/>` + T(x, y + (N[k][1] ? -13 : 14), k); });
      if (!cut) {
        (c.loads || []).forEach(k => { const [x, y] = P(k); s += pol(x, y + 4, -90, 34, 'f', c.Pl, true, [0, -2]).replace('', ''); });
        if (mode !== 'd') { s += pin(...P('A').map((v, i) => i ? v + 4 : v)) + roller(P('E')[0], P('E')[1] + 4) + dim(P('A')[0], P('E')[0], yb + 42, '4 tramos de 3 m') + line(P('E')[0] + 22, yb, P('E')[0] + 22, yt, 'dimL') + T(P('E')[0] + 34, (yb + yt) / 2, '3 m', 'dl'); if (c.cutline) s += line(P('B')[0] + 34, yt - 20, P('B')[0] + 34, yb + 20, 'dimL').replace('dimL', 'f') ; }
        else s += pol(P('A')[0], yb + 4, 90, 34, 'r', 'Ay', true) + pol(P('E')[0], yb + 4, 90, 34, 'r', 'Ey', true);
      } else {
        const [bx, by] = P('B'), [fx, fy] = P('F'), [ax, ay] = P('A');
        s += pol(bx, by + 4, -90, 34, 'f', c.Pl, true);
        s += pol(fx, fy, 0, 54, 'r', 'F_FG') + pol(bx, by, 0, 54, 'r', 'F_BC', false, [0, 12]) + pol(fx, fy, -45, 60, 'r', 'F_FC', false, [18, 0]);
        s += pol(ax, ay + 4, 90, 30, 'r', 'Ay = 15 kN', true, [34, -10]);
        s += `<circle class="body" cx="${x0 + 6 * sx}" cy="${yb}" r="3"/>` + T(x0 + 6 * sx + 12, yb + 12, 'C', 'dl');
        s += T(260, 40, 'Corte por FG, FC y BC', 'dl') + T(260, 58, 'Lado izquierdo', 'dl');
      }
      return svg(s, 210);
    },
    stack(mode) {
      let s = '';
      if (mode !== 'd') {
        s += hatchG(40, 300, 170) + box(110, 120, 120, 50, 'B 20 kg') + box(130, 85, 70, 35, 'A 10 kg');
        s += wallL(60, 60, 130) + line(60, 102, 130, 102, 'ink', 'stroke-width="1.6"') + pol(230, 145, 0, 50, 'f', 'P = ?') + T(270, 186, 'μs = 0.3 en ambas', 'dl');
      } else {
        s += box(40, 70, 70, 35, 'A') + pol(40, 87, 180, 30, 'r', 'T') + pol(75, 70, -90, 0.1, 'f', '') + pol(75, 87, -90, 50, 'f', 'W_A', false, [18, 0]).replace('', '') + pol(60, 105, 90, 30, 'r', 'N_A', true, [-18, 0]) + pol(110, 105, 0, 40, 'r', 'f_A', false, [0, 10]);
        s += line(165, 20, 165, 200, 'dimL');
        s += box(190, 100, 110, 45, 'B') + pol(300, 122, 0, 34, 'f', 'P') + pol(245, 100, -90, 40, 'r', 'N_A', true, [22, 0]) + pol(200, 100, 180, 34, 'r', 'f_A', false, [0, -10]) + pol(205, 145, 180, 40, 'r', 'f_B', false, [0, 10]) + pol(270, 145, 90, 32, 'r', 'N_B', true, [20, 0]) + pol(245, 122, -90, 70, 'f', 'W_B', false, [-20, 0]);
      }
      return svg(s, 210);
    },
    tip(mode) {
      const x0 = 140, w = 50, h = 100, yb = 175;
      let s = '';
      if (mode !== 'd') {
        s += hatchG(40, 300, yb) + box(x0, yb - h, w, h, '50 kg') + pol(x0, yb - 75, 0, 56, 'f', 'P', true);
        s += line(x0 + w + 16, yb, x0 + w + 16, yb - h, 'dimL') + T(x0 + w + 30, yb - h / 2, '2 m', 'dl') + dim(x0, x0 + w, yb + 22, '1 m') + line(x0 - 70, yb, x0 - 70, yb - 75, 'dimL') + T(x0 - 84, yb - 40, '1.5 m', 'dl') + T(270, 40, 'μs = 0.4', 'dl');
      } else {
        s += box(x0, yb - h, w, h, '') + pol(x0, yb - 75, 0, 56, 'f', 'P', true) + pol(x0 + w / 2, yb - h / 2, -90, 60, 'f', 'W', false, [14, 0]);
        s += pol(x0 + w, yb, 90, 44, 'r', 'N', true, [16, 0]) + pol(x0 + w, yb + 4, 180, 44, 'r', 'f', false, [0, 10]);
        s += `<circle class="inkf" cx="${x0 + w}" cy="${yb}" r="4"/>` + T(x0 + w + 16, yb + 10, 'O', 'dl') + T(250, 30, 'N y f en la esquina O', 'dl');
      }
      return svg(s, 210);
    },
    pulleyIncl(mode) { return incl({ th: 30, m: '30 kg', pul: true }, mode); },
    pole(mode) {
      const bx = 110, by = 180, ty = 60;
      let s = hatchG(50, 230, by) + `<rect class="body" x="${bx - 6}" y="${ty}" width="12" height="${by - ty}" rx="2"/>`;
      if (mode !== 'd') { s += pol(bx, ty, 60, 66, 'f', '1 kN', false, [10, 0]) + line(bx, ty, bx + 50, ty, 'dimL') + T(bx + 50, ty + 12, '60°', 'dl') + line(bx - 30, by, bx - 30, ty, 'dimL') + T(bx - 44, (by + ty) / 2, '4 m', 'dl'); }
      else {
        s += pol(bx, ty, 0, 40, 'rd', 'Fx = 500 N', false, [36, 0]) + pol(bx, ty, 90, 40, 'rd', 'Fy = 866 N', false, [-44, 14]);
        s += `<circle class="inkf" cx="${bx}" cy="${by}" r="4"/>` + T(bx - 14, by + 14, 'O') + couple(bx, by - 18, 'cw', 'r', '', 14);
        s += line(bx - 30, by, bx - 30, ty, 'dimL') + T(bx - 44, (by + ty) / 2, 'd = 4 m', 'dl').replace('class="lab dl"', `class="lab dl" transform="rotate(-90 ${bx - 44} ${(by + ty) / 2})"`);
        s += T(250, 150, 'Fy pasa por O:', 'dl') + T(250, 166, 'no hace momento', 'dl');
      }
      return svg(s, 210);
    },
    point(mode) {
      const ox = 70, oy = 175, k = 38, ax = ox + 2 * k, ay = oy - 3 * k;
      const a = Math.atan2(-400, 300) * 180 / Math.PI;
      let s = line(40, oy, 310, oy, 'dimL') + line(ox, 200, ox, 20, 'dimL') + `<circle class="inkf" cx="${ox}" cy="${oy}" r="4"/>` + T(ox - 12, oy + 14, 'O');
      s += `<circle class="inkf" cx="${ax}" cy="${ay}" r="4"/>` + T(ax - 34, ay - 6, 'A(2, 3)');
      if (mode !== 'd') s += pol(ax, ay, a, 80, 'f', '500 N', false, [18, 0]) + T(ax + 70, ay - 6, '(300, −400) N', 'dl');
      else {
        s += pol(ax, ay, 0, 48, 'rd', 'Fx = 300', false, [24, 0]) + pol(ax, ay, -90, 64, 'rd', 'Fy = −400', false, [36, 0]);
        s += line(ox, ay, ax, ay, 'dimL') + T(ox - 18, ay, 'y = 3', 'dl') + line(ax, oy, ax, ay, 'dimL') + T(ax, oy + 14, 'x = 2', 'dl');
        s += couple(ox, oy - 2, 'cw', 'r', '', 14);
      }
      return svg(s, 210);
    },
    parallelogram(mode) {
      const cx = 80, cy = 160, sc = 2.1;
      const a = [80 * sc, 0], b = [60 * sc * Math.cos(Math.PI / 3), 60 * sc * Math.sin(Math.PI / 3)];
      let s = pol(cx, cy, 0, 80 * sc, mode === 'd' ? 'g' : 'f', '80 N') + pol(cx, cy, 60, 60 * sc, mode === 'd' ? 'g' : 'f', '60 N');
      s += T(cx + 34, cy - 14, '60°', 'dl');
      if (mode === 'd') {
        s += line(cx + a[0], cy, cx + a[0] + b[0], cy - b[1], 'dimL') + line(cx + b[0], cy - b[1], cx + a[0] + b[0], cy - b[1], 'dimL');
        s += arr(cx, cy, cx + a[0] + b[0], cy - b[1], 'r', 'R', 'head', [12, 0]) + T(cx + a[0] + 6, cy - 16, '120°', 'dl');
      }
      return svg(s, 210);
    },
    vcomp(mode) {
      return vec({ F: [{ F: 150, a: 126.87, l: 'F' }], keep: true, extra: (m, cx, cy, sc) => m !== 'd' ? '' : '' }, mode);
    },
    truss5(mode) {
      const P = { A: [50, 160], B: [170, 160], C: [290, 160], D: [110, 70], E: [230, 70] };
      const bars = ['AB', 'BC', 'DE', 'AD', 'DB', 'BE', 'EC'];
      let s = '';
      bars.forEach(b => s += line(...P[b[0]], ...P[b[1]], 'ink', 'stroke-width="3.5" stroke-linecap="round"'));
      bars.forEach((b, i) => { const [x1, y1] = P[b[0]], [x2, y2] = P[b[1]]; s += T((x1 + x2) / 2 + (y1 === y2 ? 0 : 8), (y1 + y2) / 2 + (y1 === y2 ? 12 : 0), String(i + 1), 'dl'); });
      Object.entries(P).forEach(([k, [x, y]]) => s += `<circle class="body" cx="${x}" cy="${y}" r="5"/>` + T(x + (k === 'A' ? -14 : k === 'C' ? 14 : 0), y - 14, k));
      if (mode !== 'd') s += pin(50, 165) + roller(290, 165);
      else s += pol(50, 165, 90, 36, 'r', 'Ay', true) + pol(44, 160, 0, 26, 'r', 'Ax', true, [8, -12]) + pol(290, 165, 90, 36, 'r', 'Cy', true) + T(170, 218, 'r = 3 reacciones · b = 7 · n = 5', 'dl');
      return svg(s, 232);
    },
    apex(mode) {
      const x = 170, y = 60, L = 110, a = 30 * Math.PI / 180;
      const lx = x - L * Math.cos(a), rx = x + L * Math.cos(a), yy = y + L * Math.sin(a);
      let s = line(x, y, lx, yy, 'ink', 'stroke-width="4"') + line(x, y, rx, yy, 'ink', 'stroke-width="4"') + `<circle class="body" cx="${x}" cy="${y}" r="5"/>`;
      if (mode !== 'd') s += pol(x, y + 4, -90, 46, 'f', '10 kN', false, [28, -6]) + line(lx, yy, rx, yy, 'dimL') + T(lx + 40, yy - 8, '30°', 'dl') + T(rx - 40, yy - 8, '30°', 'dl');
      else {
        s += pol(x, y, 180 + 30, 70, 'r', 'F', false, [-6, 8]) + pol(x, y, -30, 70, 'r', 'F', false, [6, 8]) + pol(x, y, -90, 48, 'f', '10 kN', false, [0, 0]);
        s += T(x, 180, 'Supuestas en tensión (salen del nodo)', 'dl');
      }
      return svg(s, 200);
    }
  };

  const kN = (x, F, ang = -90, extra = {}) => Object.assign({ x, ang, lab: F }, extra);
  const DEF = [
    () => ({ k: 'vec', c: { F: [{ F: 250, a: 40, l: '250 N' }], comps: true } }),
    () => ({ k: 'vec', c: { F: [{ F: 120, a: 45, l: '120 N' }, { F: 80, a: 150, l: '80 N' }], Rv: { x: 15.6, y: 124.9, l: 'R', o: [14, 0] } } }),
    () => ({ k: 'vec', c: { F: [{ F: 400, a: 20, l: '400 N' }, { F: 250, a: 110, l: '250 N' }, { F: 300, a: 225, l: '300 N' }], Rv: { x: 78.2, y: 159.6, l: 'R', o: [14, 0] } } }),
    () => ({ k: 'sp', c: 'parallelogram' }),
    () => ({ k: 'vec', c: { F: [{ F: 600, a: 20, l: '600 N' }, { F: 1648.5, a: 110, l: 'F_B' }], sc: 0.05, keep: true, Rv: { x: 0, y: 1754.3, l: 'R', show: false, o: [16, 0] } } }),
    () => ({ k: 'vec', c: { F: [{ F: 500, a: -53.13, l: 'F = 500 N' }], comps: true } }),
    () => ({ k: 'knot', c: { W: '500 N', k: [{ a: 140, g: '40°', T: 'T' }, { a: 40, g: '40°', T: 'T' }] } }),
    () => ({ k: 'knot', c: { W: '800 N', k: [{ a: 150, g: '30°', T: 'T_A' }, { a: 60, g: '60°', T: 'T_B' }] } }),
    () => ({ k: 'sp', c: 'spring' }),
    () => ({ k: 'incl', c: { th: 35, m: '40 kg', P: 'hor', mu: 'liso' } }),
    () => ({ k: 'knot', c: { W: '150 kg', k: [{ a: 145, g: '35°', T: 'T_AB' }, { a: 55, g: '55°', T: 'T_AC' }] } }),
    () => ({ k: 'incl', c: { th: 15, m: '1400 kg', P: 'par', Pl: 'T', mu: 'liso' } }),
    () => ({ k: 'knot', c: { W: '2 kN', k: [{ a: 110, g: '70°', T: 'T' }, { a: 70, g: '70°', T: 'T' }] } }),
    () => ({ k: 'sp', c: 'groove' }),
    () => ({ k: 'beam', c: { L: 0.25, x0: 80, x1: 260, sup: [{ x: 0, t: 'point', n: 'O' }], P: [kN(0.25, '80 N')], D: [[0, 0.25, '0.25 m']], Mres: { x: 0, dir: 'cw', lab: 'M' } } }),
    () => ({ k: 'sp', c: 'point' }),
    () => ({ k: 'beam', c: { L: 3.5, x0: 40, x1: 300, sup: [{ x: 2, t: 'pivot', n: '', rn: 'R' }], P: [kN(0, '300 N'), kN(3.5, '400 N')], D: [[0, 2, '2 m'], [2, 3.5, 'd = ?']] } }),
    () => ({ k: 'beam', c: { L: 4, sup: [{ x: 0, t: 'point', n: 'A' }], P: [kN(1, '100 N'), kN(3, '200 N', 90), kN(4, '150 N')], D: [[0, 1, '1 m'], [1, 3, '2 m'], [3, 4, '1 m']], Mres: { x: 0, dir: 'cw', lab: 'M_A' } } }),
    () => ({ k: 'beam', c: { L: 0.3, x0: 70, x1: 260, sup: [{ x: 0, t: 'point', n: 'O' }], P: [kN(0.3, '150 N', -110, { cx: 'F∥', cy: 'F⊥' })], comp: true, D: [[0, 0.3, '0.3 m']], Mres: { x: 0, dir: 'cw', lab: 'M' } } }),
    () => ({ k: 'sp2', c: 'pointG', o: { x: 4, y: -1, Fx: -200, Fy: 350, l: 'F', dir: 'ccw' } }),
    () => ({ k: 'beam', c: { L: 6, sup: [{ x: 0, t: 'point', n: 'A' }], P: [kN(1, '4 kN'), kN(4, '6 kN')], C: [{ x: 6, dir: 'ccw', lab: '10 kN·m' }], D: [[0, 1, '1 m'], [1, 4, '3 m'], [4, 6, '2 m']], Mres: { x: 0, dir: 'cw', lab: 'ΣM_A' } } }),
    () => ({ k: 'beam', c: { L: 1.2, sup: [{ x: 0.2, t: 'pivot', n: '', rn: 'R' }], P: [kN(0, '600 N'), kN(1.2, 'F = ?')], D: [[0, 0.2, '0.2 m'], [0.2, 1.2, '1.0 m']] } }),
    () => ({ k: 'beam', c: { L: 6, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], P: [kN(2, '12 kN')], D: [[0, 2, '2 m'], [2, 6, '4 m']] } }),
    () => ({ k: 'beam', c: { L: 6, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 4, t: 'roller', n: 'B' }], P: [kN(6, '10 kN')], D: [[0, 4, '4 m'], [4, 6, '2 m']] } }),
    () => ({ k: 'beam', c: { L: 2, x0: 70, sup: [{ x: 0, t: 'fixed', n: 'A' }], P: [kN(2, '8 kN')], D: [[0, 2, '2 m']] } }),
    () => ({ k: 'beam', c: { L: 7, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 5, t: 'roller', n: 'B' }], P: [kN(2, '8 kN')], W: [{ x1: 5, x2: 7, w1: 3, w2: 3, lab: '3 kN/m' }], D: [[0, 2, '2 m'], [2, 5, '3 m'], [5, 7, '2 m']] } }),
    () => ({ k: 'beam', c: { L: 6, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 0, w2: 4, lab: '0 → 4 kN/m' }], C: [{ x: 3, dir: 'cw', lab: '6 kN·m' }], D: [[0, 3, '3 m'], [3, 6, '3 m']] } }),
    () => ({ k: 'beam', c: { L: 4, x0: 60, x1: 250, y: 160, h: 230, wallTop: 130, sup: [{ x: 0, t: 'wallpin', n: 'A' }], cable: { x: 4, ang: 30 }, P: [kN(2, '300 N'), kN(4, '1.2 kN')], D: [[0, 2, '2 m'], [2, 4, '2 m']] } }),
    () => ({ k: 'beam', c: { L: 3, x0: 70, y: 110, sup: [{ x: 0, t: 'fixed', n: 'A' }], W: [{ x1: 0, x2: 3, w1: 2, w2: 2, lab: '2 kN/m' }], P: [kN(3, '5 kN', -30, { off: [10, 0] })], comp: true, D: [[0, 3, '3 m']] } }),
    () => ({ k: 'sp2', c: 'ladderG', o: { L: 6, a: 65, pd: 4, W: '250 N', pl: '700 N' } }),
    () => ({ k: 'beam', c: { L: 4, sup: [{ x: 0.5, t: 'pivot', n: 'A', rn: 'A' }, { x: 3, t: 'pivot', n: 'B', rn: 'B' }], P: [kN(2, '200 N'), kN(3.8, '800 N')], D: [[0, 0.5, '0.5'], [0.5, 2, '1.5 m'], [2, 3, '1 m'], [3, 3.8, '0.8']] } }),
    () => ({ k: 'beam', c: { L: 5, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 5, t: 'rollerInc', a: -30, ra: 120, n: 'B' }], P: [kN(2, '10 kN')], D: [[0, 2, '2 m'], [2, 5, '3 m']] } }),
    () => ({ k: 'beam', c: { L: 2, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 1.5, t: 'spring', n: '', rn: 'F_r' }], P: [kN(2, '300 N')], D: [[0, 1.5, '1.5 m'], [1.5, 2, '0.5 m']] } }),
    () => ({ k: 'beam', c: { L: 6, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 4, w2: 4, lab: '4 kN/m' }], D: [[0, 6, '6 m']] } }),
    () => ({ k: 'beam', c: { L: 9, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 9, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 9, w1: 0, w2: 6, lab: '0 → 6 kN/m' }], D: [[0, 9, '9 m']] } }),
    () => ({ k: 'beam', c: { L: 8, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 8, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 4, w1: 2, w2: 2, lab: '2 kN/m' }], D: [[0, 4, '4 m'], [4, 8, '4 m']] } }),
    () => ({ k: 'beam', c: { L: 6, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 2, w2: 5, lab: '2 → 5 kN/m' }], Wd: [{ x1: 0, x2: 6, w1: 2, w2: 2, o: [-28, -2] }, { x1: 0, x2: 6, w1: 0, w2: 3, o: [26, -2] }], D: [[0, 6, '6 m']] } }),
    () => ({ k: 'beam', c: { L: 10, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 10, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 2, w2: 2, lab: '2 kN/m' }], P: [kN(8, '8 kN')], D: [[0, 6, '6 m'], [6, 8, '2 m'], [8, 10, '2 m']] } }),
    () => ({ k: 'floor', c: { m: '100 kg', mu: 'μs = 0.4', push: true, Pl: 'P = ?' } }),
    () => ({ k: 'incl', c: { th: 31, m: 'm', mu: 'μs = 0.6', f: 'up' } }),
    () => ({ k: 'incl', c: { th: 30, m: '10 kg', mu: 'μs = 0.2', P: 'par', f: 'up' } }),
    () => ({ k: 'floor', c: { m: '60 kg', mu: 'μs = 0.45', push: true, a: -20, Pl: 'P = ?' } }),
    () => ({ k: 'incl', c: { th: 20, m: '40 kg', P: 'hor', mu: 'μs = 0.3', f: 'down' } }),
    () => ({ k: 'sp', c: 'stack' }),
    () => ({ k: 'sp', c: 'tip' }),
    () => ({ k: 'tri', c: { span: 6, h: 4, P: '12 kN' } }),
    () => ({ k: 'sp', c: 'truss5' }),
    () => ({ k: 'sp2', c: 'pratt', o: { loads: ['B', 'C', 'D'], Pl: '10 kN', cut: true, cutline: true } }),
    () => ({ k: 'sp2', c: 'pratt', o: { loads: ['C'], Pl: '20 kN' } }),
    () => ({ k: 'beam', c: { L: 4, x0: 60, x1: 270, y: 70, h: 215, wallTop: 30, wallBot: 120, sup: [{ x: 0, t: 'wallpin', n: 'A' }], strut: { x: 2.5, ang: 38.66 }, P: [kN(4, '6 kN')], D: [[0, 2.5, '2.5 m'], [2.5, 4, '1.5 m']] } })
  ];;
  const fn = { beam, vec, knot, incl, floor: floorB, tri };
  window.FL = { svg, T, line, arr, pol, hatchG, hatchC, wallL, wallR, pin, roller, couple, dim, box, beam, vec, knot, incl, floorB, tri, special };
  return (i, mode) => {
    const d = DEF[i](); if (!d) return '';
    if (d.k === 'sp') return special[d.c](mode);
    if (d.k === 'sp2') return special[d.c](d.o, mode);
    // en DCL de plano inclinado: añade fricción por defecto si hay μ
    return fn[d.k](d.c, mode);
  };
})();
