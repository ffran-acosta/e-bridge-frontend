export const appointmentStatuses = [
  { value: "SCHEDULED", label: "Programado" },
  { value: "COMPLETED", label: "Completado" },
  { value: "CANCELLED", label: "Cancelado" },
  { value: "RESCHEDULED", label: "Reagendado" }
] as const;

export type AppointmentStatus = typeof appointmentStatuses[number]['value'];

export const getAppointmentStatusLabel = (status: string) => {
  const statusObj = appointmentStatuses.find(s => s.value === status);
  return statusObj?.label || status;
};

export const getAppointmentStatusVariant = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    case 'RESCHEDULED':
      return 'outline';
    default:
      return 'outline';
  }
};



