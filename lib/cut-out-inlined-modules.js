/* eslint-disable no-restricted-syntax */

const findRangesToKeep = require('./find-ranges-to-keep');

/**
 * @typedef {object} Range
 * @property {number} startIndex 0-based, inclusive
 * @property {number} endIndex 0-based, exclusive
 *
 * @typedef {object} InlinedModule
 * @property {string} identifier
 * @property {string} source
 * @property {Object.<number, Array<Range>>} ranges 0-based index
 *
 * @typedef {object} ParsedModule
 * @property {string} source
 * @property {number} size
 */

/**
 *
 * @param {object} props
 * @param {Array<InlinedModule>} props.inlinedModules
 * @param {Map<string, ParsedModule>} props.parsedModules
 * @param {Array<string>} props.moduleSourceLines
 * @param {string} props.moduleSource
 * @returns {ParsedModule}
 */
function cutOutInlinedModules({
  inlinedModules,
  parsedModules,
  moduleSourceLines,
  moduleSource,
}) {
  const moduleSourceLinesWithoutBoundedModules = Object.create(null);
  for (const boundedModule of inlinedModules) {
    parsedModules.set(boundedModule.identifier, {
      source: boundedModule.source,
      size: boundedModule.source.length,
    });

    for (const [line, ranges] of Object.entries(boundedModule.ranges)) {
      const lineRangesToKeep = (moduleSourceLinesWithoutBoundedModules[line]
          || (moduleSourceLinesWithoutBoundedModules[line] = [{
            startIndex: 0,
            endIndex: moduleSourceLines[line].length,
          }]));

      findRangesToKeep(ranges, lineRangesToKeep);
    }
  }

  let source = '';
  for (const [line, ranges] of Object.entries(moduleSourceLinesWithoutBoundedModules)) {
    const lineText = moduleSourceLines[line];

    if (source) {
      source += '\n';
    }

    for (const range of ranges) {
      source += lineText.slice(range.startIndex, range.endIndex);
    }
  }

  if (source) {
    const size = source.length;

    return { source, size };
  }

  return { source: moduleSource, size: moduleSource.length };
}

module.exports = cutOutInlinedModules;
