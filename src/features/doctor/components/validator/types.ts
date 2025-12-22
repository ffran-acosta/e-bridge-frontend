// Tipos para transacciones de Avalian
export type OperationType = 'ELG' | 'AP' | 'ATR' | 'RA' | 'LT';
export type TransactionStatus = 'OK' | 'NO' | 'PEND' | null;

export interface Transaction {
  id: string;
  operationType: OperationType;
  codigoSocio: string;
  nombreSocio: string | null;
  status: TransactionStatus;
  idTransaccion: string | null;
  idAutorizacion: string | null;
  mensaje: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResponse {
  transacciones: Transaction[];
  pagination: TransactionPagination;
}

// Filtros para transacciones
export interface TransactionFilters {
  page?: number;
  limit?: number;
  operationType?: OperationType;
  status?: TransactionStatus;
  codigoSocio?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  idTransaccion?: string;
  idAutorizacion?: string;
}
