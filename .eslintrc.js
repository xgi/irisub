module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `irisub-eslint`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["packages/*/"],
    },
  },
};
