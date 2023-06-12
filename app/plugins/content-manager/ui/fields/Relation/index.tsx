import React from "react";
import * as R from "ramda";

import { Entity } from "~/types/content";

import useStrapi from "~/hooks/useStrapi";

import ToOne from "./ToOne";
import ToMany from "./ToMany";

const Relation: React.FC<{
  config: {
    mappedBy: string;
    inversedBy: string;
    relationType: "oneToOne" | "oneToMany";
    targetModel: string;
    renderItem(): React.ReactNode;
  };
  onChange(mutation: {
    set: number[] | { id: number; position: { before: number } }[];
  }): void;
  value: Entity | null;
  name: string;
}> = ({ config, name, ...props }) => {
  const { contentTypes } = useStrapi();
  const targetModelApiID = contentTypes.find(
    R.whereEq({ uid: config.targetModel })
  )?.apiID;
  const apiID =
    config.mappedBy ||
    contentTypes.find(
      R.where({ info: R.whereEq({ pluralName: config.inversedBy }) })
    )?.apiID;

  if (!targetModelApiID) {
    console.error(`No content type with apiID ${targetModelApiID}`);
  }

  return !targetModelApiID ? null : config.relationType === "oneToOne" ? (
    <ToOne
      targetModelApiID={targetModelApiID}
      renderItem={config.renderItem}
      {...props}
    />
  ) : ["oneToMany", "manyToMany"].includes(config.relationType) ? (
    <ToMany
      apiID={apiID!}
      targetModelApiID={targetModelApiID}
      renderItem={config.renderItem}
      name={name}
      {...props}
    />
  ) : null;
};

export default Relation;
