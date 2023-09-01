import React from "react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { EditorProvider } from "@tiptap/react";

import { FieldDefinition } from "@/types/contentTypeConfig";
import { Attribute } from "@/types/contentType";

import "./RichtText.css";
import FormattingMenu from "./components/FormattingMenu";

const extensions = [
  StarterKit,
  Typography,
  Link.configure({ autolink: true, linkOnPaste: true, openOnClick: false }),
  Underline,
];

const RichTextField: React.FC<{
  value: string;
  onChange(value: string): void;
  field: FieldDefinition;
  attribute: Attribute;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <div className="border border-solid rounded-md border-gray-200 dark:border-gray-500 focus-within:border-indigo-500 focus-within:ring-2 ring-indigo-500/5">
      <EditorProvider
        extensions={extensions}
        content={value}
        editable={!disabled}
        onUpdate={({ editor }) => onChange?.(editor.getHTML())}
        editorProps={{
          attributes: {
            class: "rich-text-field",
          },
        }}
        slotBefore={<FormattingMenu />}
      >
        <span />
      </EditorProvider>
    </div>
  );
};

export default RichTextField;
