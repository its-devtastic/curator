import { Button, Popover, PopoverContent, PopoverTrigger } from "@curatorjs/ui";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentEditor } from "@tiptap/react";
import React from "react";

import { MediaLibraryPopover } from "@/plugins/media-library";

const ImageMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <FontAwesomeIcon icon={faImage} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
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
      </PopoverContent>
    </Popover>
  );
};

export default ImageMenu;
