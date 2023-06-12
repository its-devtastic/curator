import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { FieldDefinition } from "~/types/contentTypeConfig";
import { StrapiContentType } from "~/types/contentType";

import Field from "~/ui/Field";
import FormField from "~/ui/FormField";

import { FIELD_TYPES } from "../utils/constants";

const FieldRenderer: React.FC<{
  field?: FieldDefinition;
  contentType: StrapiContentType;
}> = ({
  field: { path, input, label, description, inputProps, hint, ...field } = {},
  contentType,
}) => {
  const { t } = useTranslation();
  const baseConfig = path ? contentType.attributes[path] : null;
  const InputComponent =
    input || baseConfig?.type ? FIELD_TYPES[input || baseConfig!.type] : null;

  return InputComponent && path ? (
    <FormField
      label={label && t(label, { ns: "custom" })}
      help={description}
      hint={
        <div className="space-x-2">
          <span>{hint}</span>
          {baseConfig?.pluginOptions?.i18n?.localized && (
            <Tooltip title={t("phrases.translated_field")}>
              <FontAwesomeIcon icon={faLanguage} />
            </Tooltip>
          )}
        </div>
      }
    >
      <Field name={path}>
        {React.createElement(InputComponent, {
          config: { ...baseConfig, ...field },
          ...inputProps,
        })}
      </Field>
    </FormField>
  ) : null;
};

export default FieldRenderer;
