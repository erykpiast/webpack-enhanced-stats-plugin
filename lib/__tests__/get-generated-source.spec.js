const { promises: fs } = require('fs');
const path = require('path');

const getGeneratedSource = require('../get-generated-source');

describe('getGeneratedSource', () => {
  function readSnapshot(name) {
    return fs.readFile(path.join(__dirname, '..', 'snapshots', name), 'utf-8');
  }

  it('should work with Webpack 4', async () => {
    const [bundle, map, expected] = await Promise.all([
      readSnapshot('v4.js'),
      readSnapshot('v4.map'),
      readSnapshot('v4.json').then(JSON.parse),
    ]);

    const result = await getGeneratedSource(map, bundle);

    expect(result).toEqual(expected);
  });

  it('should work with Webpack 5', async () => {
    const [bundle, map, expected] = await Promise.all([
      readSnapshot('v5.js'),
      readSnapshot('v5.map'),
      readSnapshot('v5.json').then(JSON.parse),
    ]);

    const result = await getGeneratedSource(map, bundle);

    expect(result).toEqual(expected);
  });

  it('should work for async function transpiled with Babel', async () => {
    const [bundle, map, expected] = await Promise.all([
      readSnapshot('async.js'),
      readSnapshot('async.map'),
      readSnapshot('async.json').then(JSON.parse),
    ]);

    const result = await getGeneratedSource(map, bundle);

    expect(result).toEqual(expected);
  });
});
