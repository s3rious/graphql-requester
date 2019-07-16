import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

import pkg from "./package.json";

export default {
  input: "src/index.ts",

  output: [
    {
      file: pkg.main,
      format: "cjs"
    },
    {
      file: pkg.module,
      format: "es"
    }
  ],

  plugins: [
    resolve({
      mainFields: ["module", "main", "browser"]
    }),
    commonjs(),

    typescript({
      typescript: require("typescript")
    })
  ],

  onwarn: warning => {
    // ignore https://rollupjs.org/guide/en/#error-this-is-undefined
    if (warning.code === "THIS_IS_UNDEFINED") {
      return;
    }

    // tslint:disable-next-line: no-console
    console.warn(warning.message);
  }
};
