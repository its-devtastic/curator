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
      onChange={(value, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default RichTextField;
