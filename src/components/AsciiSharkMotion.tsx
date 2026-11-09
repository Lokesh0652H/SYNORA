'use client';

import React, { useEffect, useRef } from 'react';

// Character sets for shading density
const GLYPHS = ['@', '%', '#', '8', 'S', 'X', 'x', 's', 't', 'o', '*', ':', '·', ' '];

interface Segment {
  x: number;
  y: number;
  width: number;
}

interface Creature {
  type: 'great_white' | 'hammerhead' | 'small_fish';
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  length: number;
  bodyWidth: number;
  phase: number;
  speed: number;
  history: { x: number; y: number; angle: number }[];
}

export default function AsciiSharkMotion({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize 3 creatures matching stackedlol demo
    const creatures: Creature[] = [
      // 1. Large Tiger / Great White shark
      {
        type: 'great_white',
        x: width * 0.45,
        y: height * 0.65,
        vx: 0.8,
        vy: -0.2,
        heading: -0.3,
        length: 220,
        bodyWidth: 46,
        phase: 0,
        speed: 1.1,
        history: [],
      },
      // 2. Hammerhead shark
      {
        type: 'hammerhead',
        x: width * 0.72,
        y: height * 0.3,
        vx: -0.65,
        vy: 0.25,
        heading: 2.7,
        length: 190,
        bodyWidth: 38,
        phase: 1.5,
        speed: 1.0,
        history: [],
      },
      // 3. Small agile pilot fish
      {
        type: 'small_fish',
        x: width * 0.2,
        y: height * 0.25,
        vx: 0.9,
        vy: 0.35,
        heading: 0.4,
        length: 85,
        bodyWidth: 16,
        phase: 3.0,
        speed: 1.5,
        history: [],
      },
    ];

    // Background floating ASCII particles
    const particles = Array.from({ length: 48 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      char: ['·', ':', '+', '~', '°', '·'][Math.floor(Math.random() * 6)],
      speed: 0.15 + Math.random() * 0.25,
      alpha: 0.12 + Math.random() * 0.22,
    }));

    const render = () => {
      time += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle background dot grid
      const gridSize = 24;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      for (let gx = 0; gx < width; gx += gridSize) {
        for (let gy = 0; gy < height; gy += gridSize) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // 2. Ambient drifting particles
      ctx.font = '10px ui-monospace, SFMono-Regular, Consolas, monospace';
      particles.forEach((p) => {
        p.x += p.speed;
        if (p.x > width + 20) p.x = -20;
        ctx.fillStyle = `rgba(130, 135, 125, ${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y + Math.sin(time + p.x * 0.01) * 4);
      });

      // 3. Update and draw each creature
      creatures.forEach((c) => {
        // Natural gentle turning and cruising
        c.phase += 0.045 * c.speed;
        const turnWiggle = Math.sin(time * 0.6 + c.phase) * 0.012;
        c.heading += turnWiggle;

        // Gentle steer back to canvas bounds
        const margin = 80;
        if (c.x < margin) c.heading += 0.02;
        if (c.x > width - margin) c.heading -= 0.02;
        if (c.y < margin) c.heading += 0.02;
        if (c.y > height - margin) c.heading -= 0.02;

        c.vx = Math.cos(c.heading) * c.speed;
        c.vy = Math.sin(c.heading) * c.speed;
        c.x += c.vx;
        c.y += c.vy;

        // Wrap around bounds softly
        if (c.x < -c.length) c.x = width + c.length;
        if (c.x > width + c.length) c.x = -c.length;
        if (c.y < -c.length) c.y = height + c.length;
        if (c.y > height + c.length) c.y = -c.length;

        // Spine segments computation
        const numSegments = c.type === 'small_fish' ? 14 : 26;
        const segDist = c.length / numSegments;

        // Keep spine history
        if (c.history.length === 0) {
          for (let i = 0; i < numSegments; i++) {
            c.history.push({
              x: c.x - Math.cos(c.heading) * i * segDist,
              y: c.y - Math.sin(c.heading) * i * segDist,
              angle: c.heading,
            });
          }
        }

        // Head position
        c.history[0] = { x: c.x, y: c.y, angle: c.heading };

        // Inverse kinematics / trailing spine with sinusoidal tail wave
        for (let i = 1; i < numSegments; i++) {
          const prev = c.history[i - 1];
          const curr = c.history[i];
          const tailWave = Math.sin(c.phase - i * 0.38) * (i / numSegments) * (c.bodyWidth * 0.42);

          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const targetAngle = Math.atan2(dy, dx);
          const angle = targetAngle;

          curr.x = prev.x + Math.cos(angle) * segDist;
          curr.y = prev.y + Math.sin(angle) * segDist + tailWave * 0.15;
          curr.angle = angle;
        }

        // Render Creature Body in ASCII Grid
        const cell = c.type === 'small_fish' ? 7 : 9;
        ctx.font = `600 ${cell}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw segments along spine
        for (let i = 0; i < numSegments; i++) {
          const seg = c.history[i];
          const t = i / numSegments;

          // Body thickness profile
          let halfWidth = 0;
          if (c.type === 'hammerhead') {
            if (i === 0) halfWidth = c.bodyWidth * 0.95; // Hammerhead cephalofoil
            else if (i === 1) halfWidth = c.bodyWidth * 0.85;
            else halfWidth = Math.sin(t * Math.PI) * (c.bodyWidth * 0.55);
          } else if (c.type === 'great_white') {
            halfWidth = Math.sin(Math.sqrt(t) * Math.PI) * (c.bodyWidth * 0.6);
            // Dorsal fin peak around segment 6-10
            if (i >= 6 && i <= 10) halfWidth += 6;
          } else {
            halfWidth = Math.sin(t * Math.PI) * (c.bodyWidth * 0.5);
          }

          // Perpendicular normal to spine
          const normAngle = seg.angle + Math.PI / 2;
          const nx = Math.cos(normAngle);
          const ny = Math.sin(normAngle);

          const lateralCount = Math.max(1, Math.round(halfWidth / cell));

          for (let lat = -lateralCount; lat <= lateralCount; lat++) {
            const px = seg.x + nx * (lat * cell);
            const py = seg.y + ny * (lat * cell);

            // Distance from center axis determines glyph density and shading
            const distRatio = Math.abs(lat) / Math.max(1, lateralCount);
            const glyphIdx = Math.floor(distRatio * (GLYPHS.length - 3));
            const char = GLYPHS[Math.min(glyphIdx, GLYPHS.length - 2)];

            // Shading color: subtle charcoal/slate with slight opacity variation
            const alpha = 0.55 + (1 - distRatio) * 0.35;
            // Tint: slightly cooler for hammerhead, neutral charcoal for great white
            const grayVal = Math.floor(65 + distRatio * 75);
            ctx.fillStyle = `rgba(${grayVal}, ${grayVal + (c.type === 'hammerhead' ? 6 : 2)}, ${
              grayVal + 8
            }, ${alpha})`;

            // Draw character
            ctx.fillText(char, px, py);
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener('mousemove', handlePointerMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
