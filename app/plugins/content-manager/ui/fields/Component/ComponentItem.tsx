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

import FormField from "~/ui/FormField";

import { FIELD_TYPES } from "../../../utils/constants";

const ComponentItem: React.FC<ComponentItemProps> = ({
  value = {},
  onChange,
  onRemove,
  config,
  customConfig,
  repeatable = false,
}) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value.id, disabled: !repeatable });

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
        {customConfig?.icon && (
          <div className="flex-none text-lg border border-solid border-gray-300 flex items-center justify-center h-8 w-8 shadow-[0_3px] shadow-black/5 rounded-md">
            {customConfig.icon}
          </div>
        )}
        <div className="flex-1">
          {customConfig?.renderLabel && (
            <div className="font-semibold">
              {customConfig.renderLabel(value)}
            </div>
          )}
          <div className="text-sm text-slate-500">
            {t(customConfig?.name ?? config?.info.displayName ?? "", {
              ns: "custom",
            })}
          </div>
        </div>
        {repeatable && onRemove && (
          <Button
            type="text"
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
        {repeatable && (
          <div
            {...attributes}
            {...listeners}
            onMouseDown={() => setOpened(false)}
            onClick={(e) => e.stopPropagation()}
            className="p-2 cursor-grab active:cursor-grabbing text-gray-400"
          >
            <FontAwesomeIcon icon={faGripVertical} />
          </div>
        )}
      </div>
      {opened && (
        <div className="p-4 space-y-6 rounded-b-lg">
          {customConfig?.fields?.map(
            ({ path, label, input, description, hint, inputProps }: any) => {
              const InputComponent =
                config && FIELD_TYPES[input ?? config.attributes[path]?.type];
              return (
                InputComponent && (
                  <FormField
                    key={path}
                    label={t(label ?? path, { ns: "custom" })}
                    help={description && t(description, { ns: "custom" })}
                    hint={hint && t(hint, { ns: "custom" })}
                  >
                    {React.createElement(InputComponent, {
                      value: value[path],
                      onChange(attribute: any) {
                        onChange?.({ ...value, [path]: attribute });
                      },
                      ...inputProps,
                    })}
                  </FormField>
                )
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

interface ComponentItemProps {
  value?: Record<string, any>;
  onChange?(item: Record<string, any>): void;
  onRemove?: VoidFunction;
  repeatable?: boolean;
  config: any;
  customConfig: any;
}

export default ComponentItem;
