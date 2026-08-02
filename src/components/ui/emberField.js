export function initEmberField(canvas) {
  if (!canvas) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let particles = [];
  const COUNT = 40;

  function resize() {
    canvas.width = canvas.clientWidth || window.innerWidth;
    canvas.height = canvas.clientHeight || 400;
  }

  function spawn() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 40,
      r: 1 + Math.random() * 2,
      speed: 0.4 + Math.random() * 0.8,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: 0.3 + Math.random() * 0.5
    };
  }

  resize();
  window.addEventListener('resize', resize);
  particles = Array.from({ length: COUNT }, spawn);

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      p.alpha -= 0.002;
      if (p.y < -10 || p.alpha <= 0) {
        Object.assign(p, spawn(), { y: canvas.height + 10 });
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 115, 22, ${Math.max(p.alpha, 0)})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
