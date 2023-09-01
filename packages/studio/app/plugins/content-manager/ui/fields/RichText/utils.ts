import { Editor } from "@tiptap/core";

export function getNodeType(editor: Editor) {
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
}
