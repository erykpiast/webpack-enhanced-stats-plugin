const { SourceMapConsumer } = require('source-map');

function recoverLine(generatedLines, { line, column, lastColumn }) {
  const lineContents = generatedLines[line - 1];
  const end = lastColumn === null ? lineContents.length : lastColumn + 1;
  return lineContents.substring(column, end);
}

function byNumericKey([a, _], [b, __]) {
  return Number(a) - Number(b);
}

function foldNestedMap(map, seed) {
  return Object.entries(map)
    .sort(byNumericKey)
    .reduce((acc, [, value]) => (
      typeof value === typeof acc
        ? acc + value
        : foldNestedMap(value, acc)
    ),
    seed);
}

function getGeneratedSource(consumer, generatedLines, source) {
  const generatedPositions = consumer
    .sourceContentFor(source)
    .split('\n')
    .reduce((acc, _, lineNumber) => consumer.allGeneratedPositionsFor({
      source,
      line: lineNumber + 1,
    }).reduce((innerAcc, position) => {
      const { line, column, lastColumn } = position;

      /* eslint-disable no-multi-assign, no-param-reassign */
      // NOTE: recreating objects is really expensive at scale, it makes a difference here
      const lineAcc = innerAcc[line] = innerAcc[line] || {};
      const columnAcc = lineAcc[column] = lineAcc[column] || {};
      /* eslint-enable no-multi-assign, no-param-reassign */

      if (!(lastColumn in columnAcc)) {
        columnAcc[lastColumn] = recoverLine(generatedLines, position);
      }

      return innerAcc;
    }, acc), Object.create(null));

  return foldNestedMap(generatedPositions, '');
}

async function getSources(map, generated) {
  const consumer = await new SourceMapConsumer(map);
  const generatedLines = generated.split('\n');

  return consumer.sources.reduce(
    (acc, source) => {
      acc[source] = getGeneratedSource(consumer, generatedLines, source);
      return acc;
    },
    Object.create(null),
  );
}

module.exports = getSources;
