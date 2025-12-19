'use client';

import React from 'react';
import { XCircle, RotateCcw, List } from 'lucide-react';
import { Button } from '@/shared';
import { Badge } from '@/shared/components/ui/badge';
import type { Transaction } from './types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onCancel: (transactionId: string, transactionNumber?: string) => void;
  onRecover: (transactionId: string, authorizationNumber?: string) => void;
  isLoading?: boolean;
}

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

  const getStatusBadge = (status: Transaction['status']) => {
    const variants = {
      'ACTIVE': 'default' as const,
      'CANCELLED': 'destructive' as const,
      'COMPLETED': 'secondary' as const,
    };
    
    const labels = {
      'ACTIVE': 'Activa',
      'CANCELLED': 'Anulada',
      'COMPLETED': 'Completada',
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-muted-foreground">Cargando transacciones...</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay transacciones o autorizaciones registradas</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="border-b">
            <th className="text-left p-3 font-medium">Tipo</th>
            <th className="text-left p-3 font-medium">Número</th>
            <th className="text-left p-3 font-medium">Fecha</th>
            <th className="text-left p-3 font-medium hidden md:table-cell">Paciente</th>
            <th className="text-left p-3 font-medium hidden lg:table-cell">Consulta</th>
            <th className="text-left p-3 font-medium">Estado</th>
            <th className="text-left p-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id}
              className="border-b hover:bg-muted/30 transition-colors"
            >
              <td className="p-3">
                <Badge variant="outline">
                  {transaction.type === 'AUTHORIZATION' ? 'Autorización' : 'Transacción'}
                </Badge>
              </td>
              <td className="p-3 font-mono text-sm">
                {transaction.transactionNumber || transaction.authorizationNumber || '-'}
              </td>
              <td className="p-3 text-sm">
                {formatDate(transaction.date)}
              </td>
              <td className="p-3 text-sm hidden md:table-cell">
                {transaction.patientName || '-'}
              </td>
              <td className="p-3 text-sm hidden lg:table-cell">
                {transaction.consultationType || '-'}
              </td>
              <td className="p-3">
                {getStatusBadge(transaction.status)}
              </td>
              <td className="p-3">
                <div className="flex gap-2">
                  {transaction.status === 'ACTIVE' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onCancel(transaction.id, transaction.transactionNumber)}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Anular
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRecover(transaction.id, transaction.authorizationNumber)}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Recuperar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
