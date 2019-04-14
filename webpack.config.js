// utils
const path = require('path')

const resolve = (...p) => path.resolve(__dirname, ...p)

const createFileLoader = (outputPath, isProduction) => ({
  loader: 'file-loader',
  options: {
    outputPath: isProduction ? outputPath : void 0,
    name: isProduction ? '[hash:8].[ext]' : '[name].[ext]',
  },
})

const crypto = require('crypto')

const generateScopedName = (className, filePath) => {
  const md5 = crypto.createHash('md5')
  const hash = '_' + md5.update(className + filePath).digest('hex')
  return hash.slice(0, 9)
}

// const

const SOURCE_PATH = resolve('src')

const DIST_PATH = resolve('dist')

const APP_NAME = require('./package.json').name

const URL_LOADER_LIMIT = 10000

// modules

const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (env = {}) => {
  // env var

  const isProduction = env.production
  const useAnalyzer = env.analyzer

  // defined var

  const definedMap = {
    SERVICE_URL: isProduction
      ? JSON.stringify('https://prod.example.com/')
      : JSON.stringify('https://dev.example.com/'),
  }

  // htmlPages

  const htmlPages = [
    {
      title: APP_NAME,
      filename: 'index.html',
    },
  ]

  // path alias

  const alias = {
    '@': SOURCE_PATH,
  }

  // entry

  const entry = {
    main: resolve(SOURCE_PATH, 'main.ts'),
  }

  // output

  const output = {
    path: DIST_PATH,
    hashDigestLength: 8,
    filename: isProduction ? 'js/[contenthash].bundle.js' : '[name].bundle.js',
    chunkFilename: isProduction
      ? 'js/[contenthash].bundle.js'
      : '[name].bundle.js',
  }

  // optimization

  const optimization = {
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
    minimizer: [
      new TerserJSPlugin({
        exclude: /[\\/]node_modules[\\/]/,
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  }

  // plugins

  const copyPlugin = new CopyPlugin([
    {
      from: resolve('./public'),
      to: DIST_PATH,
    },
  ])

  const forkTsCheck = new ForkTsCheckerWebpackPlugin()

  const htmlPlugin = htmlPages.map(pageConfig => {
    return new HtmlWebpackPlugin({
      template: resolve('./public/index.html'),
      chunks: ['runtime', 'vendors', 'main'],
      ...pageConfig,
    })
  })

  const definePlugin = new DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
    },
    ...definedMap,
  })

  const hmrPlugin = new HotModuleReplacementPlugin()

  const clearDist = new CleanWebpackPlugin([DIST_PATH])

  const manifestPlugin = new ManifestPlugin()

  const cssExtractPlugin = new MiniCssExtractPlugin({
    hashDigestLength: 8,
    filename: 'css/[contenthash].bundle.css',
    chunkFilename: 'css/[contenthash].bundle.css',
  })

  const analyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'static',
  })

  // dev only

  const devOnly = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      contentBase: DIST_PATH,
      hot: true,
    },
  }

  const devPlugins = [hmrPlugin]

  // prod only

  const prodOnly = {
    mode: 'production',
  }

  const prodPlugins = [clearDist, manifestPlugin, cssExtractPlugin]

  useAnalyzer && prodPlugins.push(analyzerPlugin)

  // common config

  const commonConfig = {
    entry,

    output,

    optimization,

    plugins: [
      copyPlugin,
      forkTsCheck,
      ...htmlPlugin,
      definePlugin,
      ...(isProduction ? prodPlugins : devPlugins),
    ],

    resolve: {
      modules: [SOURCE_PATH, 'node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias,
      symlinks: false,
      cacheWithContext: false,
    },

    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          include: SOURCE_PATH,
          use: [
            {
              loader: 'cache-loader',
              options: {
                cacheDirectory: resolve('node_modules/.cache-loader'),
              },
            },
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: !isProduction,
                getLocalIdent({ resourcePath }, localIdentName, localName) {
                  return generateScopedName(localName, resourcePath)
                },
              },
            },
            'postcss-loader',
          ],
        },

        {
          test: /\.(png|svg|jpe?g|gif)$/,
          include: SOURCE_PATH,
          use: [
            isProduction
              ? {
                  loader: 'url-loader',
                  options: Object.assign(
                    {
                      limit: URL_LOADER_LIMIT,
                    },
                    createFileLoader('images', isProduction).options
                  ),
                }
              : createFileLoader('images', isProduction),
          ],
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          include: SOURCE_PATH,
          use: [createFileLoader('fonts', isProduction)],
        },

        {
          test: /\.(t|j)sx?$/,
          include: SOURCE_PATH,
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
      ],
    },
  }

  // result

  return {
    ...commonConfig,
    ...(isProduction ? prodOnly : devOnly),
  }
}
