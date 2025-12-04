'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Nfc, SmartphoneNfc } from 'lucide-react';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared';

// Error boundary simple para debugging
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Componente de credencial individual
interface CredentialCardProps {
  logoType: 'avalian-1' | 'avalian-2' | 'nfc';
  onValidate: () => void;
}

function CredentialCard({ logoType, onValidate }: CredentialCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tarjeta tipo crédito con efecto metalizado */}
      <div className="relative aspect-[2.1/1] rounded-xl overflow-hidden shadow-2xl">
        {/* Efecto metalizado con degradado más oscuro */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/10 to-transparent"></div>
        
        {/* Brillo metalizado animado - más rápido */}
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
                />
              ) : logoType === 'avalian-2' ? (
                <Image
                  src="/logos/avalian-logo-2.png"
                  alt="Avalian Logo"
                  width={180}
                  height={90}
                  className="object-contain"
                />
              ) : null}
            </div>

            {/* Icono NFC a la derecha */}
            <div className="flex items-center justify-end">
              <SmartphoneNfc className="text-gray-300" size={50} />
            </div>
          </div>

          {/* Botón Validar en la parte inferior centrado */}
          <div className="flex justify-center">
            <Button
              onClick={onValidate}
              className="bg-gray-700/90 text-white hover:bg-gray-600 px-8 py-2 rounded-md font-medium transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30"
            >
              Validar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ValidatorView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleValidate = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Verificar que el componente se renderice
  React.useEffect(() => {
    console.log('✅ ValidatorView componente montado');
  }, []);

  return (
    <div className="space-y-12 py-8">
      {/* Credencial con logo Avalian */}
      <CredentialCard logoType="avalian-1" onValidate={handleValidate} />

      {/* Modal de validación (placeholder por ahora) */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Validar Credencial</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              El modal de validación se implementará próximamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

