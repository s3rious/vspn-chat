import replace from 'rollup-plugin-replace';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import html from "rollup-plugin-bundle-html";

import pkg from "./package.json";

let output = [];

let plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),

  resolve({
    mainFields: ["module", "main", "browser"]
  }),
  commonjs(),

  typescript({
    typescript: require("typescript")
  })
];

if (process.env.NODE_ENV === "development") {
  output = [
    ...output,
    {
      file: pkg.main,
      format: "iife",
      name: "Chat",
      sourcemap: "inline"
    }
  ];

  plugins = [
    ...plugins,
    html({
      dest: "dist/",
      filename: "index.html",
      inject: "head",
      template: "src/template.html"
    })
  ];
} else {
  output = [
    ...output,
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "cjs",
      sourcemap: true
    }
  ];
}

export default {
  input: "src/index.tsx",
  output,
  plugins
};
