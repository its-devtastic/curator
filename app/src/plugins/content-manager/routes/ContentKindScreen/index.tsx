import React from "react";
import { useParams } from "react-router-dom";
import * as R from "ramda";
import useStrapi from "~/hooks/useStrapi";

import ListScreen from "../ListScreen";
import DetailScreen from "../DetailScreen";

const ContentKindScreen: React.FC = () => {
  const { contentTypes } = useStrapi();
  const { apiID } = useParams();
  const contentType = contentTypes.find(R.whereEq({ apiID }));

  return contentType && contentType.kind === "singleType" ? (
    <DetailScreen />
  ) : (
    <ListScreen />
  );
};

export default ContentKindScreen;
