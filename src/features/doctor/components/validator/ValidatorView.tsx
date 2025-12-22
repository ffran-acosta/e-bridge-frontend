'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared';
import { CredentialCard } from './CredentialCard';
import { ActionButtons } from './ActionButtons';
import { TransactionsTable } from './TransactionsTable';
import { TransactionFiltersComponent } from './components/TransactionFilters';
import { TransactionPagination } from './components/TransactionPagination';
import { ValidateStatusModal } from './modals/ValidateStatusModal';
import { useValidatorStore } from '@/features/doctor/store/validatorStore';

export function ValidatorView() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  
  // Store de Zustand para transacciones
  const {
    transactions,
    pagination,
    loading: isLoading,
    error,
    filters,
    fetchTransactions,
    updateFilters,
    applyFilters,
    setPage,
    setLimit,
    clearFilters,
  } = useValidatorStore();

  // Cargar transacciones al montar el componente
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleCancel = (transactionId: string, idTransaccion?: string | null) => {
    // TODO: Implementar anulación de consulta
    console.log('Anular transacción:', transactionId, idTransaccion);
    // Aquí se llamará al endpoint de anulación
  };

  const handleRecover = (transactionId: string, idAutorizacion?: string | null) => {
    // TODO: Implementar recuperación de autorización
    console.log('Recuperar autorización:', transactionId, idAutorizacion);
    // Aquí se llamará al endpoint de recuperación
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 py-4 sm:py-6 lg:py-8 px-2 sm:px-4 lg:px-0">
      {/* Credencial con logo Avalian - clickeable para expandir/colapsar */}
      <CredentialCard 
        logoType="avalian-1" 
        isExpanded={isExpanded}
        onToggle={handleToggleExpanded}
      />

      {/* Botones de acción principales - directamente debajo de la credencial */}
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ActionButtons
            onValidateStatus={handleValidateStatus}
            onAuthorize={handleAuthorize}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Funcionalidades expandidas */}
      {isExpanded && (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Listado de transacciones y autorizaciones */}
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">Historial de Transacciones y Autorizaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              {/* Filtros */}
              <TransactionFiltersComponent
                filters={filters}
                onFiltersChange={updateFilters}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                isLoading={isLoading}
              />

              {/* Error */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              {/* Tabla de transacciones */}
              <TransactionsTable
                transactions={transactions}
                onCancel={handleCancel}
                onRecover={handleRecover}
                isLoading={isLoading}
              />

              {/* Paginación */}
              {pagination && pagination.total > 0 && (
                <TransactionPagination
                  pagination={pagination}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                  isLoading={isLoading}
                />
              )}
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

