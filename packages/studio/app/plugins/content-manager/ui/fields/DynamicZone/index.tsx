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
import { Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { Attribute } from "@/types/contentType";
import { FieldDefinition } from "@/types/contentTypeConfig";
import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";
import Popover from "@/ui/Popover";

import DynamicItem from "./DynamicItem";

const DynamicZone: React.FC<{
  value: DynamicZoneEntry[];
  onChange(value: any): void;
  attribute: Attribute;
  field: FieldDefinition;
  apiID: string;
}> = ({ value = [], onChange, attribute, field, apiID }) => {
  const { components, sdk } = useStrapi();
  const { t } = useTranslation();
  const curatorConfig = useCurator();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className="space-y-3 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const [activeId, activeComponent] = String(active.id).split("+");
            const [overId, overComponent] = String(over.id).split("+");
            const oldIndex = value.findIndex(
              R.where({
                id: (id: string | number) => String(id) === activeId,
                __component: R.equals(activeComponent),
              }),
            );
            const newIndex = value.findIndex(
              R.where({
                id: (id: string | number) => String(id) === overId,
                __component: R.equals(overComponent),
              }),
            );

            onChange(arrayMove(value, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={value.map(({ id, __component }) => ({
            id: `${id}+${__component}`,
          }))}
          strategy={verticalListSortingStrategy}
        >
          {value.map((item, idx) => (
            <DynamicItem
              key={`${item.id}+${item.__component}`}
              value={item}
              apiID={apiID}
              path={`${field.path}.${idx}`}
              onRemove={() =>
                onChange(
                  R.reject(
                    R.whereEq({ id: item.id, __component: item.__component }),
                  )(value),
                )
              }
            />
          ))}
        </SortableContext>
      </DndContext>

      <Popover
        trigger={["click"]}
        placement="bottom"
        content={(close) => (
          <div className="grid grid-cols-4 gap-3 max-w-3xl">
            {attribute.components?.map((uid) => {
              const component = components.find(R.whereEq({ uid }));
              const customConfig = curatorConfig.components?.find(
                R.whereEq({ apiID: component?.apiID }),
              );

              return (
                <div
                  key={uid}
                  onClick={() => {
                    close();
                    onChange(
                      R.append({
                        __component: uid,
                        ...R.mapObjIndexed(R.always(undefined))(
                          component?.attributes ?? {},
                        ),
                        id: sdk.generateTempId(),
                      })(value as any),
                    );
                  }}
                  className="select-none border border-solid border-gray-200 p-2 rounded-md cursor-pointer hover:bg-gray-50 hover:border-gray-300 flex gap-2 items-center"
                >
                  {customConfig?.icon && (
                    <div className="flex-none text-xl border border-solid border-gray-300 flex items-center justify-center h-10 w-10 shadow-[0_3px] shadow-black/5 rounded-md">
                      {customConfig.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-xs">
                      {t(
                        customConfig?.name ?? component?.info.displayName ?? "",
                        {
                          ns: "custom",
                        },
                      )}
                    </div>
                    {customConfig?.description && (
                      <div className="text-xs text-gray-500">
                        {t(customConfig.description, {
                          ns: "custom",
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      >
        <Tooltip title={t("phrases.add_component")}>
          <Button
            type="dashed"
            shape="circle"
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </Tooltip>
      </Popover>
    </div>
  );
};

export default DynamicZone;

export interface DynamicZoneEntry {
  __component: string;
  id: number | string;
  [s: string]: any;
}
