import { useContext } from "react";

import { Context } from "~/providers/StrapionProvider";

export default function useStrapion() {
  return useContext(Context);
}
