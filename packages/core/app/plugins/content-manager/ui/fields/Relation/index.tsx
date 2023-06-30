import React from "react";
import * as R from "ramda";

import { Entity } from "~/types/content";

import useStrapi from "~/hooks/useStrapi";

import ToOne from "./ToOne";
import ToMany from "./ToMany";
import { FieldDefinition } from "~/types/contentTypeConfig";

const Relation: React.FC<{
  field: FieldDefinition;
  attribute: {
    mappedBy: string;
    inversedBy: string;
    relationType: "oneToOne" | "oneToMany";
    targetModel: string;
  };
  onChange(mutation: {
    set:
      | (number | string)[]
      | { id: number | string; position: { before: number | string } }[];
  }): void;
  value: Entity | null;
}> = ({ attribute, field, ...props }) => {
  const { contentTypes } = useStrapi();
  const targetModelApiID = contentTypes.find(
    R.whereEq({ uid: attribute.targetModel })
  )?.apiID;
  const apiID =
    attribute.mappedBy ||
    contentTypes.find(
      R.where({ info: R.whereEq({ pluralName: attribute.inversedBy }) })
    )?.apiID;

  if (!targetModelApiID) {
    console.error(`No content type with apiID ${targetModelApiID}`);
  }

  return !targetModelApiID ? null : attribute.relationType === "oneToOne" ? (
    <ToOne
      targetModelApiID={targetModelApiID}
      renderItem={field.renderItem}
      {...props}
    />
  ) : ["oneToMany", "manyToMany"].includes(attribute.relationType) ? (
    <ToMany
      apiID={apiID!}
      targetModelApiID={targetModelApiID}
      renderItem={field.renderItem}
      name={field.path}
      {...props}
    />
  ) : null;
};

export default Relation;
