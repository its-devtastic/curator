import React, { useMemo, useState } from "react";
import { Button, Select, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { Form, Formik } from "formik";
import { useAsync } from "react-use";
import * as R from "ramda";
import type { TFunction } from "i18next";

import { Attribute } from "@curatorjs/types";
import { RenderContext } from "@curatorjs/types";
import { Entity } from "@curatorjs/types";
import Field from "@/ui/Field";
import useFilters from "@/hooks/useFilters";
import useStrapi from "@/hooks/useStrapi";
import useCurator from "@/hooks/useCurator";
import Spinner from "@/ui/Spinner";

export default function Relation({
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
  const { sdk, contentTypes } = useStrapi();
  const { contentTypes: curatorContentTypes = [] } = useCurator();
  const target = contentTypes.find(R.whereEq({ uid: attribute.target }));
  const targetConfig =
    target && curatorContentTypes.find(R.whereEq({ apiID: target.apiID }));
  const [search, setSearch] = useState("");

  const { value: relatedItems = [] } = useAsync(async () => {
    if (!target?.apiID) {
      return;
    }

    const data = await sdk.getMany(target.apiID, { _q: search });

    return data.results;
  }, [target?.apiID, search]);

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
      {({ values, submitForm, setFieldValue }) => (
        <Form className="space-y-2">
          <Field name="value">
            <Select
              showSearch
              searchValue={search}
              onSearch={setSearch}
              filterOption={false}
              className="w-full"
              options={relatedItems.map((item) => ({
                label: targetConfig?.render
                  ? targetConfig.render(item, {
                      t: ((key: string, opts?: any) =>
                        t(key, { ns: "custom", ...opts })) as TFunction,
                      context: RenderContext.List,
                    })
                  : item.id,
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
function FilterValue({
  filter,
  attribute,
}: {
  filter: Record<string, string>;
  attribute: Attribute;
}) {
  const { t } = useTranslation();
  const { sdk, contentTypes } = useStrapi();
  const { contentTypes: curatorContentTypes = [] } = useCurator();
  const target = contentTypes.find(R.whereEq({ uid: attribute.target }));
  const targetConfig =
    target && curatorContentTypes.find(R.whereEq({ apiID: target.apiID }));
  const id = Number(Object.values(filter)[0]);

  const { value: relatedItem, loading } = useAsync(async () => {
    if (!target || !id) {
      return;
    }

    return await sdk.getOne(target.apiID, id);
  }, [target, id]);

  const label = useMemo(() => {
    return relatedItem
      ? targetConfig?.render?.(relatedItem as Entity, {
          context: RenderContext.List,
          t: ((key: string, opts: any) =>
            t(key, { ns: "custom", ...opts })) as TFunction,
        })
      : id;
  }, [filter, relatedItem]);

  return loading ? <Spinner size={16} /> : <span>{label}</span>;
}

Relation.FilterValue = FilterValue;
