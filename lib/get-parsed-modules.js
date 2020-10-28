/* eslint-disable no-restricted-syntax */

const parseBundle = require('./parse-bundle');
const withinBoundary = require('./within-boundary');
const findRangesToKeep = require('./find-ranges-to-keep');
const { getParsedIdentifier } = require('./identifier');

function findInlinedModules(regeneratedSources, {
  identifier,
  boundary,
}) {
  const { startLine, startIndex } = boundary;
  const inlinedModules = [];
  for (const source of regeneratedSources) {
    if (source.identifier === identifier || !withinBoundary(boundary, source.boundaries)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const relativeRanges = Object.create(null);

    for (const [line, ranges] of Object.entries(source.ranges)) {
      const relativeLine = Number(line) - startLine;
      // eslint-disable-next-line no-multi-assign
      const lineRanges = (relativeRanges[relativeLine] = []);

      for (const range of ranges) {
        lineRanges.push({
          startIndex: range.startIndex - startIndex,
          endIndex: range.endIndex - startIndex,
        });
      }
    }

    const inlinedModule = {
      ...source,
      ranges: relativeRanges,
    };

    inlinedModules.push(inlinedModule);
  }

  return inlinedModules;
}

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
            endIndex: moduleSourceLines[line].length - 1,
          }]));

      findRangesToKeep(ranges, lineRangesToKeep);
    }
  }

  let source = '';
  for (const [line, ranges] of Object.entries(moduleSourceLinesWithoutBoundedModules)) {
    const lineText = moduleSourceLines[line];

    for (const range of ranges) {
      if (source) {
        source += '\n';
      }
      source += lineText.slice(range.startIndex, range.endIndex);
    }
  }

  if (source) {
    const size = source.length;

    return { source, size };
  }

  return { source: moduleSource, size: moduleSource.length };
}

function getModuleBoundary({
  bundleSource,
  moduleSource,
  moduleSourceLength,
  moduleSourceLines,
}) {
  const startIndex = bundleSource.indexOf(moduleSource);
  const startLine = bundleSource.slice(0, startIndex).split('\n').length - 1;
  const endIndex = startIndex + moduleSourceLength - 1;
  const endLine = startLine - 1 + moduleSourceLines.length;

  return {
    startLine,
    startIndex,
    endLine,
    endIndex,
  };
}

function getId(module) {
  try {
    return module.id;
  } catch (err) {
    return null;
  }
}

function setParsedModules({
  sources,
  context,
  regeneratedSourcesMap,
  parsedModules,
}) {
  const regeneratedSources = Array.from(regeneratedSourcesMap.values());

  for (const { source: bundleSource, modules: modulesIterable } of sources) {
    const { modules } = parseBundle(bundleSource);

    for (const module of modulesIterable) {
      const identifier = getParsedIdentifier(module.identifier(), context);

      const moduleSource = modules[getId(module)] || '';
      const moduleSourceLength = moduleSource.length;
      const moduleSourceLines = moduleSource.split('\n');

      const boundary = getModuleBoundary({
        bundleSource,
        moduleSource,
        moduleSourceLength,
        moduleSourceLines,
      });

      const inlinedModules = findInlinedModules(regeneratedSources, {
        identifier,
        boundary,
      });

      const finalModule = cutOutInlinedModules({
        inlinedModules,
        parsedModules,
        moduleSourceLines,
        moduleSource,
      });

      parsedModules.set(identifier, finalModule);
    }
  }
}

module.exports = setParsedModules;
