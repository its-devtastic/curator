import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SessionUser } from "@curatorjs/types";
import { AdminProfile } from "@curatorjs/types";

interface SessionState {
  token: string | null;
  user: SessionUser | null;
  profile: AdminProfile | null;
  setSession(session: {
    token?: string;
    user?: SessionUser;
    profile?: AdminProfile;
  }): void;
  clearSession(): void;
}

const initialState = {
  token: null,
  user: null,
  profile: null,
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
    { name: "curator::session" },
  ),
);

export default useSession;
