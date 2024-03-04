import * as R from "ramda";
import React from "react";
import { useParams } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

import { DetailScreen } from "../detail";
import { ListScreen } from "../list";

export function ContentKindScreen() {
  const { contentTypes } = useStrapi();
  const { apiID } = useParams();
  const contentType = contentTypes.find(R.whereEq({ apiID }));

  return (
    contentType &&
    apiID &&
    (contentType.kind === "singleType" ? <DetailScreen /> : <ListScreen />)
  );
}