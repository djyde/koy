#!/usr/bin/env node

const carlo = require('carlo')
const path = require('path')
const filePath = process.argv[2]
const {parse} = require('../lib')

;(async () => {
  if (filePath) {
    const app = await carlo.launch()
    app.serveFolder(path.resolve(__dirname, '../www'))
    await app.exposeFunction('parse', _ => parse(filePath))
    await app.load('index.html')
  }
})()

