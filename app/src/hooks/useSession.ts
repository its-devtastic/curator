import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SessionUser } from "~/types/session";

interface SessionState {
  token: string | null;
  user: SessionUser | null;
  setSession(session: { token?: string; user?: SessionUser }): void;
  clearSession(): void;
}

const initialState = {
  token: null,
  user: null,
};

const useSession = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,

      setSession(session) {
        set(session);
      },
      clearSession() {
        set(initialState);
      },
    }),
    { name: "strapion::session" }
  )
);

export default useSession;
