#!/usr/bin/env node

const carlo = require('carlo')
const path = require('path')
const filePath = process.argv[2]
const {parse} = require('../lib')
const os = require('os')

const tmpDir = path.resolve(os.tmpdir(), '.koy')

;(async () => {
  if (filePath) {
    const app = await carlo.launch({
      userDataDir: tmpDir
    })
    app.serveFolder(path.resolve(__dirname, '../www'))
    app.on('exit', () => process.exit())
    await app.exposeFunction('parse', _ => {
      return {
        content: parse(filePath),
        filePath
      }
    })
    await app.load('index.html')
  }
})()

