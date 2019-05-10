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
  const hash =
    'm_' +
    md5
      .update(className + filePath)
      .digest('hex')
      // eslint-disable-next-line no-magic-numbers
      .substr(12, 8)
  return hash
}

// const

const SOURCE_PATH = resolve('src')

const DIST_PATH = resolve('dist')

const APP_NAME = require('./package.json').name

const URL_LOADER_LIMIT = 10000

// modules

const {
  DefinePlugin,
  optimize: { OccurrenceOrderPlugin },
  HotModuleReplacementPlugin,
  NoEmitOnErrorsPlugin,
} = require('webpack')
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
const PreloadWebpackPlugin = require('preload-webpack-plugin')

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
      entry: 'main',
    },
  ]

  // path alias

  const alias = {
    '@': SOURCE_PATH,
  }

  // entry

  const entry = {
    main: isProduction
      ? resolve(SOURCE_PATH, 'main.ts')
      : ['webpack-hot-middleware/client', resolve(SOURCE_PATH, 'main.ts')],
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
      chunks: ['runtime', 'vendors', pageConfig.entry],
      ...pageConfig,
    })
  })

  const definePlugin = new DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
    },
    ...definedMap,
  })

  const occurrenceOrderPlugin = new OccurrenceOrderPlugin()

  const hmrPlugin = new HotModuleReplacementPlugin()

  const noEmitOnErrorsPlugin = new NoEmitOnErrorsPlugin()

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

  const scriptPreloadOrFetchPlugin = [
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
    }),
    new PreloadWebpackPlugin({
      rel: 'prefetch',
      include: 'asyncChunks',
    }),
  ]

  // loader rules

  const styleSheetLoader = modules => {
    return [
      isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
      modules
        ? {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: !isProduction,
              getLocalIdent({ resourcePath }, localIdentName, localName) {
                return generateScopedName(localName, resourcePath)
              },
            },
          }
        : 'css-loader',
      'postcss-loader',
    ]
  }

  // dev only

  const devOnly = {
    mode: 'development',
    devtool: 'source-map',
  }

  const devPlugins = [occurrenceOrderPlugin, hmrPlugin, noEmitOnErrorsPlugin]

  // prod only

  const prodOnly = {
    mode: 'production',
  }

  const prodPlugins = [
    clearDist,
    manifestPlugin,
    cssExtractPlugin,
    ...scriptPreloadOrFetchPlugin,
  ]

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
          test: /\.modules\.css$/,
          include: SOURCE_PATH,
          use: styleSheetLoader(true),
        },

        {
          test: /^.*?(?<!\.modules)\.css$/,
          include: SOURCE_PATH,
          use: styleSheetLoader(false),
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
            'babel-loader',
            {
              loader: 'ts-loader',
              options: {
                happyPackMode: true,
              },
            },
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
