const { getStatIdentifier, getParsedIdentifier } = require('../identifier');

describe('identifier', () => {
  describe('getParsedIdentifier', () => {
    it('should remove loaders and keep only the last path', () => {
      const result = getParsedIdentifier('foo/bar!bar/baz!baz/qux.js', '');

      expect(result).toEqual('baz/qux.js');
    });

    it('should remove webpack protocol and package name', () => {
      const result = getParsedIdentifier('webpack://bootstrap/foo/bar.js', '');

      expect(result).toEqual('foo/bar.js');
    });

    it('should remove prefix and index from multi-chunk module path', () => {
      const result = getParsedIdentifier('multi foo.js 1', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove prefix and hash from multi-chunk module path', () => {
      const result = getParsedIdentifier('multi foo.js abcdefghijklmnopqrstuvwxyz123456', '');

      expect(result).toEqual('foo.js');
    });

    it('should remove context from path', () => {
      const result = getParsedIdentifier('/root/somewhere/foo/bar.js', '/root/somewhere');

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
