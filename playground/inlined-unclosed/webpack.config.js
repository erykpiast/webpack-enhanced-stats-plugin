const TerserPlugin = require('terser-webpack-plugin');

const Plugin = require('webpack-enhanced-stats-plugin');

Plugin.webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                regenerator: true,
                helpers: false,
              },
            ],
          ],
        },
      },
    }, {
      loader: Plugin.loader,
    }],
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
    })],
  },
  plugins: [
    new Plugin(),
  ],
};
