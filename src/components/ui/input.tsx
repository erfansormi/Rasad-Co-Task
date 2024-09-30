import React from "react";
import { cn } from "../../libs/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputStyles = cva(
  "outline-none border rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "bg-white",
        muted: "bg-neutral-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input = ({
  className,
  variant,
  disabled,
  size,
  ...props
}: InputProps & VariantProps<typeof inputStyles>) => {
  return (
    <input
      className={cn(inputStyles({ variant, size }), className)}
      disabled={disabled}
      {...props}
    />
  );
};

export default Input;
