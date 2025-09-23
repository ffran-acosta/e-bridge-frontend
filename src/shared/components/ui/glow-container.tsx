import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface GlowContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string;
  glowSize?: number;
  children: React.ReactNode;
}

export function GlowContainer({ 
  className, 
  glowColor = 'rgba(59, 130, 246, 0.3)',
  glowSize = 80,
  children,
  ...props 
}: GlowContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const glow = glowRef.current;

    if (!container || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '1';
      glow.style.display = 'block';
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
      setTimeout(() => {
        if (glow) glow.style.display = 'none';
      }, 200);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      {...props}
    >
      {children}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-200"
        style={{
          width: `${glowSize}px`,
          height: `${glowSize}px`,
          background: `radial-gradient(circle, ${glowColor} 0%, ${glowColor}40 50%, transparent 80%)`,
          filter: 'blur(8px)',
          zIndex: 10,
          display: 'none',
        }}
      />
    </div>
  );
}
