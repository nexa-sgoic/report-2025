/* ═══════════════════════════════════════════════════════════════════════
   NEXA · Liquid Data · shared motor
   ───────────────────────────────────────────────────────────────────────
   Data-painting engine — Anadol / Memo Akten / Refsgaard lineage.
   Particles drift through a multi-octave Perlin flow field, leaving
   accumulating translucent trails. Each particle carries a real KPI
   weight d ∈ [0,1] that biases its speed, opacity, and stroke width.

   Usage in an embed-*.html (after p5.js global loaded):
     const SC = NEXALiquidData.scene({
       bg: '#03020C',
       accent: '#C85204',
       neutral: '#9A9794',
       kpiBag: 'emissions' | 'energy' | 'water' | 'title',
       N: 6000,                       // particle count
       biasFn: (p) => [0, 0],         // optional flow bias [fx, fy]
       spawn: (W, H) => [x, y],       // optional spawn position
       respawn: (W, H, p) => [x, y],  // optional respawn position
       strokeAlpha: 10,               // 1-30
       washAlpha: 1.5,                // 0-6
       washEvery: 360,                // frames
       timeStep: 0.0008,
       baseSpeed: 1.0,
       weightDamp: 0.6,
       maxLife: 900,
       attractorMask: null,           // p5.Graphics for title attractor
       attractorWeight: 0,            // 0-1
       lifeEnd: null,                 // ms · null = infinite
       onEnd: () => {}                // called when lifeEnd reached
     });
     SC.start();      // begins the draw loop
     SC.pause();      // freezes
     SC.resume();     // resumes
     SC.stop();       // tear down

   The motor respects prefers-reduced-motion by pre-baking 600 ticks
   on first frame and then calling noLoop(). The text-overlay always
   lives outside the canvas — never inside.
   ═══════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── KPI weight bags · derived from real values in the NEXA 2025 report ── */
  const KPI_BAGS = {
    emissions: normalize([
      8.1, 21.9, 170.8, 138.7, 1.9, 1.2, 30.0, 28.4, 26.0, 19.7, 18.9, 9.4,
      342.6, 312.6, 6.0, 14.8, 4.1, 3.4, 21.6, 14.8, 4.9, 6.3, 6.8,
      0.5, 0.8, 1.0, 1.3, 1.6, 2.0, 2.4, 3.0, 4.5, 5.8, 7.2, 9.5, 12.8, 16.4, 22.0, 35.0, 75.0
    ]),
    energy: normalize([
      1501.5, 458.9, 902.5, 140.1, 358.1, 82.4, 18.4, 794.2, 108.3,
      86.9, 39.2, 14.0, 651.0, 1902.5, 17.2, 21.1, 66.7,
      0.05, 0.1, 0.2, 0.3, 0.5, 0.8, 1.1, 1.5, 2.0, 2.8, 3.5, 4.2, 5.0, 6.5, 8.0, 12.0, 18.0, 28.0
    ]),
    water: normalize([
      9933.2, 3602, 3155, 3176.2, 1640, 1180, 782, 3042, 113, 11622,
      14.5, 0.05, 0.12, 0.2, 0.35, 0.5, 0.7, 0.9, 1.2, 1.5, 2.0, 2.5,
      3.0, 3.8, 4.5, 5.5, 7.0, 9.0, 12.0, 16.0, 22.0, 32.0, 48.0, 75.0
    ]),
    // Title variant uses a homogeneous distribution (no bursts)
    title: normalize([0.5, 0.55, 0.6, 0.5, 0.55, 0.45, 0.5, 0.55, 0.5, 0.5])
  };

  function normalize(arr) {
    const max = Math.max.apply(null, arr);
    return arr.map(v => Math.min(1, v / max));
  }

  function pickWeight(bag) {
    return bag[Math.floor(Math.random() * bag.length)];
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16)
    ];
  }

  /* ── Scene factory ─────────────────────────────────────────────────── */
  function scene(opts) {
    const cfg = Object.assign({
      bg: '#03020C',
      accent: '#C85204',
      neutral: '#9A9794',
      kpiBag: 'emissions',
      N: 6000,
      biasFn: null,
      spawn: null,
      respawn: null,
      strokeAlpha: 10,
      strokeAlphaStart: null,
      strokeAlphaEnd: null,
      strokeAlphaRampMs: 0,
      washAlpha: 1.5,
      washEvery: 360,
      timeStep: 0.0008,
      baseSpeed: 1.0,
      weightDamp: 0.6,
      maxLife: 900,
      burstThreshold: 0.85,
      noBursts: false,
      attractorMask: null,
      attractorWeight: 0,
      lifeEnd: null,
      onEnd: null,
      area: null            // { x, y, w, h } — restricts canvas to a region
    }, opts || {});

    const bgRgb = hexToRgb(cfg.bg);
    const accRgb = hexToRgb(cfg.accent);
    const neuRgb = hexToRgb(cfg.neutral);
    const bag = KPI_BAGS[cfg.kpiBag] || KPI_BAGS.emissions;

    let particles = [];
    let t = Math.random() * 1000;
    let p5inst = null;
    let startedAt = 0;
    let isPaused = false;
    let isReduced = false;
    let perfBad = 0;
    let curN = cfg.N;
    let attractorDistField = null;  // pre-computed distance field

    /* prefers-reduced-motion check (per-feature, not global) */
    try {
      isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { isReduced = false; }

    function init(p) {
      p5inst = p;
      const W = p.width, H = p.height;
      // Drop particle count on small screens
      if (W < 768) curN = Math.min(curN, 3200);
      particles = [];
      for (let i = 0; i < curN; i++) particles.push(makeParticle(W, H));
      // Paint full bg once so it's not transparent
      p.noStroke();
      p.fill(bgRgb[0], bgRgb[1], bgRgb[2]);
      p.rect(0, 0, W, H);

      // Pre-compute distance field for title attractor (if any)
      if (cfg.attractorMask && cfg.attractorWeight > 0) {
        attractorDistField = computeDistanceField(cfg.attractorMask);
      }

      // Reduced motion: pre-bake ~600 ticks then freeze
      if (isReduced) {
        for (let k = 0; k < 600; k++) tickFrame(p);
        p.noLoop();
        return;
      }
      startedAt = performance.now();
    }

    function makeParticle(W, H) {
      const d = pickWeight(bag);
      const spawnFn = cfg.spawn || defaultSpawn;
      const [sx, sy] = spawnFn(W, H);
      return { x: sx, y: sy, px: sx, py: sy, d: d, life: 0 };
    }

    function defaultSpawn(W, H) {
      if (cfg.area) {
        return [cfg.area.x + Math.random() * cfg.area.w,
                cfg.area.y + Math.random() * cfg.area.h];
      }
      return [Math.random() * W, Math.random() * H];
    }

    function respawnInPlace(W, H, p) {
      const fn = cfg.respawn || cfg.spawn || defaultSpawn;
      const [sx, sy] = fn(W, H, p);
      p.x = sx; p.y = sy;
      p.px = sx; p.py = sy;
      p.d = pickWeight(bag);
      p.life = 0;
    }

    function flowAngle(x, y) {
      let n = 0;
      n += p5inst.noise(x * 0.0015, y * 0.0015, t) * 1.00;
      n += p5inst.noise(x * 0.0040, y * 0.0040, t) * 0.50;
      n += p5inst.noise(x * 0.0120, y * 0.0120, t) * 0.25;
      n += p5inst.noise(x * 0.0400, y * 0.0400, t) * 0.12;
      return n * Math.PI * 4;
    }

    function offCanvas(p, W, H) {
      if (cfg.area) {
        const a = cfg.area;
        return p.x < a.x - 20 || p.x > a.x + a.w + 20 ||
               p.y < a.y - 20 || p.y > a.y + a.h + 20;
      }
      return p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20;
    }

    function step(p, W, H) {
      const ang = flowAngle(p.x, p.y);
      const speed = cfg.baseSpeed * (1 - p.d * cfg.weightDamp);
      let dx = Math.cos(ang) * speed;
      let dy = Math.sin(ang) * speed;
      // Optional bias term
      if (cfg.biasFn) {
        const [bx, by] = cfg.biasFn(p, W, H);
        dx += bx; dy += by;
      }
      // Attractor force (title-liquid)
      if (attractorDistField && cfg.attractorWeight > 0) {
        const f = attractorForce(p);
        dx += f[0] * cfg.attractorWeight;
        dy += f[1] * cfg.attractorWeight;
      }
      p.px = p.x; p.py = p.y;
      p.x += dx;
      p.y += dy;
      p.life++;
    }

    function paint(p) {
      const isBurst = !cfg.noBursts && p.d > cfg.burstThreshold;
      const c = isBurst ? accRgb : neuRgb;
      let alpha = currentStrokeAlpha() + p.d * 4;
      p5inst.stroke(c[0], c[1], c[2], alpha);
      p5inst.strokeWeight(0.6 + p.d * 1.4);
      p5inst.line(p.px, p.py, p.x, p.y);
    }

    function currentStrokeAlpha() {
      if (cfg.strokeAlphaStart != null && cfg.strokeAlphaEnd != null && cfg.strokeAlphaRampMs > 0) {
        const elapsed = performance.now() - startedAt;
        const k = Math.min(1, elapsed / cfg.strokeAlphaRampMs);
        return cfg.strokeAlphaStart + (cfg.strokeAlphaEnd - cfg.strokeAlphaStart) * k;
      }
      return cfg.strokeAlpha;
    }

    function tickFrame(p) {
      const W = p.width, H = p.height;
      // Wash: a near-transparent fillRect every washEvery frames so the
      // canvas breathes and doesn't saturate to white
      if (p.frameCount % cfg.washEvery === 0) {
        p.noStroke();
        p.fill(bgRgb[0], bgRgb[1], bgRgb[2], cfg.washAlpha);
        if (cfg.area) {
          p.rect(cfg.area.x, cfg.area.y, cfg.area.w, cfg.area.h);
        } else {
          p.rect(0, 0, W, H);
        }
      }
      for (let i = 0; i < particles.length; i++) {
        const part = particles[i];
        step(part, W, H);
        paint(part);
        if (part.life > cfg.maxLife || offCanvas(part, W, H)) respawnInPlace(W, H, part);
      }
      t += cfg.timeStep;

      // Perf fallback: if framerate drops sustained, drop N
      if (p.frameCount % 60 === 0) {
        if (p.frameRate() < 30) {
          perfBad++;
          if (perfBad >= 3 && curN > 3000) {
            particles.length = Math.max(3000, particles.length - 1000);
            curN = particles.length;
            perfBad = 0;
          }
        } else {
          perfBad = Math.max(0, perfBad - 1);
        }
      }

      // Finite-life scene (title-liquid): end after lifeEnd ms
      if (cfg.lifeEnd && performance.now() - startedAt >= cfg.lifeEnd) {
        if (cfg.onEnd) cfg.onEnd();
        cfg.lifeEnd = null;  // prevent re-fire
      }
    }

    /* ── Attractor (title-liquid only) ──────────────────────────────── */
    function computeDistanceField(mask) {
      // Mask is a p5.Graphics with letterforms drawn in white on black bg.
      mask.loadPixels();
      const w = mask.width, h = mask.height;
      const dist = new Float32Array(w * h);
      const dirX = new Int16Array(w * h);
      const dirY = new Int16Array(w * h);
      const INF = 1e9;
      // Initialize: 0 inside letterforms, INF elsewhere
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const isInk = mask.pixels[i] > 128;
          const idx = y * w + x;
          dist[idx] = isInk ? 0 : INF;
          dirX[idx] = 0; dirY[idx] = 0;
        }
      }
      // Two-pass distance transform (Chamfer 3-4)
      const D1 = 3, D2 = 4;
      // Forward pass
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = y * w + x;
          if (dist[idx] === 0) continue;
          let best = dist[idx], bx = dirX[idx], by = dirY[idx];
          if (x > 0)         { const v = dist[idx-1] + D1;       if (v < best) { best = v; bx = dirX[idx-1] - 1; by = dirY[idx-1]; } }
          if (y > 0 && x > 0){ const v = dist[idx-w-1] + D2;     if (v < best) { best = v; bx = dirX[idx-w-1] - 1; by = dirY[idx-w-1] - 1; } }
          if (y > 0)         { const v = dist[idx-w] + D1;       if (v < best) { best = v; bx = dirX[idx-w]; by = dirY[idx-w] - 1; } }
          if (y > 0 && x < w-1) { const v = dist[idx-w+1] + D2;  if (v < best) { best = v; bx = dirX[idx-w+1] + 1; by = dirY[idx-w+1] - 1; } }
          dist[idx] = best; dirX[idx] = bx; dirY[idx] = by;
        }
      }
      // Backward pass
      for (let y = h - 1; y >= 0; y--) {
        for (let x = w - 1; x >= 0; x--) {
          const idx = y * w + x;
          if (dist[idx] === 0) continue;
          let best = dist[idx], bx = dirX[idx], by = dirY[idx];
          if (x < w-1)       { const v = dist[idx+1] + D1;       if (v < best) { best = v; bx = dirX[idx+1] + 1; by = dirY[idx+1]; } }
          if (y < h-1 && x < w-1) { const v = dist[idx+w+1] + D2; if (v < best) { best = v; bx = dirX[idx+w+1] + 1; by = dirY[idx+w+1] + 1; } }
          if (y < h-1)       { const v = dist[idx+w] + D1;       if (v < best) { best = v; bx = dirX[idx+w]; by = dirY[idx+w] + 1; } }
          if (y < h-1 && x > 0) { const v = dist[idx+w-1] + D2;  if (v < best) { best = v; bx = dirX[idx+w-1] - 1; by = dirY[idx+w-1] + 1; } }
          dist[idx] = best; dirX[idx] = bx; dirY[idx] = by;
        }
      }
      return { dist: dist, dirX: dirX, dirY: dirY, w: w, h: h };
    }

    function attractorForce(p) {
      if (!attractorDistField) return [0, 0];
      const f = attractorDistField;
      const x = Math.max(0, Math.min(f.w - 1, Math.floor(p.x)));
      const y = Math.max(0, Math.min(f.h - 1, Math.floor(p.y)));
      const idx = y * f.w + x;
      if (f.dist[idx] === 0) return [0, 0];  // already on ink
      // Direction stored is pixel offset to nearest ink
      const dx = -f.dirX[idx];   // invert: we want to MOVE toward ink
      const dy = -f.dirY[idx];
      const m = Math.hypot(dx, dy) || 1;
      // Force magnitude attenuates with distance (stronger when far)
      const mag = Math.min(1, f.dist[idx] / 80);
      return [(dx / m) * mag, (dy / m) * mag];
    }

    /* ── Public API ─────────────────────────────────────────────────── */
    return {
      cfg: cfg,
      init: init,
      tick: function (p) {
        if (isPaused) return;
        tickFrame(p);
      },
      pause: function () { isPaused = true; },
      resume: function () { isPaused = false; },
      stop: function () { if (p5inst) p5inst.noLoop(); isPaused = true; }
    };
  }

  /* ── Title mask helper ─────────────────────────────────────────────── */
  function buildTitleMask(p, text, w, h, fontPxRatio) {
    const m = p.createGraphics(w, h);
    m.background(0);
    m.fill(255); m.noStroke();
    m.textFont('Montserrat, sans-serif');
    m.textStyle(p.BOLD);
    m.textAlign(p.LEFT, p.TOP);
    m.textSize(h * (fontPxRatio || 0.42));
    m.textLeading(h * (fontPxRatio || 0.42) * 1.04);
    // Wrap onto 2 lines manually (p5's text-with-width has poor leading control)
    const lines = text.split('\n');
    let y = 0;
    const lh = h * (fontPxRatio || 0.42) * 1.04;
    for (let i = 0; i < lines.length; i++) {
      m.text(lines[i], 0, y);
      y += lh;
    }
    return m;
  }

  global.NEXALiquidData = { scene: scene, buildTitleMask: buildTitleMask, KPI_BAGS: KPI_BAGS };
})(window);
