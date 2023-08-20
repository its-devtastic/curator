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

import { ComponentConfig } from "~/types/config";
import { StrapiComponent } from "~/types/contentType";

import FieldRenderer from "../../FieldRenderer";

const RepeatableComponentItem: React.FC<RepeatableComponentItemProps> = ({
  value = {},
  onRemove,
  config,
  component,
  path,
  apiID,
}) => {
  const { t } = useTranslation();
  const collapsible = config.collapsible ?? true;
  const [opened, setOpened] = useState(!collapsible);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value.id });

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
          "px-4 flex items-center gap-3 rounded-t-md hover:cursor-pointer select-none",
          !opened
            ? "rounded-b-md"
            : "border-b border-solid border-0 border-gray-300",
          collapsible ? "py-3" : "pt-1 border-b-0"
        )}
        onClick={() => collapsible && setOpened(R.not)}
      >
        {collapsible && (
          <span>
            <FontAwesomeIcon
              icon={faCaretUp}
              className={classNames("text-gray-400 flex-none", {
                "rotate-180": !opened,
              })}
            />
          </span>
        )}
        <div className="flex-1">
          {collapsible ? (
            config?.renderLabel ? (
              <div className="font-semibold">
                {config.renderLabel(value, {
                  t: (s) => t(s, { ns: "custom" }),
                })}
              </div>
            ) : (
              t(config?.name ?? component?.info.displayName ?? "", {
                ns: "custom",
              })
            )
          ) : null}
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
          onMouseDown={() => collapsible && setOpened(false)}
          onClick={(e) => e.stopPropagation()}
          className="p-2 cursor-grab active:cursor-grabbing text-gray-400"
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </div>
      </div>
      {opened && (
        <div
          className={classNames("px-4 pb-4 space-y-6 rounded-b-lg", {
            "pt-4": collapsible,
          })}
        >
          {config?.fields?.map((field) => (
            <FieldRenderer
              key={field.path}
              field={R.evolve({ path: (p) => `${path}.${p}` })(field)}
              attribute={component.attributes[field.path]}
              apiID={apiID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface RepeatableComponentItemProps {
  value?: Record<string, any>;
  onRemove: VoidFunction;
  config: ComponentConfig;
  component: StrapiComponent;
  path: string;
  apiID: string;
}

export default RepeatableComponentItem;
