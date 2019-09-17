module.exports = function loader(source) {
  if (typeof this.saveOriginalSource === 'function') {
    this.saveOriginalSource(source);
    this.saveOriginalSource = undefined;
  }

  return source;
};
