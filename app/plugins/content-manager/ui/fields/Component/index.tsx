import React from "react";
import * as R from "ramda";

import useStrapion from "~/hooks/useStrapion";

import RepeatableComponent from "./RepeatableComponent";
import ComponentItem from "./ComponentItem";
import useStrapi from "~/hooks/useStrapi";

const Component: React.FC<ComponentProps> = ({ value, onChange, config }) => {
  const strapionConfig = useStrapion();
  const { components } = useStrapi();
  const { repeatable, component: uid } = config;
  const componentConfig = components.find(R.whereEq({ uid }));
  const customConfig = strapionConfig.components?.find(
    R.whereEq({ apiID: componentConfig?.apiID })
  );

  return repeatable ? (
    <RepeatableComponent
      value={value as Record<string, any>[]}
      onChange={onChange}
      config={componentConfig}
      customConfig={customConfig}
    />
  ) : (
    <ComponentItem
      value={value as Record<string, any>}
      onChange={onChange}
      config={componentConfig}
      customConfig={customConfig}
    />
  );
};

export default Component;

interface ComponentProps {
  value?: Record<string, any> | Record<string, any>[];
  onChange?(item: Record<string, any> | Record<string, any>[]): void;
  config: any;
}
