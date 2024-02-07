import * as R from "ramda";
import React from "react";
import { PiXBold } from "react-icons/pi";

import { cn } from "../utils";
import { Button } from "./Button";
import { Combobox, ComboboxProps } from "./Combobox";

export default function TagSelect({
  options,
  className,
  value = [],
  onChange,
  ...props
}: TagSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2 flex-wrap empty:hidden">
        {value.map((v) => (
          <Button
            size="sm"
            variant="outline"
            key={v}
            onClick={() => onChange?.(R.without([v], value))}
          >
            {options.find(R.whereEq({ value: v }))?.label}
            <PiXBold className="size-3 ml-2" />
          </Button>
        ))}
      </div>
      <Combobox
        keepOpen
        options={options.filter(
          R.where({ value: (v: string) => !value?.includes(v) }),
        )}
        onChange={(v) =>
          onChange?.(value?.includes(v) ? R.without([v], value) : [...value, v])
        }
        {...props}
      />
    </div>
  );
}

export interface TagSelectProps
  extends Omit<ComboboxProps, "value" | "onChange"> {
  value?: string[];
  onChange?(value: string[]): void;
  className?: string;
}
