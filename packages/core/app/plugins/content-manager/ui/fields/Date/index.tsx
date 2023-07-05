import React from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const DateField: React.FC<any> = ({
  value,
  onChange,
  attribute,
  field,
  ...props
}) => {
  return (
    <DatePicker
      format={(s) => s.format(attribute.type === "date" ? "L" : "L HH:mm")}
      showTime={
        attribute.type === "datetime"
          ? { minuteStep: 10, showSecond: false }
          : false
      }
      {...props}
      value={value && dayjs(value)}
      onChange={(value) => {
        onChange(
          value &&
            (attribute.type === "date"
              ? value.format("YYYY-MM-DD")
              : value.toISOString())
        );
      }}
    />
  );
};

export default DateField;
