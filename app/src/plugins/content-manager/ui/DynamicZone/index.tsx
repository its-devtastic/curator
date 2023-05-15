import React, { useMemo } from "react";
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

import { Attribute } from "~/types/contentType";
import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";
import Popover from "~/ui/Popover";

import DynamicItem from "./DynamicItem";

const DynamicZone: React.FC<{
  value: DynamicZoneEntry[];
  onChange(value: any): void;
  config: Attribute;
}> = ({ value = [], onChange, config }) => {
  const { components } = useStrapi();
  const { t } = useTranslation();
  const strapionConfig = useStrapion();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const valueWithUniqueId = useMemo(
    () =>
      value.map((item) => ({
        ...item,
        _id: item.id,
        id: item.__temp_key__,
      })),
    [value]
  );

  return (
    <div className="space-y-3 bg-gray-50 rounded-lg p-4 flex flex-col items-center">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = value.findIndex(
              R.whereEq({
                __temp_key__: active.id,
              })
            );
            const newIndex = value.findIndex(
              R.whereEq({
                __temp_key__: over.id,
              })
            );

            onChange(arrayMove(value, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext
          items={valueWithUniqueId}
          strategy={verticalListSortingStrategy}
        >
          {valueWithUniqueId.map((item) => (
            <DynamicItem
              key={item.id}
              item={item}
              onChange={({ id, _id, __temp_key__, ...attributes }) =>
                onChange(
                  value.map((item) =>
                    item.__temp_key__ === __temp_key__
                      ? { ...item, ...attributes }
                      : item
                  )
                )
              }
              onRemove={() =>
                onChange(
                  R.reject(R.whereEq({ __temp_key__: item.__temp_key__ }))(
                    value
                  )
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
            {config.components?.map((uid) => {
              const component = components.find(R.whereEq({ uid }));
              const customConfig = strapionConfig.components?.find(
                R.whereEq({ apiID: component?.apiID })
              );

              return (
                <div
                  key={uid}
                  onClick={() => {
                    close();
                    onChange(
                      R.append({
                        __temp_key__: value.length
                          ? R.pipe(
                              R.pluck("__temp_key__"),
                              R.sortBy(R.identity),
                              R.last,
                              R.inc
                            )(value)
                          : 0,
                        __component: uid,
                        ...R.mapObjIndexed(R.always(undefined))(
                          component?.attributes ?? {}
                        ),
                      })(value)
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
                        }
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
  __temp_key__: number;
  id: number;
  [s: string]: any;
}
