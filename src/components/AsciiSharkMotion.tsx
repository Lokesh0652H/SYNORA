'use client';

import React, { useEffect, useRef } from 'react';

// Tile palette matching the stackedlol aesthetic (rich pastels, oceanic slates, charcoals, and warm golds)
const TILE_PALETTE = {
  seafoam:   { bg: '#5EA89B', border: '#428579', text: '#0D332C' },
  lavender:  { bg: '#9688B8', border: '#78699E', text: '#241640' },
  slate:     { bg: '#5E7796', border: '#455C7A', text: '#132336' },
  charcoal:  { bg: '#2B313A', border: '#1A1E24', text: '#F0F4F8' },
  gold:      { bg: '#D8A858', border: '#B58739', text: '#3E2905' },
  coral:     { bg: '#D17C8B', border: '#AF5A69', text: '#42141D' },
  belly:     { bg: '#EBF0E8', border: '#C8CEC4', text: '#263024' },
  eye:       { bg: '#111317', border: '#000000', text: '#FFFFFF' },
};

const GLYPHS = ['S', 'Y', 'N', 'O', 'R', 'A', 'X', '%', '#', '8', '*', 't'];

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

interface Creature {
  type: 'hammerhead' | 'great_white' | 'pilot_fish';
  x: number;
  y: number;
  heading: number;
  targetHeading: number;
  speed: number;
  turnSpeed: number;
  numSegs: number;
  cell: number;
  segLen: number;
  phase: number;
  beatFreq: number;
  waveAmp: number;
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

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || 600;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize 3 distinct aquatic creatures with natural screen-spanning sizes
    const creatures: Creature[] = [
      {
        type: 'hammerhead',
        x: width * 0.75,
        y: height * 0.32,
        heading: 2.8,
        targetHeading: 2.8,
        speed: 1.5,
        turnSpeed: 0.015,
        numSegs: 18,
        cell: 20,
        segLen: 20,
        phase: 0.4,
        beatFreq: 0.065,
        waveAmp: 34,
      },
      {
        type: 'great_white',
        x: width * 0.28,
        y: height * 0.72,
        heading: -0.35,
        targetHeading: -0.35,
        speed: 1.7,
        turnSpeed: 0.012,
        numSegs: 20,
        cell: 21,
        segLen: 21,
        phase: 3.1,
        beatFreq: 0.06,
        waveAmp: 36,
      },
      {
        type: 'pilot_fish',
        x: width * 0.18,
        y: height * 0.22,
        heading: 0.5,
        targetHeading: 0.5,
        speed: 2.2,
        turnSpeed: 0.025,
        numSegs: 12,
        cell: 14,
        segLen: 14,
        phase: 1.2,
        beatFreq: 0.09,
        waveAmp: 22,
      },
    ];

    const bubbles: Bubble[] = [];

    // Helper: Draw single stylized ASCII tile
    const drawTile = (
      tx: number,
      ty: number,
      angle: number,
      size: number,
      palette: { bg: string; border: string; text: string },
      glyph: string
    ) => {
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(angle);

      const r = Math.max(2, size * 0.2);
      const half = size / 2;

      // Drop subtle shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;

      ctx.fillStyle = palette.bg;
      ctx.strokeStyle = palette.border;
      ctx.lineWidth = 1;

      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-half, -half, size, size, r);
      } else {
        ctx.rect(-half, -half, size, size);
      }
      ctx.fill();
      ctx.stroke();

      // Clear shadow before drawing glyph
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = palette.text;
      ctx.fillText(glyph, 0, 0.5);

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Update and render wake bubbles
      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bubble = bubbles[b];
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        bubble.alpha *= 0.96;
        bubble.life++;

        if (bubble.life > bubble.maxLife || bubble.alpha < 0.02) {
          bubbles.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = bubble.alpha;
        ctx.fillStyle = '#6E8B99';
        ctx.font = `${bubble.size}px ui-monospace, SFMono-Regular, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bubble.char, bubble.x, bubble.y);
        ctx.restore();
      }

      // 2. Animate and render each aquatic creature
      creatures.forEach((c) => {
        // Advance swimming tail-beat oscillation
        c.phase += c.beatFreq;

        // Tail stroke creates pulsed forward thrust surges (accelerates at mid-stroke)
        const thrustSurge = Math.pow(Math.abs(Math.cos(c.phase)), 1.5) * 0.55;
        const currentSpeed = c.speed + thrustSurge;

        // Smooth natural steering wander
        if (Math.random() < 0.015) {
          c.targetHeading += (Math.random() - 0.5) * 0.7;
        }

        // Avoid screen edges gently
        const margin = 120;
        if (c.x < margin) c.targetHeading = Math.abs(c.targetHeading);
        if (c.x > width - margin) c.targetHeading = Math.PI - Math.abs(c.targetHeading);
        if (c.y < margin) c.targetHeading = Math.abs(c.targetHeading) + 0.3;
        if (c.y > height - margin) c.targetHeading = -Math.abs(c.targetHeading) - 0.3;

        let diff = c.targetHeading - c.heading;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        c.heading += diff * c.turnSpeed;

        // Forward movement along heading
        c.x += Math.cos(c.heading) * currentSpeed;
        c.y += Math.sin(c.heading) * currentSpeed;

        // Wrap around bounds with generous padding
        const totalLen = c.numSegs * c.segLen;
        if (c.x < -totalLen) c.x = width + totalLen;
        if (c.x > width + totalLen) c.x = -totalLen;
        if (c.y < -totalLen) c.y = height + totalLen;
        if (c.y > height + totalLen) c.y = -totalLen;

        // Head counter-yaw: head oscillates slightly out of phase with tail
        const headYaw = -Math.sin(c.phase) * 0.07;

        // 3. Compute organic spine vertebrae trailing BEHIND the snout
        const spine: { x: number; y: number; angle: number; waveOffset: number }[] = [];

        for (let i = 0; i < c.numSegs; i++) {
          const t = i / c.numSegs; // 0 at head, 1 at tail
          // Retrograde travelling wave along spine (phase lag increases backward)
          const waveLag = i * 0.45;
          // Wave amplitude is near 0 at snout, growing strongly toward caudal fin
          const waveOffset = Math.sin(c.phase - waveLag) * Math.pow(t, 1.45) * c.waveAmp;

          // Head points forward; body curves with wave
          const segAngle = c.heading + headYaw * (1 - t) + Math.cos(c.phase - waveLag) * 0.3 * Math.pow(t, 1.2);

          // Position trails backwards from head (c.x, c.y) along the heading
          const baseX = c.x - Math.cos(c.heading) * (i * c.segLen);
          const baseY = c.y - Math.sin(c.heading) * (i * c.segLen);

          // Perpendicular vector for lateral undulation
          const perpX = -Math.sin(c.heading);
          const perpY = Math.cos(c.heading);

          spine.push({
            x: baseX + perpX * waveOffset,
            y: baseY + perpY * waveOffset,
            angle: segAngle,
            waveOffset,
          });
        }

        // Recompute local segment angles based on neighboring vertebrae for natural spine curvature
        for (let i = 0; i < c.numSegs; i++) {
          if (i === 0) {
            spine[0].angle = c.heading + headYaw;
          } else {
            const prev = spine[i - 1];
            const curr = spine[i];
            spine[i].angle = Math.atan2(prev.y - curr.y, prev.x - curr.x);
          }
        }

        // 4. Emit wake bubbles and turbulence ripples from tail tip
        if (Math.random() < 0.22) {
          const tail = spine[c.numSegs - 1];
          bubbles.push({
            x: tail.x + (Math.random() - 0.5) * 8,
            y: tail.y + (Math.random() - 0.5) * 8,
            vx: -Math.cos(tail.angle) * 0.8 + (Math.random() - 0.5) * 0.4,
            vy: -Math.sin(tail.angle) * 0.8 + (Math.random() - 0.5) * 0.4,
            char: ['o', '°', '·', '~', 'x'][Math.floor(Math.random() * 5)],
            size: Math.floor(9 + Math.random() * 6),
            alpha: 0.35,
            life: 0,
            maxLife: 45 + Math.floor(Math.random() * 30),
          });
        }

        // 5. Render 2D Anatomical Tile Silhouettes
        ctx.font = `bold ${Math.floor(c.cell * 0.65)}px ui-monospace, SFMono-Regular, Consolas, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < c.numSegs; i++) {
          const seg = spine[i];

          // Determine half-width lateral cells for anatomy
          let bodyHw = 1;
          let pecHw = 0;
          let isHammerTBar = false;

          if (c.type === 'hammerhead') {
            if (i <= 1) {
              bodyHw = 5; // Wide T-Bar cephalofoil head (11 tiles wide!)
              isHammerTBar = true;
            } else if (i <= 3) {
              bodyHw = 2; // Tapered neck
            } else if (i <= 8) {
              bodyHw = Math.round(3.2 + Math.sin(((i - 3) / 6) * Math.PI) * 1.5);
              // Large pectoral wings
              if (i >= 5 && i <= 7) {
                pecHw = 4; // Swept wings
              }
            } else if (i <= 13) {
              bodyHw = Math.max(1, Math.round(3.5 - (i - 8) * 0.4));
            } else {
              // 2-lobed caudal tail fin
              const tTail = (i - 13) / (c.numSegs - 14);
              bodyHw = Math.round(1 + tTail * 4.5);
            }
          } else if (c.type === 'great_white') {
            if (i <= 2) {
              bodyHw = Math.max(1, i + 1); // Conical pointed snout
            } else if (i <= 9) {
              bodyHw = Math.round(3.5 + Math.sin(((i - 2) / 7) * Math.PI) * 1.8);
              // Swept pectoral wings
              if (i >= 5 && i <= 8) {
                pecHw = 5;
              }
            } else if (i <= 15) {
              bodyHw = Math.max(1, Math.round(4.0 - (i - 9) * 0.45));
            } else {
              // Crescent tail fin
              const tTail = (i - 15) / (c.numSegs - 16);
              bodyHw = Math.round(1 + tTail * 4.8);
            }
          } else {
            // Agile pilot fish
            if (i <= 2) bodyHw = i + 1;
            else if (i <= 6) bodyHw = 3;
            else if (i <= 9) bodyHw = 2;
            else bodyHw = Math.round(1 + ((i - 9) / 3) * 2.5); // fan tail
          }

          const totalHw = Math.max(bodyHw, bodyHw + pecHw);
          const normX = -Math.sin(seg.angle);
          const normY = Math.cos(seg.angle);

          for (let lat = -totalHw; lat <= totalHw; lat++) {
            const absLat = Math.abs(lat);
            const isBody = absLat <= bodyHw;
            const isPec = pecHw > 0 && absLat > bodyHw && absLat <= bodyHw + pecHw;
            const isTail = i >= c.numSegs - 4 && absLat >= 1;

            if (!isBody && !isPec && !isTail) continue;

            const tx = seg.x + normX * (lat * (c.cell * 0.95));
            const ty = seg.y + normY * (lat * (c.cell * 0.95));

            // Viewport clipping check
            if (tx < -c.cell || tx > width + c.cell || ty < -c.cell || ty > height + c.cell) continue;

            // Anatomical Color Selection
            let palette = TILE_PALETTE.slate;

            if (isHammerTBar && absLat === bodyHw) {
              // Hammerhead lateral eye tiles
              palette = TILE_PALETTE.eye;
            } else if (isPec) {
              // Pectoral fin tiles (vibrant seafoam or lavender)
              palette = c.type === 'hammerhead' ? TILE_PALETTE.seafoam : TILE_PALETTE.lavender;
            } else if (isTail) {
              // Tail fin tiles
              palette = lat > 0 ? TILE_PALETTE.coral : TILE_PALETTE.gold;
            } else if (lat < -1) {
              // Dorsal dark spine
              palette = TILE_PALETTE.charcoal;
            } else if (lat > 1) {
              // Ventral pale belly
              palette = TILE_PALETTE.belly;
            } else {
              // Midline flank
              if (c.type === 'hammerhead') {
                palette = i % 2 === 0 ? TILE_PALETTE.seafoam : TILE_PALETTE.slate;
              } else if (c.type === 'great_white') {
                palette = i % 2 === 0 ? TILE_PALETTE.lavender : TILE_PALETTE.slate;
              } else {
                palette = i % 2 === 0 ? TILE_PALETTE.gold : TILE_PALETTE.coral;
              }
            }

            const glyphIdx = (i * 5 + absLat * 3) % GLYPHS.length;
            const glyph = isHammerTBar && absLat === bodyHw ? '•' : GLYPHS[glyphIdx];

            drawTile(tx, ty, seg.angle, c.cell - 2, palette, glyph);
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
