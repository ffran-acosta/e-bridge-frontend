"use client";

import { UserAvatar } from "@/shared/components";
import { Badge } from "@/shared";
import { cn } from "@/lib/utils";

// Props más específicas y agrupadas
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
}

interface UserDisplay {
  title: string;
  subtitle: string;
  additionalInfo?: string;
}

interface UserActions {
  onToggleStatus?: () => void;
  onSelect?: () => void;
  onEdit?: () => void;
}

interface UserBadge {
  id: string;
  label: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  onRemove?: (id: string) => void;
}

interface UserCardConfig {
  showStatusToggle?: boolean;
  showAssignments?: boolean;
  isSelected?: boolean;
  avatarVariant?: "primary" | "accent";
  className?: string;
}

interface BaseUserCardProps {
  user: UserData;
  display: UserDisplay;
  actions?: UserActions;
  badges?: UserBadge[];
  config?: UserCardConfig;
}

export function BaseUserCard({
  user,
  display,
  actions,
  badges = [],
  config = {}
}: BaseUserCardProps) {
  const {
    showStatusToggle = true,
    showAssignments = true,
    isSelected = false,
    avatarVariant = "primary",
    className
  } = config;

  return (
    <div
      className={cn(
        "p-4 rounded-lg border transition-all",
        isSelected
          ? "border-primary bg-primary/10 cursor-pointer"
          : user.isActive
          ? "border-border bg-card hover:bg-accent/50 cursor-pointer"
          : "border-border bg-muted/50 opacity-75 cursor-pointer",
        className
      )}
      onClick={actions?.onSelect}
    >
      <div className="flex items-start space-x-4">
        <UserAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          variant={avatarVariant}
        />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {display.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {display.subtitle}
              </p>
              {display.additionalInfo && (
                <p className="text-sm text-muted-foreground">
                  {display.additionalInfo}
                </p>
              )}
            </div>

            {showStatusToggle && actions?.onToggleStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  actions.onToggleStatus!();
                }}
                className="ml-2"
              >
                <div className={cn(
                  "w-12 h-6 rounded-full transition-colors",
                  user.isActive ? "bg-green-500" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "w-5 h-5 bg-white rounded-full shadow transform transition-transform",
                    user.isActive ? "translate-x-6" : "translate-x-0.5"
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
