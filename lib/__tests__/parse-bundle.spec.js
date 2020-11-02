const fs = require('fs');

const parseBundle = require('../parse-bundle');

const BUNDLES_DIR = `${__dirname}/bundles-to-parse`;

describe('parseBundle', () => {
  const bundles = fs
    .readdirSync(BUNDLES_DIR)
    .filter((filename) => filename.endsWith('.js'))
    .map((filename) => filename.replace(/\.js$/u, ''));

  it.each(bundles
    .filter((bundleName) => bundleName.startsWith('valid')))('should parse', (bundleName) => {
    const bundleFile = fs.readFileSync(`${BUNDLES_DIR}/${bundleName}.js`, 'utf8');
    const bundle = parseBundle(bundleFile);

    const expectedModules = JSON.parse(fs.readFileSync(`${BUNDLES_DIR}/${bundleName}.modules.json`, 'utf8'));

    expect(bundle.src).toEqual(bundleFile);
    expect(bundle.modules).toEqual(expectedModules.modules);
  });

  it("should parse invalid bundle and return it's content and empty modules hash", () => {
    const bundleFile = fs.readFileSync(`${BUNDLES_DIR}/invalidBundle.js`, 'utf8');
    const bundle = parseBundle(bundleFile);

    expect(bundle.src).toEqual(bundleFile);
    expect(bundle.modules).toEqual({});
  });
});
