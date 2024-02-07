import { useState } from "react";
import { useDebounce, useUnmount } from "react-use";

export default function useDebouncedState(delay: number = 500) {
  const [state, setState] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(state);
    },
    delay,
    [state],
  );

  useUnmount(cancel);

  return [state, setState, debouncedValue];
}
