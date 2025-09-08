"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared";
import { cn } from "@/lib/utils";

interface FormWrapperProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "auth" | "modal";
}

export function FormWrapper({ 
  title, 
  description, 
  children, 
  className,
  variant = "default" 
}: FormWrapperProps) {
  const baseClasses = "space-y-4";
  
  const variantClasses = {
    default: "p-6",
    auth: "p-6 space-y-4",
    modal: "p-0 space-y-4"
  };

  if (variant === "auth") {
    return (
      <div className={cn("w-full min-h-[calc(100vh-4rem)] grid place-items-center p-4")}>
        <Card className="w-full max-w-md">
          <CardHeader>
            {title && <CardTitle className="text-2xl font-semibold">{title}</CardTitle>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </CardHeader>
          <CardContent className={cn(baseClasses, variantClasses[variant], className)}>
            {children}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
