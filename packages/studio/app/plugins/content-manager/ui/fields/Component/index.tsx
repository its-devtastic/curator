import React from "react";
import * as R from "ramda";

import { Attribute } from "@/types/contentType";
import { FieldDefinition } from "@/types/contentTypeConfig";
import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

import FieldRenderer from "../../FieldRenderer";

const Component: React.FC<ComponentProps> = ({ field, attribute, apiID }) => {
  const curatorConfig = useCurator();
  const { components } = useStrapi();
  const component = components.find(R.whereEq({ uid: attribute.component }));
  const config = curatorConfig.components?.find(
    R.whereEq({ apiID: component?.apiID }),
  );

  return config && component ? (
    <div className="w-full relative bg-gray-50 dark:bg-gray-800 rounded-md">
      <div className="p-4 space-y-6 rounded-b-lg">
        {config.fields?.map((f: FieldDefinition) => (
          <FieldRenderer
            key={f.path}
            apiID={apiID}
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
  apiID: string;
}
