import { createContext } from 'react';

export type CodeTabsContextType = (
  defaultLanguage: string,
  updateAttributes: (attributes: Record<string, any>) => void,
) => string;

export const CodeTabsContext = createContext<CodeTabsContextType | null>(null);
