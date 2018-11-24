/* eslint-env browser */
async function main() {
  async function render() {
    const { content, filePath } = await window.parse()
    document.getElementById('content').innerHTML = content
    document.title = `${filePath} - Koy`
  }

  await render()
  window.render = render
}

window.onload = main
