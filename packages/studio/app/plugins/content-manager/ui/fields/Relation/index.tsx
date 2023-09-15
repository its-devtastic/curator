import React from "react";
import * as R from "ramda";
import { useParams } from "react-router-dom";

import { Entity } from "@/types/content";
import { FieldDefinition } from "@/types/contentTypeConfig";

import useStrapi from "@/hooks/useStrapi";

import ToOne from "./ToOne";
import ToMany from "./ToMany";

const Relation: React.FC<{
  field: FieldDefinition;
  attribute: {
    mappedBy: string;
    inversedBy: string;
    relationType: "oneToOne" | "oneToMany" | "manyToOne";
    targetModel: string;
  };
  onChange(mutation: {
    set:
      | (number | string)[]
      | { id: number | string; position: { before: number | string } }[];
  }): void;
  value: Entity | null;
  renderItem?(item: any, utils: { t: any }): React.ReactNode;
}> = ({ attribute, field, renderItem, ...props }) => {
  const { contentTypes } = useStrapi();
  const targetModelApiID = contentTypes.find(
    R.whereEq({ uid: attribute.targetModel }),
  )?.apiID;
  const { apiID } = useParams();

  if (!targetModelApiID) {
    console.error(`No content type with apiID ${targetModelApiID}`);
  }

  return !targetModelApiID || !apiID ? null : [
      "oneToOne",
      "manyToOne",
    ].includes(attribute.relationType) ? (
    <ToOne
      targetModelApiID={targetModelApiID}
      renderItem={renderItem}
      field={field}
      apiID={apiID}
      {...props}
    />
  ) : ["oneToMany", "manyToMany"].includes(attribute.relationType) ? (
    <ToMany
      apiID={apiID}
      targetModelApiID={targetModelApiID}
      renderItem={renderItem}
      field={field}
      {...props}
    />
  ) : null;
};

export default Relation;
