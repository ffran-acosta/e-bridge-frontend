'use client';

import React from 'react';
import Image from 'next/image';
import { SmartphoneNfc, ChevronDown, ChevronUp } from 'lucide-react';

interface CredentialCardProps {
  logoType: 'avalian-1' | 'avalian-2' | 'nfc';
  isExpanded: boolean;
  onToggle: () => void;
}

export function CredentialCard({ logoType, isExpanded, onToggle }: CredentialCardProps) {
  return (
    <div className="w-full max-w-md mx-auto cursor-pointer" onClick={onToggle}>
      {/* Tarjeta tipo crédito con efecto metalizado */}
      <div className="relative aspect-[2.1/1] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl">
        {/* Efecto metalizado con degradado más oscuro */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent"></div>
        
        {/* Brillo metalizado animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 animate-shimmer"></div>
        
        {/* Contenido de la credencial */}
        <div className="relative h-full p-6 flex flex-col justify-between">
          {/* Parte superior: Logo izquierda y NFC derecha */}
          <div className="flex justify-between items-start">
            {/* Logo Avalian a la izquierda */}
            <div className="flex items-center">
              {logoType === 'avalian-1' ? (
                <Image
                  src="/logos/avalian-logo-1.png"
                  alt="Avalian Logo"
                  width={180}
                  height={90}
                  className="object-contain"
                  style={{ height: 'auto' }}
                />
              ) : logoType === 'avalian-2' ? (
                <Image
                  src="/logos/avalian-logo-2.png"
                  alt="Avalian Logo"
                  width={180}
                  height={90}
                  className="object-contain"
                  style={{ height: 'auto' }}
                />
              ) : null}
            </div>

            {/* Icono NFC a la derecha */}
            <div className="flex items-center justify-end">
              <SmartphoneNfc className="text-gray-300" size={50} />
            </div>
          </div>

          {/* Indicador de expansión - solo la flecha */}
          <div className="flex justify-center items-center">
            {isExpanded ? (
              <ChevronUp className="text-white/90" size={24} />
            ) : (
              <ChevronDown className="text-white/90" size={24} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
