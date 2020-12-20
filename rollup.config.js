import babel from 'rollup-plugin-babel'
import { version, author } from './package.json'

const banner = `/*!
 * vue-validator v${version}
 * (c) ${new Date().getFullYear()} ${author}
 * @license MIT
 */\n`

function getOutput(format) {
  const sufix = format !== 'umd' ? `.${format}` : ''

  return {
    name: 'Validator',
    file: `module/validator${sufix}.js`,
    format, banner
  }
}

export default {
  input: 'src/validator.js',
  output: [getOutput('umd'), getOutput('esm')],
  plugins: [babel()]
}
