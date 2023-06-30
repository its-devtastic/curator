import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import * as R from "ramda";

const Pagination: React.FC<{
  total?: number;
  current?: number;
  pageSize?: number;
  onChange?(page: number): void;
}> = ({ total = 0, current = 1, pageSize = 1, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between">
      {!R.isNil(total) && (
        <div className="text-sm text-gay-500">
          {`${total} ${t("common.result", {
            count: total,
          }).toLowerCase()}`}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          size="small"
          disabled={current === 1}
          onClick={() => onChange?.(current - 1)}
        >
          {t("common.previous")}
        </Button>
        <Button
          size="small"
          disabled={current === Math.ceil(total / pageSize)}
          onClick={() => onChange?.(current + 1)}
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
