import * as Tabs from '@radix-ui/react-tabs';
import React, {
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { BaseElement, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { CodeTabsContext } from '../../context/CodeTabsContext';
import { CodeLanguageSelect } from '../CodeLanguageSelect';
import classes from './style.module.css';

interface Props {
  element: BaseElement;
  children: React.ReactNode;
}

export const CodeBlock = forwardRef<HTMLDivElement, Props>(
  ({ element, children, ...props }, ref) => {
    const [id, setId] = useState<string>('');
    const testRef = useRef<string>('');
    const editor = useSlateStatic();
    const { addCodeBlock, removeCodeBlock } = useContext(CodeTabsContext);

    useEffect(() => {
      return () => {
        if (testRef.current && removeCodeBlock) {
          // note: workaround because first set of components was created and unmounted immediately
          removeCodeBlock(testRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (addCodeBlock && !id) {
        const tabId = addCodeBlock(element.lang);
        setId(tabId);
        testRef.current = tabId;
      }
    }, [addCodeBlock, id, element]);

    const Component = id ? Tabs.Content : 'div';

    const setLanguage = (lang: string) => {
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, { lang }, { at: path });
    };

    return (
      <Component style={{ position: 'relative' }} value={id}>
        <CodeLanguageSelect
          value={element.lang || 'text'}
          onChange={setLanguage}
        />
        <pre {...props}>
          {children}
        </pre>
      </Component>
    );
  },
);

CodeBlock.displayName = 'CodeBlock';
