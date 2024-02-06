import { Button, Select } from "antd";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";

const EVENTS = [
  "entry.create",
  "entry.update",
  "entry.delete",
  "entry.publish",
  "entry.unpublish",
  "media.create",
  "media.update",
  "media.delete",
];

const EventSelect: React.FC<{
  onChange?(value: string[]): void;
  value?: string[];
}> = ({ value = [], onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <Select
        value={value ?? []}
        onChange={onChange}
        mode="multiple"
        className="w-full"
        options={EVENTS.map((event) => ({ label: event, value: event }))}
      />
      {!R.isEmpty(R.without(value, EVENTS)) && (
        <div className="flex justify-end">
          <Button size="small" type="link" onClick={() => onChange?.(EVENTS)}>
            {t("phrases.select_all")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventSelect;
