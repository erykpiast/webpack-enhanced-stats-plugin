/* eslint-disable no-restricted-syntax */

/**
 * @typedef {0|1|2|3|4} Position
 *
 * @typedef {object} Range
 * @property {Number} startIndex
 * @property {Number} endIndex
 */
const OUT_OF_RANGE = 0;
const SHRINK_FROM_START = 1;
const SHRINK_FROM_END = 2;
const ERASE_WHOLE = 3;
const SPLIT = 4;

/**
  * @param {Range} range
  * @param {Number} startIndex
  * @param {Number} endIndex
  *
  * @return {Position} Position of the range between start and end index
  */
function findPosition(range, startIndex, endIndex) {
  const joinsWithStartRange = range.startIndex === startIndex;
  const joinsWithEndRange = range.endIndex === endIndex;

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
  const isBeforeEndRange = range.endIndex < endIndex;

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
            currentRangeToKeep.startIndex = currentRangeToRemove.endIndex + 1;
            break;
          case SHRINK_FROM_END:
            currentRangeToKeep.endIndex = currentRangeToRemove.startIndex - 1;
            break;
          case ERASE_WHOLE:
            rangesToKeep.splice(currentRangeToKeepIndex, 1);
            break;
          case SPLIT: {
            const newRangeToKeep = {
              startIndex: currentRangeToRemove.endIndex + 1,
              endIndex: currentRangeToKeep.endIndex,
            };
            rangesToKeep.splice(currentRangeToKeepIndex + 1, 0, newRangeToKeep);
            currentRangeToKeep.endIndex = currentRangeToRemove.startIndex - 1;
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
