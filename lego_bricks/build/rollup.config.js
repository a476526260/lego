import vue from 'rollup-plugin-vue';
import {nodeResolve} from '@rollup/plugin-node-resolve'
import css from 'rollup-plugin-css-only';
import typescript from 'rollup-plugin-typescript2';
import pkg from '../package.json' assert {type: 'json'};

const overrides = {
  compilerOptions: {declaration: true},
  exclude: [
    "node_modules",
    "src/App.vue",
    "src/main.ts",
  ]
}
const {name} = pkg
const file = type => `dist/${pkg.name}.${type}.js`
export {name, file}
export default {
  input: 'src/index.ts',
  output: {
    name,
    file: file('esm'),
    format: 'es'
  },
  plugins: [
    nodeResolve(),
    typescript({tsconfigOverride: overrides}),
    vue(),
    css({output: 'bundle.css'})
  ],
  external: ['vue', 'lodash-es']
}
