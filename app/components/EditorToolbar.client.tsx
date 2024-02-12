import {
  BoldItalicUnderlineToggles,
  ButtonWithTooltip,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  UndoRedo,
  insertDirective$,
  usePublisher,
} from '@mdxeditor/editor';
import { type LeafDirective } from 'mdast-util-directive';
import React from 'react';

const DirectiveButton = () => {
  // grab the insertDirective action (a.k.a. publisher) from the
  // state management system of the directivesPlugin
  const insertDirective = usePublisher(insertDirective$);

  return (
    <ButtonWithTooltip
      title="Inset tabs"
      onClick={() => {
        insertDirective({
          name: 'callout',
          type: 'leafDirective',
          attributes: {},
          children: [],
        } as LeafDirective);
      }}
    >
      Tabs
    </ButtonWithTooltip>
  );
};

export function EditorToolbar(): React.JSX.Element {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === 'codeblock',
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
                <Separator />
                <DirectiveButton />
                <InsertCodeBlock />
                <Separator />
                <InsertFrontmatter />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
}
