/* ===== Figuras de las lecciones (usa la librería FL de figs.js) ===== */
const LF = (() => {
  const { svg, T, line, arr, pol, hatchG, hatchC, wallL, wallR, pin, roller, couple, dim, box, beam, vec, knot, incl, floorB, tri, special } = FL;
  const D = Math.PI / 180;
  const R = v => Math.round(v * 10) / 10;
  const axes = (cx, cy, w = 120, h = 90) => line(cx - w, cy, cx + w, cy, 'dimL') + line(cx, cy + h, cx, cy - h, 'dimL') + T(cx + w - 6, cy + 12, 'x', 'dl') + T(cx + 10, cy - h + 6, 'y', 'dl');
  function arc(cx, cy, r, a0, a1, c = 'ink') {
    const p = a => [cx + r * Math.cos(a * D), cy - r * Math.sin(a * D)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `<path class="${c}" d="M${R(x0)} ${R(y0)} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${R(x1)} ${R(y1)}" fill="none" stroke-width="1.4"/>`;
  }
  const lab = (x, y, s, c = '') => T(x, y, s, c);
  const TL = (x, y, s, c = '') => T(x, y, s, c).replace('<text ', '<text style="text-anchor:start" ');
  const TR = (x, y, s, c = '') => T(x, y, s, c).replace('<text ', '<text style="text-anchor:end" ');

  function comp(fromY) {
    const cx = 70, cy = 180, F = 100, k = 1.9, a = fromY ? 60 : 30;
    const tx = cx + F * k * Math.cos(a * D), ty = cy - F * k * Math.sin(a * D);
    let s = line(cx - 30, cy, 320, cy, 'dimL') + line(cx, cy + 20, cx, 14, 'dimL') + T(318, cy + 12, 'x', 'dl') + T(cx + 10, 18, 'y', 'dl');
    s += arr(cx, cy, tx, cy, fromY ? 'rd' : 'r') + arr(tx, cy, tx, ty, fromY ? 'r' : 'rd');
    s += arr(cx, cy, tx, ty, 'f');
    s += T((cx + tx) / 2 - 34, (cy + ty) / 2 - 16, 'F = 100 N', 'fl');
    if (!fromY) {
      s += arc(cx, cy, 40, 0, 30) + T(cx + 52, cy - 12, '30°', '');
      s += T((cx + tx) / 2, cy + 16, 'Fx = F·cos30° = 86.6 N  (pegado)', 'rl');
      s += TL(tx + 8, (cy + ty) / 2 - 8, 'Fy = F·sen30°', 'rdl') + TL(tx + 8, (cy + ty) / 2 + 8, '= 50 N', 'rdl');
    } else {
      s += arc(cx, cy, 44, 90, 60) + T(cx + 18, cy - 58, '30°', '');
      s += T((cx + tx) / 2, cy + 16, 'Fx = F·sen30° = 50 N', 'rdl');
      s += TL(tx + 8, (cy + ty) / 2, 'Fy = F·cos30°', 'rl') + TL(tx + 8, (cy + ty) / 2 + 16, '= 86.6 N', 'rl') + TL(tx + 8, (cy + ty) / 2 + 32, '(pegado al eje y)', 'rl');
    }
    return svg(s, 205);
  }

  const F = {
    /* ---- Módulo 1 ---- */
    fuerza() {
      let s = line(40, 170, 300, 18, 'dimL') + T(270, 52, 'línea de acción', 'dl');
      s += arr(110, 129, 220, 65, 'f') + T(150, 80, 'F = 50 N', 'fl');
      s += line(110, 129, 210, 129, 'dimL') + arc(110, 129, 40, 0, 30.2) + T(165, 118, '30°', '');
      s += T(80, 150, 'Punto de aplicación', 'dl') + `<circle class="inkf" cx="110" cy="129" r="4"/>`;
      s += T(170, 190, '50 N · 30° · hacia arriba-derecha', 'dl');
      return svg(s, 210);
    },
    peso() {
      let s = hatchG(60, 280, 170) + box(120, 90, 100, 80, '') + T(170, 104, '10 kg') + `<circle class="inkf" cx="170" cy="130" r="3"/>` + T(184, 120, 'G', 'dl');
      s += pol(170, 130, -90, 70, 'f', 'W = 98.1 N', false, [44, -6]);
      s += T(170, 30, 'W = m·g = 10 · 9.81 = 98.1 N', '');
      return svg(s, 215);
    },
    particula() {
      let s = T(85, 22, 'Partícula', '') + `<circle class="inkf" cx="85" cy="110" r="5"/>`;
      s += pol(85, 110, 20, 60, 'f') + pol(85, 110, 150, 60, 'f') + pol(85, 110, -90, 60, 'f');
      s += T(85, 196, 'Concurrentes: no gira', 'dl');
      s += line(170, 20, 170, 200, 'dimL');
      s += T(255, 22, 'Cuerpo rígido', '') + `<rect class="body" x="195" y="104" width="120" height="12" rx="2"/>`;
      s += pol(205, 104, -90, 50, 'f', 'F', true) + pol(305, 116, 90, 50, 'f', 'F', true) + couple(255, 110, 'cw', 'r', 'gira', 26);
      s += T(255, 196, 'Distinta línea: gira', 'dl');
      return svg(s, 210);
    },
    tercera() {
      let s = T(85, 22, 'Sobre el libro', '') + box(45, 90, 80, 30, 'libro') + pol(85, 120, 90, 50, 'r', 'N (mesa → libro)', true, [0, 6]) + pol(85, 105, -90, 0.1, 'f') + pol(85, 90, -90, 0.1, 'f') + pol(70, 105, -90, 40, 'f', 'W', false, [-12, 0]);
      s += line(170, 20, 170, 200, 'dimL');
      s += T(255, 22, 'Sobre la mesa', '') + line(190, 120, 320, 120, 'ink', 'stroke-width="5"') + pol(255, 120, -90, 50, 'f', 'N (libro → mesa)', true, [0, -4]);
      s += T(170, 200, 'Misma magnitud, sentido opuesto', 'dl');
      return svg(s, 210);
    },
    /* ---- Módulo 2 ---- */
    comp_x() { return comp(false); },
    comp_y() { return comp(true); },
    cuadrantes() {
      let s = line(170, 6, 170, 254, 'dimL') + line(6, 130, 334, 130, 'dimL');
      const cells = [[250, 70, 30, 'I', '+', '+'], [90, 70, 150, 'II', '−', '+'], [90, 200, 210, 'III', '−', '−'], [250, 200, 330, 'IV', '+', '−']];
      cells.forEach(([cx, cy, a, q, sx, sy]) => {
        s += line(cx - 50, cy, cx + 50, cy, 'g') + line(cx, cy - 38, cx, cy + 38, 'g');
        const ex = cx + 48 * Math.cos(a * D), ey = cy - 48 * Math.sin(a * D);
        s += line(cx, cy, ex, cy, 'rd') + line(ex, cy, ex, ey, 'rd') + arr(cx, cy, ex, ey, 'f');
        s += T(cx, cy + (sy === '+' ? -50 : 50), 'Cuadrante ' + q, 'dl');
        s += T(cx, cy + (sy === '+' ? 30 : -30), 'Fx ' + sx + '   Fy ' + sy, 'rdl');
      });
      return svg(s, 260);
    },
    pendiente() {
      const cx = 40, cy = 175;
      let s = line(cx - 10, cy, 320, cy, 'dimL');
      s += line(cx + 200, cy, cx + 200, cy - 150, 'rd') + line(cx, cy, cx + 200, cy, 'rd');
      s += arr(cx, cy, cx + 200, cy - 150, 'f') + T(cx + 70, cy - 80, 'F = 50 N', 'fl');
      s += `<polygon points="80,60 140,60 140,15" fill="none" class="ink" stroke-width="1.4"/>` + T(110, 72, '4', '') + T(150, 38, '3', '') + T(100, 30, '5', '');
      s += T(cx + 100, cy + 16, 'Fx = 50·(4/5) = 40 N', 'rdl') + TL(cx + 208, cy - 75, 'Fy = 50·(3/5)', 'rdl') + TL(cx + 208, cy - 59, '= 30 N', 'rdl');
      return svg(s, 205);
    },
    resultante() { return vec({ F: [{ F: 200, a: 30, l: 'F₁' }, { F: 150, a: 120, l: 'F₂' }, { F: 100, a: 270, l: 'F₃' }], Rv: { x: 98.2, y: 129.9, l: 'R = 162.8 N', o: [-52, -6] } }, 'd'); },
    paralelogramo() {
      const cx = 36, cy = 175, k = 1.8;
      const a = [80 * k, 0], b = [60 * k * Math.cos(60 * D), 60 * k * Math.sin(60 * D)];
      let s = pol(cx, cy, 0, 80 * k, 'f', 'B = 80 N', false, [0, 14]) + pol(cx, cy, 60, 60 * k, 'f', 'A = 60 N', false, [-10, 0]);
      s += line(cx + a[0], cy, cx + a[0] + b[0], cy - b[1], 'dimL') + line(cx + b[0], cy - b[1], cx + a[0] + b[0], cy - b[1], 'dimL');
      s += arr(cx, cy, cx + a[0] + b[0], cy - b[1], 'r', 'R = 121.7 N', 'head', [10, -4]);
      s += arc(cx, cy, 30, 0, 60) + T(cx + 40, cy - 24, '60°', '') + arc(cx + a[0], cy, 24, 60, 180) + T(cx + a[0] - 6, cy - 32, '120°', 'dl');
      s += arc(cx, cy, 58, 0, 25.3, 'r') + T(cx + 76, cy - 14, 'β', 'rl');
      return svg(s, 205);
    },
    /* ---- Módulo 3 ---- */
    nudo() { return knot({ W: '400 N', k: [{ a: 150, g: '30°', T: 'T_A' }, { a: 45, g: '45°', T: 'T_B' }] }, 'd'); },
    cable() {
      let s = hatchC(110, 190, 26) + line(170, 26, 170, 120, 'ink', 'stroke-width="1.6"') + `<circle class="body" cx="170" cy="126" r="6"/>` + line(170, 132, 170, 150, 'ink') + box(140, 150, 60, 30, 'W');
      s += line(200, 20, 200, 200, 'dimL');
      s += `<circle class="body" cx="270" cy="126" r="6"/>` + pol(270, 120, 90, 60, 'r', 'T (jala)') + pol(270, 132, -90, 50, 'f', 'W');
      s += T(270, 22, 'DCL del anillo', 'dl') + T(100, 200, 'El cable siempre jala', 'dl');
      return svg(s, 210);
    },
    polea() {
      let s = hatchC(120, 220, 20) + line(170, 20, 170, 56, 'ink') + `<circle class="body" cx="170" cy="76" r="20"/><circle class="inkf" cx="170" cy="76" r="3"/>`;
      s += line(150, 76, 150, 150, 'ink', 'stroke-width="1.6"') + line(190, 76, 190, 130, 'ink', 'stroke-width="1.6"') + box(126, 150, 48, 30, '300 N');
      s += pol(190, 130, -90, 40, 'f', 'P = 300 N', false, [0, 6]);
      s += pol(150, 100, 90, 0.1, 'r') + T(132, 110, 'T', 'rl') + T(208, 110, 'T', 'rl');
      s += T(270, 80, 'Polea ideal:', 'dl') + T(270, 96, 'la misma T', 'dl') + T(270, 112, 'a ambos lados', 'dl');
      return svg(s, 215);
    },
    resorte() {
      const spr = (x, y0, y1) => { let p = `M${x} ${y0} L${x} ${y0 + 8}`; const n = 8, step = (y1 - y0 - 16) / n; for (let i = 0; i < n; i++) p += ` L${x + (i % 2 ? -9 : 9)} ${y0 + 8 + step * (i + 0.5)}`; p += ` L${x} ${y1 - 8} L${x} ${y1}`; return `<path class="ink" d="${p}" fill="none" stroke-width="1.6"/>`; };
      let s = hatchC(40, 300, 20);
      s += spr(90, 20, 100) + box(70, 100, 40, 24, '') + T(90, 150, 'Sin carga', 'dl');
      s += spr(230, 20, 140) + box(200, 140, 60, 30, '100 N') + line(270, 100, 270, 140, 'dimL') + T(292, 120, 's = 0.2 m', 'dl');
      s += pol(230, 140, 90, 0.1, 'r') + T(230, 196, 'F = k·s = 500 · 0.2 = 100 N', '');
      return svg(s, 210);
    },
    lamy() {
      const cx = 170, cy = 105;
      let s = `<circle class="inkf" cx="${cx}" cy="${cy}" r="4"/>`;
      s += pol(cx, cy, 90, 70, 'r', 'F₁') + pol(cx, cy, 210, 70, 'r', 'F₂') + pol(cx, cy, -30, 70, 'r', 'F₃');
      s += T(cx + 40, cy - 30, 'γ', '') + T(cx - 40, cy - 30, 'β', '') + T(cx, cy + 40, 'α', '');
      s += T(cx, 200, 'F₁/sen α = F₂/sen β = F₃/sen γ', '');
      return svg(s, 210);
    },
    /* ---- Módulo 4 ---- */
    dcl_fig() { return beam({ L: 6, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], P: [{ x: 2, ang: -90, lab: '12 kN' }], W: [{ x1: 3, x2: 6, w1: 2, w2: 2, lab: '2 kN/m' }], D: [[0, 2, '2 m'], [2, 3, '1 m'], [3, 6, '3 m']] }, 'f'); },
    dcl_dcl() { return beam({ L: 6, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], P: [{ x: 2, ang: -90, lab: '12 kN' }], W: [{ x1: 3, x2: 6, w1: 2, w2: 2, lab: '2 kN/m' }], D: [[0, 2, '2 m'], [2, 3, '1 m'], [3, 6, '3 m']] }, 'd'); },
    dcl_error() {
      // Izquierda: DCL mal hecho (incluye la fuerza que el bloque hace sobre el piso)
      let s = T(85, 18, '✗ Mal', 'fl');
      s += box(45, 40, 80, 70, '') + T(85, 56, 'bloque') + hatchG(25, 145, 110);
      s += arr(85, 112, 85, 162, 'f') + T(85, 176, 'bloque → piso', 'fl');
      s += line(66, 122, 104, 156, 'f', 'stroke-width="3"') + line(104, 122, 66, 156, 'f', 'stroke-width="3"');
      s += line(170, 10, 170, 235, 'dimL');
      // Derecha: DCL correcto (bloque aislado, solo fuerzas sobre él)
      s += T(255, 18, '✓ Bien', 'rl');
      s += box(215, 40, 80, 70, '') + T(255, 56, 'bloque');
      s += arr(240, 80, 240, 150, 'f') + T(240, 164, 'W', 'fl');
      s += arr(272, 160, 272, 112, 'r') + T(272, 174, 'N', 'rl');
      s += T(85, 204, 'Actúa sobre el piso:', 'dl') + T(85, 220, 'no va en el DCL', 'dl');
      s += T(255, 204, 'Solo fuerzas que', 'dl') + T(255, 220, 'actúan sobre el bloque', 'dl');
      return svg(s, 235);
    },
    negativo() {
      let s = T(85, 16, 'Supones Ay ↑', 'dl') + `<rect class="body" x="30" y="100" width="120" height="10"/>` + pol(70, 110, 90, 50, 'r', 'Ay = −5 kN', true, [0, 4]);
      s += line(170, 20, 170, 200, 'dimL');
      s += T(255, 16, 'En realidad', 'dl') + `<rect class="body" x="190" y="100" width="130" height="10"/>` + pol(230, 100, -90, 46, 'r', '5 kN ↓', true, [30, 20]);
      s += T(170, 200, 'El signo menos = sentido contrario', 'dl');
      return svg(s, 210);
    },
    /* ---- Módulo 5 ---- */
    brazo() {
      const ox = 60, oy = 160;
      let s = `<circle class="inkf" cx="${ox}" cy="${oy}" r="4"/>` + T(ox - 12, oy + 14, 'O');
      const px = 230, py = 120, a = 120;
      s += line(px - 150 * Math.cos(a * D), py + 150 * Math.sin(a * D), px + 60 * Math.cos(a * D), py - 60 * Math.sin(a * D), 'dimL') + pol(px, py, a, 70, 'f', 'F', false, [10, 0]) + `<circle class="inkf" cx="${px}" cy="${py}" r="3"/>`;
      const ux = Math.cos(a * D), uy = -Math.sin(a * D), t = (ox - px) * ux + (oy - py) * uy, fx = px + t * ux, fy = py + t * uy;
      s += line(ox, oy, fx, fy, 'r', 'stroke-dasharray="4 3"') + T((ox + fx) / 2 - 8, (oy + fy) / 2 - 10, 'd', 'rl') + T(200, 196, 'd ⊥ a la línea de acción', 'dl');
      return svg(s, 210);
    },
    varignon() { return special.pointG({ x: 3, y: 2, Fx: 250, Fy: 433, l: '500 N', dir: 'ccw' }, 'd'); },
    pasa() {
      let s = `<circle class="inkf" cx="80" cy="150" r="4"/>` + T(68, 164, 'O') + line(40, 176, 300, 20, 'dimL') + pol(200, 78, 31, 70, 'f', 'F', false, [0, -6]) + `<circle class="inkf" cx="200" cy="78" r="3"/>`;
      s += T(170, 196, 'Pasa por O: d = 0, M = 0', '');
      return svg(s, 210);
    },
    par() {
      let s = `<rect class="body" x="60" y="100" width="220" height="12" rx="2"/>` + pol(70, 100, 90, 50, 'f', '50 N') + pol(270, 112, -90, 50, 'f', '50 N') + couple(170, 106, 'cw', 'r', 'M = 50·0.4 = 20 N·m', 26);
      s += dim(70, 270, 160, 'd = 0.4 m');
      return svg(s, 200);
    },

    puerta() {
      const ox = 50, oy = 120;
      let s = wallL(ox - 8, 70, 170) + `<rect class="body" x="${ox}" y="${oy - 5}" width="250" height="10" rx="2"/>` + `<circle class="body" cx="${ox}" cy="${oy}" r="7"/><circle class="inkf" cx="${ox}" cy="${oy}" r="2.5"/>` + T(ox + 40, oy - 16, 'O (bisagra)', 'dl');
      s += `<path class="g" d="M${ox + 250} ${oy} A250 250 0 0 0 ${R(ox + 250 * Math.cos(25 * D))} ${R(oy - 250 * Math.sin(25 * D))}"/>`;
      s += arr(290, 175, 290, 127, 'f') + T(290, 186, 'Lejos:', 'fl') + T(290, 200, 'gira fácil', 'fl');
      s += arr(95, 175, 95, 127, 'f') + T(95, 186, 'Cerca:', 'fl') + T(95, 200, 'cuesta más', 'fl');
      s += arr(220, 100, 180, 100, 'f') + T(200, 86, 'Hacia O: no gira', 'fl');
      s += T(170, 24, 'Vista desde arriba', 'dl');
      return svg(s, 210);
    },
    alfiler() {
      const ox = 110, oy = 110;
      let s = `<rect class="body" x="40" y="${oy - 6}" width="260" height="12" rx="2"/>`;
      s += line(ox, oy - 40, ox, oy + 8, 'ink', 'stroke-width="2"') + `<circle class="inkf" cx="${ox}" cy="${oy - 42}" r="6"/>` + T(ox - 46, oy - 42, 'alfiler', 'dl') + T(ox, oy + 26, 'O', '');
      s += arr(270, 170, 270, 118, 'f') + T(270, 182, 'F', 'fl');
      s += `<g transform="rotate(-10 ${ox} ${oy})" opacity=".35"><rect class="body" x="40" y="${oy - 6}" width="260" height="12" rx="2"/></g>`;
      s += couple(ox, oy, 'ccw', 'r', '', 34) + T(200, 192, 'Solo puede girar alrededor de O', 'rl');
      return svg(s, 200);
    },
    sentido4() {
      const cell = (cx, cy, side, up) => {
        let s = `<rect class="body" x="${cx - 60}" y="${cy - 4}" width="120" height="8" rx="2"/><circle class="inkf" cx="${cx}" cy="${cy}" r="4"/>` + T(cx, cy + 16, 'O', 'dl');
        const fx = cx + side * 50;
        s += up ? arr(fx, cy + 40, fx, cy + 6, 'f') : arr(fx, cy - 40, fx, cy - 6, 'f');
        const ccw = (side > 0) === up;
        s += couple(cx, cy, ccw ? 'ccw' : 'cw', 'r', '', 20);
        s += T(cx + (side > 0 ? -38 : 38), cy - 32, ccw ? '↺ +' : '↻ −', ccw ? 'rl' : 'fl');
        return s;
      };
      let s = line(170, 6, 170, 234, 'dimL') + line(6, 120, 334, 120, 'dimL');
      s += cell(85, 62, 1, true) + cell(255, 62, 1, false) + cell(85, 180, -1, true) + cell(255, 180, -1, false);
      s += T(85, 104, 'derecha, arriba', 'dl') + T(255, 104, 'derecha, abajo', 'dl') + T(85, 226, 'izquierda, arriba', 'dl') + T(255, 226, 'izquierda, abajo', 'dl');
      return svg(s, 240);
    },
    convencion() {
      const cx = 110, cy = 110;
      let s = line(cx - 80, cy, cx + 90, cy, 'dimL') + line(cx, cy + 80, cx, cy - 80, 'dimL') + T(cx + 86, cy + 12, 'x', 'dl') + T(cx + 10, cy - 76, 'y', 'dl');
      s += arr(cx, cy, cx + 60 * Math.cos(50 * D), cy - 60 * Math.sin(50 * D), 'g');
      s += arc(cx, cy, 30, 0, 50) + T(cx + 44, cy - 16, 'θ', '');
      s += couple(cx, cy, 'ccw', 'r', '', 52);
      s += T(255, 70, '↺ antihorario', 'rl') + T(255, 88, 'positivo (+)', 'rl');
      s += T(255, 140, '↻ horario', 'fl') + T(255, 158, 'negativo (−)', 'fl');
      s += T(170, 206, 'Los ángulos también crecen en sentido antihorario', 'dl');
      return svg(s, 215);
    },
    balance() {
      const ox = 170, oy = 110;
      let s = `<rect class="body" x="30" y="${oy - 5}" width="280" height="10" rx="2"/><polygon class="body" points="${ox},${oy + 5} ${ox - 14},${oy + 30} ${ox + 14},${oy + 30}"/>` + hatchG(ox - 30, ox + 30, oy + 30) + T(ox + 22, oy + 22, 'O', '');
      s += arr(50, 40, 50, oy - 7, 'f') + T(50, 30, '300 N', 'fl') + arr(275, 40, 275, oy - 7, 'f') + T(275, 30, '400 N', 'fl');
      s += couple(95, oy - 32, 'ccw', 'r', '', 14) + T(95, oy - 58, '+600', 'rl');
      s += couple(235, oy - 32, 'cw', 'f', '', 14) + T(235, oy - 58, '−600', 'fl');
      s += dim(50, ox, oy + 50, '2 m') + dim(ox, 275, oy + 50, '1.5 m');
      s += T(170, 196, 'ΣM = +600 − 600 = 0 → no gira', '');
      return svg(s, 210);
    },
    suma() {
      const x0 = 50, k = 60, oy = 110;
      let s = `<rect class="body" x="${x0}" y="${oy - 5}" width="${4 * k}" height="10" rx="2"/><circle class="inkf" cx="${x0}" cy="${oy}" r="5"/>` + T(x0 - 14, oy + 4, 'A', '');
      s += arr(x0 + k, 50, x0 + k, oy - 7, 'f') + T(x0 + k, 40, '100 N', 'fl') + T(x0 + k, oy + 34, '−100', 'fl');
      s += arr(x0 + 3 * k, 170, x0 + 3 * k, oy + 7, 'f') + T(x0 + 3 * k, 182, '200 N', 'fl') + T(x0 + 3 * k - 30, oy - 30, '+600', 'rl');
      s += arr(x0 + 4 * k, 50, x0 + 4 * k, oy - 7, 'f') + T(x0 + 4 * k, 40, '150 N', 'fl') + T(x0 + 4 * k, oy + 34, '−600', 'fl');
      s += couple(x0 + k, oy, 'cw', 'f', '', 12) + couple(x0 + 3 * k, oy, 'ccw', 'r', '', 12) + couple(x0 + 4 * k, oy, 'cw', 'f', '', 12);
      s += T(170, 206, 'ΣM_A = −100 + 600 − 600 = −100 N·m ↻', '');
      return svg(s, 215);
    },
    /* ---- Módulo 6 ---- */
    estrategia() {
      let s = beam({ L: 8, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 8, t: 'roller', n: 'B' }], P: [{ x: 2, ang: -90, lab: '10 kN' }], W: [{ x1: 4, x2: 8, w1: 3, w2: 3 }], D: [[0, 2, '2 m'], [2, 4, '2 m'], [4, 8, '4 m']] }, 'd');
      return s.replace('</svg>', `<circle cx="66" cy="95" r="22" fill="none" class="r" stroke-dasharray="4 3"/><text class="lab rl" x="170" y="200">ΣM en A elimina Ax y Ay</text></svg>`);
    },
    determinacion() {
      const row = (y, a, b, t) => `<rect class="body" x="40" y="${y}" width="160" height="10" rx="2"/>` + (a === 'pin' ? pin(50, y + 10) : roller(50, y + 10)) + (b === 'pin' ? pin(190, y + 10) : roller(190, y + 10)) + TL(215, y + 8, t, 'dl');
      let s = row(20, 'pin', 'roller', '3: isostática ✓');
      s += row(90, 'pin', 'pin', '4: hiperestática');
      s += row(160, 'roller', 'roller', '2: inestable');
      return svg(s, 215);
    },
    dosfuerzas() {
      let s = line(80, 160, 250, 50, 'ink', 'stroke-width="7" stroke-linecap="round"') + `<circle class="body" cx="80" cy="160" r="6"/><circle class="body" cx="250" cy="50" r="6"/>`;
      const a = Math.atan2(110, 170) / D;
      s += pol(250, 50, a, 50, 'r', 'F') + pol(80, 160, 180 + a, 50, 'r', 'F');
      s += T(170, 200, 'Dos fuerzas: van por la línea AB', 'dl');
      return svg(s, 210);
    },
    /* ---- Módulo 7 ---- */
    trap_f() { return beam({ L: 6, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 2, w2: 5, lab: '2 → 5 kN/m' }], D: [[0, 6, '6 m']] }, 'f'); },
    trap_d() { return beam({ L: 6, y: 110, sup: [{ x: 0, t: 'pin', n: 'A' }, { x: 6, t: 'roller', n: 'B' }], W: [{ x1: 0, x2: 6, w1: 2, w2: 5 }], Wd: [{ x1: 0, x2: 6, w1: 2, w2: 2, o: [-28, -2] }, { x1: 0, x2: 6, w1: 0, w2: 3, o: [26, -2] }], D: [[0, 6, '6 m']] }, 'd'); },
    /* ---- Módulo 8 ---- */
    grafica() {
      const x0 = 50, y0 = 180;
      let s = arr(x0, y0, 320, y0, 'ink') + arr(x0, y0, x0, 20, 'ink') + T(316, y0 + 14, 'P aplicada', 'dl') + T(x0 + 4, 14, 'f', 'dl');
      s += line(x0, y0, 190, 60, 'r', 'stroke-width="2.6"') + line(190, 60, 190, 95, 'r', 'stroke-dasharray="4 3"') + line(190, 95, 310, 95, 'r', 'stroke-width="2.6"');
      s += line(x0, 60, 190, 60, 'dimL') + T(x0 - 26, 60, 'μs·N', 'dl') + line(x0, 95, 190, 95, 'dimL') + T(x0 - 26, 95, 'μk·N', 'dl');
      s += T(110, 150, 'Sin moverse: f = P', 'rl') + T(190, 46, 'A punto de deslizar', 'dl') + T(255, 112, 'Deslizando', 'dl');
      return svg(s, 205);
    },
    semueve() { return floorB({ m: '50 kg', push: true, Pl: '150 N' }, 'd').replace('</svg>', `<text class="lab dl" x="170" y="22">f necesaria 150 N &lt; f máx 171.7 N</text></svg>`); },
    critico() { return incl({ th: 25, m: '', f: 'up' }, 'd').replace('</svg>', `<text class="lab dl" x="270" y="200">tan θ = μs</text></svg>`); },
    /* ---- Módulo 9 ---- */
    tc() {
      let s = T(85, 22, 'Tensión (T)', '') + line(50, 100, 120, 100, 'ink', 'stroke-width="7"') + pol(50, 100, 180, 30, 'r') + pol(120, 100, 0, 30, 'r') + T(85, 140, 'jala los nodos', 'dl');
      s += line(170, 20, 170, 200, 'dimL');
      s += T(255, 22, 'Compresión (C)', '') + line(220, 100, 290, 100, 'ink', 'stroke-width="7"') + pol(220, 100, 0, 30, 'f', '', true) + pol(290, 100, 180, 30, 'f', '', true) + T(255, 140, 'empuja los nodos', 'dl');
      s += T(170, 196, 'Supón T; si sale negativo, es C', 'dl');
      return svg(s, 210);
    },
    nodos() { return tri({ span: 4, h: 2, P: '10 kN' }, 'd'); },
    secciones() { return special.pratt({ loads: ['B', 'C', 'D'], Pl: '10 kN', cut: true }, 'd'); },
    cero() {
      let s = T(85, 22, '2 barras, sin carga', 'dl') + line(50, 150, 140, 150, 'ink', 'stroke-width="5"') + line(50, 150, 50, 60, 'ink', 'stroke-width="5"') + `<circle class="body" cx="50" cy="150" r="6"/>` + T(100, 168, '0', 'rl') + T(36, 100, '0', 'rl');
      s += line(170, 20, 170, 200, 'dimL');
      s += T(255, 22, '3 barras, 2 colineales', 'dl') + line(190, 150, 320, 150, 'ink', 'stroke-width="5"') + line(255, 150, 255, 60, 'ink', 'stroke-width="5"') + `<circle class="body" cx="255" cy="150" r="6"/>` + T(268, 100, '0', 'rl');
      s += T(170, 200, 'Las barras marcadas con 0 no llevan fuerza', 'dl');
      return svg(s, 210);
    },
    determinada() { return special.truss5('d'); }
  };
  return name => (F[name] ? F[name]() : '');
})();

/* ===== Preguntas para desbloquear cada módulo ===== */
const QUIZ = {
  m1: [
    { q: 'Una caja tiene una masa de 25 kg. ¿Cuál es su peso?', o: ['25 N', '245.3 N', '2.55 N', '25 kN'], c: 1, e: 'W = m·g = 25 · 9.81 = 245.3 N. Los kilogramos son masa, no fuerza.' },
    { q: '¿Qué diferencia a un cuerpo rígido de una partícula?', o: ['Pesa más', 'Las fuerzas pueden hacerlo girar', 'No tiene peso', 'Solo recibe fuerzas verticales'], c: 1, e: 'En un cuerpo rígido las fuerzas no pasan todas por un punto, así que pueden hacerlo girar. Por eso aparece ΣM = 0.' },
    { q: '¿Cuántos newtons son 3.5 kN?', o: ['35 N', '350 N', '3500 N', '0.0035 N'], c: 2, e: '1 kN = 1000 N, así que 3.5 kN = 3500 N.' }
  ],
  m2: [
    { q: 'Una fuerza de 200 N forma 25° con el eje y (hacia arriba y a la derecha). ¿Cuánto vale Fx?', o: ['181.3 N', '84.5 N', '200 N', '93.3 N'], c: 1, e: 'El ángulo está pegado al eje y, así que Fy = 200·cos25° = 181.3 N y Fx = 200·sen25° = 84.5 N.' },
    { q: 'Una fuerza apunta hacia abajo y a la izquierda. ¿Qué signos tienen sus componentes?', o: ['Fx +, Fy +', 'Fx −, Fy +', 'Fx −, Fy −', 'Fx +, Fy −'], c: 2, e: 'Izquierda es x negativa y abajo es y negativa: tercer cuadrante.' },
    { q: 'Una fuerza de 65 N sigue una pendiente 5-12-13, con el 12 en horizontal. ¿Cuánto vale Fx?', o: ['25 N', '60 N', '65 N', '54 N'], c: 1, e: 'Fx = 65·(12/13) = 60 N y Fy = 65·(5/13) = 25 N.' }
  ],
  m3: [
    { q: 'Un peso de 300 N cuelga de dos cables simétricos que forman 30° con la horizontal. ¿Cuál es la tensión en cada uno?', o: ['150 N', '173.2 N', '300 N', '600 N'], c: 2, e: 'ΣFy: 2·T·sen30° = 300 → T = 300 N. Cables poco inclinados cargan mucho.' },
    { q: 'Al resolver, te sale la tensión de un cable negativa. ¿Qué significa?', o: ['Que el cable empuja', 'Que hay un error: un cable solo puede jalar', 'Que la tensión es cero', 'Que el cable está roto'], c: 1, e: 'Un cable no puede empujar. Revisa el DCL o la geometría.' },
    { q: 'Un resorte con k = 800 N/m se estira 5 cm. ¿Qué fuerza ejerce?', o: ['4000 N', '40 N', '160 N', '16 N'], c: 1, e: 'F = k·s = 800 · 0.05 = 40 N. Pasa los centímetros a metros.' }
  ],
  m4: [
    { q: '¿Cuántas reacciones desconocidas pone un empotramiento en 2D?', o: ['1', '2', '3', '4'], c: 2, e: 'Rx, Ry y un momento M, porque impide desplazarse y girar.' },
    { q: 'Supusiste Ay hacia arriba y te salió Ay = −4 kN. ¿Cuál es la respuesta?', o: ['4 kN hacia arriba', '4 kN hacia abajo', 'Hay que rehacer el DCL', '0 kN'], c: 1, e: 'El signo negativo solo indica que el sentido real es el contrario al supuesto.' },
    { q: '¿Qué NO se dibuja en el DCL de una viga?', o: ['Su peso', 'Las reacciones de los apoyos', 'La fuerza que la viga ejerce sobre el apoyo', 'Las cargas aplicadas'], c: 2, e: 'En el DCL van solo las fuerzas que actúan sobre la viga. La fuerza de la viga sobre el apoyo actúa sobre el apoyo.' }
  ],
  m5: [
    { q: 'Aplicas 40 N perpendicular a una barra, a 0.5 m del pivote. ¿Qué momento produces?', o: ['80 N·m', '20 N·m', '40.5 N·m', '8 N·m'], c: 1, e: 'M = F·d = 40 · 0.5 = 20 N·m.' },
    { q: 'F = (100 N, 200 N) actúa en el punto (3 m, 1 m). ¿Cuánto vale el momento respecto al origen?', o: ['700 N·m', '500 N·m', '−500 N·m', '100 N·m'], c: 1, e: 'M = x·Fy − y·Fx = 3·200 − 1·100 = 500 N·m (antihorario).' },
    { q: 'Si la línea de acción de una fuerza pasa por el punto O, su momento respecto a O es…', o: ['Máximo', 'Igual a F', 'Cero', 'Negativo'], c: 2, e: 'La distancia perpendicular es cero, así que M = F·0 = 0.' }
  ],
  m6: [
    { q: 'Una viga de 4 m simplemente apoyada tiene 8 kN a 1 m de A. ¿Cuánto vale By?', o: ['6 kN', '2 kN', '4 kN', '8 kN'], c: 1, e: 'ΣM_A: By·4 − 8·1 = 0 → By = 2 kN. Luego Ay = 6 kN.' },
    { q: 'Una viga con dos pasadores (uno en cada extremo) es…', o: ['Isostática', 'Hiperestática', 'Inestable', 'Una armadura'], c: 1, e: 'Tiene 4 incógnitas (2 por pasador) y solo 3 ecuaciones.' },
    { q: '¿Dónde conviene tomar ΣM primero?', o: ['En el centro de la viga', 'Donde se cruzan más incógnitas', 'Donde está la carga mayor', 'En cualquier punto lejano'], c: 1, e: 'Las incógnitas que pasan por ese punto no hacen momento y desaparecen de la ecuación.' }
  ],
  m7: [
    { q: 'Una carga uniforme de 3 kN/m actúa sobre 4 m. ¿Cuál es su resultante y dónde va?', o: ['3 kN en el centro', '12 kN en el centro del tramo', '12 kN en el extremo', '7 kN en el centro'], c: 1, e: 'R = w·L = 3·4 = 12 kN, en L/2 = 2 m.' },
    { q: 'Una carga triangular va de 0 a 6 kN/m en 3 m. ¿Cuánto vale su resultante?', o: ['18 kN', '9 kN', '6 kN', '3 kN'], c: 1, e: 'R = ½·w·L = ½·6·3 = 9 kN, a 1 m del lado alto.' },
    { q: '¿Cómo se resuelve una carga trapezoidal?', o: ['Con el promedio en un extremo', 'Dividiéndola en un rectángulo y un triángulo', 'Ignorándola', 'Como una sola carga en el centro siempre'], c: 1, e: 'Se calculan dos resultantes, cada una en su centroide.' }
  ],
  m8: [
    { q: 'Empujas con 80 N una caja de 20 kg; μs = 0.5. ¿Cuánto vale la fricción?', o: ['98.1 N', '80 N', '0 N', '40 N'], c: 1, e: 'f máx = 0.5·196.2 = 98.1 N. Como 80 < 98.1, no se mueve y la fricción vale lo necesario: 80 N.' },
    { q: 'Si μs = 0.25, ¿cuál es el ángulo máximo de un plano antes de que el bloque deslice?', o: ['14.0°', '25°', '75.5°', '0.25°'], c: 0, e: 'tan θ = μs → θ = tan⁻¹(0.25) = 14.0°.' },
    { q: '¿Cuándo es f = μs·N?', o: ['Siempre', 'Solo cuando está a punto de deslizar', 'Nunca', 'Cuando no hay fuerza aplicada'], c: 1, e: 'Antes de eso la fricción es solo la necesaria para el equilibrio.' }
  ],
  m9: [
    { q: 'Supusiste una barra en tensión y te salió −12 kN. ¿Qué significa?', o: ['12 kN en tensión', '12 kN en compresión', 'Error de cálculo', 'Barra de fuerza cero'], c: 1, e: 'Negativo con la suposición de tensión significa compresión.' },
    { q: 'A un nodo sin carga llegan dos barras no colineales. ¿Cuánto valen sus fuerzas?', o: ['Iguales y distintas de cero', 'Ambas cero', 'Depende de la carga total', 'Una es cero'], c: 1, e: 'Con dos direcciones distintas y sin carga, la única forma de cumplir ΣF = 0 es que ambas sean cero.' },
    { q: 'Una armadura tiene 9 barras, 6 nodos y 3 reacciones. ¿Es determinada?', o: ['Sí, b + r = 2n', 'No, sobran barras', 'No, faltan barras', 'No se puede saber'], c: 0, e: 'b + r = 9 + 3 = 12 = 2·6.' }
  ]
};

/* ===== Lógica de la ruta de aprendizaje ===== */
(() => {
  const ORDER = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
  const NAMES = { m1: 'Bases', m2: 'Vectores', m3: 'Partícula', m4: 'DCL', m5: 'Momento', m6: 'Cuerpo rígido', m7: 'Cargas dist.', m8: 'Fricción', m9: 'Armaduras' };
  const TEMA = { m1: 'vec', m2: 'vec', m3: 'par', m4: 'rig', m5: 'mom', m6: 'rig', m7: 'dis', m8: 'fri', m9: 'arm' };
  const KEY = 'estatica-ruta-v1';
  let passed = {};
  try { passed = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(passed)); } catch (e) {} };
  const unlocked = () => true;
  const pending = id => { const i = ORDER.indexOf(id); return i > 0 && !ORDER.slice(0, i).every(k => passed[k]); };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  document.querySelectorAll('[data-lf]').forEach(el => { el.innerHTML = LF(el.dataset.lf); });

  // preguntas
  ORDER.forEach(id => {
    const box = document.querySelector('#' + id + ' .quiz');
    if (!box) return;
    const qs = QUIZ[id];
    box.innerHTML = '<div class="quiz-head"><span class="num">COMPRUEBA LO QUE APRENDISTE</span><h3>Responde bien las ' + qs.length + ' preguntas para marcar el módulo como completado</h3></div>' +
      qs.map((q, i) => '<fieldset class="qz" data-i="' + i + '"><legend>' + (i + 1) + '. ' + esc(q.q) + '</legend>' +
        q.o.map((o, j) => '<label class="opt"><input type="radio" name="' + id + '-q' + i + '" value="' + j + '"><span>' + esc(o) + '</span></label>').join('') +
        '<p class="qfb" hidden></p></fieldset>').join('') +
      '<div class="quiz-act"><button type="button" class="btn-main q-check">Comprobar respuestas</button>' + (ORDER.indexOf(id) < ORDER.length - 1 ? '<button type="button" class="btn-sec q-skip">Saltar al siguiente sin responder</button>' : '') + '<span class="q-msg" aria-live="polite"></span></div>' +
      '<div class="quiz-done" hidden><p><b>¡Módulo completado!</b> Ya puedes seguir.</p><div class="quiz-links">' +
      (ORDER.indexOf(id) < ORDER.length - 1 ? '<button type="button" class="btn-main q-next">Siguiente: ' + NAMES[ORDER[ORDER.indexOf(id) + 1]] + ' →</button>' : '<a class="btn-main" href="ejercicios.html">Ir al banco de 50 ejercicios →</a>') +
      '<a class="btn-sec" href="ejercicios.html#' + TEMA[id] + '">Practicar más de este tema</a></div></div>';
    box.querySelector('.q-check').onclick = () => {
      let ok = 0;
      qs.forEach((q, i) => {
        const fs = box.querySelector('.qz[data-i="' + i + '"]'), sel = fs.querySelector('input:checked'), fb = fs.querySelector('.qfb');
        fb.hidden = false;
        if (!sel) { fb.className = 'qfb'; fb.textContent = 'Elige una respuesta.'; fs.classList.remove('ok', 'bad'); return; }
        const good = Number(sel.value) === q.c;
        fs.classList.toggle('ok', good); fs.classList.toggle('bad', !good);
        fb.className = 'qfb ' + (good ? 'good' : 'wrong');
        fb.textContent = (good ? 'Correcto. ' : 'Todavía no. ') + (good ? q.e : 'Repasa la sección y vuelve a intentarlo.');
        if (good) ok++;
      });
      const msg = box.querySelector('.q-msg');
      if (ok === qs.length) { passed[id] = true; save(); msg.textContent = ''; box.querySelector('.quiz-done').hidden = false; render(); }
      else msg.textContent = ok + ' de ' + qs.length + ' correctas. Corrige las marcadas en rojo.';
    };
    const sk = box.querySelector('.q-skip');
    if (sk) sk.onclick = () => show(ORDER[ORDER.indexOf(id) + 1], true);
    const nx = box.querySelector('.q-next');
    if (nx) nx.onclick = () => show(ORDER[ORDER.indexOf(id) + 1], true);
    if (passed[id]) { box.querySelector('.quiz-done').hidden = false; qs.forEach((q, i) => { const r = box.querySelector('input[name="' + id + '-q' + i + '"][value="' + q.c + '"]'); if (r) r.checked = true; }); }
  });

  // pasos
  const steps = document.getElementById('steps');
  let current = ORDER.find(k => !passed[k]) || 'm1';
  function render() {
    steps.innerHTML = '';
    ORDER.forEach((id, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'step-btn' + (passed[id] ? ' done' : '') + (id === current ? ' cur' : '');
      const lock = pending(id);
      if (lock) b.classList.add('pend');
      b.innerHTML = '<span class="sn">' + (passed[id] ? '✓' : (i + 1)) + '</span><span>' + NAMES[id] + '</span>';
      b.setAttribute('aria-current', id === current ? 'step' : 'false');
      if (lock) b.title = 'Puedes abrirlo, pero aún no completas los módulos anteriores';
      b.onclick = () => show(id, true);
      steps.append(b);
    });
    const n = ORDER.filter(k => passed[k]).length;
    const ring = document.getElementById('ring'); if (ring) ring.style.strokeDashoffset = 62.83 * (1 - n / ORDER.length);
    const pt = document.getElementById('progtxt'); if (pt) pt.textContent = n + '/' + ORDER.length;
  }
  function show(id, scroll) {
    if (!unlocked(id)) return;
    current = id;
    ORDER.forEach(k => { document.getElementById(k).hidden = k !== id; });
    render();
    if (scroll) document.getElementById('ruta').scrollIntoView({ block: 'start' });
  }
  show(current, false);
})();

/* ===== Laboratorio de momento ===== */
(() => {
  const svgEl = document.getElementById('mlab');
  if (!svgEl) return;
  const { T, arr, line, couple } = FL;
  const mx = document.getElementById('mx'), ma = document.getElementById('ma'), out = document.getElementById('mres');
  const D = Math.PI / 180, ox = 170, oy = 120, k = 60, F = 100;
  const R = v => Math.round(v * 10) / 10;
  function draw() {
    const x = Number(mx.value), a = Number(ma.value);
    document.getElementById('mxo').textContent = (x > 0 ? '+' : '') + x + ' m' + (x < 0 ? ' (izquierda de O)' : x > 0 ? ' (derecha de O)' : ' (en O)');
    document.getElementById('mao').textContent = a + '°';
    const Fy = F * Math.sin(a * D), Fx = F * Math.cos(a * D);
    let M = x * Fy; if (Math.abs(M) < 1e-6) M = 0;
    const px = ox + x * k, ux = Math.cos(a * D), uy = -Math.sin(a * D);
    const dir = M > 0 ? 'ccw' : M < 0 ? 'cw' : '';
    const tilt = M > 0 ? -7 : M < 0 ? 7 : 0;
    let s = line(20, oy, 320, oy, 'dimL');
    s += `<g style="transition: transform 400ms cubic-bezier(.23,1,.32,1); transform-origin: ${ox}px ${oy}px; transform: rotate(${tilt}deg)"><rect class="body" x="${ox - 2.4 * k}" y="${oy - 6}" width="${4.8 * k}" height="12" rx="2"/>`;
    s += line(px - ux * 300, oy - uy * 300, px + ux * 300, oy + uy * 300, 'g');
    const t = (ox - px) * ux + (oy - oy) * uy, fx = px + t * ux, fy = oy + t * uy;
    if (M !== 0) s += line(ox, oy, fx, fy, 'r', 'stroke-dasharray="4 3" stroke-width="2"') + T((ox + fx) / 2 + 10, (oy + fy) / 2 - 10, 'd', 'rl');
    s += arr(px, oy, px + ux * 75, oy + uy * 75, 'f') + T(px + ux * 92, oy + uy * 92, 'F', 'fl') + `<circle class="inkf" cx="${px}" cy="${oy}" r="3.5"/>`;
    s += '</g>';
    s += `<circle class="body" cx="${ox}" cy="${oy}" r="7"/><circle class="inkf" cx="${ox}" cy="${oy}" r="2.5"/>` + T(ox, oy + 24, 'O', '');
    if (dir) s += couple(ox, oy, dir, M > 0 ? 'r' : 'f', '', 30);
    svgEl.innerHTML = s;
    const d = Math.abs(x * Math.sin(a * D));
    const sense = M > 0 ? '<b class="pos">↺ antihorario (+)</b>' : M < 0 ? '<b class="neg">↻ horario (−)</b>' : '<b>no gira</b>';
    out.innerHTML = '<div class="big">M = ' + (M > 0 ? '+' : '') + R(M) + ' N·m</div><div>' + sense + '</div>' +
      '<div class="small">Fy = 100·sen' + a + '° = ' + R(Fy) + ' N · d = ' + R(d) + ' m</div>' +
      '<div class="small">M = x·Fy = (' + x + ')(' + R(Fy) + ') = ' + R(M) + ' N·m</div>' +
      (M === 0 ? '<div class="small">' + (x === 0 ? 'La fuerza está en O.' : 'La línea de acción pasa por O: d = 0.') + '</div>' : '');
  }
  mx.addEventListener('input', draw); ma.addEventListener('input', draw);
  document.querySelectorAll('#mom-lab [data-p]').forEach(b => b.onclick = () => { const [x, a] = b.dataset.p.split(','); mx.value = x; ma.value = a; draw(); });
  draw();
})();
