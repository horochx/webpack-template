const crypto = require('crypto')

const generateScopedName = (className, filePath) => {
  const md5 = crypto.createHash('md5')
  const hash = '_' + md5.update(className + filePath).digest('hex')
  return hash.slice(0, 9)
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
      [
        'react-css-modules',
        {
          filetypes: {
            '.less': {
              syntax: 'postcss-less',
            },
          },
          attributeNames: {
            activeStyleName: 'activeClassName',
          },
          generateScopedName,
        },
      ],
    ],
  }
}
