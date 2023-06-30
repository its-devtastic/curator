import React, { useState } from "react";
import { Button, Select } from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useFormikContext } from "formik";

import { Entity } from "~/types/content";
import { FieldDefinition } from "~/types/contentTypeConfig";
import useStrapi from "~/hooks/useStrapi";

const ToOne: React.FC<{
  apiID: string;
  field: FieldDefinition;
  targetModelApiID: string;
  onChange(mutation: { set: [number] }): void;
  value: Entity | null;
  renderItem?(item: any, utils: { t: any }): React.ReactNode;
}> = ({ value, onChange, targetModelApiID, renderItem, apiID, field }) => {
  const { t } = useTranslation();
  const [model, setModel] = useState(value);
  const { sdk } = useStrapi();
  const { values } = useFormikContext<{ locale: string; id: number }>();
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState(false);

  const { value: items = [], loading } = useAsync(async () => {
    try {
      const { results } = await sdk.getMany(targetModelApiID, {
        _q: search,
        locale: values.locale,
      });

      return results;
    } catch (e) {
      console.error(e);
    }
  }, [search]);

  useAsync(async () => {
    // Get ID of related item
    const { id } = await sdk.getRelation(apiID, values.id, field.path, {
      locale: values.locale,
    });

    // Get full related item object
    const relation = await sdk.getOne<Entity>(targetModelApiID, id, {
      params: {
        locale: values.locale,
      },
    });

    setModel(relation);
  }, []);

  return model && !edit ? (
    <div className="flex items-center p-4 border border-solid border-gray-300 rounded-lg">
      <div className="flex-1">{renderItem?.(model, { t })}</div>
      <div className="flex-none">
        <Button shape="circle" onClick={() => setEdit(true)}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      </div>
    </div>
  ) : (
    <Select
      className="w-full"
      showSearch
      onSelect={(id) => {
        setModel(items.find(R.whereEq({ id })));
        onChange?.({ set: [id] });
        setEdit(false);
      }}
      loading={loading}
      options={items?.map((item: any) => ({
        value: item.id,
        label: renderItem?.(item, {
          t: (s: string, options: any) => t(s, { ns: "custom", ...options }),
        }),
      }))}
      filterOption={false}
      onSearch={setSearch}
    />
  );
};

export default ToOne;
