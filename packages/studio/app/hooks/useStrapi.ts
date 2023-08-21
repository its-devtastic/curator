import { useContext } from "react";

import { Context } from "@/providers/StrapiProvider";

export default function useStrapi() {
  return useContext(Context);
}
