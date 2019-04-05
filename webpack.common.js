const {
  resolve,
  sourcePath,
  distPath,
  createFileLoader,
} = require('./webpack.utils')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = (env = {}) => {
  const isProduction = env.production

  return merge(
    {
      entry: {
        react: resolve(sourcePath, 'react/index.tsx'),
        vue: resolve(sourcePath, 'vue/main.ts'),
      },

      output: {
        path: distPath,
        hashDigestLength: 8,
        filename: isProduction
          ? 'js/[contenthash].bundle.js'
          : '[name].bundle.js',
        chunkFilename: isProduction
          ? 'js/[contenthash].bundle.js'
          : '[name].bundle.js',
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
        new VueLoaderPlugin(),
        new CopyPlugin([
          {
            from: resolve('./public'),
            to: distPath,
          },
        ]),
        new ForkTsCheckerWebpackPlugin(),
        new DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify(
              isProduction ? 'production' : 'development'
            ),
          },
          SERVICE_URL: JSON.stringify('https://dev.example.com/'),
        }),
        new HtmlWebpackPlugin({
          title: 'React App',
          filename: 'index.html',
          template: resolve('./public/index.html'),
          chunks: ['runtime', 'vendors', 'react'],
        }),
        new HtmlWebpackPlugin({
          title: 'Vue App',
          filename: 'vue.html',
          template: resolve('./public/index.html'),
          chunks: ['runtime', 'vendors', 'vue'],
        }),
      ],

      resolve: {
        modules: [sourcePath, 'node_modules'],
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
          '@': sourcePath,
        },
        symlinks: false,
        cacheWithContext: false,
      },

      module: {
        rules: [
          {
            test: /\.css$/,
            include: sourcePath,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
          {
            test: /\.(png|svg|jpe?g|gif)$/,
            include: sourcePath,
            use: [
              isProduction
                ? {
                    loader: 'url-loader',
                    options: Object.assign(
                      {
                        limit: 10000,
                      },
                      createFileLoader('images', isProduction).options
                    ),
                  }
                : createFileLoader('images', isProduction),
            ],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            include: sourcePath,
            use: [createFileLoader('fonts', isProduction)],
          },
          {
            test: /\.(tsx?|js)$/,
            include: sourcePath,
            use: [
              {
                loader: 'cache-loader',
                options: {
                  cacheDirectory: resolve('node_modules/.cache-loader'),
                },
              },
              'thread-loader',
              {
                loader: 'ts-loader',
                options: {
                  happyPackMode: true,
                },
              },
              'babel-loader',
            ],
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
          },
        ],
      },
    },
    isProduction ? require('./webpack.prod') : require('./webpack.dev')
  )
}
