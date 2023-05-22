import React, { useState } from "react";
import { Button, Image, List, message, Popconfirm, Typography } from "antd";
import { filesize } from "filesize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUpload,
  faFile,
  faLink,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAsyncRetry, useCopyToClipboard } from "react-use";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";

import { Pagination as IPagination } from "~/types/response";
import { Sort } from "~/types/request";
import useStrapi from "~/hooks/useStrapi";
import CalendarTime from "~/ui/CalendarTime";
import Pagination from "~/ui/Pagination";

import UploadButton from "../../ui/UploadButton";
import FilterToolbar from "./FilterToolbar";

const ListScreen: React.FC = () => {
  const { t } = useTranslation();
  const [_, copy] = useCopyToClipboard();
  const { sdk } = useStrapi();
  const [collection, setCollection] = useState<{
    pagination: IPagination | null;
    results: any[];
  }>({
    pagination: null,
    results: [],
  });

  const {
    value: media = { results: [], pagination: null },
    retry,
    loading,
  } = useAsyncRetry(async () => {
    const data = await sdk.getMediaItems({ sort: "createdAt:DESC" });
    setCollection(data);
  }, [sdk]);

  const { value: folders } = useAsyncRetry(async () => {
    return sdk.getFolders(null);
  }, []);

  return (
    <Formik<{ sort: Sort; _q: string; page: number; pageSize: number }>
      initialValues={{ _q: "", sort: "createdAt:DESC", page: 1, pageSize: 10 }}
      onSubmit={async (values) => {
        const data = await sdk.getMediaItems(values);
        setCollection(data);
      }}
    >
      {({ setFieldValue, submitForm }) => (
        <div className="px-4 md:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between my-12 md:mb-24 gap-4">
            <h1 className="m-0">{t("common.media_library")}</h1>
            <UploadButton
              onUploadComplete={retry}
              button={
                <Button type="primary" className="space-x-2">
                  <FontAwesomeIcon icon={faCloudUpload} />
                  <span>{t("media_library.upload")}</span>
                </Button>
              }
            />
          </div>
          <div className="mb-12">
            <FilterToolbar />
          </div>
          <List
            loading={loading}
            itemLayout="vertical"
            dataSource={collection.results}
            size="small"
            renderItem={(item) => (
              <List.Item
                extra={
                  <div className="h-full flex gap-2 items-center justify-center">
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faLink} />}
                      onClick={() => {
                        copy(item.url);
                        message.success(t("media_library.url_copied"));
                      }}
                    />
                    <Popconfirm
                      title={t("media_library.delete_item_title")}
                      description={t("media_library.delete_item_description")}
                      onConfirm={async () => {
                        await sdk.deleteMediaItem(item.id);
                        retry();
                      }}
                      okText={t("common.yes")}
                      cancelText={t("common.no")}
                      okButtonProps={{ type: "primary", danger: true }}
                    >
                      <Button
                        type="text"
                        icon={<FontAwesomeIcon icon={faTrashAlt} />}
                      />
                    </Popconfirm>
                  </div>
                }
                actions={[
                  <span key="ext">{item.ext.slice(1).toUpperCase()}</span>,
                  <span key="size">
                    {String(filesize(item.size * 1000, { round: 0 }))}
                  </span>,
                  item.mime.startsWith("image/") && (
                    <span key="dimensions">{`${item.width} x ${item.height}`}</span>
                  ),
                  <CalendarTime key="createdAt">{item.createdAt}</CalendarTime>,
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    item.mime.startsWith("image/") ? (
                      <Image
                        className="rounded-md object-contain"
                        src={
                          item.mime === "image/svg+xml"
                            ? item.url
                            : item.formats?.thumbnail?.url
                        }
                        width={64}
                        height={64}
                        alt=""
                        preview={{ width: 640, src: item.url }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-indigo-50 rounded-md">
                        <FontAwesomeIcon
                          icon={faFile}
                          className="text-indigo-500"
                        />
                      </div>
                    )
                  }
                  title={
                    <div className="max-w-xs">
                      <Typography.Text ellipsis={{ tooltip: true }}>
                        {item.name}
                      </Typography.Text>
                    </div>
                  }
                  description={
                    <div className="font-mono truncate">{item.caption}</div>
                  }
                />
              </List.Item>
            )}
          />
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
      )}
    </Formik>
  );
};

export default ListScreen;
