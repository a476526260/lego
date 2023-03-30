import basicConfig, {file, name} from './rollup.config.js'
export default {
  ...basicConfig,
  output: {
    name,
    file: file('esm'),
    format: 'es'
  }
}
