const { getStatIdentifier, getParsedIdentifer } = require('../identifier');

describe('identifier', () => {
  describe('getParsedIdentifer', () => {
    it('should remove loaders and keep only the last path', () => {
      const result = getParsedIdentifer('foo/bar!bar/baz!baz/qux.js', '');

      expect(result).toEqual('baz/qux.js');
    });

    it('should remove webpack protocol and package name', () => {
      const result = getParsedIdentifer('webpack://bootstrap/foo/bar.js', '');

      expect(result).toEqual('foo/bar.js');
    });

    it('should remove prefix and index from multi-chunk module path', () => {
      const result = getParsedIdentifer('multi foo.js 1', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove prefix and hash from multi-chunk module path', () => {
      const result = getParsedIdentifer('multi foo.js abcdefghijklmnopqrstuvwxyz123456', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove context from path', () => {
      const result = getParsedIdentifer('/root/somewhere/foo/bar.js', '/root/somewhere');

      expect(result).toEqual('foo/bar.js');
    });
  });

  describe('getStatIdentifier', () => {
    it('should remove loaders and keep only the last path', () => {
      const result = getStatIdentifier('foo/bar!bar/baz!baz/qux.js', '');

      expect(result).toEqual('baz/qux.js');
    });

    it('should remove prefix and index from multi-chunk module path', () => {
      const result = getStatIdentifier('multi foo.js 1', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove prefix and hash from multi-chunk module path', () => {
      const result = getStatIdentifier('multi foo.js abcdefghijklmnopqrstuvwxyz123456', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove context from path', () => {
      const result = getStatIdentifier('/root/somewhere/foo/bar.js', '/root/somewhere');

      expect(result).toEqual('foo/bar.js');
    });
  });
});
