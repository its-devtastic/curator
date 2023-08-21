import { create } from "zustand";

import type { SessionUser } from "@curatorjs/studio";

interface BridgeState {
  token: string | null;
  user: SessionUser | null;
  studioUrl: string | null;
  strapiUrl: string | null;
  setState(state: Partial<BridgeState>): void;
}

const initialState = {
  token: null,
  user: null,
  studioUrl: null,
  strapiUrl: null,
};

const useBridge = create<BridgeState>()((set) => ({
  ...initialState,

  setState(state) {
    set(state);
  },
}));

export default useBridge;
