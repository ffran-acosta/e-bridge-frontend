import { Badge } from "./badge"
import { cn } from "@/lib/utils"

// Tipos de estado que maneja el sistema
export type StatusType = 
  // Sistema de 4 pasos
  | 'INGRESO'           // Paso 1 - Azul
  | 'ATENCION'          // Paso 2 - Amarillo  
  | 'EN_TRATAMIENTO'    // Paso 3 - Naranja
  | 'ALTA_MEDICA'       // Paso 4 - Verde
  | 'REINGRESO'         // Reingreso - usar mismo estilo que tratamiento
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

// Colores más fuertes por tipo de consulta y estados especiales (con texto negro)
const STATUS_COLOR_CLASSES: Record<string, string> = {
  INGRESO: 'bg-blue-200 border-blue-400',
  ATENCION: 'bg-yellow-200 border-yellow-400',
  ALTA_MEDICA: 'bg-green-200 border-green-400',
  REINGRESO: 'bg-orange-200 border-orange-400',
  CIRUGIA: 'bg-red-200 border-red-400',
  CANCELLED: 'bg-red-200 border-red-400',
  DERIVADO: 'bg-red-200 border-red-400',
  NO_SHOW: 'bg-gray-200 border-gray-400',
  EN_TRATAMIENTO: 'bg-orange-200 border-orange-400',
  SCHEDULED: 'bg-blue-200 border-blue-400',
  COMPLETED: 'bg-green-200 border-green-400',
}

// Mapeo de estados a variantes de Badge
const statusVariantMap: Record<StatusType, StatusVariant> = {
  // Sistema de 4 pasos
  'INGRESO': 'step-1',
  'ATENCION': 'step-2', 
  'EN_TRATAMIENTO': 'step-3',
  'ALTA_MEDICA': 'step-4',
  'REINGRESO': 'step-3',
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
  'REINGRESO': 'Reingreso',
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
  const normalized = String(status).toUpperCase();
  const variant = statusVariantMap[status as StatusType]
  const label = statusLabelMap[status as StatusType]

  // Si es un estado que debe usar el estilo unificado (texto negro y colores suaves)
  const shouldUseUnifiedStyle = STATUS_COLOR_CLASSES[normalized] !== undefined;
  
  if (shouldUseUnifiedStyle) {
    const baseClasses = STATUS_COLOR_CLASSES[normalized] ?? 'bg-gray-200 border-gray-400';
    return (
      <Badge
        variant="outline"
        className={cn(`${baseClasses} text-xs font-medium px-2 py-0.5 rounded-sm text-black`, className)}
      >
        {label || normalized}
      </Badge>
    );
  }

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