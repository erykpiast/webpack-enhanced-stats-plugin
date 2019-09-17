function fold(mappings, maxB) {
  return mappings
    .sort(([a1, b1], [a2, b2]) => a1 - a2 || b1 - b2)
    .reduce((acc, [a, b]) => {
      const [currA, currB] = [a, b === null ? maxB : b];

      if (acc.length === 0) {
        return [
          [currA, currB],
        ];
      }

      const [
        [lastA, lastB],
        ...rest
      ] = acc;

      if (currA > (lastB + 1)) {
        return [
          [currA, currB],
          ...acc,
        ];
      }

      return [
        [lastA, Math.max(currB, lastB)],
        ...rest,
      ];
    }, [])
    .reverse();
}

function uniq(arr) {
  return [...(new Set(arr))];
}

function last(arr) {
  return arr[arr.length - 1];
}

module.exports = { fold, uniq, last };
