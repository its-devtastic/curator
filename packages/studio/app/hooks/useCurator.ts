import { useContext } from "react";

import { Context } from "@/providers/CuratorProvider";

export default function useCurator() {
  return useContext(Context);
}
