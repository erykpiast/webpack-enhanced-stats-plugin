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
        endIndex: 100,
      }, {
        startIndex: 200,
        endIndex: 300,
      }, {
        startIndex: 400,
        endIndex: 500,
      }]);
    });

    it('should exclude ranges on edges of initial one', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 400,
        endIndex: 500,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 400,
      }]);
    });

    it('should exclude ranges on edges of initial one and ones in the middle', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 200,
        endIndex: 300,
      }, {
        startIndex: 400,
        endIndex: 500,
      }, {
        startIndex: 600,
        endIndex: 700,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 700,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 200,
      }, {
        startIndex: 300,
        endIndex: 400,
      }, {
        startIndex: 500,
        endIndex: 600,
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
        endIndex: 100,
      }, {
        startIndex: 200,
        endIndex: 300,
      }, {
        startIndex: 400,
        endIndex: 500,
      }]);
    });

    it('should exclude ranges on edges of initial one', () => {
      const rangesToRemove = [{
        startIndex: 400,
        endIndex: 500,
      }, {
        startIndex: 0,
        endIndex: 100,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 400,
      }]);
    });

    it('should exclude ranges on edges of initial one and ones in the middle', () => {
      const rangesToRemove = [{
        startIndex: 200,
        endIndex: 300,
      }, {
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 600,
        endIndex: 700,
      }, {
        startIndex: 400,
        endIndex: 500,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 700,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 200,
      }, {
        startIndex: 300,
        endIndex: 400,
      }, {
        startIndex: 500,
        endIndex: 600,
      }]);
    });
  });

  describe('tight', () => {
    it('should exclude very close ranges', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 200,
      }, {
        startIndex: 201,
        endIndex: 500,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 200,
        endIndex: 201,
      }]);
    });

    it('should exclude sticking ranges', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 200,
      }, {
        startIndex: 200,
        endIndex: 500,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([]);
    });
  });

  describe('null', () => {
    it('should exclude unclosed range', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 200,
        endIndex: null,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 500,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 200,
      }]);
    });

    it('should exclude from unclosed range', () => {
      const rangesToRemove = [{
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 200,
        endIndex: 300,
      }];
      const result = [{
        startIndex: 0,
        endIndex: null,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 100,
        endIndex: 200,
      }, {
        startIndex: 300,
        endIndex: null,
      }]);
    });
  });

  describe('overlapping', () => {
    it('should exclude range overlapping many', () => {
      const rangesToRemove = [{
        startIndex: 100,
        endIndex: 500,
      }];
      const result = [{
        startIndex: 0,
        endIndex: 200,
      }, {
        startIndex: 300,
        endIndex: 600,
      }];

      findRangesToKeep(rangesToRemove, result);

      expect(result).toEqual([{
        startIndex: 0,
        endIndex: 100,
      }, {
        startIndex: 500,
        endIndex: 600,
      }]);
    });
  });
});
