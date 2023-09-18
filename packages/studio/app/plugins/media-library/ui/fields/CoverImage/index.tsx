import React, { useState } from "react";
import classNames from "classnames";
import { Popover } from "antd";

import { MediaItem } from "@/types/media";
import useCurator from "@/hooks/useCurator";

import MediaLibraryPopover from "../../MediaLibraryPopover";

const CoverImage: React.FC<{
  value: MediaItem | null;
  onChange(item: MediaItem): void;
  objectFit: "contain" | "cover";
}> = ({ value, onChange, objectFit = "cover" }) => {
  const [open, setOpen] = useState(false);
  const {
    images: { getImageUrl },
  } = useCurator();

  return (
    <Popover
      trigger={["click"]}
      placement="top"
      open={open}
      onOpenChange={setOpen}
      content={() => (
        <MediaLibraryPopover
          mime="image"
          onChange={(item) => {
            onChange(item);
            setOpen(false);
          }}
        />
      )}
      overlayInnerStyle={{ padding: 0 }}
    >
      <div className="h-48 bg-gray-100 dark:bg-gray-600 rounded-lg relative group overflow-hidden flex items-center justify-center">
        {value && (
          <img
            src={getImageUrl(value)}
            className={classNames("h-48 w-full absolute", {
              "object-contain": objectFit === "contain",
              "object-cover": objectFit === "cover",
            })}
            alt=""
          />
        )}
        <div
          className={classNames(
            "h-full w-full z-10 relative cursor-pointer",
            value
              ? "hidden group-hover:flex items-center justify-center group-hover:bg-gray-900/40"
              : "block",
          )}
        >
          <span className="text-white font-semibold">{value?.name}</span>
        </div>
      </div>
    </Popover>
  );
};

export default CoverImage;
