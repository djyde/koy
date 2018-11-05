/* eslint-env browser */
/* globals rpc */
async function main() {
  async function render() {
    const { content, filePath } = await window.parse()
    document.getElementById('content').innerHTML = content
    document.title = `${filePath} - Koy`
  }

  await render()

  const event = await rpc.lookup('event')
  event.on('update', () => render())
}

window.onbeforeunload = () => {
  window.updateWindowState({
    height: window.outerHeight,
    width: window.outerWidth,
    left: window.screenX,
    top: window.screenY
  })
}

window.onload = main
