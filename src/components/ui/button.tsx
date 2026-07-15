import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[15.5px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        accent: "bg-[var(--acc)] text-[#07130C] hover:brightness-95",
        outline:
          "bg-black/25 border-[1.5px] border-white/45 text-white hover:bg-black/35",
        whatsapp: "bg-[#25D366] text-[#062B14] hover:brightness-95",
        ghost:
          "bg-transparent border-[1.5px] border-[#C9C5BA] text-[#1A1C1E] hover:bg-black/5",
      },
      size: {
        default: "h-[54px] px-[22px]",
        sm: "h-11 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "accent",
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
