const fs = require('fs')
const path = require('path')
const markded = require('marked')

function parse (p) {
  const filePath = path.resolve(process.cwd(), p)
  const content = fs.readFileSync(filePath, 'utf8')
  return markded(content)
}

module.exports = {
  parse
}
