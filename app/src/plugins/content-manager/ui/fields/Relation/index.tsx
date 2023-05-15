import React from "react";

import { Entity } from "~/types/content";

import ToOne from "./ToOne";

const Relation: React.FC<{
  config: {
    relationType: "oneToOne";
    targetModel: string;
    renderItem(): React.ReactNode;
  };
  onChange(mutation: { set: [number] }): void;
  value: Entity | null;
}> = ({ config, ...props }) => {
  return config.relationType === "oneToOne" ? (
    <ToOne
      targetModel={config.targetModel}
      renderItem={config.renderItem}
      {...props}
    />
  ) : null;
};

export default Relation;
