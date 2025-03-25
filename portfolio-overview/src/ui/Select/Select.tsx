import classNames from "classnames";

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export const Select = ({
  options,
  value,
  onChange,
  className = "",
  disabled = false,
} : SelectProps) => {
  return (
    <select
      className={classNames("select", className)}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};