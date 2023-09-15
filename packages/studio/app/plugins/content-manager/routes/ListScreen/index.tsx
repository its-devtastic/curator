import React, { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Dropdown,
  Image,
  notification,
  Tooltip,
} from "antd";
import * as R from "ramda";
import { useAsyncRetry } from "react-use";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

import { Pagination as IPagination } from "@/types/response";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";
import useContentPermission from "@/hooks/useContentPermission";

import Spinner from "@/ui/Spinner";
import CalendarTime from "@/ui/CalendarTime";
import Table from "@/ui/Table";
import Pagination from "@/ui/Pagination";

import { ColumnConfig } from "../../types";
import { SORTABLE_FIELD_TYPES } from "../../constants";
import { convertSearchParamsToObject } from "../../utils";
import { usePluginOptions } from "../../hooks";
import CreateContentDialog from "../../dialogs/CreateContentDialog";
import FilterToolbar from "./FilterToolbar";

const ListScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const apiID = params.apiID ?? "";
  const pluginOptions = usePluginOptions(
    (state) => state.options.contentTypes?.[apiID]
  );
  const { contentTypes, sdk } = useStrapi();
  const hasPermission = useContentPermission();
  const contentType = contentTypes.find(R.whereEq({ apiID }));
  const curatorConfig = useCurator();
  const contentTypeConfig = curatorConfig.contentTypes?.find(
    R.whereEq({ apiID })
  );
  const hasDraftState = contentType?.options.draftAndPublish;
  const name = contentTypeConfig?.name ?? contentType?.info.displayName ?? "";
  const [create, setCreate] = useState<string | null>(null);
  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: any[];
  }>({
    pagination: null,
    results: [],
  });
  const hasReadPermission = hasPermission("read", apiID);
  const hasCreatePermission = hasPermission("create", apiID);

  const { loading, retry } = useAsyncRetry(async () => {
    if (!hasReadPermission) {
      return;
    }

    const data = await sdk.getMany(
      apiID,
      convertSearchParamsToObject(searchParams)
    );
    setCollection(data);
  }, [sdk, contentTypes, apiID, searchParams]);

  return hasReadPermission || hasCreatePermission ? (
    <div className="px-4 md:px-12 py-6">
      {create && (
        <CreateContentDialog
          apiID={apiID}
          onCancel={() => setCreate(null)}
          onCreate={({ id }) => navigate(`/content-manager/${apiID}/${id}`)}
        />
      )}
      {contentTypeConfig && contentType ? (
        <div>
          <div className="flex flex-col md:flex-row items-center justify-between my-12 md:mb-24 gap-4">
            <h1 className="m-0">{t(name, { count: 2, ns: "custom" })}</h1>

            {hasCreatePermission && (
              <Button
                type="primary"
                onClick={() => {
                  if (
                    pluginOptions?.create &&
                    pluginOptions.create?.when !== "relation"
                  ) {
                    return setCreate(apiID);
                  }
                  navigate(`/content-manager/${apiID}/create`);
                }}
              >
                {`${t("phrases.create_new")} ${t(name, {
                  ns: "custom",
                }).toLowerCase()}`}
              </Button>
            )}
          </div>

          {hasReadPermission && (
            <>
              <div className="mb-4">
                <FilterToolbar
                  contentType={contentType}
                  onRefresh={retry}
                  loading={loading}
                />
              </div>

              <Table
                className="mb-6"
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
                columns={
                  [
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
                                            ? await sdk.publish(
                                                apiID,
                                                record.id
                                              )
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
                                          notification.error({
                                            message: "Oops",
                                          });
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
                    ...R.pathOr([], ["list", "columns"], pluginOptions).map(
                      ({ title = "", ...column }: ColumnConfig) => {
                        const config =
                          column.path &&
                          contentType.attributes[String(column.path)];

                        if (!config) {
                          console.warn(
                            `Could not find config for path ${column.path}`
                          );
                          return;
                        }

                        const sortable = SORTABLE_FIELD_TYPES.includes(
                          config?.type
                        );
                        const isSorted =
                          searchParams.get("sort")?.split(":")[0] ===
                          column.path;

                        return {
                          dataIndex: column.path,
                          key: column.path,
                          title: t(title, { ns: "custom" }),
                          width: config?.type === "media" ? 72 : undefined,
                          onHeaderCell: (column: any) => ({
                            onClick: () => {
                              if (sortable) {
                                setSearchParams((params) => {
                                  params.set(
                                    "sort",
                                    `${column.dataIndex}:${
                                      isSorted
                                        ? params.get("sort")?.split(":")[1] ===
                                          "DESC"
                                          ? "ASC"
                                          : "DESC"
                                        : "ASC"
                                    }`
                                  );
                                  return params;
                                });
                              }
                            },
                          }),
                          sorter: sortable,
                          sortOrder: isSorted
                            ? searchParams.get("sort")?.split(":")[1] === "ASC"
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
                                    src={curatorConfig.images.getImageUrl(
                                      value
                                    )}
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
                        };
                      }
                    ),
                    contentType?.pluginOptions.i18n?.localized && {
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
                              ...(localizations ?? []),
                            ]).map(({ locale = "" }) => (
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
                  ].filter(Boolean) as any
                }
              />
              <Pagination
                current={Number(searchParams.get("page") ?? 1)}
                pageSize={Number(searchParams.get("pageSize") ?? 10)}
                total={collection.pagination?.total}
                onChange={(page) => {
                  setSearchParams((params) => {
                    params.set("page", String(page));
                    return params;
                  });
                }}
              />
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen max-w-screen-xl">
          <Spinner />
        </div>
      )}
    </div>
  ) : (
    <div className="p-4 lg:p-12">
      <Alert type="warning" description={t("phrases.no_view_permission")} />
    </div>
  );
};

export default ListScreen;
