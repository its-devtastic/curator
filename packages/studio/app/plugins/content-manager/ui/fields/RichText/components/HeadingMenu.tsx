import { useCurrentEditor } from "@tiptap/react";
import { Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { getNodeType } from "../utils";

const NODE_TYPES = [
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "paragraph",
  "blockquote",
  "codeBlock",
];

const HeadingMenu: React.FC = () => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation();

  return (
    editor && (
      <Select
        bordered={false}
        className="w-[140px]"
        value={getNodeType(editor)}
        options={NODE_TYPES.map((nodeType) => ({
          label: t(`rich_text_editor.${nodeType}`),
          value: nodeType,
        }))}
        onChange={(nodeType) => {
          const baseCommands = editor.chain().focus().clearNodes();
          if (nodeType.startsWith("heading")) {
            baseCommands
              .setHeading({ level: Number(nodeType.at(-1)) as any })
              .run();
          }
          if (nodeType === "blockquote") {
            baseCommands.setBlockquote().run();
          }
          if (nodeType === "codeBlock") {
            baseCommands.setCodeBlock().run();
          }
          if (nodeType === "paragraph") {
            baseCommands.setParagraph().run();
          }
        }}
      />
    )
  );
};

export default HeadingMenu;
