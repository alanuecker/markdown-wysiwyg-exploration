import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface Props {
  markdown: string;
}

export function Editor({ markdown }: Props): React.JSX.Element {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
  });

  return <EditorContent editor={editor} />;
}
