module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-inferrable-types": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-member-accessibility": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
  },
};
