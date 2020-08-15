const path = require("path");
const { DefinePlugin, NoEmitOnErrorsPlugin } = require("webpack");
const { GenerateSW } = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PreloadWebpackPlugin = require("preload-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = (env = {}) => {
  // env
  const isProduction = !!env.production;
  const useAnalyzer = !!env.analyzer;

  process.env.NODE_ENV = isProduction ? "production" : "development";

  // utils
  const resolveRelativePath = (relativePath) =>
    path.resolve(__dirname, relativePath);

  // config
  const smp = new SpeedMeasurePlugin();
  return smp.wrap({
    mode: isProduction ? "production" : "development",

    entry: {
      index: resolveRelativePath("./src/index.ts"),
    },

    output: {
      path: resolveRelativePath("./dist"),
      filename: isProduction ? "js/[name].[contenthash:8].js" : "js/[name].js",
      chunkFilename: isProduction
        ? "js/[name].[contenthash:8].bundle.js"
        : "js/[name].bundle.js",
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loaders: [
            isProduction ? void 0 : "cache-loader",
            "thread-loader",
            "babel-loader",
            {
              loader: "ts-loader",
              options: {
                happyPackMode: true,
                transpileOnly: true,
              },
            },
          ].filter(Boolean),
        },

        {
          test: /\.css$/,
          use: [
            isProduction ? void 0 : "cache-loader",
            isProduction ? MiniCssExtractPlugin.loader : void 0,
            isProduction ? void 0 : "style-loader",
            // "thread-loader",
            "css-loader",
            "postcss-loader",
          ].filter(Boolean),
        },

        {
          test: /\.s[ac]ss$/,
          use: [
            isProduction ? void 0 : "cache-loader",
            isProduction ? MiniCssExtractPlugin.loader : void 0,
            isProduction ? void 0 : "style-loader",
            // "thread-loader",
            "css-loader",
            "postcss-loader",
            "sass-loader",
          ].filter(Boolean),
        },

        {
          test: /\.svg$/,
          use: [
            "@svgr/webpack",
            {
              loader: "url-loader",
              options: {
                limit: 8192,
                name: isProduction
                  ? "img/[name].[contenthash:8].[ext]"
                  : "img/[name].[ext]",
              },
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: isProduction
                ? "img/[name].[contenthash:8].[ext]"
                : "img/[name].[ext]",
            },
          },
        },

        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: {
            loader: "url-loader",
            options: {
              limit: 65536,
              name: isProduction
                ? "font/[name].[contenthash:8].[ext]"
                : "font/[name].[ext]",
            },
          },
        },
      ],
    },

    resolve: {
      modules: [resolveRelativePath("./src"), "node_modules"],
      extensions: [".ts", ".tsx", ".js", ".jsx", "json"],
    },

    performance: {
      hints: "warning",
      maxAssetSize: 300000,
      maxEntrypointSize: 300000,
    },

    devtool: isProduction ? "none" : "inline-source-map",

    target: "web",

    externals: [],

    devServer: {
      host: "0.0.0.0",
      port: 8080,
      proxy: {
        "/api/v2/": {
          target: "https://pokeapi.co/api/v2/",
          changeOrigin: true,
          secure: false,
        },
      },
      historyApiFallback: true,
      hot: true,
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: resolveRelativePath("./public"),
            to: resolveRelativePath("./dist"),
          },
        ],
      }),

      new ForkTsCheckerWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: resolveRelativePath("./src/index.ejs"),
        filename: "index.html",
        chunks: ["runtime", "vendors", "index"],
      }),

      new Dotenv(),

      new DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(
          isProduction ? "production" : "development"
        ),
      }),

      // isProduction ? void 0 : new HotModuleReplacementPlugin(),

      isProduction ? void 0 : new ReactRefreshWebpackPlugin(),

      isProduction ? void 0 : new NoEmitOnErrorsPlugin(),

      isProduction ? new CleanWebpackPlugin() : void 0,

      isProduction
        ? new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].bundle.css",
          })
        : void 0,

      isProduction
        ? new PreloadWebpackPlugin({
            rel: "preload",
            include: "initial",
          })
        : void 0,

      isProduction
        ? new PreloadWebpackPlugin({
            rel: "prefetch",
            include: "asyncChunks",
          })
        : void 0,

      isProduction
        ? new GenerateSW({
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
            sourcemap: !isProduction,
          })
        : void 0,

      useAnalyzer
        ? new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: `report.${Date.now()}.html`,
          })
        : void 0,
    ].filter(Boolean),

    optimization: isProduction
      ? {
          runtimeChunk: "single",
          splitChunks: {
            chunks: "all",
            cacheGroups: {
              vendors: {
                name: "vendors",
                test: /[\\/]node_modules[\\/]/,
                chunks: "all",
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
      : void 0,
  });
};
