import React, { useState } from "react";
import { Button, Select } from "antd";
import { useAsync } from "react-use";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useFormikContext } from "formik";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import useStrapi from "@/hooks/useStrapi";
import { Entity } from "@/types/content";
import { FieldDefinition } from "@/types/contentTypeConfig";

import { usePluginOptions } from "../../../../hooks";
import CreateContentDialog from "../../../../dialogs/CreateContentDialog";

const RelationSelect: React.FC<{
  idsToOmit: (number | string)[];
  targetModelApiID: string;
  onChange(item: Entity): void;
  renderItem?(item: any, utils: { t: TFunction }): React.ReactNode;
  value: (number | string)[];
  field: FieldDefinition;
}> = ({ onChange, targetModelApiID, renderItem, value = [], field }) => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { values } = useFormikContext<{
    locale: string;
    id: number | string;
  }>();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const allowCreate = usePluginOptions(
    (state) => !R.isNil(state.options.contentTypes?.[targetModelApiID]?.create)
  );

  const { value: items = [], loading } = useAsync(async () => {
    // Don't fetch anything unless the select is active
    if (!open) {
      return [];
    }
    try {
      const { results } = await sdk.getMany(targetModelApiID, {
        _q: search,
        locale: values.locale,
        page: 1,
        pageSize: 10,
        sort: "createdAt:DESC",
        "filters[id][$notIn]": value,
      });

      return results;
    } catch (e) {
      console.error(e);
    }
  }, [search, open]);

  return (
    <>
      {create && (
        <CreateContentDialog
          apiID={targetModelApiID}
          onCancel={() => setCreate(false)}
          onCreate={(model) => {
            onChange?.(model);
            setCreate(false);
          }}
        />
      )}
      <div className="flex items-center gap-2">
        <Select
          className="w-full"
          onDropdownVisibleChange={setOpen}
          value={null}
          onSelect={(id) => {
            !R.isNil(id) && onChange?.(items.find(R.whereEq({ id })));
          }}
          loading={loading}
          notFoundContent={loading ? null : undefined}
          options={items?.map((item: any) => ({
            value: item.id,
            label: renderItem?.(item, { t }),
          }))}
          filterOption={false}
          showSearch
          onSearch={setSearch}
          placeholder={t("phrases.add_item", {
            item: t(field.label ?? "", { ns: "custom" }).toLowerCase(),
          })}
        />
        {allowCreate && (
          <div className="flex-none">
            <Button type="dashed" onClick={() => setCreate(true)}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default RelationSelect;
