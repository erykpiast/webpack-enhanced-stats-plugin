# webpack-enhanced-stats-plugin

[![dependencies Status](https://david-dm.org/erykpiast/webpack-enhanced-stats-plugin/status.svg)](https://david-dm.org/erykpiast/webpack-enhanced-stats-plugin) [![Greenkeeper badge](https://badges.greenkeeper.io/erykpiast/webpack-enhanced-stats-plugin.svg)](https://greenkeeper.io/)

Save Webpack stats extended with parsed and original source and size. This plugin is recommended to install when you use [webpack-stats-explorer](https://github.com/erykpiast/webpack-stats-explorer).

Each module in enhanced stats file has four additional fields analogous to
`source` and `size`, but related to original source code and "parsed" code
in the final bundle.

```typescript
interface EnhancedModule extends Module {
  // may be null for built-in modules like webpack/bootstrap
  originalSource: string | null,
  originalSize: number | null,
  // may be null or empty for concatenated (inlined) modules
  parsedSource: string | null,
  parsedSize: number | null,
}
```

## Installation

```
npm i -D webpack-enhanced-stats-plugin
```

## Usage

In `webpack.config.js`:

```javascript
const WebpackEnhancedStatsPlugin = require("webpack-enhanced-stats-plugin")

module.exports = {
  // set any source-map devtool (not none/false nor eval)
  devtool: 'source-map',
  module: {
    rules: [
      // other loaders here, this has to be the last one
      {
        test: [/\.json$/, /\.js$/, /\.jx$/, /\.ts$/, /\.tsx$/, /\.css$/, /\.scss$/],
        loader: WebpackEnhancedStatsPlugin.loader
      }
    ]
  },
  plugins: [
    // write out stats file to the output directory
    new WebpackEnhancedStatsPlugin({
      filename: 'stats.json'
    })
  ]
}
```
