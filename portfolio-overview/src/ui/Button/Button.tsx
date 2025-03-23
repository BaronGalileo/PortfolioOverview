import React from "react";
import classNames from "classnames";

interface ButtonProps {
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  active?: boolean;
}

export const Button = ({
  children = "Default button",
  onClick = () => {},
  className = "",
  disabled = false,
  type = "button",
  active = false,
} : ButtonProps) => {
  return (
    <button
      type={type}
      className={classNames("btn", className, { active })}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};