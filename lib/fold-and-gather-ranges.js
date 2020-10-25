/* eslint-disable no-restricted-syntax, no-param-reassign */

/**
 * @typedef {Object.<number, string>} LastColumnMap
 * @description 1-based index, inclusive
 *
 * @typedef {Object.<number, LastColumnMap>} ColumnMap
 * @description 1-based index, inclusive
 *
 * @typedef {Object.<number, ColumnMap>} LinesMap
 * @description 1-based index
 *
 * @typedef {object} Range
 * @property {number} startIndex 0-based, inclusive
 * @property {number} endIndex 0-based, exclusive
 *
 * @typedef {object} Return
 * @property {string} text
 * @property {Object.<number, Array<Range>>} ranges 0-based index
 * @property {Object.<number, Range>} boundaries 0-based index
 */

/**
 * @param {LinesMap} linesMap
 *
 * @returns {Return}
 */
function foldAndGatherRanges(linesMap) {
  let text = '';
  const ranges = Object.create(null);
  const boundaries = {
    startLine: Infinity,
    endLine: -Infinity,
    startIndex: Infinity,
    endIndex: -Infinity,
  };

  for (const [lineKey, columnMap] of Object.entries(linesMap)) {
    const line = Number(lineKey) - 1;
    const lineRanges = ranges[line] || (ranges[line] = []);
    if (line < boundaries.startLine) {
      boundaries.startLine = line;
      boundaries.startIndex = Infinity;
    }
    if (line > boundaries.endLine) {
      boundaries.endLine = line;
      boundaries.endIndex = -Infinity;
    }

    for (const [startColumnKey, lastColumnMap] of Object.entries(columnMap)) {
      const startIndex = Number(startColumnKey) - 1;

      if (boundaries.startIndex > startIndex) {
        boundaries.startIndex = startIndex;
      }

      for (const [endColumnKey, rangeText] of Object.entries(lastColumnMap)) {
        const endIndex = endColumnKey === 'null'
          ? startIndex + rangeText.length
          : Number(endColumnKey);

        if (boundaries.endIndex < endIndex) {
          boundaries.endIndex = endIndex;
        }

        let matchingRangeFound;
        for (const range of lineRanges) {
          if (endIndex === range.startIndex) {
            range.startIndex = startIndex;
            matchingRangeFound = true;
            break;
          }

          if (startIndex === range.endIndex) {
            range.endIndex = endIndex;
            matchingRangeFound = true;
            break;
          }
        }

        if (!matchingRangeFound) {
          lineRanges.push({ startIndex, endIndex });
        }

        text += rangeText;
      }
    }
  }

  return { text, ranges, boundaries };
}

module.exports = foldAndGatherRanges;
