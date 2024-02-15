import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import markdownitContainer from 'markdown-it-container';
import { CodeTabs } from '../components/CodeTabs/CodeTabs';
import { generateUID } from '../utils/generateUUID';

export const ExtensionCodeTabs = Node.create({
  name: 'codeTabs',
  group: 'block',
  content: 'block+',
  defining: true,
  addOptions() {
    return {
      classes: ['codeTabs'],
    };
  },
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          state.write(`:::${node.attrs.containerClass || ''} \n`);
          state.renderContent(node);
          state.flushClose(1);
          state.write(':::');
          state.closeBlock(node);
        },
        parse: {
          setup(markdownit: any) {
            for (const className of this.options.classes) {
              markdownit.use(markdownitContainer, className);
            }
          },
        },
      },
    };
  },
  addAttributes() {
    return {
      id: generateUID(),
      containerClass: {
        default: null,
        parseHTML: (element) =>
          [...element.classList].find((className) =>
            this.options.classes.includes(className),
          ),
        renderHTML: (attributes) => ({
          class: attributes.containerClass,
        }),
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div',
        getAttrs: (element) => {
          return [...element.classList].find((className) =>
            this.options.classes.includes(className),
          )
            ? null
            : false;
        },
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeTabs);
  },
});
