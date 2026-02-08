import { useEffect, useRef } from 'react';

interface StarfieldProps {
  className?: string;
}

export function Starfield({ className = '' }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate stars
    const stars: { x: number; y: number; size: number; opacity: number; speed: number }[] = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 4000);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.01,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = '#0B0F1C';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Twinkle effect
        star.opacity += Math.sin(Date.now() * star.speed) * 0.01;
        star.opacity = Math.max(0.2, Math.min(0.8, star.opacity));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 ${className}`}
      style={{ background: '#0B0F1C' }}
    />
  );
}
