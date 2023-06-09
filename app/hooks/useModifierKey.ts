import { useMemo } from "react";

export default function useModifierKey(): {
  label: string;
  value: "metaKey" | "ctrlKey";
} {
  return useMemo(() => {
    return navigator.platform?.indexOf("Mac") === 0 ||
      navigator.platform === "iPhone"
      ? { label: "⌘", value: "metaKey" }
      : { label: "^", value: "ctrlKey" };
  }, []);
}
