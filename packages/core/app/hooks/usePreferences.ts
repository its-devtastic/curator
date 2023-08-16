import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as R from "ramda";

interface PreferenceState {
  preferences: Record<string, any>;
  setPreference(key: string, value: any): void;
}

const initialState = {
  preferences: {
    // Automatically save drafts after changes
    autosave: true,
    mediaLibrary: {
      listView: "list",
      popoverView: "grid",
    },
    darkMode: false,
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
      name: "curator::preferences",
      merge: (persisted: any = {}, current) =>
        R.mergeDeepRight(current, persisted),
    }
  )
);

export default usePreferences;
