// eslint.config.js

import globals from "globals";
import js from "@eslint/js";
import markdown from "eslint-plugin-markdown";
import jsonc from "eslint-plugin-jsonc";
import prettierConfig from "eslint-config-prettier";

export default [
  // 1. 全てのファイルに適用する基本設定
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.json", "**/*.md"],
    ignores: ["public/dict/**", "node_modules/**", ".wrangler/**"],
  },

  // 2. JavaScriptファイル用の設定
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },

  // 3. JSONファイル用の設定
  {
    files: ["**/*.json"],
    plugins: {
      jsonc: jsonc,
    },
    languageOptions: {
      parser: jsonc.parser,
    },
    rules: {
      ...jsonc.configs["recommended-with-jsonc"].rules,
    },
  },

  // 4. Markdownファイル内のコードブロック用設定
  {
    files: ["**/*.md"],
    plugins: {
      markdown: markdown,
    },
    processor: "markdown/markdown",
  },
  {
    files: ["**/*.md/*.js"],
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },

  // 5. Prettierとの連携設定 (これが一番最後にくることが重要)
  prettierConfig,
];
