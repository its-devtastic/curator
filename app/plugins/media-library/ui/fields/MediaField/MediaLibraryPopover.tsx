import React, { useState } from "react";
import { useAsyncRetry } from "react-use";
import { Button, Input } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import { MediaItem } from "~/types/media";
import useStrapi from "~/hooks/useStrapi";

import UploadButton from "../../UploadButton";

const MediaLibraryPopover: React.FC<{
  onChange(item: MediaItem): void;
  mime: "image";
}> = ({ onChange, mime }) => {
  const { sdk } = useStrapi();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { value, retry, loading } = useAsyncRetry(async () => {
    return sdk.getMediaItems({
      "filters[$and][0][mime][$contains]": mime,
      _q: search,
      sort: "createdAt:DESC",
      pageSize: 12,
    });
  }, [sdk, search]);

  return (
    <div>
      <div className="p-2 border-b border-0 border-solid border-gray-200 flex items-center gap-2">
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
        <Input.Search
          size="small"
          onSearch={(value) => setSearch(value)}
          loading={loading}
        />
      </div>
      <div className="grid grid-cols-4 gap-2 p-2">
        {loading && !value && (
          <>
            {R.times(R.identity, 12).map((idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-sm bg-gray-100 animate-pulse"
              />
            ))}
          </>
        )}
        {value?.results.map((item) => (
          <div key={item.id} onClick={() => onChange(item)}>
            {item.mime.startsWith("image/") ? (
              <img
                className="flex w-12 h-12 rounded-sm hover:cursor-pointer object-cover hover:opacity-80 bg-gray-50"
                src={
                  item.mime === "image/svg+xml"
                    ? item.url
                    : item.formats?.thumbnail?.url
                }
                alt=""
              />
            ) : item.mime.startsWith("video/") ? (
              <video
                className="flex w-12 h-12 rounded-sm hover:cursor-pointer object-cover hover:opacity-80 bg-gray-50"
                src={item.url}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaLibraryPopover;
