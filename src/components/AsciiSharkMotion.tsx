'use client';

import React, { useEffect, useRef } from 'react';

// Color palette matching the stackedlol aesthetic (refined pastels, slates, and charcoals)
const TILE_PALETTE = [
  { bg: 'rgba(122, 166, 158, 0.85)', text: '#1A332E', border: 'rgba(92, 136, 128, 0.4)' }, // Seafoam teal
  { bg: 'rgba(154, 142, 178, 0.85)', text: '#261F33', border: 'rgba(124, 112, 148, 0.4)' }, // Lavender purple
  { bg: 'rgba(120, 146, 175, 0.85)', text: '#192C3D', border: 'rgba(95, 120, 148, 0.4)' },  // Slate blue
  { bg: 'rgba(196, 168, 122, 0.85)', text: '#382B14', border: 'rgba(166, 138, 92, 0.4)' },  // Warm sand/gold
  { bg: 'rgba(188, 138, 148, 0.85)', text: '#3B1F25', border: 'rgba(158, 108, 118, 0.4)' }, // Dusty rose
  { bg: 'rgba(45, 50, 58, 0.92)',    text: '#E5E8EB', border: 'rgba(25, 28, 33, 0.6)' },    // Dark charcoal
  { bg: 'rgba(78, 86, 98, 0.88)',    text: '#E8ECF0', border: 'rgba(55, 62, 72, 0.5)' },    // Mid slate
  { bg: 'rgba(232, 235, 228, 0.92)', text: '#2D332A', border: 'rgba(202, 205, 198, 0.6)' }, // Pale silver belly
];

const GLYPHS = ['S', 'X', '%', 't', '8', '@', 's', 'x', 'o', '*', '#', ':'];

interface Creature {
  type: 'hammerhead' | 'great_white' | 'small_fish';
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  length: number;
  phase: number;
  speed: number;
}

export default function AsciiSharkMotion({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Three distinct creatures
    const creatures: Creature[] = [
      {
        type: 'hammerhead',
        x: width * 0.72,
        y: height * 0.28,
        vx: -0.65,
        vy: 0.22,
        heading: 2.8,
        length: 260,
        phase: 0.5,
        speed: 0.95,
      },
      {
        type: 'great_white',
        x: width * 0.38,
        y: height * 0.68,
        vx: 0.85,
        vy: -0.18,
        heading: -0.25,
        length: 300,
        phase: 2.2,
        speed: 1.1,
      },
      {
        type: 'small_fish',
        x: width * 0.18,
        y: height * 0.22,
        vx: 1.1,
        vy: 0.35,
        heading: 0.32,
        length: 120,
        phase: 4.0,
        speed: 1.45,
      },
    ];

    // Background drifting ASCII bubbles/particles
    const bubbles = Array.from({ length: 42 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      char: ['o', '°', '·', '+', '~'][Math.floor(Math.random() * 5)],
      speed: 0.2 + Math.random() * 0.3,
      alpha: 0.15 + Math.random() * 0.25,
    }));

    const render = () => {
      time += 0.022;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle background grid
      const gridSize = 24;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
      for (let gx = 0; gx < width; gx += gridSize) {
        for (let gy = 0; gy < height; gy += gridSize) {
          ctx.fillRect(gx, gy, 1, 1);
        }
      }

      // 2. Ambient drifting particles
      ctx.font = '10px ui-monospace, SFMono-Regular, Consolas, monospace';
      bubbles.forEach((b) => {
        b.x += b.speed;
        if (b.x > width + 20) b.x = -20;
        ctx.fillStyle = `rgba(140, 145, 138, ${b.alpha})`;
        ctx.fillText(b.char, b.x, b.y + Math.sin(time * 1.5 + b.x * 0.02) * 5);
      });

      // 3. Draw each creature with 2D tile body silhouettes
      creatures.forEach((c) => {
        c.phase += 0.045 * c.speed;
        // Natural gentle steering
        c.heading += Math.sin(time * 0.7 + c.phase) * 0.012;

        // Keep inside canvas bounds softly
        const pad = 120;
        if (c.x < pad) c.heading += 0.02;
        if (c.x > width - pad) c.heading -= 0.02;
        if (c.y < pad) c.heading += 0.02;
        if (c.y > height - pad) c.heading -= 0.02;

        c.vx = Math.cos(c.heading) * c.speed;
        c.vy = Math.sin(c.heading) * c.speed;
        c.x += c.vx;
        c.y += c.vy;

        // Wrap around bounds
        if (c.x < -c.length) c.x = width + c.length;
        if (c.x > width + c.length) c.x = -c.length;
        if (c.y < -c.length) c.y = height + c.length;
        if (c.y > height + c.length) c.y = -c.length;

        // Spine segments computation
        const numSegs = c.type === 'small_fish' ? 20 : 30;
        const cell = c.type === 'small_fish' ? 9 : 11;
        const segLen = c.length / numSegs;

        // Precompute spine points with sinusoidal traveling wave
        const spine: { x: number; y: number; angle: number }[] = [];
        let currX = c.x;
        let currY = c.y;

        for (let i = 0; i < numSegs; i++) {
          const t = i / numSegs;
          // Realistic swimming wave: amplitude grows from head to tail
          const waveAmp = Math.sin(c.phase - i * 0.36) * Math.pow(t, 1.25) * (c.length * 0.2);
          const segAngle = c.heading + Math.sin(c.phase - i * 0.3) * 0.16 * Math.pow(t, 1.1);

          const normX = -Math.sin(segAngle);
          const normY = Math.cos(segAngle);

          spine.push({
            x: currX + normX * waveAmp,
            y: currY + normY * waveAmp,
            angle: segAngle,
          });

          currX += Math.cos(c.heading) * segLen;
          currY += Math.sin(c.heading) * segLen;
        }

        // Draw 2D bodily tiles along spine
        ctx.font = `bold ${cell - 2}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numSegs; i++) {
          const seg = spine[i];
          const t = i / numSegs;

          // Silhouette half-width (in cells)
          let bodyHw = 0;
          let pecHw = 0;
          let isHammer = false;

          if (c.type === 'hammerhead') {
            if (i <= 2) {
              bodyHw = 6; // Wide Hammerhead T-Bar!
              isHammer = true;
            } else if (i <= 4) {
              bodyHw = 2; // Neck
            } else if (i <= 14) {
              bodyHw = Math.round(3 + Math.sin(((i - 4) / 10) * Math.PI) * 2.5);
              if (i >= 8 && i <= 11) pecHw = Math.round((11 - Math.abs(i - 9.5) * 2) * 0.7);
            } else if (i <= 23) {
              bodyHw = Math.max(1, Math.round(3.5 - (i - 14) * 0.28));
            } else {
              // Crescent tail fin
              const tailT = (i - 24) / 5;
              bodyHw = Math.max(1, Math.round(tailT * 5));
            }
          } else if (c.type === 'great_white') {
            if (i <= 4) {
              bodyHw = Math.max(1, Math.round(i * 1.1)); // Pointed snout
            } else if (i <= 15) {
              bodyHw = Math.round(4 + Math.sin(((i - 4) / 11) * Math.PI) * 2.8);
              if (i >= 8 && i <= 12) pecHw = Math.round((12 - Math.abs(i - 10) * 2) * 0.8);
            } else if (i <= 23) {
              bodyHw = Math.max(1, Math.round(4.2 - (i - 15) * 0.35));
            } else {
              // Broad caudal tail fin
              const tailT = (i - 24) / 5;
              bodyHw = Math.max(1, Math.round(tailT * 5.2));
            }
          } else {
            // Agile pilot fish
            if (i <= 3) bodyHw = Math.max(1, i);
            else if (i <= 11) bodyHw = Math.round(2.5 + Math.sin(((i - 3) / 8) * Math.PI) * 1.5);
            else if (i <= 15) bodyHw = Math.max(1, Math.round(2.5 - (i - 11) * 0.35));
            else bodyHw = Math.max(1, Math.round(((i - 15) / 4) * 3));
          }

          const totalHw = Math.max(bodyHw, bodyHw + pecHw);
          const normX = -Math.sin(seg.angle);
          const normY = Math.cos(seg.angle);

          for (let lat = -totalHw; lat <= totalHw; lat++) {
            const isBody = Math.abs(lat) <= bodyHw;
            const isPec = pecHw > 0 && Math.abs(lat) > bodyHw && Math.abs(lat) <= bodyHw + pecHw;
            const isTail = i >= numSegs - 6 && Math.abs(lat) >= 1;

            if (!isBody && !isPec && !isTail) continue;

            // Center of this tile
            const tx = seg.x + normX * (lat * cell);
            const ty = seg.y + normY * (lat * cell);

            if (tx < -cell || tx > width + cell || ty < -cell || ty > height + cell) continue;

            // Color selection based on region
            let paletteItem = TILE_PALETTE[0];
            const distRatio = Math.abs(lat) / Math.max(1, totalHw);

            if (isHammer && Math.abs(lat) >= 4) {
              // Eyes on hammerhead tips: dark charcoal tile
              paletteItem = TILE_PALETTE[5];
            } else if (isPec || isTail) {
              // Fin tips: pastel teal, lavender, or dusty rose
              const finColorIdx = (i + Math.abs(lat)) % 5;
              paletteItem = TILE_PALETTE[finColorIdx];
            } else if (lat > 1) {
              // Pale belly side
              paletteItem = (i % 2 === 0) ? TILE_PALETTE[7] : TILE_PALETTE[0];
            } else if (lat < -1) {
              // Dorsal/darker flank
              paletteItem = (i % 3 === 0) ? TILE_PALETTE[5] : TILE_PALETTE[6];
            } else {
              // Mid-body chromatic variety
              const cIdx = (i * 2 + Math.abs(lat) * 3) % TILE_PALETTE.length;
              paletteItem = TILE_PALETTE[cIdx];
            }

            // Draw rounded square tile
            const r = 2.5;
            const sz = cell - 1.5;
            const x0 = tx - sz / 2;
            const y0 = ty - sz / 2;

            ctx.save();
            ctx.fillStyle = paletteItem.bg;
            ctx.strokeStyle = paletteItem.border;
            ctx.lineWidth = 0.8;

            ctx.beginPath();
            ctx.roundRect(x0, y0, sz, sz, r);
            ctx.fill();
            ctx.stroke();

            // Draw ASCII glyph inside tile
            const charIdx = (i * 7 + Math.abs(lat) * 5) % GLYPHS.length;
            const glyph = GLYPHS[charIdx];

            ctx.fillStyle = paletteItem.text;
            ctx.fillText(glyph, tx, ty + 0.5);
            ctx.restore();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
