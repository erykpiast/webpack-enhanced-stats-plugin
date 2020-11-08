/* eslint-disable no-restricted-syntax */

const parseBundle = require('./parse-bundle');
const withinBoundary = require('./within-boundary');
const { getParsedIdentifier } = require('./identifier');
const cutOutInlinedModules = require('./cut-out-inlined-modules');

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
          endIndex: range.endIndex === null
            ? boundary.endIndex - startIndex
            : range.endIndex - startIndex,
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
