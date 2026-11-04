import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default:
          "bg-[#635BFF] text-white shadow-sm hover:bg-[#5249F5] hover:shadow-brand",
        secondary:
          "bg-[#111318] text-white shadow-sm hover:bg-[#1E222B]",
        outline:
          "border border-[#E8EAF0] bg-white text-[#171923] shadow-subtle hover:bg-[#F8F9FC] hover:border-[#D5D9E4]",
        ghost:
          "text-[#171923] hover:bg-[#F1F3F9] hover:text-[#171923]",
        destructive:
          "bg-[#E5484D] text-white shadow-sm hover:bg-[#D13438]",
        success:
          "bg-[#16A36A] text-white shadow-sm hover:bg-[#138A59]",
        soft:
          "bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/15",
        link: "text-[#635BFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-lg px-5 text-sm",
        xl: "h-11 rounded-xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

