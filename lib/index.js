const fs = require('fs')
const markded = require('marked')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const fetch = require('node-fetch')
const renderer = new markded.Renderer()

renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank" rel="noopener" title=${title}>${text}</a>`
}

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
  } else if (filePath.startsWith('npm:')) {
    try {
      const res = await fetch(
        `https://registry.npmjs.org/${filePath.split(':')[1]}`
      )
      content = await res.json()
      content = content.readme
    } catch (e) {
      throw new Error('Network Error')
    }
  } else {
    content = fs.readFileSync(filePath, 'utf8')
  }

  markded.setOptions({
    highlight: function(code, lang = 'markup') {
      if (!Prism.languages[lang]) {
        loadLanguages([lang])
      }
      const c = Prism.highlight(code, Prism.languages[lang], lang)
      return c
    }
  })
  return markded(content, {
    renderer
  })
}

module.exports = {
  parse
}
