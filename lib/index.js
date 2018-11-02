const fs = require('fs')
const markded = require('marked')

function parse (filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  return markded(content)
}

module.exports = {
  parse
}
