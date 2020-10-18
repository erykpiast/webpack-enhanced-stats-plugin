const findRangesToKeep = require('../find-ranges-to-keep');

describe('find ranges to keep', () => {
  describe('sorted', () => {
    it('should exclude ranges inside the initial one', () => {
      const rangesToRemove = [{
        startIndex: 100,
        endIndex: 200,
      }, {
        startIndex: 300,
        endIndex: 400,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 0,
        endIndex: 99,
      }, {
        startIndex: 201,
        endIndex: 299,
      }, {
        startIndex: 401,
        endIndex: 500,
      }]);
    });

    it('should exclude ranges on edges of initial one', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 99,
      }, {
        startIndex: 400,
        endIndex: 499,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 499,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 399,
      }]);
    });

    it('should exclude ranges on edges of initial one and ones in the middle', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 99,
      }, {
        startIndex: 200,
        endIndex: 299,
      }, {
        startIndex: 400,
        endIndex: 499,
      }, {
        startIndex: 600,
        endIndex: 699,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 699,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 199,
      }, {
        startIndex: 300,
        endIndex: 399,
      }, {
        startIndex: 500,
        endIndex: 599,
      }]);
    });
  });

  describe('unsorted', () => {
    it('should exclude ranges inside the initial one', () => {
      const rangesToRemove = [{
        startIndex: 300,
        endIndex: 400,
      }, {
        startIndex: 100,
        endIndex: 200,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 0,
        endIndex: 99,
      }, {
        startIndex: 201,
        endIndex: 299,
      }, {
        startIndex: 401,
        endIndex: 500,
      }]);
    });

    it('should exclude ranges on edges of initial one', () => {
      const rangesToRemove = [{
        startIndex: 400,
        endIndex: 499,
      }, {
        startIndex: 0,
        endIndex: 99,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 499,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 399,
      }]);
    });

    it('should exclude ranges on edges of initial one and ones in the middle', () => {
      const rangesToRemove = [{
        startIndex: 200,
        endIndex: 299,
      }, {
        startIndex: 0,
        endIndex: 99,
      }, {
        startIndex: 600,
        endIndex: 699,
      }, {
        startIndex: 400,
        endIndex: 499,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 699,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 199,
      }, {
        startIndex: 300,
        endIndex: 399,
      }, {
        startIndex: 500,
        endIndex: 599,
      }]);
    });
  });
});
