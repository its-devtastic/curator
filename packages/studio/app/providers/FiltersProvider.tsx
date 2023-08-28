import React, { createContext, useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as R from "ramda";
import { useDeepCompareEffect } from "react-use";

import { parseFilterParams, serializeFilterParams } from "@/utils/filters";

type Filters = Record<string, Record<string, string>>;

export const Context = createContext<{
  filters: Filters;
  clearFilters: VoidFunction;
  updateFilter(path: string, value: Filters[""], merge?: boolean): void;
  removeFilter(path: string): void;
}>({} as any);

const FiltersProvider: React.FC<{ children: any }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Filters>(
    parseFilterParams(searchParams)
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const removeFilter = useCallback(
    (path: string) => {
      setFilters(R.dissoc(path, filters));
    },
    [filters]
  );

  const updateFilter = useCallback(
    (path: string, value: Filters[""], merge = false) => {
      const newValue = merge
        ? R.mergeDeepRight(filters[path] ?? {}, value)
        : value;
      const newFilters = R.assoc(path, newValue, filters);

      setFilters(newFilters);
    },
    [filters]
  );

  /**
   * Update search params to match current filters state.
   */
  useDeepCompareEffect(() => {
    setSearchParams((searchParams) => {
      const serialized = serializeFilterParams(filters);

      for (const [param] of searchParams.entries()) {
        if (param.startsWith("filters")) {
          searchParams.delete(param);
        }
      }

      for (const key in serialized) {
        searchParams.set(key, serialized[key]);
      }

      return searchParams;
    });
  }, [filters]);

  return (
    <Context.Provider
      value={{ filters, clearFilters, updateFilter, removeFilter }}
    >
      {children}
    </Context.Provider>
  );
};

export default FiltersProvider;
