const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

const resolve = p => path.resolve(__dirname, p)

module.exports = merge(common, {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    contentBase: resolve('dist'),
    hot: true,
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
})
