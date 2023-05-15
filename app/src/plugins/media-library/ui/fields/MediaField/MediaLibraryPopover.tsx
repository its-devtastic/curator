import React from "react";
import { useAsyncRetry } from "react-use";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import { MediaItem } from "~/types/media";
import useStrapi from "~/hooks/useStrapi";

import UploadButton from "../../UploadButton";

const MediaLibraryPopover: React.FC<{ onChange(item: MediaItem): void }> = ({
  onChange,
}) => {
  const { sdk } = useStrapi();
  const { t } = useTranslation();

  const { value, retry, loading } = useAsyncRetry(async () => {
    return sdk.getMediaItems();
  }, [sdk]);

  return (
    <div>
      <div className="p-2 border-b border-0 border-solid border-gray-200">
        <UploadButton
          onUploadComplete={(item) => {
            retry();
            onChange(item);
          }}
          button={
            <Button size="small" type="primary">
              {t("media_library.upload")}
            </Button>
          }
        />
      </div>
      <div className="grid grid-cols-4 gap-2 p-2">
        {loading && (
          <>
            <div className="w-12 h-12 rounded-sm bg-gray-100 animate-pulse" />
            <div className="w-12 h-12 rounded-sm bg-gray-100 animate-pulse" />
            <div className="w-12 h-12 rounded-sm bg-gray-100 animate-pulse" />
            <div className="w-12 h-12 rounded-sm bg-gray-100 animate-pulse" />
          </>
        )}
        {value?.results.map((item) => (
          <div key={item.id} onClick={() => onChange(item)}>
            <img
              className="flex w-12 h-12 rounded-sm hover:cursor-pointer"
              src={
                item.mime === "image/svg+xml"
                  ? item.url
                  : item.formats?.thumbnail?.url
              }
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibraryPopover;
