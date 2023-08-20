import React from "react";
import { useField } from "formik";

const Field: React.FC<FieldProps> = ({ children, name }) => {
  const [field, meta, helper] = useField(name);

  return React.cloneElement(children, {
    ...field,
    onChange: (valueOrEvent: any) =>
      helper.setValue(valueOrEvent.target?.value ?? valueOrEvent),
    error: meta.touched && meta.error,
  });
};

export default Field;

export interface FieldProps {
  children: React.ReactElement;
  name: string;
}
