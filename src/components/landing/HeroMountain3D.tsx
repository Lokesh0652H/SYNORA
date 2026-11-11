'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function HeroMountain3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [activePin, setActivePin] = useState<number | null>(null);

  // Track mouse coordinates relative to container center
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouse((prev) => ({ ...prev, targetX: x, targetY: y }));
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({ ...prev, targetX: 0, targetY: 0 }));
    setActivePin(null);
  };

  // Smooth lerp animation loop for subtle 3D parallax tilt & topographical lines
  useEffect(() => {
    let animId: number;
    let currentX = 0;
    let currentY = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let time = 0;

    const render = () => {
      currentX += (mouse.targetX - currentX) * 0.08;
      currentY += (mouse.targetY - currentY) * 0.08;
      setMouse((prev) => ({ ...prev, x: currentX, y: currentY }));

      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Render architectural limestone topographical contour rings
      const numRings = 9;
      const centerX = width / 2 + currentX * 45;
      const centerY = height * 0.62 + currentY * 35;

      for (let r = numRings; r >= 1; r--) {
        const radX = (r * width * 0.052) + Math.sin(time + r * 0.4) * 4;
        const radY = (r * height * 0.042) + Math.cos(time + r * 0.3) * 3;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY - (numRings - r) * 7, radX, radY, 0, 0, Math.PI * 2);

        // Elegant warm limestone / ivory stroke and subtle fill
        ctx.strokeStyle = r % 2 === 0 ? 'rgba(214, 201, 181, 0.45)' : 'rgba(222, 218, 208, 0.35)';
        ctx.lineWidth = 1;
        ctx.setLineDash(r % 3 === 0 ? [4, 6] : []);
        ctx.stroke();

        if (r === 2 || r === 5) {
          ctx.fillStyle = 'rgba(239, 235, 226, 0.25)';
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [mouse.targetX, mouse.targetY]);

  const pins = [
    {
      id: 1,
      label: 'Summit · Synthesized Core',
      metric: '0.00% Divergence',
      top: '18%',
      left: '50%',
      desc: 'Topographical peak of grounded reasoning with SHA-256 provenance signature.',
    },
    {
      id: 2,
      label: 'Col · Multi-Source Triangulation',
      metric: '42 Chunks Cross-Linked',
      top: '48%',
      left: '26%',
      desc: 'Cross-notebook relationship bridge between arXiv preprints and clinical reports.',
    },
    {
      id: 3,
      label: 'Base · Empirical Grounding',
      metric: 'Page 8, §4.2 Citation',
      top: '64%',
      left: '74%',
      desc: 'Direct tamper-evident reference to original PDF source text passage.',
    },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[840px] mx-auto h-[380px] sm:h-[460px] md:h-[500px] flex items-center justify-center select-none overflow-visible group cursor-crosshair"
    >
      {/* Background Topographical Contours Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Layered Architectural Limestone Mountain Centerpiece */}
      <div
        className="relative z-10 w-full max-w-[580px] px-4 transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) rotateY(${mouse.x * 12}deg) rotateX(${-mouse.y * 12}deg) translateY(${mouse.y * 10}px)`,
        }}
      >
        <div className="relative flex items-center justify-center animate-float-slow">
          <Image
            src="/illustrations/hero_mountain.png"
            alt="Architectural limestone mountain peak"
            width={600}
            height={380}
            priority
            className="w-full h-auto object-contain filter contrast-105 drop-shadow-[0_20px_40px_rgba(32,32,29,0.06)]"
          />

          {/* Interactive Scientific Coordinate Markers */}
          {pins.map((pin) => {
            const isHovered = activePin === pin.id;
            return (
              <div
                key={pin.id}
                style={{ top: pin.top, left: pin.left }}
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
              >
                {/* Micro Pulsing Coordinate Node */}
                <button
                  type="button"
                  aria-label={pin.label}
                  className="relative flex items-center justify-center w-7 h-7 rounded-full bg-[#FBFAF6] border border-[#DEDAD0] shadow-sm hover:border-[#20201D] hover:scale-115 transition-all duration-200 group/pin"
                >
                  <span className="w-2 h-2 rounded-full bg-[#20201D]" />
                  <span className="absolute inset-0 rounded-full border border-[#20201D]/20 animate-ping opacity-75" />
                </button>

                {/* Floating Scientific Annotation Popover */}
                <div
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 rounded-xl bg-[#FBFAF6] border border-[#DEDAD0] shadow-[0_12px_30px_-6px_rgba(32,32,29,0.12)] text-left transition-all duration-200 pointer-events-none ${
                    isHovered ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-1'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#858875] tracking-widest uppercase mb-1">
                    {pin.metric}
                  </div>
                  <div className="text-xs font-semibold text-[#20201D] mb-1">
                    {pin.label}
                  </div>
                  <p className="text-[11px] text-[#77756E] leading-relaxed">
                    {pin.desc}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-[#FBFAF6] border-r border-b border-[#DEDAD0] rotate-45" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Coordinate Badge at Bottom Center */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-[#FBFAF6]/80 border border-[#DEDAD0] text-[10px] font-mono text-[#77756E] tracking-wider uppercase backdrop-blur-xs flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#858875] animate-pulse" />
        <span>TOPOGRAPHICAL GROUNDING · ELEV. 2,840M · 47.3769° N</span>
      </div>
    </div>
  );
}
