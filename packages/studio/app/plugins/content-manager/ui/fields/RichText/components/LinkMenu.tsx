import { faCheck, faLink, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentEditor } from "@tiptap/react";
import { Button, Input, Space } from "antd";
import React, { useState } from "react";

import Popover from "@/ui/Popover";

const LinkMenu: React.FC = () => {
  const { editor } = useCurrentEditor();
  const [link, setLink] = useState("");

  return (
    <Popover
      trigger={["click"]}
      onOpenChange={(open) => {
        open ? setLink(editor?.getAttributes("link").href ?? "") : setLink("");
      }}
      content={(close) => {
        return (
          <div className="space-x-1">
            <Space.Compact>
              <Input
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
                icon={<FontAwesomeIcon icon={faCheck} />}
                onClick={() => {
                  editor
                    ?.chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: link })
                    .run();
                  close();
                }}
              />
            </Space.Compact>
            <Button
              icon={<FontAwesomeIcon icon={faXmark} />}
              type="text"
              onClick={() => {
                editor
                  ?.chain()
                  .focus()
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                close();
              }}
            />
          </div>
        );
      }}
    >
      <button className="richt-text-button">
        <FontAwesomeIcon icon={faLink} />
      </button>
    </Popover>
  );
};

export default LinkMenu;
