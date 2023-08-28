import { useContext } from "react";

import { Context } from "@/providers/FiltersProvider";

export default function useFilters() {
  return useContext(Context);
}
