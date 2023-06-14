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

import { Entity } from "~/types/content";
import { Attribute } from "~/types/contentType";
import { FieldDefinition } from "~/types/contentTypeConfig";
import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";

import RepeatableComponentItem from "./RepeatableComponentItem";

const RepeatableComponent: React.FC<RepeatableComponentProps> = ({
  field,
  value = [],
  onChange,
  attribute,
}) => {
  const { t } = useTranslation();
  const strapionConfig = useStrapion();
  const { sdk, components } = useStrapi();
  const component = components.find(R.whereEq({ uid: attribute.component }));
  const config = strapionConfig.components?.find(
    R.whereEq({ apiID: component?.apiID })
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return component && config ? (
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
          items={value as Entity[]}
          strategy={verticalListSortingStrategy}
        >
          {value.map((item, idx) => (
            <RepeatableComponentItem
              key={item.id}
              component={component}
              config={config}
              value={item}
              path={`${field.path}.${idx}`}
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
              ...R.mapObjIndexed(R.always(undefined))(
                component?.attributes ?? {}
              ),
              id: sdk.generateTempId(),
            },
          ]);
        }}
      >
        {t("phrases.add_item", {
          item: config?.name
            ? t(config.name, { ns: "custom" }).toLowerCase()
            : component?.info.displayName.toLowerCase(),
        })}
      </Button>
    </div>
  ) : null;
};

export default RepeatableComponent;

interface RepeatableComponentProps {
  value: Entity[];
  onChange(value: Entity[]): void;
  field: FieldDefinition;
  attribute: Attribute;
}
