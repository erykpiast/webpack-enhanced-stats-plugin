const fs = require('fs').promises;
const path = require('path');

const {
  tap,
  tapPromise,
} = require('./lib/tap');
const getGeneratedSources = require('./lib/get-generated-source');
const getParsedModules = require('./lib/get-parsed-modules');
const { getStatIdentifier, getParsedIdentifier } = require('./lib/identifier');

function enhanceModules(modules = [], enhancedModulesMap) {
  return modules.map(({
    modules: submodules,
    ...module
  }) => {
    const enhancedSubmodules = enhanceModules(submodules, enhancedModulesMap);

    if (!('source' in module)) {
      return {
        ...module,
        modules: enhancedSubmodules,
      };
    }

    const enhancedModule = enhancedModulesMap.get(module.identifier) || {};

    return {
      ...module,
      ...enhancedModule,
      modules: enhancedSubmodules,
    };
  });
}

function getCompilationHooks(compilation) {
  // eslint-disable-next-line global-require, import/no-unresolved
  const { NormalModule } = module.exports.webpack || require('webpack');

  if (NormalModule) {
    const { loader } = NormalModule.getCompilationHooks(compilation);
    const { afterProcessAssets } = compilation.hooks;

    return {
      loader,
      afterProcessAssets,
    };
  }

  const {
    normalModuleLoader: loader,
    afterOptimizeChunkAssets: afterProcessAssets,
  } = compilation.hooks;

  return {
    loader,
    afterProcessAssets,
  };
}

function getSources(chunks, compilation) {
  if (chunks.length) {
    return Array.from(chunks)
      .reduce((acc, { files }) => acc.concat(files), [])
      .map((file) => compilation.assets[file].sourceAndMap())
      .filter(({ map }) => map !== null);
  }

  const maps = Object.keys(chunks).filter((chunkName) => chunkName.endsWith('.map'));
  return maps.map((mapName) => ({
    map: chunks[mapName].source(),
    source: chunks[mapName.slice(0, -4)].source(),
  }));
}

module.exports = class WebpackEnhancedStatsPlugin {
  constructor({
    filename = 'stats.json',
  } = {}) {
    this.options = {
      filename,
    };

    this.originalSource = new Map();
    this.parsedSource = new Map();
  }

  async apply({
    hooks: {
      compilation,
      done,
    },
    context,
  }) {
    const plugin = {
      name: 'Assets logger',
    };

    const [enhancedModulesMap, statsJson] = await Promise.all([
      tap(
        plugin,
        compilation,
        async (comp) => {
          const { loader, afterProcessAssets } = getCompilationHooks(comp);
          tap(
            plugin,
            loader,
            (loaderContext, mod) => {
              // eslint-disable-next-line no-param-reassign
              loaderContext.saveOriginalSource = (source) => {
                const identifier = path.relative(context, mod.resource);
                this.originalSource.set(identifier, {
                  source,
                  size: source.length,
                });
              };
            },
          );

          await tap(
            plugin,
            afterProcessAssets,
            async (chunks) => {
              const sources = getSources(chunks, comp);
              const modules = await Promise.all(
                sources.map(async ({ source: generatedSource, map }) => {
                  try {
                    const parsed = await getGeneratedSources(map, generatedSource);

                    return Object.entries(parsed).map(([key, { text, ranges, boundaries }]) => {
                      const identifier = getParsedIdentifier(key, context);

                      return {
                        identifier,
                        source: text,
                        size: text.length,
                        boundaries,
                        ranges,
                      };
                    });
                  } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error(err);
                    return [];
                  }
                }),
              );

              const regeneratedSourcesMap = new Map();
              modules
                .reduce((acc, item) => acc.concat(item), [])
                .forEach((source) => {
                  regeneratedSourcesMap.set(source.identifier, source);
                });

              getParsedModules({
                chunks,
                context,
                assets: comp.assets,
                regeneratedSourcesMap,
                parsedModules: this.parsedSource,
              });
            },
          );

          return {
            get: (key) => {
              const identifier = getStatIdentifier(key, context);

              const parsed = this.parsedSource.get(identifier);
              const original = this.originalSource.get(identifier);

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
