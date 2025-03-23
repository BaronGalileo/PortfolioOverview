import React from "react";
import classNames from "classnames";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

export const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
} : InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={classNames("input", className)}
      disabled={disabled}
    />
  );
};