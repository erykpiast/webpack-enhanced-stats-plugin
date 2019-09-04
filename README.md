# webpack-enhanced-stats-plugin
Save Webpack stats extended with parsed and original source and size.

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
const WebpackEnhancedStatsPlugin = require("webpack-enchanced-stats-plugin")

module.exports = {
  // set any source-map devtool (not none/false nor eval)
  devtool: 'source-map',
  plugins: [
    // write out stats file to build directory
    new WebpackEnhancedStatsPlugin({
      filename: 'stats.json'
    })
  ]
}
```