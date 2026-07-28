import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      className = "",
      children,
      type = "button",
      disabled,
      ...rest
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex min-h-11 min-w-11 items-center justify-center rounded-control px-4 py-2 font-medium motion-safe-transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-50";
    const variantClasses = {
      primary:
        "bg-primary text-white shadow-soft hover:bg-primary-hover",
      secondary:
        "bg-surface text-primary shadow-soft hover:bg-[var(--primary-soft)] hover:text-[var(--background)]",
      outline:
        "border border-[var(--border)] bg-transparent text-primary hover:bg-surface-elevated",
    }[variant];

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
