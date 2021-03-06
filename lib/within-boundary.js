/**
 * @typedef {object} Boundary
 * @property {number} startLine 0-based, inclusive
 * @property {number} startIndex 0-based, inclusive
 * @property {number} endLine 0-based, inclusive
 * @property {number|null} endIndex 0-based, exclusive
 */

/**
  *
  * @param {Boundary} bounding
  * @param {Boundary} bounded
  * @returns {boolean}
  */
function compareEndIndex(bounding, bounded) {
  const boundedIsUnclosed = bounded.endIndex === null;
  const boundingIsUnclosed = bounding.endIndex === null;
  const singleLine = bounded.startLine === bounding.endLine;

  if (boundedIsUnclosed && boundingIsUnclosed) {
    return false;
  }

  if (boundedIsUnclosed) {
    if (singleLine) {
      return bounded.startIndex <= bounding.endIndex;
    }

    return true;
  }

  if (boundingIsUnclosed) {
    if (singleLine) {
      return bounding.startIndex >= bounded.endIndex;
    }

    return true;
  }

  return bounded.endIndex <= bounding.endIndex;
}

/**
 * @param {Boundary} bounding boundaries of the module containing the other
 * @param {Boundary} bounded module possibly contained in the other
 * @returns {boolean}
 */
function withinBoundary(bounding, bounded) {
  const startLineWithin = bounded.startLine >= bounding.startLine;
  const endLineWithin = bounded.endLine <= bounding.endLine;
  const startIndexWithin = bounded.startLine === bounding.startLine
    ? bounded.startIndex >= bounding.startIndex
    : true;
  const endIndexWithin = bounded.endLine === bounding.endLine
    ? compareEndIndex(bounding, bounded)
    : true;

  return startLineWithin
    && endLineWithin
    && startIndexWithin
    && endIndexWithin;
}

module.exports = withinBoundary;
