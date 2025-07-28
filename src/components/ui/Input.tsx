import React from "react";

type InputProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
}: InputProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border-2 px-2 py-1 ${className}`}
      />
    </div>
  );
}