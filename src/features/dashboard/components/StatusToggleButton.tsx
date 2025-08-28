import { Button } from "@/shared";
import { UserCheck, UserX } from "lucide-react";

interface StatusToggleButtonProps {
    isActive: boolean;
    onToggle: () => void;
    size?: "sm" | "default";
    disabled?: boolean;
    stopPropagation?: boolean;
}

export function StatusToggleButton({
    isActive,
    onToggle,
    size = "sm",
    disabled = false,
    stopPropagation = false
}: StatusToggleButtonProps) {
    const handleClick = (e: React.MouseEvent) => {
        if (stopPropagation) {
            e.stopPropagation();
        }
        onToggle();
    };

    return (
        <Button
            variant={isActive ? "destructive" : "default"}
            size={size}
            onClick={handleClick}
            disabled={disabled}
            className="shrink-0"
        >
            {isActive ? (
                <>
                    <UserX className="h-4 w-4 mr-2" />
                    Desactivar
                </>
            ) : (
                <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activar
                </>
            )}
        </Button>
    );
}