const fs = require('fs').promises;
const path = require('path');
const {
  SourceMapConsumer,
} = require('source-map');

const {
  tap,
  tapPromise,
} = require('./lib/tap');
const {
  fold,
  uniq,
  last,
} = require('./lib/fold');

function enhanceModules(modules = [], enhancedModulesMap) {
  return modules.map(({
    modules: submodules,
    ...module
  }) => {
    const modulePath = module.identifier.split('!').reverse()[0];
    const enhancedModule = enhancedModulesMap[modulePath] || {};

    return {
      ...module,
      ...enhancedModule,
      modules: enhanceModules(submodules, enhancedModulesMap),
    };
  });
}

function getIdentifier(filename) {
  return last(filename.split('!'));
}

module.exports = class WebpackEnhancedStatsPlugin {
  constructor({
    filename,
  }) {
    this.options = {
      filename,
    };
  }

  async apply({
    hooks: {
      compilation,
      done,
    },
  }) {
    const plugin = {
      name: 'Assets logger',
    };

    const [enhancedModulesMap, statsJson] = await Promise.all([
      tap(
        plugin,
        compilation,
        async ({
          hooks: {
            afterOptimizeDependencies,
            afterOptimizeChunkAssets,
          },
          assets,
        }) => {
          const [originalSource, parsedSource] = await Promise.all([
            tap(
              plugin,
              afterOptimizeDependencies,
              (modules) => modules.reduce((acc, {
                _source: {
                  _name,
                  _value,
                },
              }) => ({
                ...acc,
                [getIdentifier(_name)]: {
                  source: _value,
                  size: _value.length,
                },
              }), {}),
            ),
            tap(
              plugin,
              afterOptimizeChunkAssets,
              async (chunks) => {
                const sources = Array.from(chunks)
                  .flatMap((chunk) => chunk.files)
                  .map((file) => assets[file].sourceAndMap());
                const modules = await Promise.all(sources.map(async ({
                  source,
                  map,
                }) => {
                  const consumer = await new SourceMapConsumer(map);
                  return map.sources.map((filepath, index) => {
                    const mappings = map.sourcesContent[index]
                      .split('\n')
                      .flatMap((_, lineNumber) => consumer.allGeneratedPositionsFor({
                        line: lineNumber + 1,
                        source: filepath,
                      })).map(({
                        column,
                        lastColumn,
                      }) => [column, lastColumn]);

                    const moduleSource = fold(mappings, source.length)
                      .map(([start, end]) => source.slice(start, end + 1))
                      .join('');

                    return {
                      identifier: filepath,
                      source: moduleSource,
                      size: moduleSource.length,
                    };
                  });
                }));

                return modules.flat().reduce((acc, {
                  identifier,
                  source,
                  size,
                }) => ({
                  ...acc,
                  [identifier]: {
                    source,
                    size,
                  },
                }), {});
              },
            ),
          ]);

          return uniq([
            ...Object.keys(originalSource),
            ...Object.keys(parsedSource),
          ]).reduce((acc, identifier) => {
            const parsed = parsedSource[identifier];
            const original = originalSource[identifier];

            return {
              ...acc,
              [identifier]: {
                parsedSize: parsed ? parsed.size : null,
                parsedSource: parsed ? parsed.source : null,
                originalSize: original ? original.size : null,
                originalSource: original ? original.source : null,
              },
            };
          }, {});
        },
      ),
      tapPromise(plugin, done, (stats) => stats.toJson()),
    ]);

    const enhancedStats = {
      ...statsJson,
      modules: enhanceModules(statsJson.modules, enhancedModulesMap),
      chunks: statsJson.chunks.map(({
        modules,
        ...chunk
      }) => ({
        ...chunk,
        modules: enhanceModules(modules, enhancedModulesMap),
      })),
    };

    await fs.writeFile(
      path.join(statsJson.outputPath, this.options.filename),
      JSON.stringify(enhancedStats, null, 2),
    );
  }
};
