import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "dist",
    "**/dist/**",
    "node_modules",
    "backend",
    "zaytouna-developer2",
    "TempforEC",
  ]),

  {
    files: ["**/*.{js,jsx}"],

    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },

  {
    // Vite and other Node-side config files
    files: [
      "vite.config.js",
      "vite.config.*",
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs",
    ],

    languageOptions: {
      globals: globals.node,
    },
  },

  {
    // shadcn/ui components export cva() variant constants
    // alongside components, which react-refresh flags by design.
    files: ["src/components/ui/**/*.{js,jsx}"],

    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
]);
