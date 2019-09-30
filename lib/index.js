const fs = require('fs')
const markded = require('marked')
const Prism = require('prismjs')
const loadLanguages = require('prismjs/components/')
const fetch = require('node-fetch')
const renderer = new markded.Renderer()

renderer.link = function(href, title, text) {
  return `<a href="${href}" target="_blank" rel="noopener" title=${title}>${text}</a>`
}

async function parse(input) {
  let content = ''
  if (Buffer.isBuffer(input)) {
    content = input.toString()
  } else if (input.startsWith('gh:')) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${
          input.split(':')[1]
        }/master/README.md`
      )
      content = await res.text()
    } catch (e) {
      throw new Error('Network Error')
    }
  } else if (input.startsWith('npm:')) {
    try {
      const res = await fetch(
        `https://registry.npmjs.org/${input.split(':')[1]}`
      )
      content = await res.json()
      content = content.readme
    } catch (e) {
      throw new Error('Network Error')
    }
  } else {
    content = fs.readFileSync(input, 'utf8')
  }

  markded.setOptions({
    highlight(code, lang) {
      // No specified language, don't highlight
      if (!lang) return code

      // Pretending to support Vue
      if (lang === 'vue') {
        lang = 'html'
      }

      // Try to load language components
      if (!Prism.languages[lang]) {
        loadLanguages([lang])
      }

      // Still not supported, don't highlight
      if (!Prism.languages[lang]) {
        return code
      }

      // Actually highlight
      return Prism.highlight(code, Prism.languages[lang], lang)
    }
  })
  return markded(content, {
    renderer
  })
}

module.exports = {
  parse
}
