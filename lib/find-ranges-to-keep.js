/* eslint-disable no-restricted-syntax */

/**
 * @typedef {0|1|2|3|4} Position
 *
 * @typedef {object} Range
 * @property {number} startIndex 0-based, inclusive
 * @property {number|null} endIndex 0-based, exclusive
 */
const OUT_OF_RANGE = 0;
const SHRINK_FROM_START = 1;
const SHRINK_FROM_END = 2;
const ERASE_WHOLE = 3;
const SPLIT = 4;

/**
  * @param {Range} range
  * @param {number} startIndex
  * @param {number|null} endIndex
  *
  * @return {Position} Position of the range between start and end index
  */
function findPosition(range, startIndex, endIndex) {
  const joinsWithStartRange = range.startIndex === startIndex;
  const joinsWithEndRange = range.endIndex === endIndex || range.endIndex === null;

  if (joinsWithStartRange && joinsWithEndRange) {
    return ERASE_WHOLE;
  }

  if (joinsWithStartRange) {
    return SHRINK_FROM_START;
  }

  if (joinsWithEndRange) {
    return SHRINK_FROM_END;
  }

  const isAfterStartRange = range.startIndex > startIndex;
  const isBeforeEndRange = range.endIndex < endIndex || endIndex === null;

  if (isAfterStartRange && isBeforeEndRange) {
    return SPLIT;
  }

  return OUT_OF_RANGE;
}

/**
 * @param {Array<Range>} rangesToRemove
 * @param {Array<Range>} rangesToKeep needs to contain at least one element at
 *   the start
 * @returns {void} It's a procedure which modifies the second argument, which
 *   is purely for performance reasons
 */
function findRangesToKeep(rangesToRemove, rangesToKeep) {
  for (const currentRangeToRemove of rangesToRemove) {
    let currentRangeToKeepIndex = 0;
    let currentRangeToKeep;

    while (true) {
      currentRangeToKeep = rangesToKeep[currentRangeToKeepIndex];

      const position = findPosition(
        currentRangeToRemove,
        currentRangeToKeep.startIndex,
        currentRangeToKeep.endIndex,
      );

      if (position !== OUT_OF_RANGE) {
        switch (position) {
          case SHRINK_FROM_START:
            currentRangeToKeep.startIndex = currentRangeToRemove.endIndex;
            break;
          case SHRINK_FROM_END:
            currentRangeToKeep.endIndex = currentRangeToRemove.startIndex;
            break;
          case ERASE_WHOLE:
            rangesToKeep.splice(currentRangeToKeepIndex, 1);
            break;
          case SPLIT: {
            const newRangeToKeep = {
              startIndex: currentRangeToRemove.endIndex,
              endIndex: currentRangeToKeep.endIndex,
            };
            rangesToKeep.splice(currentRangeToKeepIndex + 1, 0, newRangeToKeep);
            currentRangeToKeep.endIndex = currentRangeToRemove.startIndex;
            break;
          }
          default:
            throw new Error(`Unknown position ${position}`);
        }

        break;
      }

      currentRangeToKeepIndex += 1;
    }
  }
}

module.exports = findRangesToKeep;
