const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const resolve = p => path.resolve(__dirname, p)

module.exports = {
  entry: {
    index: resolve('src/index.ts'),
    another: resolve('src/another.ts'),
  },

  output: {
    hashDigestLength: 8,
    path: resolve('dist'),
  },

  optimization: {
    usedExports: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  plugins: [
    new ManifestPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'webpack template',
      filename: 'index.html',
      template: resolve('src/template.html'),
      chunks: ['runtime', 'vendors', 'index'],
    }),
    new HtmlWebpackPlugin({
      title: 'another',
      filename: 'another.html',
      template: resolve('src/template.html'),
      chunks: ['runtime', 'vendors', 'another'],
    }),
  ],

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': resolve('src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ts|js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
}
