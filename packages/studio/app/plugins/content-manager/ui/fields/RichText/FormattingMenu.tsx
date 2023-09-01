import React, { useState } from "react";
import { Editor } from "@tiptap/core";
import { useCurrentEditor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { Button, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import Popover from "@/ui/Popover";
import {
  faBold,
  faCheck,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faRedo,
  faStrikethrough,
  faUnderline,
  faUndo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

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

const getNodeType = (editor: Editor) => {
  if (editor?.isActive("codeBlock")) {
    return "codeBlock";
  }
  if (editor?.isActive("blockquote")) {
    return "blockquote";
  }
  if (editor?.isActive("heading", { level: 1 })) {
    return "heading1";
  }
  if (editor?.isActive("heading", { level: 2 })) {
    return "heading2";
  }
  if (editor?.isActive("heading", { level: 3 })) {
    return "heading3";
  }
  if (editor?.isActive("heading", { level: 4 })) {
    return "heading4";
  }
  if (editor?.isActive("heading", { level: 5 })) {
    return "heading5";
  }
  if (editor?.isActive("heading", { level: 6 })) {
    return "heading6";
  }
  return "paragraph";
};

const FormattingMenu: React.FC = () => {
  const { editor } = useCurrentEditor();
  const { t } = useTranslation();
  const [link, setLink] = useState("");

  return (
    editor && (
      <div className="bg-white dark:bg-gray-800 rounded-t-md shadow-sm border-0 border-b border-solid border-gray-200 dark:border-gray-500 h-8 flex items-start overflow-hidden">
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full flex items-center">
          <button
            className="richt-text-button"
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button
            className="richt-text-button"
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <FontAwesomeIcon icon={faRedo} />
          </button>
        </div>
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full">
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
        </div>
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full flex items-center">
          <button
            className={classNames(
              "richt-text-button",
              editor?.isActive("bold")
                ? "text-indigo-500"
                : "text-gray-800 dark:text-white"
            )}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button
            className={classNames(
              "richt-text-button",
              editor?.isActive("italic")
                ? "text-indigo-500"
                : "text-gray-800 dark:text-white"
            )}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button
            className={classNames(
              "richt-text-button",
              editor?.isActive("underline")
                ? "text-indigo-500"
                : "text-gray-800 dark:text-white"
            )}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button
            className={classNames(
              "richt-text-button",
              editor?.isActive("strike")
                ? "text-indigo-500"
                : "text-gray-800 dark:text-white"
            )}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
        </div>
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full flex items-center">
          <button
            className="richt-text-button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <FontAwesomeIcon icon={faListOl} />
          </button>
          <button
            className="richt-text-button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <FontAwesomeIcon icon={faListUl} />
          </button>
        </div>
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full flex items-center">
          <Popover
            trigger={["click"]}
            onOpenChange={(open) => {
              open
                ? setLink(editor?.getAttributes("link").href ?? "")
                : setLink("");
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
        </div>
      </div>
    )
  );
};

export default FormattingMenu;
