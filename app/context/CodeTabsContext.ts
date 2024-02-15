import { createContext } from 'react';

export type CodeTabsContextType = (defaultLanguage: string) => string;

export const CodeTabsContext = createContext<CodeTabsContextType | null>(null);
