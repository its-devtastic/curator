import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useInterval } from "react-use";

export default function CalendarTime({
  children,
  className,
}: CalendarTimeProps) {
  // eslint-disable-next-line
  const [now, setNow] = useState(dayjs());
  const then = typeof children === "string" ? dayjs(children) : children;
  const format = then.isValid()
    ? now.diff(then, "days") > 2
      ? then.format("L")
      : then.fromNow()
    : "";

  useInterval(() => {
    setNow(dayjs());
  }, 1000);

  return (
    <time
      dateTime={then.isValid() ? then.toISOString() : ""}
      className={className}
    >
      {format}
    </time>
  );
}

interface CalendarTimeProps {
  children: string | Dayjs;
  className?: string;
}
