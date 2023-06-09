import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as R from "ramda";

interface PreferenceState {
  preferences: Record<string, unknown>;
  setPreference(key: string, value: unknown): void;
}

const initialState = {
  preferences: {
    // Automatically save drafts after changes
    autosave: true,
  },
};

const usePreferences = create<PreferenceState>()(
  persist(
    (set) => ({
      ...initialState,

      setPreference(key, value) {
        set(
          R.evolve({
            preferences: R.assocPath(key.split("."), value),
          })
        );
      },
    }),
    {
      name: "strapion::preferences",
      merge: (persisted: any = {}, current) =>
        R.mergeDeepRight(current, persisted),
    }
  )
);

export default usePreferences;
