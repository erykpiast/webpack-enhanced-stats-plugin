/* eslint-disable no-restricted-syntax */

function getSources(chunks, compilation) {
  if (chunks.length) {
    /**
     * NOTE: Webpack v4
     */
    const sources = [];

    for (const chunk of chunks) {
      for (const file of chunk.files) {
        const { source, map } = compilation.assets[file].sourceAndMap();
        if (map !== null) {
          sources.push({
            source,
            map,
            modules: chunk.modulesIterable,
          });
          break;
        }
      }
    }

    return sources;
  }

  /**
   * NOTE: Webpack v5
   */
  return getSources(compilation.chunks, compilation);
}

module.exports = getSources;
