"use client";

import { forwardRef } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/lib/utils';

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'date' | 'datetime-local';
}

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  ({ className, type = 'datetime-local', ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          type={type}
          className={cn(
            "pl-10 pr-4 py-2 h-10 text-sm",
            "bg-background border-border text-foreground",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            "placeholder:text-muted-foreground",
            className
          )}
          ref={ref}
          {...props}
        />
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
    );
  }
);

DateTimeInput.displayName = "DateTimeInput";
