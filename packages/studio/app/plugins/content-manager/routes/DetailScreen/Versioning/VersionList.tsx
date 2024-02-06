import {
  faBullhorn,
  faMagnifyingGlass,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Timeline, Tooltip } from "antd";
import classNames from "classnames";
import { useFormikContext } from "formik";
import * as R from "ramda";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAsyncRetry } from "react-use";

import useStrapi from "@/hooks/useStrapi";
import CalendarTime from "@/ui/CalendarTime";
import Pagination from "@/ui/Pagination";

const VersionList: React.FC<{ onRestore: VoidFunction }> = ({ onRestore }) => {
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const { apiID, id } = useParams() as {
    apiID: string;
    id: string;
  };
  const [page, setPage] = useState(1);
  const [view, setView] = useState<null | number>(null);
  const { values, setFieldValue } = useFormikContext<Record<string, any>>();

  const { value, loading } = useAsyncRetry(async () => {
    try {
      return await sdk.getVersions(apiID, Number(id), { page });
    } catch (e) {}
  }, [sdk, page]);

  const viewedItem = value?.results.find(R.whereEq({ id: view }));

  return (
    <div className="flex h-full items-stretch">
      <div className="flex-[2] border-solid border-0 border-r border-gray-100">
        {viewedItem && (
          <div className="space-y-4 p-4 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left [&_th]:font-semibold">
                  <th>{t("versioning.field")}</th>
                  <th>{t("versioning.current")}</th>
                  <th>{t("versioning.selected")}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(viewedItem.content)
                  .filter(([key, value]) => value !== values[key])
                  .map(([key, value]) => (
                    <tr key={key}>
                      <th className="text-left font-semibold">{key}</th>
                      <td>{values[key]}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <Button
              type="primary"
              onClick={() => {
                Object.entries(viewedItem.content).forEach(([key, value]) =>
                  setFieldValue(key, value),
                );
                onRestore();
              }}
            >
              {t("versioning.restore")}
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <Timeline
          className="flex-1 overflow-y-auto p-4"
          items={value?.results.map((item) => ({
            dot:
              item.id === view ? (
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-indigo-500"
                />
              ) : (
                <Tooltip
                  title={
                    item.content.published
                      ? t("versioning.published")
                      : t("versioning.edit")
                  }
                >
                  <FontAwesomeIcon
                    icon={item.content.published ? faBullhorn : faPen}
                    className={classNames(
                      item.content.published
                        ? "text-green-500"
                        : "text-gray-400",
                    )}
                  />
                </Tooltip>
              ),
            children: (
              <div
                className={classNames(
                  "space-y-1 cursor-pointer rounded-sm px-2",
                  item.id === view
                    ? "bg-indigo-50 ring-2 ring-indigo-500"
                    : "hover:bg-gray-50",
                )}
                onClick={() => {
                  setView(item.id);
                }}
              >
                <CalendarTime className="font-semibold">
                  {item.createdAt}
                </CalendarTime>
                <div className="text-gray-600">
                  {[item.createdBy?.firstname, item.createdBy?.lastname]
                    .filter(Boolean)
                    .join(" ")}
                </div>
              </div>
            ),
          }))}
        />
        <div className="p-4 border-solid border-0 border-t border-gray-100">
          <Pagination
            current={value?.pagination.page}
            pageSize={10}
            total={value?.pagination.total}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default VersionList;
