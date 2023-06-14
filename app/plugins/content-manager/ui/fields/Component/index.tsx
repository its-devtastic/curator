import React from "react";
import * as R from "ramda";

import { Attribute } from "~/types/contentType";
import { FieldDefinition } from "~/types/contentTypeConfig";
import useStrapion from "~/hooks/useStrapion";
import useStrapi from "~/hooks/useStrapi";

import FieldRenderer from "../../FieldRenderer";

const Component: React.FC<ComponentProps> = ({ field, attribute }) => {
  const strapionConfig = useStrapion();
  const { components } = useStrapi();
  const component = components.find(R.whereEq({ uid: attribute.component }));
  const config = strapionConfig.components?.find(
    R.whereEq({ apiID: component?.apiID })
  );

  return config && component ? (
    <div className="w-full relative bg-gray-50 rounded-md">
      <div className="p-4 space-y-6 rounded-b-lg">
        {config.fields?.map((f: FieldDefinition) => (
          <FieldRenderer
            key={f.path}
            field={R.evolve({
              path: (p) => `${field.path}.${p}`,
            })(f)}
            attribute={component.attributes[f.path]}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Component;

interface ComponentProps {
  field: FieldDefinition;
  attribute: Attribute;
}
