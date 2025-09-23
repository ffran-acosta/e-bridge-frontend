import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden hover:shadow-lg",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // ========== SISTEMA DE 4 PASOS ==========
        "step-1":
          "border-transparent bg-[var(--status-step-1)] text-[var(--status-step-1-foreground)] [a&]:hover:bg-[var(--status-step-1)]/90 hover:shadow-[var(--status-step-1)]/30",
        "step-2":
          "border-transparent bg-[var(--status-step-2)] text-[var(--status-step-2-foreground)] [a&]:hover:bg-[var(--status-step-2)]/90 hover:shadow-[var(--status-step-2)]/30",
        "step-3":
          "border-transparent bg-[var(--status-step-3)] text-[var(--status-step-3-foreground)] [a&]:hover:bg-[var(--status-step-3)]/90 hover:shadow-[var(--status-step-3)]/30",
        "step-4":
          "border-transparent bg-[var(--status-step-4)] text-[var(--status-step-4-foreground)] [a&]:hover:bg-[var(--status-step-4)]/90 hover:shadow-[var(--status-step-4)]/30",
        // ========== ESTADOS ESPECIALES ==========
        cancelled:
          "border-transparent bg-[var(--status-cancelled)] text-[var(--status-cancelled-foreground)] [a&]:hover:bg-[var(--status-cancelled)]/90 hover:shadow-[var(--status-cancelled)]/30",
        "no-show":
          "border-transparent bg-[var(--status-no-show)] text-[var(--status-no-show-foreground)] [a&]:hover:bg-[var(--status-no-show)]/90 hover:shadow-[var(--status-no-show)]/30",
        surgery:
          "border-transparent bg-[var(--status-surgery)] text-[var(--status-surgery-foreground)] [a&]:hover:bg-[var(--status-surgery)]/90 hover:shadow-[var(--status-surgery)]/30",
        referred:
          "border-transparent bg-[var(--status-referred)] text-[var(--status-referred-foreground)] [a&]:hover:bg-[var(--status-referred)]/90 hover:shadow-[var(--status-referred)]/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
