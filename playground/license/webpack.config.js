const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Plugin = require('webpack-enhanced-stats-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  module: {
    rules: [{
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
