module.exports = {
  extends: ['@atamaco/eslint-config-atama'],
  parserOptions: {
    project: './tsconfig.json',
  },
  ignorePatterns: [".*rc.js", "dist"],
};
