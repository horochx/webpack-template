const autoprefixer = require('autoprefixer')
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')
const postcssNormalize = require('postcss-normalize')

module.exports = {
  plugins: [autoprefixer, postcssFlexbugsFixes, postcssNormalize()],
}
