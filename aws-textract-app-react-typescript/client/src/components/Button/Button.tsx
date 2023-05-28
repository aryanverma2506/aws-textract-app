import React from "react";

interface ButtonProps extends React.PropsWithChildren {
  id?: string | number;
  // min?: number;
  // max?: number;
  // step?: number;
  label?: string;
  type?: "button" | "reset" | "submit";
  value?: string | number;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    id,
    //   min,
    //   max,
    //   step,
    type,
    label,
    value,
    disabled,
    className,
    placeholder,
    children,
    onClick,
  } = props;

  return (
    <>
      {label && <label htmlFor={id?.toString()}>{label}</label>}
      <button
        id={id?.toString()}
        type={type}
        //   min={min}
        //   max={max}
        //   step={step}
        disabled={disabled}
        className={className}
        placeholder={placeholder}
        value={value}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
