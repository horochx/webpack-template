const crypto = require('crypto')
const generateScopedName = (className, filePath) => {
  const md5 = crypto.createHash('md5')
  const hash =
    'm_' +
    md5
      .update(className + filePath)
      .digest('hex')
      .substr(12, 8)
  return hash
}

module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV === 'production')

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          corejs: 3,
          useBuiltIns: 'usage',
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      'react-hot-loader/babel',
      [
        'react-css-modules',
        {
          exclude: '^.*?(?<!\\.modules)\\.css$',
          webpackHotModuleReloading: true,
          attributeNames: {
            activeStyleName: 'activeClassName',
          },
          generateScopedName,
        },
      ],
    ],
  }
}
