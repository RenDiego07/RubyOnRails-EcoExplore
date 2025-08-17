import { mulberry32 } from '@/utils/canvas';

export function drawScene(canvas: HTMLCanvasElement): (() => void) | undefined {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas');
    return;
  }

  const resize = (): void => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  const render = (): void => {
    const w: number = canvas.width;
    const h: number = canvas.height;

    if (!w || !h) return;

    const rng = mulberry32(42); // Semilla fija para consistencia
    ctx.clearRect(0, 0, w, h);

    // Gradiente de fondo
    const g: CanvasGradient = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#EDE9E3');
    g.addColorStop(0.5, '#F2E7E0');
    g.addColorStop(1, '#E8D8CB');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Sol/luna en esquina superior derecha
    ctx.fillStyle = 'rgba(255,210,180,.6)';
    ctx.beginPath();
    ctx.arc(w * 0.8, h * 0.25, 50, 0, Math.PI * 2);
    ctx.fill();

    // Montañas/colinas (3 capas)
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = `rgba(120,${120 + i * 20},${110 + i * 15},${0.25 + i * 0.15})`;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6 + i * 30);

      for (let x = 0; x <= w; x += 20) {
        const y: number = h * 0.6 + i * 30 + Math.sin(x / 140 + i) * 14 + rng() * 10;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }

    // Líneas de agua (ondas)
    for (let y = h * 0.75; y < h * 0.95; y += 8) {
      ctx.strokeStyle = 'rgba(100,140,160,.12)';
      ctx.beginPath();
      ctx.moveTo(0, y);

      for (let x = 0; x <= w; x += 16) {
        ctx.lineTo(x, y + Math.sin(x / 60 + y / 50) * 2);
      }

      ctx.stroke();
    }

    // Playa/arena en la parte inferior
    ctx.fillStyle = 'rgba(230,200,170,.35)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.bezierCurveTo(w * 0.2, h * 0.85, w * 0.4, h * 0.95, w * 0.65, h * 0.9);
    ctx.bezierCurveTo(w * 0.85, h * 0.86, w * 0.95, h * 0.94, w, h * 0.92);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  };

  resize();

  const handleResize = (): void => {
    resize();
    render();
  };

  window.addEventListener('resize', handleResize, { passive: true });

  // Cleanup function
  const cleanup = (): void => {
    window.removeEventListener('resize', handleResize);
  };

  render();

  // Retornamos la función de cleanup para usar en useEffect
  return cleanup;
}
