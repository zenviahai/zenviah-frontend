import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#635BFF]/10 text-[#635BFF]",
        secondary:
          "border-[#E8EAF0] bg-[#F8F9FC] text-[#4A5060]",
        success:
          "border-[#16A36A]/20 bg-[#16A36A]/10 text-[#16A36A]",
        warning:
          "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#D97706]",
        destructive:
          "border-[#E5484D]/20 bg-[#E5484D]/10 text-[#E5484D]",
        outline:
          "border-[#E8EAF0] bg-white text-[#171923]",
        dark:
          "border-transparent bg-[#111318] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

