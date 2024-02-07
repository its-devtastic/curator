"use client";

import * as React from "react";
import { useTranslation } from "react-i18next";
import { PiCheck } from "react-icons/pi";
import { RxCaretSort } from "react-icons/rx";

import { cn } from "../utils";
import { Button } from "./Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./Command";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

export function Combobox({
  options,
  value,
  onChange,
  renderOption,
  placeholder,
  emptySearch,
  noResults,
  keepOpen,
}: ComboboxProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedOption
            ? renderOption?.(selectedOption) ?? selectedOption.label
            : placeholder}
          <RxCaretSort className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={emptySearch ?? t("common.search")} />
          <CommandEmpty>{noResults ?? t("phrases.no_results")}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange?.(currentValue === value ? "" : currentValue);
                  !keepOpen && setOpen(false);
                }}
              >
                <PiCheck
                  className={cn(
                    "mr-2 size-4",
                    value === option.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {renderOption?.(option) ?? option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange?(value: string): void;
  renderOption?(option: { label: string; value: string }): React.ReactNode;
  keepOpen?: boolean;
  placeholder?: string;
  emptySearch?: string;
  noResults?: string;
}
