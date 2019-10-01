#!/usr/bin/env node

const path = require('path')
const carlo = require('carlo')
const chokidar = require('chokidar')
const getStdin = require('get-stdin')
const { parse } = require('../lib')
const os = require('os')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

updateNotifier({ pkg }).notify()

const [file] = process.argv.splice(2)
const tmpDir = path.resolve(os.tmpdir(), '.koy')

const main = async () => {
  const stdin = await getStdin.buffer()
  const useStdin = Buffer.byteLength(stdin) > 0

  let input
  if (useStdin) {
    input = stdin
  } else if (file && /(npm)|(gh):/.test(file)) {
    input = file
  } else {
    input = path.resolve(file || 'README.md')
  }

  const app = await carlo.launch({
    userDataDir: tmpDir
  })
  app.serveFolder(path.resolve(__dirname, '../www'))
  app.on('exit', () => process.exit())

  await app.exposeFunction('parse', async _ => {
    const content = await parse(input)
    const filePath = useStdin ? 'stdin' : input
    return { content, filePath }
  })

  app.on('window', () => {
    if (useStdin) {
      return app.evaluate(() => window.render()) // eslint-disable-line
    }

    chokidar
      .watch(input, {
        ignoreInitial: true
      })
      .on('change', () => {
        app.evaluate(() => window.render()) // eslint-disable-line
      })
  })

  await app.load('index.html')
}

main().catch(console.error)
