import React from "react";
import { cn } from "../../libs/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonStyles = cva(
  "font-semibold text-base capitalize rounded-md duration-200 transition-all",
  {
    variants: {
      variant: {
        primary: "bg-blue-500 hover:bg-blue-600 text-white",
        secondary: "bg-white ring-1 ring-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
        error: "bg-red-500 hover:bg-red-600 text-white",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-sm",
        icon: "size-7 flex items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const Button = ({
  className,
  variant,
  disabled,
  size,
  children,
  ...props
}: ButtonProps & VariantProps<typeof buttonStyles>) => {
  return (
    <button
      className={cn(
        buttonStyles({ variant, size }),
        disabled && "opacity-50 hover:bg-[auto] hover:text-[unset]",
        !disabled && "active:scale-90",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
