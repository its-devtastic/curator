import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./Button";

export function Pagination({
  total = 0,
  current = 1,
  pageSize = 1,
  onChange,
}: PaginationProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between">
      {!R.isNil(total) && (
        <div className="text-sm text-muted-foreground">
          {`${total} ${t("common.result", {
            count: total,
          }).toLowerCase()}`}
        </div>
      )}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={current === 1}
          onClick={() => onChange?.(current - 1)}
        >
          {t("common.previous")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={current === Math.ceil(total / pageSize)}
          onClick={() => onChange?.(current + 1)}
        >
          {t("common.next")}
        </Button>
      </div>
    </div>
  );
}

interface PaginationProps {
  total?: number;
  current?: number;
  pageSize?: number;
  onChange?(page: number): void;
}
