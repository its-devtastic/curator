import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "@/ui/Popover";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import { MediaLibraryPopover } from "@/plugins/media-library";

const ImageMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    <Popover
      trigger={["click"]}
      content={(close) => (
        <MediaLibraryPopover
          mime="image"
          onChange={(item) => {
            editor
              ?.chain()
              .focus()
              .setImage({ src: item.url, alt: item.alternativeText ?? "" })
              .run();
            close();
          }}
        />
      )}
    >
      <button className="richt-text-button">
        <FontAwesomeIcon icon={faImage} />
      </button>
    </Popover>
  );
};

export default ImageMenu;
