// src/components/Button.tsx
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md text-white font-semibold transition duration-200";
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700",
    danger: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
