import React, { useState } from "react";
import { Button, List, message, Popconfirm, Segmented, Typography } from "antd";
import { filesize } from "filesize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUpload,
  faFile,
  faLink,
  faTableCells,
  faTableList,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAsync, useCopyToClipboard } from "react-use";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import classNames from "classnames";
import { useSearchParams } from "react-router-dom";
import * as R from "ramda";

import { Pagination as IPagination } from "~/types/response";
import { Sort } from "~/types/request";
import { MediaItem } from "~/types/media";
import usePreferences from "~/hooks/usePreferences";
import useStrapi from "~/hooks/useStrapi";
import CalendarTime from "~/ui/CalendarTime";
import Pagination from "~/ui/Pagination";

import UploadButton from "../../ui/UploadButton";
import FilterToolbar from "./FilterToolbar";
import FolderList from "./FolderList";
import EditMediaModal from "./EditMediaModal";

const MediaList: React.FC = () => {
  const { t } = useTranslation();
  const [_, copy] = useCopyToClipboard();
  const { sdk } = useStrapi();
  const { preferences, setPreference } = usePreferences();
  const [searchParams] = useSearchParams();
  const [edit, setEdit] = useState<MediaItem | null>(null);
  const view = preferences.mediaLibrary?.listView ?? "list";
  const { permissions } = useStrapi();
  const canUpload = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.create" })
  );
  const canEdit = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.update" })
  );
  const canCopyLink = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.copy-link" })
  );
  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: any[];
  }>({
    pagination: null,
    results: [],
  });
  const folder = R.unless(R.isNil, Number)(searchParams.get("folder"));

  const { value: media = { results: [], pagination: null }, loading } =
    useAsync(async () => {
      const data = await sdk.getMediaItems({
        sort: "createdAt:DESC",
        pageSize: 12,
        "filters[$and][0][folder][id]": folder || undefined,
        "filters[$and][0][folder][id][$null]": !folder || undefined,
      });
      setCollection(data);
    }, [sdk]);

  return (
    <Formik<{
      sort: Sort;
      _q: string;
      page: number;
      pageSize: number;
      folder: number | null;
    }>
      initialValues={{
        _q: "",
        sort: "createdAt:DESC",
        page: 1,
        pageSize: 12,
        folder,
      }}
      onSubmit={async ({ folder, ...values }) => {
        const data = await sdk.getMediaItems({
          "filters[$and][0][folder][id]": folder ? String(folder) : undefined,
          "filters[$and][0][folder][id][$null]": !folder || undefined,
          ...values,
        });
        setCollection(data);
      }}
    >
      {({ setFieldValue, submitForm }) => (
        <>
          {edit && canEdit && (
            <EditMediaModal
              media={edit}
              onCancel={() => setEdit(null)}
              onSave={() => {
                setEdit(null);
                submitForm();
              }}
              onDelete={() => {
                setEdit(null);
                submitForm();
              }}
            />
          )}
          <div className="px-4 md:px-12 py-6">
            <div className="flex flex-col md:flex-row items-center my-12 md:mb-24 gap-4">
              <h1 className="m-0 flex-1">{t("common.media_library")}</h1>
              <Segmented
                value={view}
                onChange={(view) =>
                  setPreference(
                    "mediaLibrary.listView",
                    view as "list" | "grid"
                  )
                }
                options={[
                  {
                    icon: <FontAwesomeIcon icon={faTableCells} />,
                    value: "grid",
                  },
                  {
                    icon: <FontAwesomeIcon icon={faTableList} />,
                    value: "list",
                  },
                ]}
              />
              {canUpload && (
                <UploadButton
                  onUploadComplete={submitForm}
                  folder={folder}
                  button={
                    <Button type="primary" className="space-x-2">
                      <FontAwesomeIcon icon={faCloudUpload} />
                      <span>{t("media_library.upload")}</span>
                    </Button>
                  }
                />
              )}
            </div>
            <div className="mb-12">
              <FilterToolbar />
            </div>
            <div className="border-solid border border-gray-200 dark:border-gray-500 dark:bg-gray-700 rounded-md">
              <div className={classNames({ "pb-6": view === "grid" })}>
                <FolderList />
              </div>

              <List
                grid={
                  view === "grid"
                    ? { gutter: 24, lg: 6, md: 4, sm: 4, xs: 2 }
                    : undefined
                }
                loading={loading}
                dataSource={collection.results}
                size="small"
                renderItem={(item) => (
                  <List.Item
                    className={classNames({
                      "hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer":
                        canEdit,
                    })}
                    onClick={() => setEdit(item)}
                    extra={
                      view === "grid" ? null : (
                        <div className="h-full flex gap-2 items-center justify-center">
                          {canCopyLink && (
                            <Button
                              type="text"
                              icon={<FontAwesomeIcon icon={faLink} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                copy(item.url);
                                message.success(t("media_library.url_copied"));
                              }}
                            />
                          )}
                          {canEdit && (
                            <Popconfirm
                              title={t("media_library.delete_item_title")}
                              description={t(
                                "media_library.delete_item_description"
                              )}
                              onConfirm={async (e) => {
                                e?.stopPropagation();
                                await sdk.deleteMediaItem(item.id);
                                submitForm();
                              }}
                              onCancel={(e) => {
                                e?.stopPropagation();
                              }}
                              okText={t("common.yes")}
                              cancelText={t("common.no")}
                              okButtonProps={{ type: "primary", danger: true }}
                            >
                              <Button
                                type="text"
                                icon={<FontAwesomeIcon icon={faTrashAlt} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              />
                            </Popconfirm>
                          )}
                        </div>
                      )
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        item.mime.startsWith("image/") ? (
                          <img
                            className="rounded-md object-contain"
                            src={
                              item.mime === "image/svg+xml"
                                ? item.url
                                : item.formats?.thumbnail?.url
                            }
                            style={{
                              width: view === "grid" ? 128 : 40,
                              height: view === "grid" ? 128 : 40,
                            }}
                            alt=""
                          />
                        ) : (
                          <div
                            className={classNames(
                              "flex items-center justify-center bg-indigo-50 rounded-md select-none",
                              view === "grid" ? "w-32 h-32" : "h-10 w-10"
                            )}
                          >
                            <FontAwesomeIcon
                              icon={faFile}
                              className="text-indigo-500"
                            />
                          </div>
                        )
                      }
                      title={
                        view === "grid" ? undefined : (
                          <div className="max-w-xs select-none">
                            <Typography.Text ellipsis={{ tooltip: true }}>
                              {item.name}
                            </Typography.Text>
                          </div>
                        )
                      }
                      description={
                        view === "grid" ? undefined : (
                          <div className="space-y-2 select-none dark:text-gray-300">
                            {item.caption && (
                              <div className="font-mono truncate">
                                {item.caption}
                              </div>
                            )}
                            <div className="space-x-4">
                              <span>{item.ext.slice(1).toUpperCase()}</span>
                              <span>
                                {String(
                                  filesize(item.size * 1000, { round: 0 })
                                )}
                              </span>
                              {item.mime.startsWith("image/") && (
                                <span>{`${item.width} x ${item.height}`}</span>
                              )}
                              <CalendarTime>{item.createdAt}</CalendarTime>
                            </div>
                          </div>
                        )
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
            <div className="mt-12">
              <Pagination
                current={collection.pagination?.page}
                pageSize={collection.pagination?.pageSize}
                total={collection.pagination?.total}
                onChange={(page) => {
                  setFieldValue("page", page);
                  submitForm();
                }}
              />
            </div>
          </div>
        </>
      )}
    </Formik>
  );
};

export default MediaList;
