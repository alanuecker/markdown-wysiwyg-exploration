import { createContext } from 'react';

export type CodeTabsContextType = {
  addCodeBlock: (defaultLanguage: string) => string;
  removeCodeBlock: (id: string) => void;
};

export const CodeTabsContext = createContext<CodeTabsContextType>({
  addCodeBlock: null,
  removeCodeBlock: null,
});
