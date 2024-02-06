import { Button, Select } from "antd";
import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";

import useFilters from "@/hooks/useFilters";
import useStrapi from "@/hooks/useStrapi";
import Field from "@/ui/Field";
import Spinner from "@/ui/Spinner";

export default function AdminUser({
  onSubmit,
  path,
}: {
  onSubmit: VoidFunction;
  path: string;
}) {
  const { t } = useTranslation();
  const { updateFilter, filters } = useFilters();
  const filter = filters[path] ?? {};
  const { sdk } = useStrapi();
  const [search, setSearch] = useState("");

  const { value: relatedItems = [] } = useAsync(async () => {
    const data = await sdk.getAdminUsers({ _q: search });

    return data.results;
  }, [search]);

  return (
    <Formik
      initialValues={{
        value: Object.values(filter)[0] ? Number(Object.values(filter)[0]) : "",
      }}
      onSubmit={(values) => {
        updateFilter(path, {
          // Special operator that will be expanded to [id][$eq]
          $relation: String(values.value),
        });

        onSubmit();
      }}
    >
      {({ submitForm }) => (
        <Form className="space-y-2">
          <Field name="value">
            <Select
              showSearch
              searchValue={search}
              onSearch={setSearch}
              filterOption={false}
              className="w-full"
              options={relatedItems.map((item) => ({
                label:
                  [item.firstname, item.lastname].filter(Boolean).join(" ") ??
                  item.email,
                value: item.id,
              }))}
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
  const { sdk } = useStrapi();
  const id = Number(Object.values(filter)[0]);

  const { value: relatedItem, loading } = useAsync(async () => {
    if (!id) {
      return;
    }

    return await sdk.getAdminUser(id);
  }, [id]);

  const label = useMemo(() => {
    return relatedItem
      ? [relatedItem.firstname, relatedItem.lastname]
          .filter(Boolean)
          .join(" ") ?? relatedItem.email
      : id;
  }, [filter, relatedItem]);

  return loading ? <Spinner size={16} /> : <span>{label}</span>;
}

AdminUser.FilterValue = FilterValue;
