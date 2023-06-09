import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import "./RichtText.css";

const RichTextField: React.FC<{
  value: string;
  onChange(value: string): void;
}> = ({ value, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value ?? ""}
      config={{
        heading: {
          options: [
            {
              model: "paragraph",
              title: "Paragraph",
              class: "ck-heading_paragraph",
            },
            {
              model: "heading2",
              view: "h2",
              title: "Heading 2",
              class: "ck-heading_heading2",
            },
            {
              model: "heading3",
              view: "h3",
              title: "Heading 3",
              class: "ck-heading_heading3",
            },
            {
              model: "heading4",
              view: "h4",
              title: "Heading 4",
              class: "ck-heading_heading4",
            },
          ],
        },
        toolbar: [
          "undo",
          "redo",
          "|",
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "link",
          "insertTable",
          "blockQuote",
        ],
      }}
      onChange={(value, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default RichTextField;
