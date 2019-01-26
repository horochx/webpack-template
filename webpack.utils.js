const path = require('path')

const resolve = (...p) => path.resolve(__dirname, ...p)

const sourcePath = resolve('src')

const distPath = resolve('dist')

const createFileLoader = (outputPath, isProduction) => ({
  loader: 'file-loader',
  options: {
    outputPath: isProduction ? outputPath : undefined,
    name: isProduction ? '[hash:8].[ext]' : '[name].[ext]',
  },
})

module.exports = {
  resolve,
  sourcePath,
  distPath,
  createFileLoader,
}
