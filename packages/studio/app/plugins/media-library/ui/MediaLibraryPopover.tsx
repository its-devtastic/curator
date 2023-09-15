import React, { useState } from "react";
import { useAsyncRetry } from "react-use";
import { Button, Input, Segmented, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAudio,
  faTableCells,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

import { MediaItem } from "@/types/media";
import useStrapi from "@/hooks/useStrapi";
import usePreferences from "@/hooks/usePreferences";
import useCurator from "@/hooks/useCurator";

import UploadButton from "./UploadButton";

const MediaLibraryPopover: React.FC<{
  onChange(item: MediaItem): void;
  mime: "image" | "audio";
}> = ({ onChange, mime }) => {
  const { sdk, permissions } = useStrapi();
  const {
    images: { getImageUrl },
  } = useCurator();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const canCreate = permissions.some(
    R.whereEq({ action: "plugin::upload.assets.create" }),
  );
  const { preferences, setPreference } = usePreferences();
  const view = preferences.mediaLibrary?.popoverView ?? "grid";

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
        {canCreate && (
          <UploadButton
            onUploadComplete={(item) => {
              retry();
              item?.[0] && onChange(item[0]);
            }}
            button={
              <Button size="small" type="primary">
                {t("media_library.upload")}
              </Button>
            }
          />
        )}
        <Input.Search
          size="small"
          onSearch={(value) => setSearch(value)}
          loading={loading}
        />
        <Segmented
          value={view}
          onChange={(view) =>
            setPreference("mediaLibrary.popoverView", view as "list" | "grid")
          }
          options={[
            { icon: <FontAwesomeIcon icon={faTableCells} />, value: "grid" },
            { icon: <FontAwesomeIcon icon={faTableList} />, value: "list" },
          ]}
        />
      </div>
      {view === "grid" ? (
        <div className="grid grid-cols-4 gap-2 p-2">
          {loading && !value && (
            <>
              {R.times(R.identity, 12).map((idx) => (
                <div
                  key={idx}
                  className="w-24 h-24 rounded-sm bg-gray-100 dark:bg-gray-700 animate-pulse"
                />
              ))}
            </>
          )}
          {value?.results.map((item) => (
            <div
              key={item.id}
              onClick={() => onChange(item)}
              className="hover:cursor-pointer w-24 h-24"
            >
              <Tooltip title={item.name}>
                {item.mime.startsWith("image/") ? (
                  <img
                    className="flex w-full h-full rounded-sm object-cover hover:opacity-80 bg-gray-50 dark:bg-gray-700"
                    src={getImageUrl(item)}
                    alt=""
                  />
                ) : item.mime.startsWith("video/") ? (
                  <video
                    className="flex w-full h-full rounded-sm object-cover hover:opacity-80 bg-gray-50 dark:bg-gray-700"
                    src={item.url}
                  />
                ) : item.mime.startsWith("audio/") ? (
                  <div className="flex items-center justify-center bg-indigo-50 rounded-sm w-full h-full">
                    <FontAwesomeIcon
                      icon={faFileAudio}
                      className="text-lg text-indigo-500"
                    />
                  </div>
                ) : null}
              </Tooltip>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 p-2 max-h-[320px] overflow-y-auto">
          {loading && !value && (
            <>
              {R.times(R.identity, 12).map((idx) => (
                <div
                  key={idx}
                  className="h-4 rounded-sm bg-gray-100 dark:bg-gray-700 animate-pulse"
                />
              ))}
            </>
          )}
          {value?.results.map((item) => (
            <div
              key={item.id}
              onClick={() => onChange(item)}
              className="hover:cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 flex gap-4"
            >
              <div className="w-10 h-10">
                {item.mime.startsWith("image/") ? (
                  <img
                    className="flex w-full h-full rounded-sm object-cover hover:opacity-80 bg-gray-50"
                    src={getImageUrl(item)}
                    alt=""
                  />
                ) : item.mime.startsWith("video/") ? (
                  <video
                    className="flex w-full h-full rounded-sm object-cover hover:opacity-80 bg-gray-50"
                    src={item.url}
                  />
                ) : item.mime.startsWith("audio/") ? (
                  <div className="flex items-center justify-center bg-indigo-50 rounded-sm w-full h-full">
                    <FontAwesomeIcon
                      icon={faFileAudio}
                      className="text-lg text-indigo-500"
                    />
                  </div>
                ) : null}
              </div>
              <div>
                <div className="truncate">{item.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPopover;
