import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as R from "ramda";

interface DashboardState {
  recentlyOpened: { apiID: string; id: string }[];
  addRecentlyOpened(apiID: string, id: string): void;
}

const initialState = {
  recentlyOpened: [],
};

const useDashboard = create<DashboardState>()(
  persist(
    (set) => ({
      ...initialState,

      addRecentlyOpened(apiID, id) {
        set(
          R.evolve({
            recentlyOpened: R.pipe(
              R.prepend({ apiID, id }),
              R.uniqBy(({ apiID, id }) => apiID + id),
              R.take<{ apiID: string; id: string }>(5)
            ),
          })
        );
      },
    }),
    { name: "curator::dashboard" }
  )
);

export default useDashboard;
