const fs = require('fs').promises;
const path = require('path');
const {
  SourceMapConsumer,
} = require('source-map');

const {
  tap,
  tapPromise,
} = require('./lib/tap');
const fold = require('./lib/fold');
const ResourceMap = require('./lib/map');

function enhanceModules(modules = [], enhancedModulesMap) {
  return modules.map(({
    modules: submodules,
    ...module
  }) => {
    const enhancedModule = enhancedModulesMap.get(module.identifier) || {};

    return {
      ...module,
      ...enhancedModule,
      modules: enhanceModules(submodules, enhancedModulesMap),
    };
  });
}

module.exports = class WebpackEnhancedStatsPlugin {
  constructor({
    filename = 'stats.json',
  } = {}) {
    this.options = {
      filename,
    };

    this.originalSource = new ResourceMap();
    this.parsedSource = new ResourceMap();
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
            normalModuleLoader,
            afterOptimizeChunkAssets,
          },
          assets,
        }) => {
          tap(
            plugin,
            normalModuleLoader,
            (loaderContext, mod) => {
              // eslint-disable-next-line no-param-reassign
              loaderContext.saveOriginalSource = (source) => {
                this.originalSource.set(mod.resource, {
                  source,
                  size: source.length,
                });
              };
            },
          );

          await tap(
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
                if (!map || !map.sourcesContent) {
                  return [];
                }

                const consumer = await new SourceMapConsumer(map);
                return map.sources.map((identifier, index) => {
                  const mappings = map.sourcesContent[index]
                    .split('\n')
                    .flatMap((_, lineNumber) => consumer.allGeneratedPositionsFor({
                      line: lineNumber + 1,
                      source: identifier,
                    })).map(({
                      column,
                      lastColumn,
                    }) => [column, lastColumn]);

                  const moduleSource = fold(mappings, source.length)
                    .map(([start, end]) => source.slice(start, end + 1))
                    .join('');

                  return {
                    identifier,
                    source: moduleSource,
                    size: moduleSource.length,
                  };
                });
              }));

              return modules.flat().forEach(({
                identifier,
                source,
                size,
              }) => {
                this.parsedSource.set(identifier, {
                  source,
                  size,
                });
              });
            },
          );

          return {
            get: (key) => {
              const parsed = this.parsedSource.get(key);
              const original = this.originalSource.get(key);

              return {
                parsedSize: parsed ? parsed.size : null,
                parsedSource: parsed ? parsed.source : null,
                originalSize: original ? original.size : null,
                originalSource: original ? original.source : null,
              };
            },
          };
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

module.exports.loader = require.resolve('./loader');
