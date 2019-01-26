const { distPath } = require('./webpack.utils')
const webpack = require('webpack')

module.exports = {
  mode: 'development',

  devtool: 'source-map',

  devServer: {
    contentBase: distPath,
    hot: true,
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
}
