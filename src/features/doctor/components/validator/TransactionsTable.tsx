'use client';

import React from 'react';
import { XCircle, RotateCcw, List, MoreVertical } from 'lucide-react';
import { Button } from '@/shared';
import { Badge } from '@/shared/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared';
import { TransactionStatusBadge } from './components/TransactionStatusBadge';
import type { Transaction, OperationType } from './types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onCancel: (transactionId: string, idTransaccion?: string | null) => void;
  onRecover: (transactionId: string, idAutorizacion?: string | null) => void;
  isLoading?: boolean;
}

const operationTypeLabels: Record<OperationType, string> = {
  ELG: 'Elegibilidad',
  AP: 'Autorización',
  ATR: 'Anulación',
  RA: 'Recuperar Autorización',
  LT: 'Listar',
};

const operationTypeColors: Record<OperationType, 'default' | 'secondary' | 'outline'> = {
  ELG: 'default',
  AP: 'secondary',
  ATR: 'outline',
  RA: 'secondary',
  LT: 'outline',
};

export function TransactionsTable({ transactions, onCancel, onRecover, isLoading = false }: TransactionsTableProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };


  const canCancel = (transaction: Transaction) => {
    // Solo se puede anular autorizaciones (AP) que tengan idAutorizacion
    return transaction.operationType === 'AP' && transaction.idAutorizacion !== null;
  };

  const canRecover = (transaction: Transaction) => {
    // Solo se puede recuperar autorizaciones (AP o RA) que tengan idAutorizacion
    return (transaction.operationType === 'AP' || transaction.operationType === 'RA') 
      && transaction.idAutorizacion !== null;
  };

  if (isLoading && (!transactions || transactions.length === 0)) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Cargando transacciones...</span>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay transacciones o autorizaciones registradas</p>
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla para desktop */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-xs sm:text-sm">Tipo</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm">ID Transacción</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm">ID Autorización</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm">Fecha</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm hidden lg:table-cell">Socio</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm hidden xl:table-cell">Código Socio</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm">Estado</th>
                <th className="text-left p-3 font-medium text-xs sm:text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr 
                  key={transaction.id}
                  className="border-b hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3">
                    <Badge variant={operationTypeColors[transaction.operationType]}>
                      {operationTypeLabels[transaction.operationType]}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-xs sm:text-sm">
                    {transaction.idTransaccion || '-'}
                  </td>
                  <td className="p-3 font-mono text-xs sm:text-sm">
                    {transaction.idAutorizacion || '-'}
                  </td>
                  <td className="p-3 text-xs sm:text-sm">
                    {formatDate(transaction.createdAt)}
                  </td>
                  <td className="p-3 text-xs sm:text-sm hidden lg:table-cell">
                    {transaction.nombreSocio || '-'}
                  </td>
                  <td className="p-3 text-xs sm:text-sm font-mono hidden xl:table-cell">
                    {transaction.codigoSocio || '-'}
                  </td>
                  <td className="p-3">
                    <TransactionStatusBadge status={transaction.status} />
                  </td>
                  <td className="p-3">
                    {(canCancel(transaction) || canRecover(transaction)) ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canCancel(transaction) && (
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onCancel(transaction.id, transaction.idAutorizacion)}
                              className="cursor-pointer"
                            >
                              <XCircle className="h-4 w-4" />
                              Anular
                            </DropdownMenuItem>
                          )}
                          {canRecover(transaction) && (
                            <DropdownMenuItem
                              onClick={() => onRecover(transaction.id, transaction.idAutorizacion)}
                              className="cursor-pointer"
                            >
                              <RotateCcw className="h-4 w-4" />
                              Recuperar
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de cards para móviles */}
      <div className="md:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="border rounded-lg p-4 space-y-3 bg-card hover:bg-muted/30 transition-colors"
          >
            {/* Header con tipo y estado */}
            <div className="flex items-center justify-between">
              <Badge variant={operationTypeColors[transaction.operationType]}>
                {operationTypeLabels[transaction.operationType]}
              </Badge>
              <TransactionStatusBadge status={transaction.status} />
            </div>

            {/* Información principal */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">ID Transacción</p>
                  <p className="text-sm font-mono font-medium">
                    {transaction.idTransaccion || '-'}
                  </p>
                </div>
                {transaction.idAutorizacion && (
                  <div className="flex-1 ml-4">
                    <p className="text-xs text-muted-foreground">ID Autorización</p>
                    <p className="text-sm font-mono font-medium">
                      {transaction.idAutorizacion}
                    </p>
                  </div>
                )}
              </div>

              {transaction.nombreSocio && (
                <div>
                  <p className="text-xs text-muted-foreground">Socio</p>
                  <p className="text-sm font-medium">{transaction.nombreSocio}</p>
                </div>
              )}

              {transaction.codigoSocio && (
                <div>
                  <p className="text-xs text-muted-foreground">Código Socio</p>
                  <p className="text-sm font-mono">{transaction.codigoSocio}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm">{formatDate(transaction.createdAt)}</p>
              </div>
            </div>

            {/* Acciones */}
            {(canCancel(transaction) || canRecover(transaction)) && (
              <div className="pt-2 border-t">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center"
                    >
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Acciones
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canCancel(transaction) && (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onCancel(transaction.id, transaction.idAutorizacion)}
                        className="cursor-pointer"
                      >
                        <XCircle className="h-4 w-4" />
                        Anular
                      </DropdownMenuItem>
                    )}
                    {canRecover(transaction) && (
                      <DropdownMenuItem
                        onClick={() => onRecover(transaction.id, transaction.idAutorizacion)}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Recuperar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
