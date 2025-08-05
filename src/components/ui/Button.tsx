import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "danger" | "success";
  className?: string;
  dataTestId?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  dataTestId,
}: ButtonProps) {
  const baseClasses = "px-2 py-1 rounded-md transition-colors";

  const variantClasses = {
    primary: "bg-gray-300 hover:bg-gray-500 text-black hover:text-white",
    danger: "bg-red-300 hover:bg-red-500 text-black hover:text-white",
    success: "bg-green-300 hover:bg-green-500 text-black hover:text-white",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      data-testid={dataTestId}
    >
      {children}
    </button>
  );
}
