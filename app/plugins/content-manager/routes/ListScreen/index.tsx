import React, { useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  Image,
  notification,
  Table,
  Tooltip,
} from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

import { Pagination } from "~/types/response";

import useStrapion from "~/hooks/useStrapion";
import useStrapi from "~/hooks/useStrapi";

import Spinner from "~/ui/Spinner";
import CalendarTime from "~/ui/CalendarTime";

import { SORTABLE_FIELD_TYPES } from "../../utils/constants";
import FilterToolbar from "./FilterToolbar";
import { GetManyParams } from "~/types/request";

const ListScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const apiID = params.apiID ?? "";
  const { contentTypes, sdk } = useStrapi();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const config = useStrapion();
  const contentTypeConfig = config.contentTypes.find(R.whereEq({ apiID }));
  const hasDraftState = contentType?.options.draftAndPublish;
  const name = contentTypeConfig?.name ?? contentType?.info.displayName ?? "";
  const [collection, setCollection] = useState<{
    pagination: Pagination | null;
    results: any[];
  }>({
    pagination: null,
    results: [],
  });

  const { loading } = useAsync(async () => {
    const data = await sdk.getMany(apiID, { sort: "updatedAt:DESC" });
    setCollection(data);
  }, [sdk, contentTypes, apiID]);

  return (
    <div>
      {contentTypeConfig && contentType && !loading ? (
        <Formik<GetManyParams>
          initialValues={{
            page: 1,
            pageSize: 10,
            _q: "",
            sort: "updatedAt:DESC",
            locale: undefined,
          }}
          onSubmit={async (values) => {
            const data = await sdk.getMany(apiID, values);
            setCollection(data);
          }}
        >
          {({ values, setFieldValue, submitForm }) => (
            <div>
              <div className="flex items-center justify-between mb-24">
                <h1>{t(name, { count: 2, ns: "custom" })}</h1>

                <Button
                  type="primary"
                  onClick={() => navigate(`/content-manager/${apiID}/create`)}
                >
                  {`${t("phrases.create_new")} ${t(name, {
                    ns: "custom",
                  }).toLowerCase()}`}
                </Button>
              </div>

              <div className="mb-4">
                <FilterToolbar />
              </div>

              <Table
                dataSource={collection.results}
                tableLayout="auto"
                sortDirections={["ascend", "descend", "ascend"]}
                rowKey="id"
                showSorterTooltip={false}
                size="small"
                onRow={(record) => ({
                  onClick: () =>
                    navigate(`/content-manager/${apiID}/${record.id}`),
                })}
                rowClassName="cursor-pointer"
                columns={[
                  hasDraftState && {
                    key: "draftStatus",
                    dataIndex: "publishedAt",
                    width: 40,
                    render(value: any, record: any) {
                      return (
                        <Tooltip
                          placement="top"
                          title={
                            value ? t("common.published") : t("common.draft")
                          }
                        >
                          <div
                            className="flex"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 1,
                                    label: value
                                      ? t("common.unpublish")
                                      : t("common.publish"),
                                    async onClick() {
                                      const isDraft = !record.publishedAt;
                                      try {
                                        const data = isDraft
                                          ? await sdk.publish(apiID, record.id)
                                          : await sdk.unpublish(
                                              apiID,
                                              record.id
                                            );
                                        setCollection(
                                          R.evolve({
                                            results: R.map((item: any) =>
                                              item.id === record.id
                                                ? data
                                                : item
                                            ),
                                          })
                                        );
                                        notification.success({
                                          message: t(
                                            "phrases.document_status_changed"
                                          ),
                                          description: t(
                                            isDraft
                                              ? "phrases.document_published"
                                              : "phrases.document_unpublished"
                                          ),
                                        });
                                      } catch (e) {
                                        notification.error({ message: "Oops" });
                                      }
                                    },
                                  },
                                ],
                              }}
                              trigger={["click"]}
                            >
                              <Button type="text">
                                <Badge color={value ? "green" : "yellow"} />
                              </Button>
                            </Dropdown>
                          </div>
                        </Tooltip>
                      );
                    },
                  },
                  ...(contentTypeConfig.columns?.map(
                    ({ title, ...column }: any) => {
                      const config =
                        column.dataIndex &&
                        contentType.attributes[String(column.dataIndex)];
                      const sortable = SORTABLE_FIELD_TYPES.includes(
                        config?.type
                      );
                      const isSorted =
                        values.sort?.split(":")[0] === column.dataIndex;

                      return {
                        title: t(title, { ns: "custom" }),
                        width: config?.type === "media" ? 72 : undefined,
                        onHeaderCell: (column: any) => ({
                          onClick: () => {
                            if (sortable) {
                              setFieldValue(
                                "sort",
                                `${column.dataIndex}:${
                                  isSorted
                                    ? values.sort?.split(":")[1] === "DESC"
                                      ? "ASC"
                                      : "DESC"
                                    : "ASC"
                                }`
                              );
                              fetch(apiID);
                            }
                          },
                        }),
                        sorter: sortable,
                        sortOrder: isSorted
                          ? values.sort?.split(":")[1] === "ASC"
                            ? "ascend"
                            : "descend"
                          : null,
                        render(value: any) {
                          switch (config?.type) {
                            case "datetime":
                              return <CalendarTime>{value}</CalendarTime>;
                            case "media":
                              return value?.mime?.startsWith("image/") ? (
                                <Image
                                  src={value.formats.thumbnail.url}
                                  alt=""
                                  width={64}
                                  height={64}
                                  preview={false}
                                  fallback="/image_fallback.png"
                                  className="rounded-md object-cover"
                                />
                              ) : (
                                value
                              );
                            default:
                              return value;
                          }
                        },
                        ...column,
                      };
                    }
                  ) ?? []),
                  {
                    title: (
                      <Tooltip title={t("common.translation_plural")}>
                        <FontAwesomeIcon icon={faLanguage} />
                      </Tooltip>
                    ),
                    dataIndex: "localizations",
                    render(localizations: any[], record: any) {
                      return (
                        <div className="space-x-1">
                          {R.sortBy(R.prop("locale"))([
                            record,
                            ...localizations,
                          ]).map(({ locale }) => (
                            <Tooltip title={t(`locales.${locale}`)}>
                              <span
                                className={`rounded-sm fi fi-${
                                  locale.startsWith("en")
                                    ? "us"
                                    : locale.split("-")[0]
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </div>
                      );
                    },
                  },
                ].filter(Boolean)}
                pagination={{
                  pageSize: values.pageSize,
                  current: values.page,
                  total: collection.pagination?.total,
                  showSizeChanger: false,
                  onChange: (page) => {
                    setFieldValue("page", page);
                    submitForm();
                  },
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                }}
              />
            </div>
          )}
        </Formik>
      ) : (
        <div className="flex items-center justify-center h-screen max-w-screen-xl">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ListScreen;
