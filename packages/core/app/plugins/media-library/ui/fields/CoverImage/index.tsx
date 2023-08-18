import React from "react";

import { MediaItem } from "~/types/media";

import MediaField from "../MediaField";
import classNames from "classnames";

const CoverImage: React.FC<{
  value: MediaItem | null;
  onChange(item: MediaItem): void;
}> = ({ value, onChange }) => {
  return (
    <div className="h-48 bg-gray-100 dark:bg-gray-600 rounded-lg relative group overflow-hidden">
      {value && (
        <img
          src={value.formats?.large?.url ?? value.url}
          className="h-48 object-cover w-full absolute"
          alt=""
        />
      )}
      <div
        className={classNames(
          "h-full items-center justify-center flex-col gap-2 z-10 relative",
          value ? "hidden group-hover:flex group-hover:bg-black/20" : "flex"
        )}
      >
        <MediaField
          mime="image"
          showAvatar={false}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CoverImage;
