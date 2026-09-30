/**
 * Compiles a global CSS entry with the project PostCSS config and exports
 * the result as a string so the layout can inline it. That removes the
 * render-blocking stylesheet request for this file.
 */
const postcss = require('postcss')
const postcssImport = require('postcss-import')
const tailwindcss = require('tailwindcss')
const autoprefixer = require('autoprefixer')

module.exports = function cssToStringLoader(source) {
  const callback = this.async()
  postcss([postcssImport(), tailwindcss(), autoprefixer()])
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
