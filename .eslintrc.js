/** @type {ESLint.ConfigData} */
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  plugins: ["react-refresh"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
    },
  },
  rules: {
    // Allow implicit return types.
    "@typescript-eslint/explicit-function-return-type": "off",

    // Allow if(<not a boolean>).
    "@typescript-eslint/strict-boolean-expressions": "off",

    // Unecessary.
    "@typescript-eslint/restrict-template-expressions": "off",

    // Prefer `type` over `interface`.
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],

    // No unused variables.
    "@typescript-eslint/no-unused-vars": "error",

    // ?
    "react-refresh/only-export-components": "warn",

    // Warn about console leftovers.
    "no-console": "error",

    // Unecessary.
    "react/no-unescaped-entities": "off",

    // Wrong dependencies cause errors, so it should be an error.
    "react-hooks/exhaustive-deps": "error",

    // Insert blank lines between import groups and categorize ~/* paths.
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "src/**",
            group: "internal",
          },
        ],
      },
    ],
  },
};
