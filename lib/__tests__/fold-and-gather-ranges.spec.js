const foldAndGatherRanges = require('../fold-and-gather-ranges');

describe('fold and gather ranges', () => {
  it('should work', () => {
    const input = {
      1: {
        1: {
          1: 'f',
        },
        2: {
          2: 'u',
        },
        3: {
          8: 'nction',
        },
        10: {
          11: '()',
        },
        15: {
          15: '{',
        },
      },
      2: {
        3: {
          null: 'console.log("Hello World!")',
        },
      },
      4: {
        1: {
          1: '}',
        },
      },
    };
    const output = foldAndGatherRanges(input);

    expect(output).toHaveProperty('text', 'function(){console.log("Hello World!")}');
    expect(output).toHaveProperty('ranges', {
      0: [
        { startIndex: 0, endIndex: 8 },
        { startIndex: 9, endIndex: 11 },
        { startIndex: 14, endIndex: 15 },
      ],
      1: [{ startIndex: 2, endIndex: null }],
      3: [{ startIndex: 0, endIndex: 1 }],
    });
    expect(output).toHaveProperty('boundaries', {
      startLine: 0,
      startIndex: 0,
      endLine: 3,
      endIndex: 1,
    });
  });
});
