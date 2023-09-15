import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";

import { Entity } from "@/types/content";

const Item: React.FC<{
  item: Entity;
  renderItem?(item: any, utils: { t: any }): React.ReactNode;
  onRemove: VoidFunction;
}> = ({ item, renderItem, onRemove }) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={classNames(
        "relative border border-solid border-gray-300 bg-white dark:border-gray-900 dark:bg-gray-800 rounded-md flex items-center gap-3 py-3 px-4",
        isDragging ? "shadow-2xl z-20" : "shadow-sm",
      )}
      ref={setNodeRef}
      style={style}
    >
      <div className="flex-1">
        {renderItem?.(item, {
          t: (s: string, options: any) => t(s, { ns: "custom", ...options }),
        })}
      </div>
      <Button
        type="text"
        icon={<FontAwesomeIcon icon={faTrashAlt} />}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      />
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="p-2 cursor-grab active:cursor-grabbing text-gray-400"
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </div>
    </div>
  );
};

export default Item;
