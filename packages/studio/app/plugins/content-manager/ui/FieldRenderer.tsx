import { Attribute, FieldDefinition } from "@curatorjs/types";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useFormContext,
} from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiTranslateBold } from "react-icons/pi";

import useContentPermission from "@/hooks/useContentPermission";
import FormField from "@/ui/FormField";

import { FIELD_TYPES } from "../constants";

const FieldRenderer: React.FC<{
  field?: FieldDefinition;
  attribute?: Attribute;
  apiID: string;
}> = ({ field = {}, attribute, apiID }) => {
  const { t } = useTranslation();
  const hasPermission = useContentPermission();
  const { getValues, control } = useFormContext<{
    id: number | string | null;
  }>();
  const id = getValues("id");

  const inputName = R.when(R.equals("component"), () =>
    attribute?.repeatable ? "repeatableComponent" : "component",
  )((typeof field.input === "string" && field.input) || attribute?.type || "");
  const InputComponent =
    typeof field.input !== "string" && !R.isNil(field.input)
      ? field.input
      : inputName
        ? FIELD_TYPES[inputName]
        : null;

  // Don't check for field permissions if it's a field inside a component
  const fieldPermission = !field.path?.includes(".") ? field.path : null;
  const hasReadPermission =
    !apiID || hasPermission("read", apiID, fieldPermission);
  const hasCreatePermission =
    !apiID || hasPermission("create", apiID, fieldPermission);
  const hasUpdatePermission =
    !apiID || hasPermission("update", apiID, fieldPermission);
  const hasSavePermission =
    (R.isNil(id) && hasCreatePermission) ||
    (!R.isNil(id) && hasUpdatePermission);

  return (hasReadPermission || hasSavePermission) &&
    InputComponent &&
    field.path ? (
    <FormField
      name={field.path}
      control={control}
      render={({ field }) => (
        <FormItem>
          {(field.label ||
            field.hint ||
            attribute?.pluginOptions?.i18n?.localized) && (
            <FormLabel className="flex items-center justify-between">
              {field.label && <span>{t(field.label, { ns: "custom" })}</span>}
              <div className="flex items-center gap-2">
                {field.hint && <span>{field.hint}</span>}
                {attribute?.pluginOptions?.i18n?.localized && (
                  <Tooltip>
                    <TooltipContent>
                      {t("phrases.translated_field")}
                    </TooltipContent>
                    <TooltipTrigger asChild>
                      <span>
                        <PiTranslateBold className="size-4 inline-flex" />
                      </span>
                    </TooltipTrigger>
                  </Tooltip>
                )}
              </div>
            </FormLabel>
          )}
          <FormControl>
            {React.createElement(InputComponent, {
              attribute,
              field,
              apiID,
              disabled: !hasSavePermission,
              ...field,
            })}
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  ) : null;
};

export default FieldRenderer;
