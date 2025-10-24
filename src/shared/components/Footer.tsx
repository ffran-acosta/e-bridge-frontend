'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={cn(
      "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "px-6 py-4 text-center text-sm text-muted-foreground",
      "transition-colors duration-200",
      className
    )}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-4 text-xs">
            <span>© {currentYear} All rights reserved</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">e-Bridge</span>
            <span className="text-muted-foreground">by</span>
            <span className="font-semibold text-white">SHM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
