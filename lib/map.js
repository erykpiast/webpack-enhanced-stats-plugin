module.exports = class ResourceMap extends Map {
  static getOriginalResource(identifier) {
    const segments = identifier.split('!');
    return segments[segments.length - 1];
  }

  set(key, value) {
    return super.set(ResourceMap.getOriginalResource(key), value);
  }

  get(key) {
    return super.get(ResourceMap.getOriginalResource(key));
  }
};
