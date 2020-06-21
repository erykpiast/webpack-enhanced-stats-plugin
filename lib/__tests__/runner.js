
const { promises: fs } = require('fs');
const path = require('path');

const getSources = require('../get-generated-source');

(async () => {
  const map = await fs.readFile(path.join(__dirname, 'snapshots', 'v4.map'), 'utf-8');
  const generated = await fs.readFile(path.join(__dirname, 'snapshots', 'v4.js'), 'utf-8');

  const result = await getSources(map, generated);

  console.log(JSON.stringify(result, null, 2));
})();
