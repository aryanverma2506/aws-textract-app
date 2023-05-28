import React, { useRef, useState } from "react";

import Button from "../Button/Button";

interface InputProps extends React.PropsWithChildren {
  id: string | number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number;
  style?: React.CSSProperties;
  accept?: string;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  callback?: (...args: any) => void;
}

const Input: React.FC<InputProps> = (props) => {
  const {
    id,
    min,
    max,
    step,
    type,
    label,
    value,
    style,
    accept,
    disabled,
    className,
    placeholder,
    children,
    onInput,
    onChange,
    callback,
  } = props;
  const [filePickerBtnValue, setFilePickerBtnValue] = useState<string>(
    label || "Choose an image"
  );
  const filePickerRef = useRef<HTMLInputElement>(null);

  function pickFileHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let file: File;
    if (event.target.files && event.target.files.length === 1) {
      file = event.target.files[0];
      filePickerRef.current && (filePickerRef.current.value = "");
      setFilePickerBtnValue(() => file.name);
      callback && callback(file);
    }
  }

  return (
    <>
      {type === "file" ? (
        <>
          <label htmlFor={id.toString()}>{filePickerBtnValue}</label>
          <input
            id={id.toString()}
            type={type}
            min={min}
            max={max}
            step={step}
            style={style}
            accept={accept}
            ref={filePickerRef}
            disabled={disabled}
            className={className}
            placeholder={placeholder}
            onInput={onInput}
            onChange={pickFileHandler}
          />
          <Button
            id="file-picker-btn"
            type="button"
            disabled={disabled}
            className="btn btn-warning"
            onClick={() => filePickerRef.current?.click()}
          >
            {children}
          </Button>
        </>
      ) : (
        <>
          {label && <label htmlFor={id.toString()}>{label}</label>}
          <input
            id={id.toString()}
            type={type}
            min={min}
            max={max}
            step={step}
            value={value}
            style={style}
            disabled={disabled}
            className={className}
            placeholder={placeholder}
            onInput={onInput}
            onChange={onChange}
          />
        </>
      )}
    </>
  );
};

export default Input;
