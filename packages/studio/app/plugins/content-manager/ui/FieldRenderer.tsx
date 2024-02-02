import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { useFormikContext } from "formik";

import { FieldDefinition } from "@curatorjs/types";
import { Attribute } from "@curatorjs/types";

import useContentPermission from "@/hooks/useContentPermission";

import Field from "@/ui/Field";
import FormField from "@/ui/FormField";

import { FIELD_TYPES } from "../constants";

const FieldRenderer: React.FC<{
  field?: FieldDefinition;
  attribute?: Attribute;
  apiID: string;
}> = ({ field = {}, attribute, apiID }) => {
  const { t } = useTranslation();
  const hasPermission = useContentPermission();
  const {
    values: { id },
  } = useFormikContext<{ id: number | string | null }>();

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
      label={field.label && t(field.label, { ns: "custom" })}
      help={field.description}
      hint={
        <div className="space-x-2">
          <span>{field.hint}</span>
          {attribute?.pluginOptions?.i18n?.localized && (
            <Tooltip title={t("phrases.translated_field")}>
              <FontAwesomeIcon
                icon={faLanguage}
                className="text-gray-500 dark:text-gray-200"
              />
            </Tooltip>
          )}
        </div>
      }
    >
      <Field name={field.path}>
        {React.createElement(InputComponent, {
          attribute,
          field,
          apiID,
          disabled: !hasSavePermission,
          ...field.inputProps,
        })}
      </Field>
    </FormField>
  ) : null;
};

export default FieldRenderer;
