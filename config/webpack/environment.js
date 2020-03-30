const { environment } = require('@rails/webpacker')

const merge = require('webpack-merge')
const webpack = require('webpack')

environment.plugins.prepend('Provide', new webpack.ProvidePlugin({
    $: 'jquery',
    JQuery: 'jquery',
    jquery: 'jquery',
    'window.Tether': "tether",
  })
)

const envConfig = module.exports = environment
const aliasConfig = module.exports = {
  resolve: {
    alias: {
      jquery: 'jquery/src/jquery'
    }
  }
}

module.exports = merge(envConfig.toWebpackConfig(), aliasConfig)
