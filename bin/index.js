#!/usr/bin/env node

const { EventEmitter } = require('events')
const path = require('path')
const carlo = require('carlo')
const chokidar = require('chokidar')
const { parse, config } = require('../lib')
const os = require('os')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

updateNotifier({ pkg }).notify()

const tmpDir = path.resolve(os.tmpdir(), '.koy')

const main = async () => {
  const filePath =
    process.argv[2] && process.argv[2].startsWith('gh:')
      ? process.argv[2]
      : path.resolve(process.argv[2] || 'README.md')

  const { width, height, left, top } = config.get('windowState') || {}
  const app = await carlo.launch({
    userDataDir: tmpDir,
    width,
    height,
    args: [
      // FIX: doesn't seem to work
      left !== undefined &&
        top !== undefined &&
        `--window-position=${left},${top}`
    ].filter(Boolean)
  })
  app.serveFolder(path.resolve(__dirname, '../www'))
  app.on('exit', () => process.exit())
  // Use the native EventEmitter will throw error when calling `event.on`
  class Events extends EventEmitter {}
  const event = new Events()
  await app.exposeObject('event', event)

  await app.exposeFunction('parse', async _ => {
    const content = await parse(filePath)
    return {
      content,
      filePath
    }
  })
  await app.exposeFunction('updateWindowState', windowState => {
    config.set('windowState', windowState)
  })
  await app.load('index.html')

  chokidar
    .watch(filePath, {
      ignoreInitial: true
    })
    .on('change', () => {
      event.emit('update')
    })
}

main().catch(console.error)
