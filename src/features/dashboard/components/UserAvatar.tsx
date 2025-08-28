interface UserAvatarProps {
    firstName: string;
    lastName: string;
    size?: "sm" | "md" | "lg";
    variant?: "primary" | "accent";
}

export function UserAvatar({
    firstName,
    lastName,
    size = "md",
    variant = "primary"
}: UserAvatarProps) {
    const getInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-lg"
    };

    const variantClasses = {
        primary: "bg-primary/20 text-primary",
        accent: "bg-accent/20 text-accent"
    };

    return (
        <div className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full flex items-center justify-center font-semibold shrink-0`}>
            {getInitials(firstName, lastName)}
        </div>
    );
}