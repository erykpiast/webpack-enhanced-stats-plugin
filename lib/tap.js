function tapPromise(plugin, hook, promiseCb) {
  return new Promise((resolve, reject) => {
    hook.tapAsync(plugin, async (...args) => {
      const cb = args[args.length - 1];
      try {
        const result = await promiseCb(...args.slice(0, -1));
        cb();
        resolve(result);
      } catch (err) {
        cb(err);
        reject(err);
      }
    });
  });
}

function tap(plugin, hook, cb) {
  return new Promise((resolve, reject) => {
    hook.tap(plugin, async (...args) => {
      try {
        resolve(await cb(...args));
      } catch (err) {
        reject(err);
      }
    });
  });
}

module.exports = { tap, tapPromise };
