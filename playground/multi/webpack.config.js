const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Plugin = require('webpack-enhanced-stats-plugin');

function createConfig(name, babelOptions) {
  return {
    entry: './src/index.js',
    output: {
      filename: `${name}.js`,
    },
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
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
      new Plugin({
        filename: `${name}.stats.json`,
      }),
      new BundleAnalyzerPlugin({
        reportFilename: `${name}.html`,
        analyzerMode: 'static',
        openAnalyzer: false,
      }),
    ],
  };
}

module.exports = [
  createConfig('a', {
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
  }),
  createConfig('b', {}),
];
