module.exports = {
  extends: ["turbo", "react-app", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "react/jsx-key": "off",
  },
};
