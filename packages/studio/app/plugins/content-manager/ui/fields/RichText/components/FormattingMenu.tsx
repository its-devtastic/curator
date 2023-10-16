import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
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

import HeadingMenu from "./HeadingMenu";
import LinkMenu from "./LinkMenu";
import ImageMenu from "./ImageMenu";

const FormattingMenu: React.FC = () => {
  const { editor } = useCurrentEditor();

  return (
    editor && (
      <div className="bg-white dark:bg-gray-800 rounded-t-md shadow-sm border-0 border-b border-solid border-gray-200 dark:border-gray-500 h-8 flex items-start overflow-x-auto overflow-y-hidden">
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
          <HeadingMenu />
        </div>
        <div className="border-0 border-solid border-r border-gray-200 dark:border-gray-500 h-full flex items-center">
          <button
            className={classNames(
              "richt-text-button",
              editor?.isActive("bold")
                ? "text-indigo-500"
                : "text-gray-800 dark:text-white",
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
                : "text-gray-800 dark:text-white",
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
                : "text-gray-800 dark:text-white",
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
                : "text-gray-800 dark:text-white",
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
          <LinkMenu />
          <ImageMenu />
        </div>
      </div>
    )
  );
};

export default FormattingMenu;
