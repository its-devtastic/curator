import React, { useCallback, useState } from "react";
import { useAsync } from "react-use";
import { useFormikContext } from "formik";
import * as R from "ramda";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Entity } from "@curatorjs/types";
import { FieldDefinition } from "@curatorjs/types";
import useStrapi from "@/hooks/useStrapi";

import RelationSelect from "./RelationSelect";
import Item from "./Item";

const ToMany: React.FC<{
  apiID: string;
  field: FieldDefinition;
  targetModelApiID: string;
  onChange(mutation: {
    set: { id: number | string; position: { before: number | string } }[];
  }): void;
  renderItem?(item: any, utils: { t: any }): React.ReactNode;
}> = ({ onChange, targetModelApiID, renderItem, apiID, field }) => {
  const { sdk } = useStrapi();
  const { values } = useFormikContext<{ locale: string; id?: number }>();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Entity[]>([]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleChange = useCallback((ids: (number | string)[]) => {
    onChange({
      set: ids.map((id, idx) => ({
        id,
        position: { before: ids[idx + 1], end: ids.length === idx + 1 },
      })),
    });
  }, []);

  // Retrieve full related objects
  useAsync(async () => {
    if (!values?.id) {
      return;
    }
    try {
      // Get the relation ids for this entity
      const { results: relations } = await sdk.getRelations(
        apiID,
        values.id,
        field.path,
        {
          locale: values.locale,
        },
      );
      const ids = R.pluck("id", relations);

      // Get the full objects
      if (ids.length) {
        const { results } = await sdk.getMany(targetModelApiID, {
          "filters[id][$in]": ids,
        });

        setItems(R.reverse(ids).map((id) => results.find(R.whereEq({ id }))));
      }
    } catch (e) {
      console.error(e);
    }
  }, [search, values.id]);

  return (
    <div className="space-y-6">
      <RelationSelect
        idsToOmit={R.pluck("id", items)}
        onChange={(item) => {
          handleChange([...R.pluck("id", items), item.id]);
          setItems(R.append(item));
        }}
        targetModelApiID={targetModelApiID}
        renderItem={renderItem}
        value={R.pluck("id", items)}
        field={field}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(
              R.whereEq({
                id: active.id,
              }),
            );
            const newIndex = items.findIndex(
              R.whereEq({
                id: over.id,
              }),
            );

            handleChange(arrayMove(R.pluck("id", items), oldIndex, newIndex));
            setItems(arrayMove(items, oldIndex, newIndex));
          }
        }}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-600 rounded-md">
            {items.map((item) => (
              <Item
                key={item.id}
                item={item}
                renderItem={renderItem}
                onRemove={() => {
                  const newItems = R.reject(R.whereEq({ id: item.id }))(items);
                  handleChange(R.pluck("id", newItems));
                  setItems(newItems);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ToMany;
