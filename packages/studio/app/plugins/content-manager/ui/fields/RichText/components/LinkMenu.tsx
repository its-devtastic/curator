import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@curatorjs/ui";
import { faCheck, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentEditor } from "@tiptap/react";
import React, { useState } from "react";

const LinkMenu: React.FC = () => {
  const { editor } = useCurrentEditor();
  const [link, setLink] = useState("");

  return (
    <Popover
      onOpenChange={(open) => {
        open ? setLink(editor?.getAttributes("link").href ?? "") : setLink("");
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost">
          <FontAwesomeIcon icon={faLink} />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="https://"
            value={link}
            autoFocus
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editor
                  ?.chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: link })
                  .run();
                close();
              }
            }}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              editor
                ?.chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: link })
                .run();
              close();
            }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              editor?.chain().focus().extendMarkRange("link").unsetLink().run();
              close();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkMenu;
