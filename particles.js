/* particles.js — lightweight canvas star-field with pink accent nodes */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles, lines;

  const PARTICLE_COUNT = 72;
  const PINK = { r: 236, g: 72, b: 153 };
  const LINE_DIST = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(a, b) { return Math.random() * (b - a) + a; }

  function makeParticle() {
    const isPink = Math.random() < 0.12;
    return {
      x:    rand(0, W),
      y:    rand(0, H),
      vx:   rand(-0.18, 0.18),
      vy:   rand(-0.12, 0.12),
      r:    isPink ? rand(2, 3.5) : rand(0.6, 1.6),
      pink: isPink,
      alpha: rand(0.5, isPink ? 1.0 : 0.55),
      phase: rand(0, Math.PI * 2), // for shimmer
    };
  }

  function init() {
    particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINE_DIST) {
          const t = 1 - dist / LINE_DIST;
          const bothPink = particles[i].pink && particles[j].pink;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = bothPink
            ? `rgba(${PINK.r},${PINK.g},${PINK.b},${t * 0.5})`
            : `rgba(255,255,255,${t * 0.04})`;
          ctx.lineWidth = bothPink ? 0.8 : 0.4;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    const t = Date.now() / 1000;
    particles.forEach(p => {
      if (p.pink) {
        // shimmer pulse
        const pulse = 0.75 + 0.25 * Math.sin(t * 2.2 + p.phase);
        const glowR = p.r * 6 * pulse;

        // outer soft glow
        const outer = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        outer.addColorStop(0, `rgba(${PINK.r},${PINK.g},${PINK.b},${0.22 * pulse})`);
        outer.addColorStop(1, `rgba(${PINK.r},${PINK.g},${PINK.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = outer;
        ctx.fill();

        // mid glow
        const mid = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        mid.addColorStop(0, `rgba(255,200,230,${0.9 * pulse})`);
        mid.addColorStop(0.4, `rgba(${PINK.r},${PINK.g},${PINK.b},${0.6 * pulse})`);
        mid.addColorStop(1, `rgba(${PINK.r},${PINK.g},${PINK.b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = mid;
        ctx.fill();

        // bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,240,248,${p.alpha})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize();
  init();
  loop();
})();
