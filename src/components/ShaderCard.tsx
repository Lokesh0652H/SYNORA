'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

export type ShaderTheme = 'blue' | 'purple' | 'emerald' | 'amber' | 'magenta' | 'ruby' | 'slate';

export interface ShaderCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  theme?: ShaderTheme;
  href?: string;
  onClick?: () => void;
  badge?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const THEME_GRADIENTS: Record<ShaderTheme, { base: string; iconBg: string; iconColor: string; shader: string[] }> = {
  blue: {
    base: '#1e40af',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    shader: ['#1d4ed8', '#2563eb', '#3b82f6', '#1e3a8a', '#172554'],
  },
  purple: {
    base: '#581c87',
    iconBg: '#faf5ff',
    iconColor: '#9333ea',
    shader: ['#6b21a8', '#7e22ce', '#9333ea', '#3b0764', '#1f033a'],
  },
  emerald: {
    base: '#064e3b',
    iconBg: '#ecfdf5',
    iconColor: '#059669',
    shader: ['#047857', '#059669', '#10b981', '#064e3b', '#022c22'],
  },
  amber: {
    base: '#78350f',
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    shader: ['#b45309', '#d97706', '#f59e0b', '#78350f', '#451a03'],
  },
  magenta: {
    base: '#701a75',
    iconBg: '#fdf4ff',
    iconColor: '#c026d3',
    shader: ['#86198f', '#a21caf', '#c026d3', '#4a044e', '#2e0231'],
  },
  ruby: {
    base: '#881337',
    iconBg: '#fff1f2',
    iconColor: '#e11d48',
    shader: ['#be123c', '#e11d48', '#f43f5e', '#4c0519', '#2b020d'],
  },
  slate: {
    base: '#1e293b',
    iconBg: '#f8fafc',
    iconColor: '#475569',
    shader: ['#334155', '#475569', '#64748b', '#0f172a', '#020617'],
  },
};

export default function ShaderCard({
  title,
  description,
  icon,
  theme = 'blue',
  href,
  onClick,
  badge,
  actions,
  meta,
  children,
  className = '',
}: ShaderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const animProgress = useRef(0);
  const animFrame = useRef<number | null>(null);

  const themeConfig = THEME_GRADIENTS[theme] || THEME_GRADIENTS.blue;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth progress animation
      const targetProgress = hovered ? 1 : 0;
      animProgress.current += (targetProgress - animProgress.current) * 0.12;

      if (animProgress.current > 0.005) {
        time += 0.03;
        const w = canvas.width;
        const h = canvas.height;
        const maxRadius = Math.hypot(w, h) * 1.1;
        const radius = animProgress.current * maxRadius;

        const cx = mousePos.current.x * w;
        const cy = mousePos.current.y * h;

        ctx.save();
        // Create expanding circle mask from cursor
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        // Fluid gradient background
        const grad = ctx.createRadialGradient(
          cx + Math.sin(time) * 40,
          cy + Math.cos(time * 0.8) * 40,
          10,
          cx,
          cy,
          radius * 1.2
        );

        const colors = themeConfig.shader;
        grad.addColorStop(0, colors[1]);
        grad.addColorStop(0.35, colors[0]);
        grad.addColorStop(0.7, colors[3]);
        grad.addColorStop(1, colors[4]);

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Fluid organic marble distortion ripples
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const wavePhase = time + i * 1.8;
          const rx = w * 0.4 + Math.sin(wavePhase * 0.9) * 60;
          const ry = h * 0.4 + Math.cos(wavePhase * 1.1) * 60;
          const rGrad = ctx.createRadialGradient(
            cx + Math.cos(wavePhase) * 50,
            cy + Math.sin(wavePhase) * 50,
            20,
            cx,
            cy,
            radius * 0.9
          );
          rGrad.addColorStop(0, `${colors[2]}44`);
          rGrad.addColorStop(0.6, `${colors[0]}22`);
          rGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = rGrad;
          ctx.ellipse(cx + Math.sin(wavePhase) * 40, cy + Math.cos(wavePhase) * 40, rx, ry, wavePhase * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrame.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, [hovered, themeConfig]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  };

  const content = (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`relative overflow-hidden rounded-[24px] p-6 sm:p-7 transition-all duration-300 ease-out border cursor-pointer select-none group ${
        hovered
          ? 'border-transparent shadow-[0_20px_40px_-15px_rgba(0,0,0,0.22)] -translate-y-1'
          : 'bg-white border-[#E8E6DF] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:border-[#D5D3CB]'
      } ${className}`}
    >
      {/* Background Fluid Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none rounded-[24px]"
      />

      {/* Card Content (z-index 10) */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top Icon Badge & optional status pill */}
        <div className="flex items-center justify-between mb-5">
          {icon && (
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:-rotate-3 ${
                hovered
                  ? 'bg-white/20 text-white shadow-inner backdrop-blur-md'
                  : 'text-current shadow-2xs'
              }`}
              style={{
                backgroundColor: hovered ? undefined : themeConfig.iconBg,
                color: hovered ? '#FFFFFF' : themeConfig.iconColor,
              }}
            >
              {icon}
            </div>
          )}

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {badge && (
              <span
                className={`text-[11px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full border transition-colors duration-300 ${
                  hovered
                    ? 'bg-white/20 text-white border-white/30'
                    : 'bg-[#F4F3EE] text-[#6E7067] border-black/[0.06]'
                }`}
              >
                {badge}
              </span>
            )}
            {actions}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-300 mb-2 ${
            hovered ? 'text-white' : 'text-[#1E201D]'
          }`}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className={`text-xs sm:text-sm leading-relaxed transition-colors duration-300 line-clamp-3 mb-4 flex-1 ${
            hovered ? 'text-white/85' : 'text-[#6C6E66]'
          }`}
        >
          {description}
        </p>

        {children}

        {/* Meta / Footer */}
        {meta && (
          <div
            className={`mt-auto pt-3 border-t text-xs transition-colors duration-300 ${
              hovered ? 'border-white/20 text-white/80' : 'border-[#F0EFEB] text-[#8C8E85]'
            }`}
          >
            {meta}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
