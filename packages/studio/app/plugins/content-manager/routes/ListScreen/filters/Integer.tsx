import React, { useMemo } from "react";
import { Button, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";

import { Attribute } from "@curatorjs/types";
import Field from "@/ui/Field";
import useFilters from "@/hooks/useFilters";

const OPERATORS = ["eq", "lt", "lte", "gt", "gte"];

export default function Integer({
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
        operator: Object.keys(filter)[0]?.replace("$", "") ?? "eq",
        value: Object.values(filter)[0] ?? "",
      }}
      onSubmit={(values) => {
        updateFilter(path, {
          [`$${values.operator}`]: values.value,
        });

        onSubmit();
      }}
    >
      {({ submitForm }) => (
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
            <InputNumber
              className="w-[200px]"
              min={1}
              precision={0}
              stringMode
            />
          </Field>

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
    return `${t(`filters.${Object.keys(filter)[0]?.replace("$", "")}`)} ${
      Object.values(filter)[0]
    }`;
  }, [filter]);

  return <span>{label}</span>;
}

Integer.FilterValue = FilterValue;
