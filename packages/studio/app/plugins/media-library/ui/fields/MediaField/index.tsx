import React, { useState } from "react";
import { Avatar, Button, Popover } from "antd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import * as R from "ramda";

import { MediaItem } from "@/types/media";
import useCurator from "@/hooks/useCurator";

import MediaLibraryPopover from "../../MediaLibraryPopover";

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
  const {
    images: { getImageUrl },
  } = useCurator();
  const isMulti = Array.isArray(value);
  const media = isMulti ? value : value ? [value] : [];

  return (
    <div className="space-y-4">
      {media.map((item) => (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {showAvatar &&
              (item.mime.startsWith("image/") ? (
                <Avatar size="large" src={getImageUrl(item)} />
              ) : item.mime.startsWith("video/") ? (
                <video
                  className="flex w-9 h-9 rounded-full object-cover"
                  src={item.url}
                />
              ) : item.mime.startsWith("audio/") ? (
                <audio controls className="h-9 w-64" src={item.url} />
              ) : null)}

            {clearable && (
              <Button
                type="text"
                danger
                size="small"
                icon={<FontAwesomeIcon icon={faTrashAlt} />}
                onClick={() => {
                  onChange(isMulti ? R.without([item], value) : null);
                }}
              />
            )}
          </div>
          <div className="text-gray-500">{item?.name}</div>
        </div>
      ))}
      <Popover
        trigger={["click"]}
        placement="top"
        open={open}
        onOpenChange={setOpen}
        content={() => (
          <MediaLibraryPopover
            mime={mime}
            onChange={(item) => {
              onChange(isMulti ? [...value, item] : item);
              setOpen(false);
            }}
          />
        )}
        overlayInnerStyle={{ padding: 0 }}
      >
        <Button>{t("phrases.select_media")}</Button>
      </Popover>
    </div>
  );
};

export default MediaField;

interface MediaFieldProps {
  value: MediaItem[] | MediaItem | null;
  onChange(item: MediaItem[] | MediaItem | null): void;
  mime: "image" | "audio";
  showAvatar?: boolean;
  clearable?: boolean;
}
