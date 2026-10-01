/**
 * Compiles a global CSS entry with the project PostCSS config and exports
 * the result as a string so the layout can inline it. That removes the
 * render-blocking stylesheet request for this file.
 *
 * Production minifies here because this string never goes through Next's
 * CSS minimizer, so PageSpeed otherwise sees the raw stylesheet.
 */
const postcss = require('postcss')
const postcssImport = require('postcss-import')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

module.exports = function cssToStringLoader(source) {
  const callback = this.async()
  const plugins = [postcssImport(), tailwindcss(), autoprefixer()]
  if (process.env.NODE_ENV === 'production') {
    plugins.push(
      cssnano({
        preset: ['default', { discardComments: { removeAll: true } }],
      })
    )
  }

  postcss(plugins)
    .process(source, { from: this.resourcePath })
    .then((result) => {
      for (const message of result.messages) {
        if (message.type === 'dependency' && message.file) this.addDependency(message.file)
        if (message.type === 'dir-dependency' && message.dir) this.addContextDependency(message.dir)
      }
      callback(null, `export default ${JSON.stringify(result.css)}`)
    })
    .catch((error) => callback(error))
}
