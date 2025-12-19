'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { CredentialCard } from './CredentialCard';
import { ActionButtons } from './ActionButtons';
import { TransactionsTable } from './TransactionsTable';
import { ValidateStatusModal } from './modals/ValidateStatusModal';
import type { Transaction } from './types';

export function ValidatorView() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  
  // Placeholder para transacciones - se reemplazará con datos reales del backend
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleValidateStatus = () => {
    setIsValidateModalOpen(true);
  };

  const handleValidateSuccess = (data: any) => {
    console.log('Eligibilidad validada exitosamente:', data);
    // Aquí se puede actualizar el estado o mostrar notificaciones
  };

  const handleAuthorize = () => {
    // TODO: Implementar autorización de consulta
    console.log('Autorizar consulta');
    // Aquí se llamará al endpoint de autorización
  };

  const handleCancel = (transactionId: string, transactionNumber?: string) => {
    // TODO: Implementar anulación de consulta
    console.log('Anular transacción:', transactionId, transactionNumber);
    // Aquí se llamará al endpoint de anulación
  };

  const handleRecover = (transactionId: string, authorizationNumber?: string) => {
    // TODO: Implementar recuperación de autorización
    console.log('Recuperar autorización:', transactionId, authorizationNumber);
    // Aquí se llamará al endpoint de recuperación
  };

  return (
    <div className="space-y-8 py-8">
      {/* Credencial con logo Avalian - clickeable para expandir/colapsar */}
      <CredentialCard 
        logoType="avalian-1" 
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
      />

      {/* Funcionalidades expandidas */}
      {isExpanded && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Botones de acción principales */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Principales</CardTitle>
            </CardHeader>
            <CardContent>
              <ActionButtons
                onValidateStatus={handleValidateStatus}
                onAuthorize={handleAuthorize}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          {/* Listado de transacciones y autorizaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones y Autorizaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionsTable
                transactions={transactions}
                onCancel={handleCancel}
                onRecover={handleRecover}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de validación de estado */}
      <ValidateStatusModal
        isOpen={isValidateModalOpen}
        onClose={() => setIsValidateModalOpen(false)}
        onSuccess={handleValidateSuccess}
      />
    </div>
  );
}

