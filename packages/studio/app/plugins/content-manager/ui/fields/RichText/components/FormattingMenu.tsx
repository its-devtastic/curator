import { Button, Separator, Toggle } from "@curatorjs/ui";
import {
  faBold,
  faItalic,
  faListOl,
  faListUl,
  faRedo,
  faStrikethrough,
  faUnderline,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentEditor } from "@tiptap/react";
import React from "react";

import HeadingMenu from "./HeadingMenu";
import ImageMenu from "./ImageMenu";
import LinkMenu from "./LinkMenu";

const FormattingMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    editor && (
      <div className="border-b flex items-center gap-2 p-1 overflow-x-auto overflow-y-hidden">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>

        <div className="w-[140px]">
          <HeadingMenu />
        </div>

        <Toggle
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
        >
          <FontAwesomeIcon icon={faBold} />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
        >
          <FontAwesomeIcon icon={faItalic} />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("underline")}
          onPressedChange={() =>
            editor?.chain().focus().toggleUnderline().run()
          }
        >
          <FontAwesomeIcon icon={faUnderline} />
        </Toggle>
        <Toggle
          pressed={editor?.isActive("strike")}
          onPressedChange={() => editor?.chain().focus().toggleStrike().run()}
        >
          <FontAwesomeIcon icon={faStrikethrough} />
        </Toggle>

        <Separator orientation="vertical" />

        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <FontAwesomeIcon icon={faListOl} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <FontAwesomeIcon icon={faListUl} />
        </Button>

        <Separator orientation="vertical" />

        <LinkMenu />
        <ImageMenu />
      </div>
    )
  );
};

export default FormattingMenu;
