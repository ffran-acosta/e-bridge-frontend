"use client";

import { forwardRef } from "react";
import { Label } from "@/shared";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper = forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, error, required = false, className, children }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <Label className={cn(
          "text-sm font-medium text-foreground",
          required && "after:content-['*'] after:ml-0.5 after:text-destructive"
        )}>
          {label}
        </Label>
        {children}
        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}
      </div>
    );
  }
);

FormFieldWrapper.displayName = "FormFieldWrapper";
