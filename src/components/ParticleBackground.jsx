import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const emitCooldown = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Reduce particles on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const BASE_PARTICLES = isMobile
      ? Math.floor((width * height) / 40000) // Fewer particles on mobile
      : Math.floor((width * height) / 20000);
    const particles = [];

    class Particle {
      constructor(x, y, follow = false) {
        this.x = x ?? Math.random() * width;
        this.y = y ?? Math.random() * height;

        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;

        this.radius = Math.random() * 1.6 + 0.6;
        this.life = follow ? 160 : Infinity;
        this.follow = follow;
        this.alpha = 1;

        // Ambient drift direction
        this.drift = Math.random() * Math.PI * 2;
      }

      update() {
        // 🌊 Ambient floating motion
        this.drift += 0.002;
        this.vx += Math.cos(this.drift) * 0.002;
        this.vy += Math.sin(this.drift) * 0.002;

        // 🎯 Cursor attraction for emitted particles
        if (this.follow) {
          const dx = mouse.current.x - this.x;
          const dy = mouse.current.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = Math.min(70 / dist, 0.5);
          this.vx += (dx / dist) * force * 0.03;
          this.vy += (dy / dist) * force * 0.03;

          this.life--;
          this.alpha = Math.max(this.life / 160, 0);
        }

        this.x += this.vx;
        this.y += this.vy;

        this.vx *= 0.985;
        this.vy *= 0.985;

        // Wrap edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,200,255,${0.55 * this.alpha})`;
        ctx.fill();
      }
    }

    // Base ambient particles
    for (let i = 0; i < BASE_PARTICLES; i++) {
      particles.push(new Particle());
    }

    // Emit particles near cursor
    const emitParticles = (x, y) => {
      const COUNT = 3;

      for (let i = 0; i < COUNT; i++) {
        particles.push(
          new Particle(
            x + (Math.random() - 0.5) * 14,
            y + (Math.random() - 0.5) * 14,
            true
          )
        );
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      emitCooldown.current--;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();

        if (p.follow && p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (emitCooldown.current <= 0) {
        emitParticles(e.clientX, e.clientY);
        emitCooldown.current = 3;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.current.x = t.clientX;
        mouse.current.y = t.clientY;

        if (emitCooldown.current <= 0) {
          emitParticles(t.clientX, t.clientY);
          emitCooldown.current = 3;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,              // ✅ background layer
        pointerEvents: "none",
      }}
    />
  );
}
