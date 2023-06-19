import React, { useState } from "react";
import * as R from "ramda";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faTrashAlt,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { Button } from "antd";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import useStrapi from "~/hooks/useStrapi";
import useStrapion from "~/hooks/useStrapion";

import FieldRenderer from "../../FieldRenderer";
import { DynamicZoneEntry } from "./index";

const DynamicItem: React.FC<{
  value: DynamicZoneEntry;
  onRemove: VoidFunction;
  path: string;
}> = ({ value: { __component, id, ...attrs }, path, onRemove }) => {
  const { t } = useTranslation();
  const { components } = useStrapi();
  const strapionConfig = useStrapion();
  const [opened, setOpened] = useState(false);
  const component = components.find(R.whereEq({ uid: __component }));
  const config = strapionConfig.components?.find(
    R.whereEq({ apiID: component?.apiID })
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${id}+${__component}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={classNames(
        "w-full relative border border-solid border-gray-300 bg-white rounded-md",
        isDragging ? "shadow-2xl z-20" : "shadow-sm"
      )}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={classNames(
          "py-3 px-4 flex items-center gap-3 rounded-t-md hover:cursor-pointer select-none",
          !opened
            ? "rounded-b-md"
            : "border-b border-solid border-0 border-gray-300"
        )}
        onClick={() => setOpened(R.not)}
      >
        <span>
          <FontAwesomeIcon
            icon={faCaretUp}
            className={classNames("text-gray-400 flex-none", {
              "rotate-180": !opened,
            })}
          />
        </span>
        {config?.icon && (
          <div className="flex-none text-lg border border-solid border-gray-300 flex items-center justify-center h-8 w-8 shadow-[0_3px] shadow-black/5 rounded-md">
            {config.icon}
          </div>
        )}
        <div className="flex-1">
          {config?.renderLabel && (
            <div className="font-semibold">
              {config.renderLabel(attrs, {
                t: (s) => t(s, { ns: "custom" }),
              })}
            </div>
          )}
          <div className="text-sm text-slate-500">
            {t(config?.name ?? component?.info.displayName ?? "", {
              ns: "custom",
            })}
          </div>
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
          onMouseDown={() => setOpened(false)}
          onClick={(e) => e.stopPropagation()}
          className="p-2 cursor-grab active:cursor-grabbing text-gray-400"
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </div>
      </div>
      {opened && (
        <div className="p-4 space-y-6 rounded-b-lg">
          {config?.fields?.map(
            (field) =>
              component && (
                <FieldRenderer
                  key={field.path}
                  field={R.evolve({ path: (p) => `${path}.${p}` })(field)}
                  attribute={component.attributes[field.path]}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicItem;
