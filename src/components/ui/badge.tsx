import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-800",
        success: "bg-success-light text-success-dark",
        warning: "bg-warning-light text-warning-dark",
        info: "bg-info-light text-info-dark",
        neutral: "bg-neutral-100 text-neutral-700"
      }
    },
    defaultVariants: { variant: "default" }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
