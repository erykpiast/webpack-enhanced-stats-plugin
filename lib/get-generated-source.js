const { SourceMapConsumer } = require('source-map');

function isEqual(a) {
  return (b) => Object.entries(a).every(([key, value]) => b[key] === value);
}

function uniq(element, index, collection) {
  return index === collection.findIndex(isEqual(element));
}

function recoverLine(generatedLines) {
  return ({ line, column, lastColumn }) => {
    const lineContents = generatedLines[line - 1];
    const end = lastColumn === null ? lineContents.length : lastColumn + 1;
    return lineContents.substring(column, end);
  };
}

function byLineAndColumn(a, b) {
  const lineDiff = a.line - b.line;
  if (!lineDiff) {
    return a.column - b.column;
  }

  return lineDiff;
}

function getGeneratedSource(consumer, generatedLines, source) {
  return consumer
    .sourceContentFor(source)
    .split('\n')
    .flatMap((_, line) => consumer.allGeneratedPositionsFor({
      source,
      line: line + 1,
    }))
    .sort(byLineAndColumn)
    .filter(uniq)
    .sort(byLineAndColumn)
    .map(recoverLine(generatedLines))
    .join('');
}

async function getSources(map, generated) {
  const consumer = await new SourceMapConsumer(map);
  const generatedLines = generated.split('\n');

  return consumer.sources.reduce(
    (acc, source) => ({
      ...acc,
      [source]: getGeneratedSource(consumer, generatedLines, source),
    }),
    {},
  );
}

module.exports = getSources;
