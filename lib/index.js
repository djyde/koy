const fs = require('fs')
const markded = require('marked')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const fetch = require('node-fetch')

async function parse(filePath) {
  let content = ''
  if (filePath.startsWith('gh:')) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${
          filePath.split(':')[1]
        }/master/README.md`
      )
      content = await res.text()
    } catch (e) {
      throw new Error('Network Error')
    }
  } else {
    content = fs.readFileSync(filePath, 'utf8')
  }

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
