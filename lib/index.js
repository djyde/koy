const fs = require('fs')
const markded = require('marked')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')

function parse(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  markded.setOptions({
    highlight: function(code, lang) {
      if (!Prism.languages[lang]) {
        loadLanguages([lang])
      }
      const c = Prism.highlight(code, Prism.languages[lang], lang)
      return c
    }
  })
  return markded(content)
}

module.exports = {
  parse
}
