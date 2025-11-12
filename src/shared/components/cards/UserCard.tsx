"use client";

import { UserAvatar } from "@/shared/components";
import { Badge } from "@/shared";
import { cn } from "@/lib/utils";

interface UserCardProps {
  // Datos del usuario
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  
  // Información adicional
  subtitle?: string;
  additionalInfo?: string;
  patientsCount?: number;
  
  // Badges/etiquetas
  badges?: Array<{
    id: string;
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    onRemove?: (id: string) => void;
  }>;
  
  // Acciones
  onToggleStatus?: () => void;
  onSelect?: () => void;
  
  // Estado visual
  isSelected?: boolean;
  showStatusToggle?: boolean;
  showAssignments?: boolean;
  
  // Estilos
  className?: string;
  avatarVariant?: "primary" | "accent";
}

export function UserCard({
  firstName,
  lastName,
  email,
  isActive,
  subtitle,
  additionalInfo,
  patientsCount,
  badges = [],
  onToggleStatus,
  onSelect,
  isSelected = false,
  showStatusToggle = true,
  showAssignments = true,
  className,
  avatarVariant = "primary"
}: UserCardProps) {
  const fullName = `${firstName} ${lastName}`;
  const displayName = subtitle?.includes("Dr.") ? fullName : `Dr. ${fullName}`;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isSelected
          ? "border-primary bg-primary/10 cursor-pointer"
          : isActive
          ? "border-border bg-card hover:bg-accent/50 cursor-pointer"
          : "border-border bg-muted/50 opacity-75 cursor-pointer",
        className
      )}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <UserAvatar
          firstName={firstName}
          lastName={lastName}
          variant={avatarVariant}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {displayName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {subtitle || email}
              </p>
              {additionalInfo && (
                <p className="text-sm text-muted-foreground">
                  {additionalInfo}
                  {patientsCount !== undefined && ` • ${patientsCount} pacientes`}
                </p>
              )}
            </div>

            {showStatusToggle && onToggleStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus();
                }}
                className="ml-2"
              >
                {/* StatusToggleButton se puede pasar como prop o importar aquí */}
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors",
                  isActive ? "bg-green-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full shadow transform transition-transform",
                    isActive ? "translate-x-6" : "translate-x-0.5"
                  )} />
                </div>
              </button>
            )}
          </div>

          {/* Badges/Asignaciones */}
          {showAssignments && badges.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Asignado a:</span>
              <div className="flex flex-wrap gap-1">
                {badges.map((badge) => (
                  <Badge
                    key={badge.id}
                    variant={badge.variant || "secondary"}
                    className="text-xs flex items-center space-x-1"
                  >
                    <span>{badge.label}</span>
                    {badge.onRemove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          badge.onRemove?.(badge.id);
                        }}
                        className="ml-1 hover:text-red-400"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
