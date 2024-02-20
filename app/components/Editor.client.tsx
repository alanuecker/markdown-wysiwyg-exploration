import { getPluginType, unwrapList } from '@udecode/plate';
import {
  AutoformatPlugin,
  createAutoformatPlugin,
} from '@udecode/plate-autoformat';
import { MARK_CODE, createCodePlugin } from '@udecode/plate-basic-marks';
import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_CODE_SYNTAX,
  createCodeBlockPlugin,
  insertEmptyCodeBlock,
} from '@udecode/plate-code-block';
import {
  ELEMENT_DEFAULT,
  Plate,
  PlatePlugin,
  createPlugins,
} from '@udecode/plate-common';
import { createNodeIdPlugin } from '@udecode/plate-node-id';
import { createNormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createDeletePlugin } from '@udecode/plate-select';
import { createBlockSelectionPlugin } from '@udecode/plate-selection';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';
import { createTabbablePlugin } from '@udecode/plate-tabbable';
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { CodeBlockElement } from './plate-ui/code-block-element';
import { CodeLeaf } from './plate-ui/code-leaf';
import { CodeLineElement } from './plate-ui/code-line-element';
import { CodeSyntaxLeaf } from './plate-ui/code-syntax-leaf';
import { Editor as PlateEditor } from './plate-ui/editor';
import { FixedToolbar } from './plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from './plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from './plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from './plate-ui/floating-toolbar-buttons';
import { TooltipProvider } from './plate-ui/tooltip';

interface Props {
  editorRef: any;
  markdown: string;
}

const preFormat = (editor) => unwrapList(editor);

const optionsAutoformat: Partial<PlatePlugin<AutoformatPlugin>> = {
  options: {
    rules: [
      {
        mode: 'block',
        type: ELEMENT_CODE_BLOCK,
        match: '```',
        triggerAtBlockStart: false,
        preFormat,
        format: (editor) => {
          insertEmptyCodeBlock(editor, {
            defaultType: ELEMENT_DEFAULT,
            insertNodesOptions: { select: true },
          });
        },
      },
    ],
  },
};

const plugins = createPlugins(
  [
    createCodeBlockPlugin(),
    createCodePlugin(),
    createAutoformatPlugin(optionsAutoformat),
    createBlockSelectionPlugin({
      options: {
        sizes: {
          top: 0,
          bottom: 0,
        },
      },
    }),
    createNodeIdPlugin(),
    createNormalizeTypesPlugin(),
    createResetNodePlugin({
      options: {
        rules: [
          // Usage: https://platejs.org/docs/reset-node
        ],
      },
    }),
    createDeletePlugin(),
    createTabbablePlugin(),
    createTrailingBlockPlugin({
      options: { type: ELEMENT_PARAGRAPH },
    }),
    createDeserializeMdPlugin(),
  ],
  {
    components: {
      [ELEMENT_CODE_BLOCK]: CodeBlockElement,
      [ELEMENT_CODE_LINE]: CodeLineElement,
      [ELEMENT_CODE_SYNTAX]: CodeSyntaxLeaf,
      [MARK_CODE]: CodeLeaf,
    },
  },
);

export function Editor({ editorRef, markdown }: Props): React.JSX.Element {
  return (
    <>
      <TooltipProvider>
        <Plate plugins={plugins} initialValue={markdown}>
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>
          <PlateEditor />
          <FloatingToolbar>
            <FloatingToolbarButtons />
          </FloatingToolbar>
        </Plate>
      </TooltipProvider>
      <hr />
    </>
  );
}
