// modules

const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

// const

const PORT = 3000
const ENV = {}

const app = express()
const config = require('./webpack.config.js')(ENV)
const compiler = webpack(config)

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
)

app.use(webpackHotMiddleware(compiler))

app.listen(PORT, function() {
  console.log(`dev server listening on port ${PORT}!\n`)
})
