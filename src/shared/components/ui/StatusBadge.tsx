import { Badge } from "./badge"
import { cn } from "@/lib/utils"

// Tipos de estado que maneja el sistema
export type StatusType = 
  // Sistema de 4 pasos
  | 'INGRESO'           // Paso 1 - Azul
  | 'ATENCION'          // Paso 2 - Amarillo  
  | 'EN_TRATAMIENTO'    // Paso 3 - Naranja
  | 'ALTA_MEDICA'       // Paso 4 - Verde
  // Estados especiales
  | 'CANCELLED'         // Cancelado - Rojo
  | 'NO_SHOW'           // No asistió - Gris
  | 'CIRUGIA'           // Cirugía - Rojo
  | 'DERIVADO'          // Derivado - Rojo
  // Estados de turnos
  | 'SCHEDULED'         // Programado - Azul
  | 'COMPLETED'         // Completado - Verde

type StatusVariant =
  | "step-1"
  | "step-2"
  | "step-3"
  | "step-4"
  | "cancelled"
  | "no-show"
  | "surgery"
  | "referred"

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

// Mapeo de estados a variantes de Badge
const statusVariantMap: Record<StatusType, StatusVariant> = {
  // Sistema de 4 pasos
  'INGRESO': 'step-1',
  'ATENCION': 'step-2', 
  'EN_TRATAMIENTO': 'step-3',
  'ALTA_MEDICA': 'step-4',
  // Estados especiales
  'CANCELLED': 'cancelled',
  'NO_SHOW': 'no-show',
  'CIRUGIA': 'surgery',
  'DERIVADO': 'referred',
  // Estados de turnos
  'SCHEDULED': 'step-1',
  'COMPLETED': 'step-4'
}

// Mapeo de estados a etiquetas legibles
const statusLabelMap: Record<StatusType, string> = {
  // Sistema de 4 pasos
  'INGRESO': 'Ingreso',
  'ATENCION': 'Atención',
  'EN_TRATAMIENTO': 'En Tratamiento',
  'ALTA_MEDICA': 'Alta Médica',
  // Estados especiales
  'CANCELLED': 'Cancelado',
  'NO_SHOW': 'No asistió',
  'CIRUGIA': 'Cirugía',
  'DERIVADO': 'Derivado',
  // Estados de turnos
  'SCHEDULED': 'Programado',
  'COMPLETED': 'Completado'
}

export function StatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  const variant = statusVariantMap[status as StatusType]
  const label = statusLabelMap[status as StatusType]

  if (!variant || !label) {
    console.warn(`StatusBadge: Estado desconocido "${status}"`)
    return (
      <Badge variant="outline" className={cn("text-xs", className)}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge 
      variant={variant}
      className={cn("text-xs", className)}
    >
      {label}
    </Badge>
  )
}

// Hook para obtener información del estado
export function useStatusInfo(status: StatusType) {
  return {
    variant: statusVariantMap[status],
    label: statusLabelMap[status],
    isValid: statusVariantMap[status] !== undefined
  }
}