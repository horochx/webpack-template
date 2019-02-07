const {
  resolve,
  sourcePath,
  distPath,
  createFileLoader,
} = require('./webpack.utils')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const threadLoader = require('thread-loader')

// threadLoader.warmup(
//   {
//     workers: 2,
//     workerParallelJobs: 50,
//     workerNodeArgs: ['--max-old-space-size=1024'],
//     poolRespawn: false,
//     poolTimeout: Infinity,
//     poolParallelJobs: 50,
//     name: 'babel-pool',
//   },
//   ['babel-loader']
// )

module.exports = (env = {}) => {
  const isProduction = env.production

  return merge(
    {
      entry: {
        index: resolve(sourcePath, 'index.ts'),
        another: resolve(sourcePath, 'another.ts'),
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
        new HtmlWebpackPlugin({
          title: 'webpack template',
          filename: 'index.html',
          template: resolve(sourcePath, 'template.html'),
          chunks: ['runtime', 'vendors', 'index'],
        }),
        new HtmlWebpackPlugin({
          title: 'another',
          filename: 'another.html',
          template: resolve(sourcePath, 'template.html'),
          chunks: ['runtime', 'vendors', 'another'],
        }),
      ],

      resolve: {
        modules: [sourcePath, 'node_modules'],
        extensions: ['.ts', '.js'],
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
                        limit: 100000,
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
            test: /\.(ts|js)$/,
            include: sourcePath,
            use: [
              'cache-loader',
              // 'thread-loader',
              'babel-loader',
            ],
          },
        ],
      },
    },
    isProduction ? require('./webpack.prod') : require('./webpack.dev')
  )
}
