const fs = require('fs')
const fg = require('fast-glob')
const { defaultExtractor } = require('tailwindcss/lib/lib/defaultExtractor')
const base = require('./tailwind.config')
const { homeContent, siteContent } = require('./tailwind.content')

const extract = defaultExtractor({ tailwindConfig: { separator: ':', prefix: '' } })
const blocklist = new Set()
for (const file of fg.sync(homeContent, { onlyFiles: true })) {
  for (const token of extract(fs.readFileSync(file, 'utf8'))) blocklist.add(token)
}

/** Utilities for inner routes, minus classes already shipped in the homepage stylesheet. */
module.exports = {
  ...base,
  content: siteContent,
  blocklist: [...blocklist],
}
