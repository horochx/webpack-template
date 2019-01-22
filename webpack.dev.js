const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    contentBase: './dist',
    hot: true,
  },

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
})
