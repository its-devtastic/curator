import React, { useMemo } from "react";
import { nanoid } from "nanoid";

const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  help,
  hint,
  error,
  className,
  ...props
}) => {
  const id = useMemo(() => nanoid(8), []);

  return (
    <div className={className}>
      <div className="flex justify-between mb-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold flex items-center"
          >
            {label}
          </label>
        )}
        {hint && (
          <div className="text-gray-500 cursor-default text-xs">{hint}</div>
        )}
      </div>

      {React.cloneElement(children, { valid: !error, id, ...props })}

      {help && !error && (
        <div className="mt-1 text-xs text-gray-500 cursor-default">{help}</div>
      )}
      {error && (
        <div className="mt-1 text-sm text-rose-500 cursor-default">{error}</div>
      )}
    </div>
  );
};

export default FormField;

export interface FormFieldProps {
  children: React.ReactElement;
  label?: React.ReactNode;
  help?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
}
