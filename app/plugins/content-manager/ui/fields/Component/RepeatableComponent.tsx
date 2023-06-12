import React from "react";
import * as R from "ramda";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import useStrapi from "~/hooks/useStrapi";

import ComponentItem from "./ComponentItem";

const RepeatableComponent: React.FC<RepeatableComponentProps> = ({
  value = [],
  onChange,
  config,
  customConfig,
}) => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="space-y-3 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = value.findIndex(R.whereEq({ id: active.id }));
            const newIndex = value.findIndex(R.whereEq({ id: over.id }));
            onChange?.(arrayMove(value, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={value as any[]}
          strategy={verticalListSortingStrategy}
        >
          {value.map((item) => (
            <ComponentItem
              key={item.id}
              repeatable
              config={config}
              customConfig={customConfig}
              value={item}
              onChange={(attributes) => {
                const idx = value.findIndex(R.whereEq({ id: item.id }));
                onChange?.(R.update(idx, attributes, value));
              }}
              onRemove={() => {
                const idx = value.findIndex(R.whereEq({ id: item.id }));
                onChange?.(R.remove(idx, 1, value));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="dashed"
        icon={<FontAwesomeIcon icon={faPlus} />}
        onClick={() => {
          onChange?.([
            ...value,
            {
              ...R.mapObjIndexed(R.always(undefined))(config?.attributes ?? {}),
              id: sdk.generateTempId(),
            },
          ]);
        }}
      >
        {t("phrases.add_item", {
          item: customConfig?.name
            ? t(customConfig.name, { ns: "custom" }).toLowerCase()
            : config.displayName.toLowerCase(),
        })}
      </Button>
    </div>
  );
};

export default RepeatableComponent;

interface RepeatableComponentProps {
  value?: Record<string, any>[];
  onChange?(item: Record<string, any>[]): void;
  config: any;
  customConfig: any;
}
