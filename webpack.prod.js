const { distPath } = require('./webpack.utils')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = {
  mode: 'production',

  plugins: [
    new CleanWebpackPlugin([distPath]),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled ',
      generateStatsFile: true,
      statsFilename: 'webpack-bundle-analyzer.json',
    }),
    new ManifestPlugin(),
  ],
}
