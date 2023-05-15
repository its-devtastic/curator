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

import FormField from "~/ui/FormField";

import { FIELD_TYPES } from "~/plugins/content-manager/utils/constants";

import { DynamicZoneEntry } from "./index";

const DynamicItem: React.FC<{
  item: DynamicZoneEntry;
  onChange(item: DynamicZoneEntry): void;
  onRemove: VoidFunction;
}> = ({ item: { __component, id, ...attrs }, onChange, onRemove }) => {
  const { t } = useTranslation();
  const { components } = useStrapi();
  const strapionConfig = useStrapion();
  const [opened, setOpened] = useState(false);
  const component = components.find(R.whereEq({ uid: __component }));
  const customConfig = strapionConfig.components?.find(
    R.whereEq({ apiID: component?.apiID })
  );
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

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
          <div className="font-semibold">
            {t(customConfig?.name ?? component?.info.displayName ?? "", {
              ns: "custom",
            })}
          </div>
          {customConfig?.labelField && (
            <div className="text-sm text-slate-500">
              {attrs[customConfig?.labelField]}
            </div>
          )}
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
          {customConfig?.fields?.map(
            ({ path, label, input, description, hint, inputProps }) => {
              const InputComponent =
                component &&
                FIELD_TYPES[input ?? component.attributes[path]?.type];
              return (
                InputComponent && (
                  <FormField
                    key={path}
                    label={t(label ?? path, { ns: "custom" })}
                    help={description && t(description, { ns: "custom" })}
                    hint={hint && t(hint, { ns: "custom" })}
                  >
                    {React.createElement(InputComponent, {
                      value: attrs[path],
                      onChange(value: any) {
                        onChange({ ...attrs, id, __component, [path]: value });
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

export default DynamicItem;
