import React from "react";
import { CgSpinnerTwoAlt } from "react-icons/cg";

import { cn } from "../utils";

export function Spinner({ className }: SpinnerProps) {
  return <CgSpinnerTwoAlt className={cn("size-4 animate-spin", className)} />;
}

interface SpinnerProps {
  className?: string;
}
