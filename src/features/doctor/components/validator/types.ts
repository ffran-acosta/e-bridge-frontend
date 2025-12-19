// Tipo para transacciones/autorizaciones (placeholder - se actualizará con los tipos reales del backend)
export interface Transaction {
  id: string;
  transactionNumber?: string;
  authorizationNumber?: string;
  type: 'AUTHORIZATION' | 'TRANSACTION';
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
  date: string;
  patientName?: string;
  consultationType?: string;
  // Otros campos que vengan del backend
}
