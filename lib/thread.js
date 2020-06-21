module.exports = function thread(value, ...fns) {
  return fns.reduce((acc, fn) => fn(acc), value);
};
