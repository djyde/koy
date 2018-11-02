#!/usr/bin/env node

const { EventEmitter } = require('events')
const fs = require('fs')
const path = require('path')
const carlo = require('carlo')
const chokidar = require('chokidar')
const { parse } = require('../lib')
const os = require('os')

const tmpDir = path.resolve(os.tmpdir(), '.koy')

const main = async () => {
  const filePath = path.resolve(process.argv[2] || 'README.md')

  if (filePath && fs.existsSync(filePath)) {
    const app = await carlo.launch({
      userDataDir: tmpDir
    })
    app.serveFolder(path.resolve(__dirname, '../www'))
    app.on('exit', () => process.exit())
    // Use the native EventEmitter will throw error when calling `event.on`
    class Events extends EventEmitter {}
    const event = new Events()
    await app.exposeObject('event', event)
    await app.exposeFunction('parse', _ => {
      return {
        content: parse(filePath),
        filePath
      }
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
}

main().catch(console.error)
