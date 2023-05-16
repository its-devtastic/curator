import React from "react";
import { Button, Image, List, message, Popconfirm } from "antd";
import { filesize } from "filesize";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faLink, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useCopyToClipboard } from "react-use";
import { useTranslation } from "react-i18next";

import { MediaItem } from "~/types/media";
import { Pagination } from "~/types/response";
import useStrapi from "~/hooks/useStrapi";
import CalendarTime from "~/ui/CalendarTime";

const ListView: React.FC<{
  items: MediaItem[];
  pagination: Pagination | null;
  onPageChange(page: number): void;
  onDelete: VoidFunction;
  loading: boolean;
}> = ({ items, pagination, onDelete, onPageChange, loading }) => {
  const { t } = useTranslation();
  const [_, copy] = useCopyToClipboard();
  const { sdk } = useStrapi();

  return (
    <div>
      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={items}
        pagination={
          pagination
            ? { ...pagination, showSizeChanger: false, onChange: onPageChange }
            : false
        }
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
                    onDelete();
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
              title={item.name}
              description={
                <div className="font-mono truncate">{item.caption}</div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ListView;
