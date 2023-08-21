import React, { useState } from "react";
import { Avatar, Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import { MediaItem } from "@/types/media";

import MediaLibraryPopover from "./MediaLibraryPopover";

const MediaField: React.FC<MediaFieldProps> = ({
  value,
  onChange,
  mime,
  showAvatar = true,
  clearable = true,
  ...props
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        {showAvatar &&
          value &&
          (value.mime.startsWith("image/") ? (
            <Avatar
              size="large"
              src={
                value?.mime === "image/svg+xml"
                  ? value?.url
                  : value?.formats?.thumbnail?.url
              }
            />
          ) : value.mime.startsWith("video/") ? (
            <video
              className="flex w-9 h-9 rounded-full object-cover"
              src={value.url}
            />
          ) : value.mime.startsWith("audio/") ? (
            <audio controls className="h-9 w-64" src={value.url} />
          ) : null)}
        <Popover
          trigger={["click"]}
          placement="top"
          open={open}
          onOpenChange={setOpen}
          content={() => (
            <MediaLibraryPopover
              mime={mime}
              onChange={(item) => {
                onChange(item);
                setOpen(false);
              }}
            />
          )}
          overlayInnerStyle={{ padding: 0 }}
        >
          <Button>{t("phrases.select_media")}</Button>
        </Popover>
        {clearable && value && (
          <Button
            type="text"
            danger
            size="small"
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            onClick={() => {
              onChange(null);
            }}
          />
        )}
      </div>
      <div className="text-gray-500">{value?.name}</div>
    </div>
  );
};

export default MediaField;

interface MediaFieldProps {
  value: MediaItem | null;
  onChange(item: MediaItem | null): void;
  mime: "image" | "audio";
  showAvatar?: boolean;
  clearable?: boolean;
}
