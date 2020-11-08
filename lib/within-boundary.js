/**
 * @typedef {object} Boundary
 * @property {number} startLine 0-based, inclusive
 * @property {number} startIndex 0-based, inclusive
 * @property {number} endLine 0-based, inclusive
 * @property {number|null} endIndex 0-based, exclusive
 */

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
    ? bounded.endIndex <= bounding.endIndex
      || bounded.endIndex === null
      || bounding.endIndex === null
    : true;

  return startLineWithin
    && endLineWithin
    && startIndexWithin
    && endIndexWithin;
}

module.exports = withinBoundary;
