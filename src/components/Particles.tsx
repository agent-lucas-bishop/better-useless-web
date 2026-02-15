import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; color: string; life: number;
}

export function Particles({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (trigger === 0) return;
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ff9f43', '#00d2d3'];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 8;
      particlesRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      });
    }
  }, [trigger]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life -= 0.02;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // random shapes
        if (Math.random() > 0.5) {
          ctx.fillRect(p.x, p.y, p.size, p.size);
        } else {
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 100 }} />;
}
