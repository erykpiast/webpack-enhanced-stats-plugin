const { SourceMapConsumer } = require('source-map');

const foldAndGatherRanges = require('./fold-and-gather-ranges');

function recoverLine(generatedLines, { line, column, lastColumn }) {
  const lineContents = generatedLines[line - 1];
  // NOTE: taking all columns till the end of the line may be too much sometimes 
  // but it's the best we can do here at this moment. We'll get precise and
  // real ranges of an inlined module after parsing the bundle and getting
  // concatenated module ranges.
  const end = lastColumn === null ? lineContents.length : lastColumn + 1;
  return lineContents.substring(column, end);
}

function getGeneratedSource(consumer, generatedLines, source) {
  const generatedPositions = consumer
    .sourceContentFor(source)
    .split('\n')
    .reduce((acc, _, lineNumber) => {
      const positions = consumer.allGeneratedPositionsFor({
        source,
        line: lineNumber + 1,
      }, []);

      return positions.reduce((innerAcc, position) => {
        const { line, column, lastColumn } = position;

        /* eslint-disable no-multi-assign, no-param-reassign */
        // NOTE: recreating objects is really expensive at scale, it makes a difference here
        const lineAcc = innerAcc[line] = innerAcc[line] || {};
        const columnAcc = lineAcc[column] = lineAcc[column] || {};
        /* eslint-enable no-multi-assign, no-param-reassign */

        if (!(lastColumn in columnAcc)) {
          const text = recoverLine(generatedLines, position);
          columnAcc[lastColumn] = text;
        }

        return innerAcc;
      }, acc);
    }, Object.create(null));

  return foldAndGatherRanges(generatedPositions);
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
