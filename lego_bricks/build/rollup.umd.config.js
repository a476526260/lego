import basicConfig, {file, name} from './rollup.config.js'
import globals from "globals";
export default {
  ...basicConfig,
  output: {
    name: 'legoComponents',
    file: file('umd'),
    format: 'umd',
    globals: {
      'vue': 'Vue',
      'lodash-es': '_'
    },
    exports: 'named'
  },
}
