import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import {
  type Editor as TipTapEditor,
  EditorContent,
  ReactNodeViewRenderer,
  useEditor,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/a11y-light.min.css';
import { createLowlight } from 'lowlight';
import { useEffect } from 'react';
import { Markdown } from 'tiptap-markdown';
import { ExtensionCodeTabs } from '../extensions/codeTabs';
import { CodeTab } from './CodeTab';

interface Props {
  editorRef: React.RefObject<TipTapEditor>;
  markdown: string;
}

const MenuBar = ({ editor }: { editor: TipTapEditor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        code
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
        clear nodes
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        redo
      </button>
    </>
  );
};

const lowlight = createLowlight({ html, css, js, ts });

export function Editor({ editorRef, markdown }: Props): React.JSX.Element {
  const editor = useEditor({
    extensions: [
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
      StarterKit.configure({ codeBlock: false }),
      ExtensionCodeTabs,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeTab);
        },
      }).configure({ lowlight }),
    ],
    content: markdown,
    injectCSS: false,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(markdown);
    }
  }, [editor, markdown]);

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <hr />
    </>
  );
}
