import { useEffect, useRef } from 'react';

interface UseMouseGlowOptions {
  glowColor?: string;
  glowIntensity?: number;
  glowSize?: number;
}

export const useMouseGlow = (options: UseMouseGlowOptions = {}) => {
  const {
    glowColor = 'rgba(59, 130, 246, 0.3)', // Color primario con transparencia
    glowIntensity = 0.5,
    glowSize = 100
  } = options;

  const elementRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    const glow = glowRef.current;

    if (!element || !glow) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      glow.style.opacity = '0';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor, glowIntensity, glowSize]);

  return { elementRef, glowRef };
};
