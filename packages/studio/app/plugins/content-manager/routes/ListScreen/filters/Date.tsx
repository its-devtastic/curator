import React, { useMemo } from "react";
import { Button, DatePicker, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import dayjs, { ManipulateType } from "dayjs";

import { Attribute } from "@/types/contentType";
import Field from "@/ui/Field";
import useFilters from "@/hooks/useFilters";

const OPERATORS = ["last_n", "eq"];

export default function Date({
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
  const n = filter.$gte && dayjs().diff(dayjs(filter.$gte), "days");
  const date = filter.$eq ? dayjs(filter.$eq) : null;
  const operator = filter.$eq ? "eq" : "last_n";

  return (
    <Formik
      initialValues={{
        unit: "days" as ManipulateType,
        operator,
        date,
        n,
      }}
      onSubmit={(values, { resetForm }) => {
        switch (values.operator) {
          case "last_n": {
            updateFilter(path, {
              $gte: dayjs()
                .subtract(Number(values.n), values.unit)
                .toISOString(),
            });
            break;
          }
          case "eq": {
            updateFilter(path, {
              $startsWith: values.date?.format("YYYY-MM-DD") ?? "",
            });
            break;
          }
        }

        resetForm();
        onSubmit();
      }}
    >
      {({ values, submitForm }) => (
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
          {values.operator === "last_n" && (
            <div className="flex gap-2">
              <Field name="n">
                <InputNumber
                  className="w-[200px]"
                  min={1}
                  precision={0}
                  addonAfter={
                    <Field name="unit">
                      <Select
                        className="w-[100px]"
                        options={[
                          {
                            label: t("filters.days").toLowerCase(),
                            value: "days",
                          },
                          {
                            label: t("filters.months").toLowerCase(),
                            value: "months",
                          },
                        ]}
                      />
                    </Field>
                  }
                />
              </Field>
            </div>
          )}
          {values.operator === "eq" && (
            <div className="flex gap-2">
              <Field name="date">
                <DatePicker className="w-[200px]" />
              </Field>
            </div>
          )}
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
    if (filter.$gte && !filter.$lte) {
      return `${t("filters.last")} ${dayjs().diff(
        dayjs(filter.$gte),
        "days",
      )} ${t("filters.days").toLowerCase()}`;
    }
    return "";
  }, [filter]);

  return <span>{label}</span>;
}

Date.FilterValue = FilterValue;
