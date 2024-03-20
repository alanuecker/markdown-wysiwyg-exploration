module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/extensions": [".js", ".cjs", ".ts", ".tsx"],
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ["@typescript-eslint", "react", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    "no-use-before-define": "off",
    // note you must disable the base rule as it can report incorrect errors
    "no-shadow": "off",
    "no-console": [
      "warn",
      {
        allow: ["warn", "error"],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        trailingComma: "all",
        arrowParens: "avoid",
      },
    ],
    "import/no-unresolved": "error",
    "import/prefer-default-export": "off",
    "import/no-default-export": "warn",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
      },
    ],
    "import/no-extraneous-dependencies": "off",
    "import/order": [
      "error",
      {
        groups: [
          "external",
          "builtin",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["builtin"],
        alphabetize: {
          order:
            "asc" /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },

        "newlines-between": "always",
      },
    ],
    "react/jsx-filename-extension": [
      2,
      {
        extensions: [".tsx"],
      },
    ],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "function-declaration",
        unnamedComponents: "function-expression",
      },
    ],
    "@ts-ignore": "off",
    "@typescript-eslint/no-shadow": ["error"],
    // Disable prop-types as we use TypeScript for type checking
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // note you must disable the base rule as it can report incorrect errors
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md#how-to-use
    "@typescript-eslint/no-use-before-define": ["error"],
  },
  overrides: [
    {
      files: ["*.cjs"],
      rules: { "@typescript-eslint/no-var-requires": "off" },
    },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // note: https://github.com/import-js/eslint-import-resolver-typescript/issues/31#issuecomment-539751607
        "import/default": "off",
        "import/named": "off",
      },
    },
    {
      files: [
        "*.stories.d.ts",
        "*.stories.tsx",
        "*.config.ts",
        "*.config.umd.ts",
        "*.config.esm.ts",
        "preview.ts",
        "main.ts",
      ],
      rules: {
        "import/no-default-export": "off",
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};
