import { Attribute } from "@curatorjs/types";
import { Button, Checkbox, Input, Select } from "antd";
import { Form, Formik } from "formik";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import useFilters from "@/hooks/useFilters";
import Field from "@/ui/Field";

const OPERATORS = ["eq", "contains", "startsWith", "endsWith"];

export default function String({
  onSubmit,
  attribute,
  path,
}: {
  onSubmit: VoidFunction;
  path: string;
  attribute: Attribute;
}) {
  const { t } = useTranslation();
  const { updateFilter, filters } = useFilters();
  const filter = filters[path] ?? {};

  return (
    <Formik
      initialValues={{
        operator:
          Object.keys(filter)[0]?.replace(/(^\$|i$)/g, "") ?? "contains",
        insensitive: Object.keys(filter)[0]?.endsWith("i") ?? true,
        value: Object.values(filter)[0] ?? "",
      }}
      onSubmit={(values) => {
        updateFilter(path, {
          [`$${values.operator}${values.insensitive ? "i" : ""}`]: values.value,
        });

        onSubmit();
      }}
    >
      {({ values, submitForm, setFieldValue }) => (
        <Form className="space-y-2">
          <Field name="operator">
            <Select
              className="w-full"
              options={OPERATORS.map((operator) => ({
                label: t(`filters.${operator}`),
                value: operator,
              }))}
            />
          </Field>
          <Field name="value">
            <Input />
          </Field>

          <div>
            <label className="space-x-2">
              <Checkbox
                checked={values.insensitive}
                onChange={(e) => setFieldValue("insensitive", e.target.checked)}
              />
              <span>{t("filters.insensitive")}</span>
            </label>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            onClick={submitForm}
          >
            {t("common.apply")}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
function FilterValue({ filter }: { filter: Record<string, string> }) {
  const { t } = useTranslation();

  const label = useMemo(() => {
    return `${t(
      `filters.${Object.keys(filter)[0]?.replace(/(^\$|i$)/g, "")}`,
    )} ${Object.values(filter)[0]}`;
  }, [filter]);

  return <span>{label}</span>;
}

String.FilterValue = FilterValue;
