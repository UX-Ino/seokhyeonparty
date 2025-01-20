module.exports = [
  {
    files: ["src/assets/scripts/**/*.js", "src/assets/scripts/**/*.cjs"],
    rules: {
      indent: ["error", 2],
      quotes: ["error", "single"],
      "prefer-const": "error",
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "comma-dangle": ["error", "always-multiline"],
    },
  },
];
