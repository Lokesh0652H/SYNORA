'use client';

import React, { useEffect, useRef } from 'react';

// Tile palette matching the stackedlol aesthetic (refined pastels, slates, and charcoals)
const TILE_PALETTE = [
  { bg: 'rgba(122, 166, 158, 0.88)', text: '#1A332E', border: 'rgba(92, 136, 128, 0.45)' }, // Seafoam teal
  { bg: 'rgba(154, 142, 178, 0.88)', text: '#261F33', border: 'rgba(124, 112, 148, 0.45)' }, // Lavender purple
  { bg: 'rgba(120, 146, 175, 0.88)', text: '#192C3D', border: 'rgba(95, 120, 148, 0.45)' },  // Slate blue
  { bg: 'rgba(196, 168, 122, 0.88)', text: '#382B14', border: 'rgba(166, 138, 92, 0.45)' },  // Warm sand/gold
  { bg: 'rgba(188, 138, 148, 0.88)', text: '#3B1F25', border: 'rgba(158, 108, 118, 0.45)' }, // Dusty rose
  { bg: 'rgba(45, 50, 58, 0.92)',    text: '#E5E8EB', border: 'rgba(25, 28, 33, 0.6)' },    // Dark charcoal
  { bg: 'rgba(78, 86, 98, 0.88)',    text: '#E8ECF0', border: 'rgba(55, 62, 72, 0.5)' },    // Mid slate
  { bg: 'rgba(235, 238, 232, 0.92)', text: '#2D332A', border: 'rgba(202, 205, 198, 0.6)' }, // Pale silver belly
];

const GLYPHS = ['S', 'X', '%', 't', '8', '@', 's', 'x', 'o', '*', '#', ':'];

interface WakeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Creature {
  type: 'hammerhead' | 'great_white' | 'small_fish';
  x: number;
  y: number;
  heading: number;
  targetHeading: number;
  baseSpeed: number;
  length: number;
  phase: number;
  beatFreq: number;
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

    // Three distinct aquatic creatures
    const creatures: Creature[] = [
      {
        type: 'hammerhead',
        x: width * 0.74,
        y: height * 0.28,
        heading: 2.85,
        targetHeading: 2.85,
        baseSpeed: 1.1,
        length: 270,
        phase: 0.2,
        beatFreq: 0.08,
      },
      {
        type: 'great_white',
        x: width * 0.36,
        y: height * 0.68,
        heading: -0.28,
        targetHeading: -0.28,
        baseSpeed: 1.25,
        length: 310,
        phase: 2.4,
        beatFreq: 0.075,
      },
      {
        type: 'small_fish',
        x: width * 0.18,
        y: height * 0.2,
        heading: 0.35,
        targetHeading: 0.35,
        baseSpeed: 1.6,
        length: 125,
        phase: 4.2,
        beatFreq: 0.12,
      },
    ];

    // Wake ripples emitted from tail beats
    const wake: WakeParticle[] = [];

    // Ambient background drifting particles
    const ambientBubbles = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      char: ['·', ':', '+', '~', '°'][Math.floor(Math.random() * 5)],
      speed: 0.15 + Math.random() * 0.25,
      alpha: 0.12 + Math.random() * 0.2,
    }));

    const render = () => {
      time += 0.02;
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
      ambientBubbles.forEach((b) => {
        b.x += b.speed;
        if (b.x > width + 20) b.x = -20;
        ctx.fillStyle = `rgba(135, 140, 132, ${b.alpha})`;
        ctx.fillText(b.char, b.x, b.y + Math.sin(time + b.x * 0.01) * 3);
      });

      // 3. Update and draw wake particles
      for (let i = wake.length - 1; i >= 0; i--) {
        const p = wake[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const progress = p.life / p.maxLife;
        const currentAlpha = p.alpha * (1 - progress);

        if (progress >= 1) {
          wake.splice(i, 1);
          continue;
        }

        ctx.fillStyle = `rgba(140, 150, 142, ${currentAlpha})`;
        ctx.font = '9px ui-monospace, SFMono-Regular, Consolas, monospace';
        ctx.fillText(p.char, p.x, p.y);
      }

      // 4. Update and render creatures with lifelike propulsion kinematics
      creatures.forEach((c) => {
        c.phase += c.beatFreq;

        // Tail-beat thrust surge: fish accelerate forward during the stroke!
        const thrustSurge = Math.abs(Math.sin(c.phase)) * 0.45;
        const currentSpeed = c.baseSpeed * (0.8 + thrustSurge);

        // Gentle wandering & course correction
        c.targetHeading += Math.sin(time * 0.6 + c.phase * 0.5) * 0.01;

        // Soft boundary avoidance
        const pad = 120;
        if (c.x < pad) c.targetHeading += 0.03;
        if (c.x > width - pad) c.targetHeading -= 0.03;
        if (c.y < pad) c.targetHeading += 0.03;
        if (c.y > height - pad) c.targetHeading -= 0.03;

        // Smooth turning interpolation
        c.heading += (c.targetHeading - c.heading) * 0.04;

        // Forward movement
        c.x += Math.cos(c.heading) * currentSpeed;
        c.y += Math.sin(c.heading) * currentSpeed;

        // Wrap around canvas bounds
        if (c.x < -c.length) c.x = width + c.length;
        if (c.x > width + c.length) c.x = -c.length;
        if (c.y < -c.length) c.y = height + c.length;
        if (c.y > height + c.length) c.y = -c.length;

        // Multi-segment spine calculation with retrograde traveling wave (Lighthill kinematics)
        const numSegs = c.type === 'small_fish' ? 22 : 32;
        const cell = c.type === 'small_fish' ? 9 : 11;
        const segLen = c.length / numSegs;

        const spine: { x: number; y: number; angle: number; waveOffset: number }[] = [];
        let currX = c.x;
        let currY = c.y;

        // Head counter-yaw: head oscillates in counter-phase with smaller amplitude
        const headYaw = -Math.sin(c.phase) * 0.08;

        for (let i = 0; i < numSegs; i++) {
          const t = i / numSegs;
          // Traveling wave: phase increases backward along the spine
          const waveLag = i * 0.38;
          // Wave amplitude grows exponentially from nose (nearly 0) to caudal fin (large)
          const waveAmp = Math.sin(c.phase - waveLag) * Math.pow(t, 1.4) * (c.length * 0.22);
          const segAngle = c.heading + headYaw * (1 - t) + Math.sin(c.phase - waveLag) * 0.22 * Math.pow(t, 1.15);

          const normX = -Math.sin(segAngle);
          const normY = Math.cos(segAngle);

          spine.push({
            x: currX + normX * waveAmp,
            y: currY + normY * waveAmp,
            angle: segAngle,
            waveOffset: waveAmp,
          });

          currX += Math.cos(c.heading) * segLen;
          currY += Math.sin(c.heading) * segLen;
        }

        // Emit wake bubbles from caudal tail tip occasionally
        if (Math.random() < 0.18) {
          const tail = spine[numSegs - 1];
          wake.push({
            x: tail.x,
            y: tail.y,
            vx: -Math.cos(tail.angle) * 0.5 + (Math.random() - 0.5) * 0.3,
            vy: -Math.sin(tail.angle) * 0.5 + (Math.random() - 0.5) * 0.3,
            char: ['o', '°', '~', '·'][Math.floor(Math.random() * 4)],
            alpha: 0.35,
            life: 0,
            maxLife: 40 + Math.floor(Math.random() * 25),
          });
        }

        // Render 2D tiles along the spine with local tangent rotation
        ctx.font = `bold ${cell - 2}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < numSegs; i++) {
          const seg = spine[i];

          // Silhouette half-width (in cells)
          let bodyHw = 0;
          let pecHw = 0;
          let isHammer = false;

          if (c.type === 'hammerhead') {
            if (i <= 2) {
              bodyHw = 6; // Wide Hammerhead T-Bar head
              isHammer = true;
            } else if (i <= 4) {
              bodyHw = 2; // Narrow neck
            } else if (i <= 14) {
              bodyHw = Math.round(3 + Math.sin(((i - 4) / 10) * Math.PI) * 2.5);
              // Dynamic pectoral fins with flutter
              if (i >= 8 && i <= 11) {
                const finFlutter = Math.sin(c.phase * 1.5 + i) * 0.5;
                pecHw = Math.round((11 - Math.abs(i - 9.5) * 2) * 0.7 + finFlutter);
              }
            } else if (i <= 24) {
              bodyHw = Math.max(1, Math.round(3.5 - (i - 14) * 0.26));
            } else {
              // 2-lobed tail fin
              const tailT = (i - 24) / (numSegs - 25);
              bodyHw = Math.max(1, Math.round(tailT * 5.2));
            }
          } else if (c.type === 'great_white') {
            if (i <= 4) {
              bodyHw = Math.max(1, Math.round(i * 1.15)); // Pointed snout
            } else if (i <= 15) {
              bodyHw = Math.round(4.2 + Math.sin(((i - 4) / 11) * Math.PI) * 2.8);
              // Pectoral fins
              if (i >= 8 && i <= 12) {
                const finFlutter = Math.sin(c.phase * 1.5 + i) * 0.5;
                pecHw = Math.round((12 - Math.abs(i - 10) * 2) * 0.8 + finFlutter);
              }
            } else if (i <= 24) {
              bodyHw = Math.max(1, Math.round(4.2 - (i - 15) * 0.34));
            } else {
              // Crescent tail fin
              const tailT = (i - 24) / (numSegs - 25);
              bodyHw = Math.max(1, Math.round(tailT * 5.5));
            }
          } else {
            // Agile pilot fish
            if (i <= 3) bodyHw = Math.max(1, i);
            else if (i <= 11) bodyHw = Math.round(2.6 + Math.sin(((i - 3) / 8) * Math.PI) * 1.6);
            else if (i <= 16) bodyHw = Math.max(1, Math.round(2.6 - (i - 11) * 0.36));
            else bodyHw = Math.max(1, Math.round(((i - 16) / 5) * 3.2));
          }

          const totalHw = Math.max(bodyHw, bodyHw + pecHw);
          const normX = -Math.sin(seg.angle);
          const normY = Math.cos(seg.angle);

          for (let lat = -totalHw; lat <= totalHw; lat++) {
            const isBody = Math.abs(lat) <= bodyHw;
            const isPec = pecHw > 0 && Math.abs(lat) > bodyHw && Math.abs(lat) <= bodyHw + pecHw;
            const isTail = i >= numSegs - 6 && Math.abs(lat) >= 1;

            if (!isBody && !isPec && !isTail) continue;

            const tx = seg.x + normX * (lat * cell);
            const ty = seg.y + normY * (lat * cell);

            if (tx < -cell || tx > width + cell || ty < -cell || ty > height + cell) continue;

            // Palette selection
            let paletteItem = TILE_PALETTE[0];

            if (isHammer && Math.abs(lat) >= 4) {
              paletteItem = TILE_PALETTE[5]; // Hammer eyes
            } else if (isPec || isTail) {
              const finIdx = (i + Math.abs(lat)) % 5;
              paletteItem = TILE_PALETTE[finIdx];
            } else if (lat > 1) {
              paletteItem = (i % 2 === 0) ? TILE_PALETTE[7] : TILE_PALETTE[0];
            } else if (lat < -1) {
              paletteItem = (i % 3 === 0) ? TILE_PALETTE[5] : TILE_PALETTE[6];
            } else {
              const cIdx = (i * 2 + Math.abs(lat) * 3) % TILE_PALETTE.length;
              paletteItem = TILE_PALETTE[cIdx];
            }

            const r = 2.5;
            const sz = cell - 1.5;

            // Render tile rotated to the local spine tangent angle for fluid skin bending!
            ctx.save();
            ctx.translate(tx, ty);
            ctx.rotate(seg.angle);

            ctx.fillStyle = paletteItem.bg;
            ctx.strokeStyle = paletteItem.border;
            ctx.lineWidth = 0.8;

            ctx.beginPath();
            ctx.roundRect(-sz / 2, -sz / 2, sz, sz, r);
            ctx.fill();
            ctx.stroke();

            const charIdx = (i * 7 + Math.abs(lat) * 5) % GLYPHS.length;
            const glyph = GLYPHS[charIdx];

            ctx.fillStyle = paletteItem.text;
            ctx.fillText(glyph, 0, 0.5);
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
