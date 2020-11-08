const withinBoundary = require('../within-boundary');

describe('within boundaries', () => {
  describe('in', () => {
    it(`
+ 1 2 3 4 5   
1 - - - - -
2 - o o o o
3 o o o o o
4 o o o o -
5 - - - - -
`, () => {
      const result = withinBoundary({
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(true);
    });

    it(`
+ 1 2 3 4 5   
1 x x x x x
2 x o o o o
3 o o o o o
4 o o o o x
5 x x x x x
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: 5,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(true);
    });

    it(`
+ 1 2 3 4 5   
1 o o o o o
2 o o o o o
3 o o o o o
4 o o o o x
5 x x x x x
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: 5,
      }, {
        startLine: 1,
        startIndex: 1,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(true);
    });

    it(`
+ 1 2 3 4 5   
1 x x x x x
2 x o o o o
3 o o o o o
4 o o o o o
5 o o o o o
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: 5,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 5,
        endIndex: 5,
      });

      expect(result).toBe(true);
    });

    it(`
+ 1 2 3 4 5   
1 - o o o o
2 o o o o o
3 x x x x x
4 x x o o o
5 o - - - -
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 2,
        endLine: 5,
        endIndex: 1,
      }, {
        startLine: 3,
        startIndex: 1,
        endLine: 4,
        endIndex: 2,
      });

      expect(result).toBe(true);
    });
  });

  describe('out', () => {
    it(`
+ 1 2 3 4 5   
1 x x x x x
2 x o o o o
3 o o o o o
4 o o o o -
5 - - - - -
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 4,
        endIndex: 2,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(false);
    });

    it(`
+ 1 2 3 4 5   
1 - - - - -
2 - o o o o
3 o o o o o
4 o o o o x
5 x x x x x
`, () => {
      const result = withinBoundary({
        startLine: 3,
        startIndex: 3,
        endLine: 5,
        endIndex: 5,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(false);
    });

    it(`
+ 1 2 3 4 5   
1 o o o o o
2 o o o o o
3 o - - x x
4 x x x x x
5 x x x x x
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 3,
        endIndex: 1,
      }, {
        startLine: 3,
        startIndex: 4,
        endLine: 5,
        endIndex: 5,
      });

      expect(result).toBe(false);
    });

    it(`
+ 1 2 3 4 5   
1 o o o o o
2 o o o o o
3 o o o x x
4 x x x x x
5 x x x x x
`, () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 3,
        endIndex: 5,
      }, {
        startLine: 3,
        startIndex: 4,
        endLine: 5,
        endIndex: 5,
      });

      expect(result).toBe(false);
    });
  });

  describe('null', () => {
    it('bounding null', () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: null,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(true);
    });

    it('bounded null', () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: 5,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: null,
      });

      expect(result).toBe(true);
    });

    it('two nulls', () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 5,
        endIndex: null,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: null,
      });

      expect(result).toBe(true);
    });

    it('out', () => {
      const result = withinBoundary({
        startLine: 1,
        startIndex: 1,
        endLine: 3,
        endIndex: null,
      }, {
        startLine: 2,
        startIndex: 2,
        endLine: 4,
        endIndex: 4,
      });

      expect(result).toBe(false);
    });
  });
});
