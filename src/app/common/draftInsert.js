// Link and image insertion for the draft-js email editors. The entities
// they create are the ones draft-js-export-html turns into <a> and <img>.
import React from "react";
import { AtomicBlockUtils, EditorState, Modifier, RichUtils } from "draft-js";

const askUrl = (label) => {
  const raw = window.prompt(label, "https://");
  if (!raw || raw.trim() === "https://") return null;
  const url = raw.trim();
  return /^(https?:|mailto:)/i.test(url) ? url : `https://${url}`;
};

// Links the selected text, or inserts the address as linked text.
export const insertLink = (editorState) => {
  const url = askUrl("Link address");
  if (!url) return editorState;
  const content = editorState.getCurrentContent().createEntity("LINK", "MUTABLE", { url });
  const key = content.getLastCreatedEntityKey();
  const selection = editorState.getSelection();
  if (selection.isCollapsed()) {
    const next = Modifier.insertText(content, selection, url, null, key);
    return EditorState.push(editorState, next, "insert-characters");
  }
  return RichUtils.toggleLink(EditorState.set(editorState, { currentContent: content }), selection, key);
};

export const insertImage = (editorState) => {
  const src = askUrl("Image address (a link to the picture)");
  if (!src) return editorState;
  const content = editorState.getCurrentContent().createEntity("IMAGE", "IMMUTABLE", { src });
  const next = EditorState.set(editorState, { currentContent: content });
  return AtomicBlockUtils.insertAtomicBlock(next, content.getLastCreatedEntityKey(), " ");
};

function ImageBlock({ block, contentState }) {
  const entity = block.getEntityAt(0);
  if (!entity) return null;
  const { src } = contentState.getEntity(entity).getData();
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={{ maxWidth: "100%" }} />;
}

// Pass as the Editor's blockRendererFn so inserted images show while typing.
export const imageBlockRenderer = (block) =>
  block.getType() === "atomic" ? { component: ImageBlock, editable: false } : null;
