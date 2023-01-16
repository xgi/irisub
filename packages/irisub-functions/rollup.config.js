import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import pkg from "./package.json";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  input: "src/index.ts",
  external: [...Object.keys(pkg.dependencies)],
  plugins: [typescript(), nodeResolve()],
  onwarn: () => {
    return;
  },
  output: {
    file: "dist/index.js",
    format: "es",
    sourcemap: true,
  },
};
