import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import perfectionist from "eslint-plugin-perfectionist";
import pluginReact from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: [
      "dist/**",
      ".vercel/**",
      ".astro/**",
      "node_modules/**",
      "public/**",
    ],
  },
  { languageOptions: { globals: globals.browser } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  ...pluginQuery.configs["flat/recommended"],
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    plugins: {
      perfectionist: perfectionist,
      "react-compiler": reactCompiler,
      "react-hooks": reactHooks,
    },
    rules: {
      "perfectionist/sort-array-includes": [
        "error",
        {
          customGroups: [],
          groupKind: "literals-first",
          groups: [],
          ignoreCase: true,
          newlinesBetween: "ignore",
          order: "asc",
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
          useConfigurationIf: {},
        },
      ],
      "perfectionist/sort-enums": [
        "error",
        {
          forceNumericSort: false,
          ignoreCase: true,
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          sortByValue: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^(on|handle)[A-Z]",
              groupName: "callback",
            },
          ],
          groupKind: "mixed",
          groups: ["unknown", "callback"],
          ignoreCase: true,
          ignorePattern: [],
          newlinesBetween: "ignore",
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-modules": [
        "error",
        {
          customGroups: [],
          groups: [
            "declare-enum",
            "export-enum",
            "enum",
            ["declare-interface", "declare-type"],
            ["export-interface", "export-type"],
            ["interface", "type"],
            "declare-class",
            "class",
            "export-class",
            "declare-function",
            "export-function",
            "function",
          ],
          ignoreCase: true,
          newlinesBetween: "ignore",
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: true,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-object-types": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^(on|handle)[A-Z]",
              groupName: "callback",
            },
          ],
          groups: ["unknown", "callback"],
          ignoreCase: true,
          ignorePattern: [],
          newlinesBetween: "ignore",
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-objects": [
        "error",
        {
          customGroups: [
            {
              elementNamePattern: "^(on|handle)[A-Z]",
              groupName: "callback",
              selector: "property",
            },
          ],
          destructuredObjects: true,
          groups: ["unknown", "callback"],
          ignoreCase: true,
          ignorePattern: [],
          newlinesBetween: "ignore",
          objectDeclarations: true,
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: "keep",
          styledComponents: true,
          type: "alphabetical",
          useConfigurationIf: {},
        },
      ],
      "perfectionist/sort-sets": [
        "error",
        {
          customGroups: [],
          groupKind: "literals-first",
          groups: [],
          ignoreCase: true,
          newlinesBetween: "ignore",
          order: "asc",
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
          useConfigurationIf: {},
        },
      ],
      "perfectionist/sort-switch-case": [
        "error",
        {
          ignoreCase: true,
          order: "asc",
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "perfectionist/sort-variable-declarations": [
        "error",
        {
          ignoreCase: true,
          order: "asc",
          partitionByComment: false,
          partitionByNewLine: false,
          specialCharacters: "keep",
          type: "alphabetical",
        },
      ],
      "react-compiler/react-compiler": "error",
      "react-hooks/exhaustive-deps": "error",
      "react-hooks/rules-of-hooks": "error",
      "react/boolean-prop-naming": [
        "error",
        { rule: "^(is|has|as)[A-Z]([A-Za-z0-9]?)+" },
      ],
      "react/hook-use-state": ["error", { allowDestructuredState: true }],
      "react/jsx-handler-names": [
        "error",
        {
          checkInlineFunction: false,
          checkLocalVariables: false,
          eventHandlerPrefix: "handle",
          eventHandlerPropPrefix: "on",
          ignoreComponentNames: [],
        },
      ],
      "react/jsx-max-depth": ["error", { max: 10 }],
      "react/jsx-newline": ["error", { allowMultilines: true, prevent: true }],
      "react/jsx-sort-props": [
        "error",
        {
          callbacksLast: true,
          ignoreCase: true,
          multiline: "ignore",
          reservedFirst: true,
          shorthandLast: true,
        },
      ],
      "react/no-unused-prop-types": ["error"],
    },
  },
];
