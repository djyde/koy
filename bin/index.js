#!/usr/bin/env node

const path = require('path')
const carlo = require('carlo')
const chokidar = require('chokidar')
const { parse } = require('../lib')
const os = require('os')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

updateNotifier({ pkg }).notify()

const tmpDir = path.resolve(os.tmpdir(), '.koy')

const main = async () => {
  const filePath =
    process.argv[2] && /(npm)|(gh):/.test(process.argv[2])
      ? process.argv[2]
      : path.resolve(process.argv[2] || 'README.md')

  const app = await carlo.launch({
    userDataDir: tmpDir
  })
  app.serveFolder(path.resolve(__dirname, '../www'))
  app.on('exit', () => process.exit())

  await app.exposeFunction('parse', async _ => {
    const content = await parse(filePath)
    return {
      content,
      filePath
    }
  })
  await app.load('index.html')

  chokidar
    .watch(filePath, {
      ignoreInitial: true
    })
    .on('change', () => {
      app.evaluate(() => window.render()) // eslint-disable-line
    })
}

main().catch(console.error)
