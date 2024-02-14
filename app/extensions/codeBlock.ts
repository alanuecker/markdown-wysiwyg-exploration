import CodeBlock, { CodeBlockOptions } from '@tiptap/extension-code-block';

export const ExtensionCodeBlock = CodeBlock.extend<CodeBlockOptions>({
  addNodeView() {
    return (props) => {
      // Markup
      /*
        <div class="node-view">
          <span class="label">Node view</span>

          <div class="content"></div>
        </div>
      */

      const dom = document.createElement('div');

      dom.classList.add('node-view');

      const label = document.createElement('span');

      label.classList.add('label');
      label.innerHTML =  this.editor.$pos(props.getPos()).node.type.name === 'codeTabs' ? 'In Code Tab' : 'Outside Code Tab';
      label.contentEditable = false;

      const content = document.createElement('div');

      content.classList.add('content');

      dom.append(label, content);

      return {
        dom,
        contentDOM: content,
      };
    };
  },
});
