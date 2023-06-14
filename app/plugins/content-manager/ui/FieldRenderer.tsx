import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import { FieldDefinition } from "~/types/contentTypeConfig";
import { Attribute } from "~/types/contentType";

import Field from "~/ui/Field";
import FormField from "~/ui/FormField";

import { FIELD_TYPES } from "../utils/constants";

const FieldRenderer: React.FC<{
  field?: FieldDefinition;
  attribute?: Attribute;
}> = ({ field = {}, attribute }) => {
  const { t } = useTranslation();
  const inputName = R.when(R.equals("component"), () =>
    attribute?.repeatable ? "repeatableComponent" : "component"
  )(field.input || attribute?.type || "");
  const InputComponent = inputName ? FIELD_TYPES[inputName] : null;

  return InputComponent && field.path ? (
    <FormField
      label={field.label && t(field.label, { ns: "custom" })}
      help={field.description}
      hint={
        <div className="space-x-2">
          <span>{field.hint}</span>
          {attribute?.pluginOptions?.i18n?.localized && (
            <Tooltip title={t("phrases.translated_field")}>
              <FontAwesomeIcon icon={faLanguage} />
            </Tooltip>
          )}
        </div>
      }
    >
      <Field name={field.path}>
        {React.createElement(InputComponent, {
          attribute,
          field,
          ...field.inputProps,
        })}
      </Field>
    </FormField>
  ) : null;
};

export default FieldRenderer;
