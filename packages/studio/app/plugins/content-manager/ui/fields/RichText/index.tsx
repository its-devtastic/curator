import "./RichtText.css";

import { Attribute, FieldDefinition } from "@curatorjs/types";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import React from "react";

import FormattingMenu from "./components/FormattingMenu";

const extensions = [
  StarterKit,
  Typography,
  Link.configure({ autolink: true, linkOnPaste: true, openOnClick: false }),
  Underline,
  Image.configure({
    HTMLAttributes: {
      class: "rich-text-image",
    },
  }),
];

const RichTextField: React.FC<{
  value: string;
  onChange(value: string): void;
  field: FieldDefinition;
  attribute: Attribute;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <div className="border border-solid rounded-md bg-background focus-within:border-ring">
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
