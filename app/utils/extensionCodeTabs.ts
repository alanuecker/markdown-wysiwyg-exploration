import { Node } from '@tiptap/core';
import markdownitContainer from 'markdown-it-container';

export default Node.create({
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
  renderHTML({ node, HTMLAttributes }) {
    const tabs = [];

    for (let i = 0; i < node.childCount; i += 1) {
      const child = node.child(i);
      const { language } = child.attrs;
      if (language) {
        tabs.push({ language });
      }
    }

    const children = tabs.map(({ language }) => ['div', {}, language]);

    // note: 0 contains the children of this node
    return ['div', HTMLAttributes, ...children, ['div', {}, 0]];
  },
});
