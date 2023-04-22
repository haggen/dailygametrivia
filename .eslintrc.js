/** @type {ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
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
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      settings: {
        "import/resolver": {
          typescript: {},
        },
      },
      plugins: ["@typescript-eslint"],
      rules: {
        // If enabled it whines about CSS module imported classes.
        "@typescript-eslint/no-unsafe-assignment": "off",

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
      },
    },
  ],
};
