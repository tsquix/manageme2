import React from "react";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  className?: string;
  disabled: boolean;
  dataTestId: string;
};

export default function Select({
  label,
  name,
  value,
  onChange,
  options,
  className = "",
  disabled,
  dataTestId,
}: SelectProps) {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border-2 px-2 py-1 text-black ${className}`}
        data-testid={dataTestId}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
